import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Sistema de Agendamiento Inteligente para ÁPERCA SpA
// Integrado con Gemini AI para reservas automáticas

// ====================================================================
// QUERIES (Lectura de datos)
// ====================================================================

/**
 * Obtener disponibilidad de horarios para un día específico
 * Retorna slots de 30 min disponibles entre 8 AM y 12 AM
 */
export const getDisponibilidad = query({
  args: {
    fecha: v.string(), // Formato: "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    console.log(`📅 Consultando disponibilidad para: ${args.fecha}`);
    
    // Parsear fecha
    const [year, month, day] = args.fecha.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day, 0, 0, 0, 0);
    const fechaFin = new Date(year, month - 1, day, 23, 59, 59, 999);
    
    const timestampInicio = fechaInicio.getTime();
    const timestampFin = fechaFin.getTime();
    
    // Obtener configuración de agenda (horarios laborales)
    const config = await ctx.db
      .query("configuracion_agenda")
      .filter(q => q.eq(q.field("activo"), true))
      .first();
    
    if (!config) {
      console.error("❌ No hay configuración de agenda activa");
      return {
        fecha: args.fecha,
        slots_disponibles: [],
        error: "Configuración no encontrada",
      };
    }
    
    // Validar que el día sea laboral
    const diaSemana = fechaInicio.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    if (!config.dias_laborales.includes(diaSemana)) {
      console.log(`⚠️ Día no laboral: ${diaSemana}`);
      return {
        fecha: args.fecha,
        slots_disponibles: [],
        es_dia_laboral: false,
      };
    }
    
    // Obtener citas confirmadas para ese día
    const citasConfirmadas = await ctx.db
      .query("agenda")
      .filter(q => 
        q.and(
          q.gte(q.field("fecha_inicio"), timestampInicio),
          q.lte(q.field("fecha_inicio"), timestampFin),
          q.eq(q.field("estado"), "confirmada")
        )
      )
      .collect();
    
    console.log(`🔍 Citas confirmadas encontradas: ${citasConfirmadas.length}`);
    
    // Generar slots disponibles
    const slots: Array<{
      hora: string;
      timestamp: number;
      disponible: boolean;
    }> = [];
    
    const horaInicio = config.hora_inicio; // 8
    const horaFin = config.hora_fin; // 24
    const duracionSlot = config.duracion_slot; // 30 minutos
    
    // Generar slots de 30 min desde horaInicio hasta horaFin
    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minuto = 0; minuto < 60; minuto += duracionSlot) {
        const slotDate = new Date(year, month - 1, day, hora, minuto, 0, 0);
        const slotTimestamp = slotDate.getTime();
        
        // No agregar slots pasados (solo para hoy)
        const ahora = Date.now();
        if (timestampInicio <= ahora && slotTimestamp < ahora) {
          continue;
        }
        
        // Verificar si el slot está ocupado
        const estaOcupado = citasConfirmadas.some(cita => {
          return slotTimestamp >= cita.fecha_inicio && slotTimestamp < cita.fecha_fin;
        });
        
        const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        
        slots.push({
          hora: horaFormateada,
          timestamp: slotTimestamp,
          disponible: !estaOcupado,
        });
      }
    }
    
    const slotsDisponibles = slots.filter(s => s.disponible);
    
    console.log(`✅ Slots totales: ${slots.length}, Disponibles: ${slotsDisponibles.length}`);
    
    return {
      fecha: args.fecha,
      dia_semana: diaSemana,
      es_dia_laboral: true,
      slots_disponibles: slotsDisponibles,
      slots_ocupados: slots.filter(s => !s.disponible),
    };
  },
});

/**
 * Listar citas en un rango de fechas
 */
