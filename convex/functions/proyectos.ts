import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// ====================================================================
// CRUD para Proyectos - Sistema de Gestión de Proyectos
// ====================================================================

/**
 * Crear un nuevo proyecto
 */
export const crearProyecto = mutation({
  args: {
    nombre: v.string(),
    descripcion: v.string(),
    objetivo: v.optional(v.string()),
    categoria: v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("ia"),
      v.literal("automatizacion"),
      v.literal("consultoria"),
      v.literal("personal"),
      v.literal("otro")
    ),
    prioridad: v.optional(v.union(v.literal("baja"), v.literal("media"), v.literal("alta"), v.literal("urgente"))),
    fecha_inicio: v.optional(v.number()),
    fecha_fin_estimada: v.optional(v.number()),
    presupuesto_estimado: v.optional(v.number()),
    moneda: v.optional(v.string()),
    cliente_nombre: v.optional(v.string()),
    cliente_email: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notas: v.optional(v.string()),
    creado_por: v.optional(v.string()), // "gemini", "deep_seek", "sistema"
  },
  handler: async (ctx, args) => {
    console.log(`📝 Creando proyecto: ${args.nombre}`);
    
    const proyectoId = await ctx.db.insert("proyectos", {
      nombre: args.nombre,
      descripcion: args.descripcion,
      objetivo: args.objetivo,
      categoria: args.categoria,
      estado: "activo", // Default: activo
      prioridad: args.prioridad || "media",
      fecha_inicio: args.fecha_inicio,
      fecha_fin_estimada: args.fecha_fin_estimada,
      fecha_fin_real: undefined,
      progreso: 0, // Inicia en 0%
      presupuesto_estimado: args.presupuesto_estimado,
      presupuesto_gastado: 0,
      moneda: args.moneda || "CLP",
      cliente_nombre: args.cliente_nombre,
      cliente_email: args.cliente_email,
      equipo: undefined,
      tags: args.tags,
      notas: args.notas,
      archivos_adjuntos: undefined,
      creado_por: args.creado_por || "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Proyecto creado con ID: ${proyectoId}`);
    
    return { 
      success: true, 
      proyectoId,
      mensaje: `Proyecto "${args.nombre}" creado exitosamente`
    };
  },
});

/**
 * Listar todos los proyectos (con filtros opcionales)
 */
export const listarProyectos = query({
  args: {
    estado: v.optional(v.union(
      v.literal("activo"),
      v.literal("pausado"),
      v.literal("completado"),
      v.literal("cancelado")
    )),
    categoria: v.optional(v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("ia"),
      v.literal("automatizacion"),
      v.literal("consultoria"),
      v.literal("personal"),
      v.literal("otro")
    )),
    prioridad: v.optional(v.union(v.literal("baja"), v.literal("media"), v.literal("alta"), v.literal("urgente"))),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("📋 Listando proyectos con filtros:", args);
    
    // Si no hay filtros, usar índice para ordenar por fecha de creación
    if (!args.estado && !args.categoria && !args.prioridad) {
      const query = ctx.db.query("proyectos")
        .withIndex("por_creado_en")
        .order("desc");
      
      const proyectos = args.limite 
        ? await query.take(args.limite)
        : await query.collect();
      
      console.log(`✅ ${proyectos.length} proyectos encontrados`);
      return proyectos;
    }
    
    // Si hay filtros, hacer query full table scan y filtrar manualmente
    let proyectos = await ctx.db.query("proyectos").collect();
    
    // Aplicar filtros
    if (args.estado) {
      proyectos = proyectos.filter(p => p.estado === args.estado);
    }
    if (args.categoria) {
      proyectos = proyectos.filter(p => p.categoria === args.categoria);
    }
    if (args.prioridad) {
      proyectos = proyectos.filter(p => p.prioridad === args.prioridad);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    proyectos.sort((a, b) => b.creado_en - a.creado_en);
    
    // Aplicar límite si existe
    if (args.limite) {
      proyectos = proyectos.slice(0, args.limite);
    }
    
    console.log(`✅ ${proyectos.length} proyectos encontrados`);
    
    return proyectos;
  },
});

/**
 * Obtener un proyecto específico por ID
 */
export const obtenerProyecto = query({
  args: {
    proyectoId: v.id("proyectos"),
  },
  handler: async (ctx, args) => {
    console.log(`🔍 Buscando proyecto: ${args.proyectoId}`);
    
    const proyecto = await ctx.db.get(args.proyectoId);
    
    if (!proyecto) {
      console.error(`❌ Proyecto no encontrado: ${args.proyectoId}`);
      return null;
    }
    
    console.log(`✅ Proyecto encontrado: ${proyecto.nombre}`);
    return proyecto;
  },
});

/**
 * Actualizar el estado de un proyecto
 */
export const actualizarEstadoProyecto = mutation({
  args: {
    proyectoId: v.id("proyectos"),
    estado: v.union(
      v.literal("activo"),
      v.literal("pausado"),
      v.literal("completado"),
      v.literal("cancelado")
    ),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(`🔄 Actualizando estado del proyecto ${args.proyectoId} a: ${args.estado}`);
    
    const proyecto = await ctx.db.get(args.proyectoId);
    
    if (!proyecto) {
      throw new Error(`Proyecto no encontrado: ${args.proyectoId}`);
    }
    
    const updates: any = {
      estado: args.estado,
      actualizado_en: Date.now(),
    };
    
    // Si se marca como completado, agregar fecha de finalización
    if (args.estado === "completado" && !proyecto.fecha_fin_real) {
      updates.fecha_fin_real = Date.now();
      updates.progreso = 100;
    }
    
    // Agregar notas si se proporcionan
    if (args.notas) {
      updates.notas = args.notas;
    }
    
    await ctx.db.patch(args.proyectoId, updates);
    
    console.log(`✅ Estado actualizado exitosamente`);
    
    return { 
      success: true,
      mensaje: `Proyecto actualizado a estado: ${args.estado}`
    };
  },
});

/**
 * Actualizar el progreso de un proyecto
 */
export const actualizarProgresoProyecto = mutation({
  args: {
    proyectoId: v.id("proyectos"),
    progreso: v.number(), // 0-100
  },
  handler: async (ctx, args) => {
    console.log(`📊 Actualizando progreso del proyecto ${args.proyectoId} a: ${args.progreso}%`);
    
    if (args.progreso < 0 || args.progreso > 100) {
      throw new Error("El progreso debe estar entre 0 y 100");
    }
    
    const proyecto = await ctx.db.get(args.proyectoId);
    
    if (!proyecto) {
      throw new Error(`Proyecto no encontrado: ${args.proyectoId}`);
    }
    
    const updates: any = {
      progreso: args.progreso,
      actualizado_en: Date.now(),
    };
    
    // Si alcanza 100%, marcar como completado
    if (args.progreso === 100 && proyecto.estado !== "completado") {
      updates.estado = "completado";
      updates.fecha_fin_real = Date.now();
    }
    
    await ctx.db.patch(args.proyectoId, updates);
    
    console.log(`✅ Progreso actualizado exitosamente`);
    
    return { 
      success: true,
      progreso: args.progreso,
      mensaje: `Progreso actualizado a ${args.progreso}%`
    };
  },
});

/**
 * Actualizar información general del proyecto
 */
export const actualizarProyecto = mutation({
  args: {
    proyectoId: v.id("proyectos"),
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    objetivo: v.optional(v.string()),
    prioridad: v.optional(v.union(v.literal("baja"), v.literal("media"), v.literal("alta"), v.literal("urgente"))),
    fecha_fin_estimada: v.optional(v.number()),
    presupuesto_estimado: v.optional(v.number()),
    presupuesto_gastado: v.optional(v.number()),
    cliente_nombre: v.optional(v.string()),
    cliente_email: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(`🔄 Actualizando proyecto: ${args.proyectoId}`);
    
    const proyecto = await ctx.db.get(args.proyectoId);
    
    if (!proyecto) {
      throw new Error(`Proyecto no encontrado: ${args.proyectoId}`);
    }
    
    // Construir objeto de actualización solo con campos proporcionados
    const updates: any = {
      actualizado_en: Date.now(),
    };
    
    if (args.nombre !== undefined) updates.nombre = args.nombre;
    if (args.descripcion !== undefined) updates.descripcion = args.descripcion;
    if (args.objetivo !== undefined) updates.objetivo = args.objetivo;
    if (args.prioridad !== undefined) updates.prioridad = args.prioridad;
    if (args.fecha_fin_estimada !== undefined) updates.fecha_fin_estimada = args.fecha_fin_estimada;
    if (args.presupuesto_estimado !== undefined) updates.presupuesto_estimado = args.presupuesto_estimado;
    if (args.presupuesto_gastado !== undefined) updates.presupuesto_gastado = args.presupuesto_gastado;
    if (args.cliente_nombre !== undefined) updates.cliente_nombre = args.cliente_nombre;
    if (args.cliente_email !== undefined) updates.cliente_email = args.cliente_email;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.notas !== undefined) updates.notas = args.notas;
    
    await ctx.db.patch(args.proyectoId, updates);
    
    console.log(`✅ Proyecto actualizado exitosamente`);
    
    return { 
      success: true,
      mensaje: `Proyecto actualizado exitosamente`
    };
  },
});

