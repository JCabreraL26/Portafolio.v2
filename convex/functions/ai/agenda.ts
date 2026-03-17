import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { api } from "../../_generated/api";

// ========================================
// MUTATIONS - Gestión de Reuniones
// ========================================

// Crear nueva reunión
export const crearReunion = mutation({
  args: {
    fecha_inicio: v.number(),
    duracion: v.number(), // en minutos
    cliente_nombre: v.string(),
    cliente_email: v.string(),
    cliente_telefono: v.optional(v.string()),
    motivo: v.string(),
    notas: v.optional(v.string()),
    source: v.union(v.literal("web"), v.literal("telegram")),
  },
  handler: async (ctx, args) => {
    const ahora = Date.now();
    const fecha_fin = args.fecha_inicio + (args.duracion * 60 * 1000);

    // Validar que la fecha no sea en el pasado
    if (args.fecha_inicio < ahora) {
      throw new Error("No puedes agendar una reunión en el pasado");
    }

    // Verificar disponibilidad
    const reunionesExistentes = await ctx.db
      .query("agenda")
      .withIndex("por_fecha_estado", (q) =>
        q.eq("fecha_inicio", args.fecha_inicio).eq("estado", "confirmada")
      )
      .collect();

    if (reunionesExistentes.length > 0) {
      throw new Error("Ya existe una reunión agendada en ese horario");
    }

    // Crear reunión
    const reunionId = await ctx.db.insert("agenda", {
      fecha_inicio: args.fecha_inicio,
      fecha_fin: fecha_fin,
      duracion: args.duracion,
      cliente_nombre: args.cliente_nombre,
      cliente_email: args.cliente_email,
      cliente_telefono: args.cliente_telefono,
      motivo: args.motivo,
      notas: args.notas,
      estado: "confirmada",
      source: args.source,
      creado_en: ahora,
      actualizado_en: ahora,
    });

    return {
      success: true,
      reunionId,
      mensaje: `✅ Reunión agendada con ${args.cliente_nombre} para ${new Date(args.fecha_inicio).toLocaleString('es-CL')}`,
    };
  },
});

// Cancelar reunión
export const cancelarReunion = mutation({
  args: {
    reunionId: v.id("agenda"),
    razon: v.string(),
  },
  handler: async (ctx, args) => {
    const reunion = await ctx.db.get(args.reunionId);
    
    if (!reunion) {
      throw new Error("Reunión no encontrada");
    }

    if (reunion.estado === "cancelada") {
      throw new Error("La reunión ya está cancelada");
    }

    await ctx.db.patch(args.reunionId, {
      estado: "cancelada",
      cancelado_en: Date.now(),
      razon_cancelacion: args.razon,
      actualizado_en: Date.now(),
    });

    return {
      success: true,
      mensaje: `🗑️ Reunión cancelada: ${reunion.cliente_nombre}`,
    };
  },
});

// Actualizar estado de reunión
export const actualizarEstadoReunion = mutation({
  args: {
    reunionId: v.id("agenda"),
    estado: v.union(
      v.literal("confirmada"),
      v.literal("cancelada"),
      v.literal("completada"),
      v.literal("no_asistio")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reunionId, {
      estado: args.estado,
      actualizado_en: Date.now(),
    });

    return { success: true };
  },
});

// ========================================
// QUERIES - Consultas de Reuniones
// ========================================

// Obtener reuniones por rango de fechas
export const obtenerReuniones = query({
  args: {
    desde: v.number(),
    hasta: v.number(),
    estado: v.optional(v.union(
      v.literal("confirmada"),
      v.literal("cancelada"),
      v.literal("completada"),
      v.literal("no_asistio")
    )),
  },
  handler: async (ctx, args) => {
    let reuniones = await ctx.db
      .query("agenda")
      .withIndex("por_fecha_inicio")
      .filter((q) =>
        q.and(
          q.gte(q.field("fecha_inicio"), args.desde),
          q.lte(q.field("fecha_inicio"), args.hasta)
        )
      )
      .collect();

    if (args.estado) {
      reuniones = reuniones.filter((r) => r.estado === args.estado);
    }

    return reuniones;
  },
});

// Verificar disponibilidad de horario
export const verificarDisponibilidad = query({
  args: {
    fecha_inicio: v.number(),
    duracion: v.number(), // en minutos
  },
  handler: async (ctx, args) => {
    const fecha_fin = args.fecha_inicio + (args.duracion * 60 * 1000);

    // Buscar reuniones que se solapen
    const reunionesConfirmadas = await ctx.db
      .query("agenda")
      .withIndex("por_estado", (q) => q.eq("estado", "confirmada"))
      .collect();

    const conflictos = reunionesConfirmadas.filter((reunion) => {
      // Verificar si hay solapamiento
      return (
        (args.fecha_inicio >= reunion.fecha_inicio && args.fecha_inicio < reunion.fecha_fin) ||
        (fecha_fin > reunion.fecha_inicio && fecha_fin <= reunion.fecha_fin) ||
        (args.fecha_inicio <= reunion.fecha_inicio && fecha_fin >= reunion.fecha_fin)
      );
    });

    return {
      disponible: conflictos.length === 0,
      conflictos: conflictos.map((r) => ({
        cliente: r.cliente_nombre,
        inicio: new Date(r.fecha_inicio).toLocaleString('es-CL'),
        fin: new Date(r.fecha_fin).toLocaleString('es-CL'),
      })),
    };
  },
});