export const listarCitas = query({
  args: {
    desde: v.number(), // Timestamp Unix
    hasta: v.number(), // Timestamp Unix
    estado: v.optional(v.union(
      v.literal("confirmada"),
      v.literal("cancelada"),
      v.literal("completada"),
      v.literal("no_asistio")
    )),
    source: v.optional(v.union(v.literal("web"), v.literal("telegram"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("agenda")
      .filter(q => 
        q.and(
          q.gte(q.field("fecha_inicio"), args.desde),
          q.lte(q.field("fecha_inicio"), args.hasta)
        )
      );
    
    const citas = await query.collect();
    
    // Filtrar por estado si se especifica
    let citasFiltradas = citas;
    
    if (args.estado) {
      citasFiltradas = citasFiltradas.filter(c => c.estado === args.estado);
    }
    
    if (args.source) {
      citasFiltradas = citasFiltradas.filter(c => c.source === args.source);
    }
    
    // Ordenar por fecha_inicio ascendente
    citasFiltradas.sort((a, b) => a.fecha_inicio - b.fecha_inicio);
    
    console.log(`📋 Listando citas: ${citasFiltradas.length} encontradas`);
    
    return citasFiltradas;
  },
});

/**
 * Buscar citas por email del cliente
 */
export const buscarCitasPorEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const citas = await ctx.db
      .query("agenda")
      .filter(q => q.eq(q.field("cliente_email"), args.email.toLowerCase()))
      .collect();
    
    // Ordenar por fecha más reciente primero
    citas.sort((a, b) => b.fecha_inicio - a.fecha_inicio);
    
    console.log(`🔍 Citas encontradas para ${args.email}: ${citas.length}`);
    
    return citas;
  },
});

/**
 * Obtener configuración activa de agenda
 */
export const getConfiguracion = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db
      .query("configuracion_agenda")
      .filter(q => q.eq(q.field("activo"), true))
      .first();
    
    return config;
  },
});

// ====================================================================
// MUTATIONS (Escritura de datos)
// ====================================================================

/**
 * Agendar una cita nueva
 */
export const agendarCita = mutation({
  args: {
    fecha_inicio: v.number(), // Timestamp Unix
    duracion: v.optional(v.number()), // Minutos (default: 30)
    cliente_nombre: v.string(),
    cliente_email: v.string(),
    cliente_telefono: v.optional(v.string()),
    motivo: v.string(),
    notas: v.optional(v.string()),
    source: v.union(v.literal("web"), v.literal("telegram")),
  },
  handler: async (ctx, args) => {
    console.log(`📝 Intentando agendar cita para: ${args.cliente_nombre}`);
    
    const duracion = args.duracion || 30; // Default 30 minutos
    const fecha_fin = args.fecha_inicio + (duracion * 60 * 1000); // Convertir a milisegundos
    
    // Verificar que el slot esté disponible
    const citasConflicto = await ctx.db
      .query("agenda")
      .filter(q => 
        q.and(
          q.eq(q.field("estado"), "confirmada"),
          q.or(
            // El inicio de la nueva cita cae dentro de una cita existente
            q.and(
              q.gte(q.field("fecha_fin"), args.fecha_inicio),
              q.lte(q.field("fecha_inicio"), args.fecha_inicio)
            ),
            // El fin de la nueva cita cae dentro de una cita existente
            q.and(
              q.gte(q.field("fecha_fin"), fecha_fin),
              q.lte(q.field("fecha_inicio"), fecha_fin)
            ),
            // La nueva cita envuelve completamente una cita existente
            q.and(
              q.gte(q.field("fecha_inicio"), args.fecha_inicio),
              q.lte(q.field("fecha_fin"), fecha_fin)
            )
          )
        )
      )
      .collect();
    
    if (citasConflicto.length > 0) {
      console.error("❌ Conflicto: El horario ya está ocupado");
      throw new Error("El horario seleccionado ya está ocupado. Por favor elige otro.");
    }
    
    // Insertar la cita
    const citaId = await ctx.db.insert("agenda", {
      fecha_inicio: args.fecha_inicio,
      fecha_fin: fecha_fin,
      duracion: duracion,
      cliente_nombre: args.cliente_nombre,
      cliente_email: args.cliente_email.toLowerCase(),
      cliente_telefono: args.cliente_telefono,
      motivo: args.motivo,
      notas: args.notas,
      estado: "confirmada",
      source: args.source,
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Cita agendada exitosamente. ID: ${citaId}`);
    
    // 📱 NOTIFICACIÓN POR TELEGRAM
    try {
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_AUTHORIZED_USER;
      
      if (BOT_TOKEN && CHAT_ID) {
        // Formatear fecha y hora
        const fecha = new Date(args.fecha_inicio);
        const fechaFormateada = fecha.toLocaleDateString('es-CL', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const horaFormateada = fecha.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const mensaje = `🗓️ *NUEVA CITA AGENDADA*

📅 *Fecha:* ${fechaFormateada}
🕐 *Hora:* ${horaFormateada}
👤 *Cliente:* ${args.cliente_nombre}
📧 *Email:* ${args.cliente_email}
${args.cliente_telefono ? `📱 *Teléfono:* ${args.cliente_telefono}\n` : ''}📝 *Motivo:* ${args.motivo}
⏱️ *Duración:* ${duracion} minutos
🌐 *Fuente:* ${args.source === 'web' ? 'Chatbot Web' : 'Telegram'}

_ID: ${citaId}_`;
        
        // Enviar mensaje a Telegram
        const response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: mensaje,
              parse_mode: "Markdown",
            }),
          }
        );
        
        if (response.ok) {
          console.log("📱 Notificación enviada a Telegram exitosamente");
        } else {
          console.warn("⚠️ Error enviando notificación a Telegram:", await response.text());
        }
      } else {
        console.warn("⚠️ Telegram no configurado - notificación no enviada");
      }
    } catch (notifError) {
      console.error("❌ Error enviando notificación Telegram:", notifError);
      // No lanzamos error para que no falle el agendamiento
    }
    
    return {
      success: true,
      citaId: citaId,
      fecha_inicio: args.fecha_inicio,
      fecha_fin: fecha_fin,
      mensaje: `Cita confirmada para ${args.cliente_nombre}`,
    };
  },
});

/**
 * Cancelar una cita existente
 */
export const cancelarCita = mutation({
  args: {
    citaId: v.id("agenda"),
    razon: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`❌ Cancelando cita: ${args.citaId}`);
    
    const cita = await ctx.db.get(args.citaId);
    
    if (!cita) {
      throw new Error("Cita no encontrada");
    }
    
    if (cita.estado === "cancelada") {
      throw new Error("La cita ya está cancelada");
    }
    
    // Actualizar estado a cancelada
    await ctx.db.patch(args.citaId, {
      estado: "cancelada",
      cancelado_en: Date.now(),
      razon_cancelacion: args.razon,
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Cita cancelada exitosamente`);
    
    // 📱 NOTIFICACIÓN POR TELEGRAM - CANCELACIÓN
    try {
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_AUTHORIZED_USER;
      
      if (BOT_TOKEN && CHAT_ID) {
        const fecha = new Date(cita.fecha_inicio);
        const fechaFormateada = fecha.toLocaleDateString('es-CL', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const horaFormateada = fecha.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const mensaje = `❌ *CITA CANCELADA*

📅 *Fecha:* ${fechaFormateada}
🕐 *Hora:* ${horaFormateada}
👤 *Cliente:* ${cita.cliente_nombre}
📧 *Email:* ${cita.cliente_email}
📝 *Motivo original:* ${cita.motivo}
⚠️ *Razón de cancelación:* ${args.razon}

_ID: ${args.citaId}_`;
        
        await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: mensaje,
              parse_mode: "Markdown",
            }),
          }
        );
        
        console.log("📱 Notificación de cancelación enviada a Telegram");
      }
    } catch (notifError) {
      console.error("❌ Error enviando notificación de cancelación:", notifError);
    }
    
    return {
      success: true,
      mensaje: "Cita cancelada exitosamente",
    };
  },
});