/**
 * Eliminar un proyecto (soft delete - marcarlo como cancelado)
 */
export const eliminarProyecto = mutation({
  args: {
    proyectoId: v.id("proyectos"),
    motivo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(`🗑️ Eliminando proyecto: ${args.proyectoId}`);
    
    const proyecto = await ctx.db.get(args.proyectoId);
    
    if (!proyecto) {
      throw new Error(`Proyecto no encontrado: ${args.proyectoId}`);
    }
    
    // Soft delete: marcar como cancelado
    await ctx.db.patch(args.proyectoId, {
      estado: "cancelado",
      notas: args.motivo 
        ? `${proyecto.notas || ''}\n[CANCELADO] ${args.motivo}` 
        : proyecto.notas,
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Proyecto marcado como cancelado`);
    
    return { 
      success: true,
      mensaje: `Proyecto cancelado exitosamente`
    };
  },
});

/**
 * Obtener estadísticas de proyectos
 */
export const obtenerEstadisticasProyectos = query({
  handler: async (ctx) => {
    console.log("📊 Generando estadísticas de proyectos");
    
    const proyectos = await ctx.db.query("proyectos").collect();
    
    const stats = {
      total: proyectos.length,
      activos: proyectos.filter(p => p.estado === "activo").length,
      pausados: proyectos.filter(p => p.estado === "pausado").length,
      completados: proyectos.filter(p => p.estado === "completado").length,
      cancelados: proyectos.filter(p => p.estado === "cancelado").length,
      por_categoria: {
        web: proyectos.filter(p => p.categoria === "web").length,
        mobile: proyectos.filter(p => p.categoria === "mobile").length,
        ia: proyectos.filter(p => p.categoria === "ia").length,
        automatizacion: proyectos.filter(p => p.categoria === "automatizacion").length,
        consultoria: proyectos.filter(p => p.categoria === "consultoria").length,
        personal: proyectos.filter(p => p.categoria === "personal").length,
        otro: proyectos.filter(p => p.categoria === "otro").length,
      },
      por_prioridad: {
        urgente: proyectos.filter(p => p.prioridad === "urgente").length,
        alta: proyectos.filter(p => p.prioridad === "alta").length,
        media: proyectos.filter(p => p.prioridad === "media").length,
        baja: proyectos.filter(p => p.prioridad === "baja").length,
      },
      progreso_promedio: proyectos.length > 0
        ? proyectos.reduce((sum, p) => sum + (p.progreso || 0), 0) / proyectos.length
        : 0,
    };
    
    console.log(`✅ Estadísticas generadas:`, stats);
    
    return stats;
  },
});

/**
 * Buscar proyectos por texto (nombre, descripción, tags)
 */
export const buscarProyectos = query({
  args: {
    texto: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`🔍 Buscando proyectos con texto: "${args.texto}"`);
    
    const proyectos = await ctx.db.query("proyectos").collect();
    const textoLower = args.texto.toLowerCase();
    
    const resultados = proyectos.filter(p => {
      const nombreMatch = p.nombre.toLowerCase().includes(textoLower);
      const descripcionMatch = p.descripcion.toLowerCase().includes(textoLower);
      const tagsMatch = p.tags?.some(tag => tag.toLowerCase().includes(textoLower));
      const notasMatch = p.notas?.toLowerCase().includes(textoLower);
      
      return nombreMatch || descripcionMatch || tagsMatch || notasMatch;
    });
    
    console.log(`✅ ${resultados.length} proyectos encontrados`);
    
    return resultados;
  },
});
