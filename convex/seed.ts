import { mutation } from "./_generated/server";

// Script de inicialización - Carga datos de empresa
export const seedEmpresa = mutation({
  handler: async (ctx) => {
    // Verificar si ya existe configuración de empresa
    const existente = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("clave"), "empresa_rut"))
      .first();
    
    if (existente) {
      return {
        success: false,
        mensaje: "Los datos de empresa ya están configurados. Usa el comando /empresa para actualizarlos."
      };
    }
    
    // Insertar RUT de empresa
    await ctx.db.insert("configuracion", {
      clave: "empresa_rut",
      valor: "78318808-2",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "RUT de ÁPERCA SPA",
      creado_por: "seed",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    // Insertar Razón Social
    await ctx.db.insert("configuracion", {
      clave: "empresa_razon_social",
      valor: "ÁPERCA SPA",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "Razón Social de la empresa",
      creado_por: "seed",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log("✅ Datos de empresa configurados: ÁPERCA SPA (RUT: 78318808-2)");
    
    return {
      success: true,
      mensaje: "Empresa ÁPERCA SPA configurada correctamente",
      datos: {
        rut: "78318808-2",
        razon_social: "ÁPERCA SPA"
      }
    };
  },
});

// Script de inicialización - Configuración de Agenda
export const seedAgenda = mutation({
  handler: async (ctx) => {
    // Verificar si ya existe configuración
    const configExistente = await ctx.db
      .query("configuracion_agenda")
      .filter(q => q.eq(q.field("activo"), true))
      .first();
    
    if (configExistente) {
      return {
        success: false,
        mensaje: "La configuración de agenda ya existe."
      };
    }
    
    // Crear configuración por defecto
    const configId = await ctx.db.insert("configuracion_agenda", {
      hora_inicio: 8,        // 8:00 AM
      hora_fin: 22,          // 10:00 PM
      dias_laborales: [1, 2, 3, 4, 5, 6, 7], // Todos los días (Lun-Dom)
      duracion_slot: 30,     // 30 minutos
      zona_horaria: "America/Santiago",
      dias_bloqueados: [],
      activo: true,
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log("✅ Configuración de agenda creada:");
    console.log("   - Horario: 8:00 AM - 10:00 PM");
    console.log("   - Días: Lunes a Domingo");
    console.log("   - Duración slot: 30 minutos");
    console.log("   - Zona horaria: America/Santiago");
    
    return {
      success: true,
      mensaje: "Configuración de agenda creada exitosamente",
      configId: configId,
      horarios: {
        inicio: "8:00 AM",
        fin: "10:00 PM",
        dias: "Lunes a Domingo",
        slot: "30 minutos"
      }
    };
  },
});

// Actualizar horarios de agenda existente
export const updateHorariosAgenda = mutation({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("configuracion_agenda")
      .filter(q => q.eq(q.field("activo"), true))
      .first();
    
    if (!config) {
      throw new Error("No existe configuración de agenda activa");
    }
    
    await ctx.db.patch(config._id, {
      hora_inicio: 8,
      hora_fin: 22,
      actualizado_en: Date.now(),
    });
    
    console.log("✅ Horarios actualizados a 8:00 AM - 10:00 PM");
    
    return {
      success: true,
      mensaje: "Horarios actualizados correctamente",
      horarios: {
        inicio: "8:00 AM",
        fin: "10:00 PM"
      }
    };
  },
});