// Obtener próximas reuniones
export const obtenerProximasReuniones = query({
  args: {
    limite: v.number(),
  },
  handler: async (ctx, args) => {
    const ahora = Date.now();

    const reuniones = await ctx.db
      .query("agenda")
      .withIndex("por_fecha_estado", (q) =>
        q.eq("fecha_inicio", ahora).eq("estado", "confirmada")
      )
      .order("asc")
      .take(args.limite);

    return reuniones;
  },
});

// Obtener reuniones de hoy
export const obtenerReunionesHoy = query({
  handler: async (ctx) => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
    const finHoy = inicioHoy + (24 * 60 * 60 * 1000);

    const reuniones = await ctx.db
      .query("agenda")
      .withIndex("por_fecha_inicio")
      .filter((q) =>
        q.and(
          q.gte(q.field("fecha_inicio"), inicioHoy),
          q.lt(q.field("fecha_inicio"), finHoy),
          q.eq(q.field("estado"), "confirmada")
        )
      )
      .collect();

    return reuniones;
  },
});

// ========================================
// CONFIGURACIÓN DE AGENDA
// ========================================

// Obtener configuración activa
export const obtenerConfiguracionAgenda = query({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("configuracion_agenda")
      .withIndex("por_activo", (q) => q.eq("activo", true))
      .first();

    if (!config) {
      // Retornar configuración por defecto
      return {
        hora_inicio: 9,
        hora_fin: 18,
        dias_laborales: [1, 2, 3, 4, 5], // Lun-Vie
        duracion_slot: 30,
        zona_horaria: "America/Santiago",
        activo: false,
      };
    }

    return config;
  },
});

// Configurar horarios laborales
export const configurarAgenda = mutation({
  args: {
    hora_inicio: v.number(),
    hora_fin: v.number(),
    dias_laborales: v.array(v.number()),
    duracion_slot: v.number(),
    zona_horaria: v.string(),
  },
  handler: async (ctx, args) => {
    const ahora = Date.now();

    // Desactivar configuración anterior
    const configAnterior = await ctx.db
      .query("configuracion_agenda")
      .withIndex("por_activo", (q) => q.eq("activo", true))
      .first();

    if (configAnterior) {
      await ctx.db.patch(configAnterior._id, {
        activo: false,
        actualizado_en: ahora,
      });
    }

    // Crear nueva configuración
    const configId = await ctx.db.insert("configuracion_agenda", {
      hora_inicio: args.hora_inicio,
      hora_fin: args.hora_fin,
      dias_laborales: args.dias_laborales,
      duracion_slot: args.duracion_slot,
      zona_horaria: args.zona_horaria,
      activo: true,
      creado_en: ahora,
      actualizado_en: ahora,
    });

    return {
      success: true,
      configId,
      mensaje: "✅ Configuración de agenda actualizada",
    };
  },
});

// Obtener slots disponibles para un día
export const obtenerSlotsDisponibles = query({
  args: {
    fecha: v.number(), // Timestamp del día (inicio del día)
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("configuracion_agenda")
      .withIndex("por_activo", (q) => q.eq("activo", true))
      .first();

    if (!config) {
      return [];
    }

    const fecha = new Date(args.fecha);
    const diaSemana = fecha.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab

    // Verificar si es día laboral
    if (!config.dias_laborales.includes(diaSemana)) {
      return [];
    }

    // Generar slots
    const slots = [];
    const inicioHora = config.hora_inicio;
    const finHora = config.hora_fin;
    const duracionSlot = config.duracion_slot;

    for (let hora = inicioHora; hora < finHora; hora++) {
      for (let minuto = 0; minuto < 60; minuto += duracionSlot) {
        const slotInicio = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate(),
          hora,
          minuto
        ).getTime();

        const slotFin = slotInicio + (duracionSlot * 60 * 1000);

        // Verificar disponibilidad
        const disponibilidad = await ctx.db
          .query("agenda")
          .withIndex("por_estado", (q) => q.eq("estado", "confirmada"))
          .collect();

        const ocupado = disponibilidad.some((reunion) => {
          return (
            (slotInicio >= reunion.fecha_inicio && slotInicio < reunion.fecha_fin) ||
            (slotFin > reunion.fecha_inicio && slotFin <= reunion.fecha_fin)
          );
        });

        if (!ocupado && slotInicio > Date.now()) {
          slots.push({
            inicio: slotInicio,
            fin: slotFin,
            hora: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
            disponible: true,
          });
        }
      }
    }

    return slots;
  },
});