/**
 * Marcar cita como completada
 */
export const marcarCompletada = mutation({
  args: {
    citaId: v.id("agenda"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.citaId, {
      estado: "completada",
      actualizado_en: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Marcar cita como "no asistió"
 */
export const marcarNoAsistio = mutation({
  args: {
    citaId: v.id("agenda"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.citaId, {
      estado: "no_asistio",
      actualizado_en: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Inicializar configuración de agenda (ejecutar una vez)
 */
export const inicializarConfiguracion = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar si ya existe configuración
    const configExistente = await ctx.db
      .query("configuracion_agenda")
      .filter(q => q.eq(q.field("activo"), true))
      .first();
    
    if (configExistente) {
      console.log("⚠️ Configuración ya existe");
      return { success: false, mensaje: "Configuración ya existe" };
    }
    
    // Crear configuración por defecto
    const configId = await ctx.db.insert("configuracion_agenda", {
      hora_inicio: 8,        // 8:00 AM
      hora_fin: 22,          // 10:00 PM
      dias_laborales: [1, 2, 3, 4, 5, 6, 7], // Todos los días
      duracion_slot: 30,     // 30 minutos
      zona_horaria: "America/Santiago",
      dias_bloqueados: [],
      activo: true,
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Configuración inicializada: ${configId}`);
    
    return {
      success: true,
      configId: configId,
      mensaje: "Configuración creada exitosamente",
    };
  },
});
