import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

// FinBot Pro - Google Gemini (Plan Gratuito)
// Extractor de datos financieros con IA

// Inicializar cliente de Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Mutaciones para Contabilidad
export const registrarTransaccion = mutation({
  args: {
    tipo: v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia")),
    categoria: v.string(),
    monto: v.number(),
    descripcion: v.string(),
    cuenta_origen: v.optional(v.string()),
    cuenta_destino: v.optional(v.string()),
    etiquetas: v.optional(v.array(v.string())),
    comprobante_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("🔥🔥🔥 REGISTRAR TRANSACCION LLAMADA (LEGACY) 🔥🔥🔥");
    console.log("📋 Args recibidos:", JSON.stringify(args, null, 2));
    
    try {
      // Legacy: calcular monto_neto y monto_total asumiendo IVA 19%
      const monto_total = args.monto;
      const monto_neto = Math.round(monto_total / 1.19);
      const monto_iva = monto_total - monto_neto;
      
      const transaccionId = await ctx.db.insert("contabilidad", {
        ...args,
        monto_total,
        monto_neto,
        monto_iva,
        afecto_iva: true,
        iva_porcentaje: 19,
        fecha: Date.now(),
        creado_por: "gemini",
        creado_en: Date.now(),
      });
      
      console.log("✅ Transacción insertada exitosamente. ID:", transaccionId);
      
      return { 
        success: true, 
        transaccionId,
        mensaje: `Transacción ${args.tipo} de $${args.monto} registrada exitosamente`
      };
    } catch (error) {
      console.error("❌ ERROR al insertar transacción:", error);
      throw error;
    }
  },
});

// Mutación para guardar mensajes de Telegram en historial
export const guardarMensajeTelegram = mutation({
  args: {
    message_id: v.number(),
    chat_id: v.string(),
    username: v.string(),
    tipo_mensaje: v.union(
      v.literal("texto"),
      v.literal("voz"),
      v.literal("foto"),
      v.literal("documento")
    ),
    contenido_texto: v.optional(v.string()),
    contenido_transcrito: v.optional(v.string()),
    archivo_url: v.optional(v.string()),
    duracion_audio: v.optional(v.number()),
    respuesta_bot: v.string(),
    accion_realizada: v.string(),
    datos_extraidos: v.optional(v.any()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const mensajeId = await ctx.db.insert("mensajes_telegram", args);
    
    console.log(`📝 Mensaje guardado en historial: ${mensajeId}`);
    
    return {
      success: true,
      mensajeId,
    };
  },
});

// Query para obtener mensajes recientes (memoria contextual)
export const obtenerMensajesRecientes = query({
  args: {
    chat_id: v.string(),
    desde: v.number(),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const mensajes = await ctx.db
      .query("mensajes_telegram")
      .withIndex("por_chat_timestamp", q => 
        q.eq("chat_id", args.chat_id)
         .gte("timestamp", args.desde)
      )
      .order("desc")
      .take(args.limite || 5);
    
    return mensajes;
  },
});

// Mutaciones para Design Thinking
export const crearProyectoDT = mutation({
  args: {
    proyecto_id: v.string(),
    fase: v.union(v.literal("empatizar"), v.literal("definir"), v.literal("idear"), v.literal("prototipar"), v.literal("testear")),
    titulo: v.string(),
    descripcion: v.string(),
    insights: v.optional(v.array(v.string())),
    archivos_adjuntos: v.optional(v.array(v.string())),
    stakeholders: v.optional(v.array(v.string())),
    prioridad: v.union(v.literal("baja"), v.literal("media"), v.literal("alta")),
  },
  handler: async (ctx, args) => {
    const proyectoId = await ctx.db.insert("design_thinking", {
      ...args,
      estado: "activo",
      creado_por: "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    return { 
      success: true, 
      proyectoId,
      mensaje: `Proyecto "${args.titulo}" creado en fase ${args.fase}`
    };
  },
});

// NUEVA FUNCIÓN: Crear proyecto completo con tabla de proyectos + design thinking
export const crearProyectoCompleto = mutation({
  args: {
    nombre: v.string(),
    descripcion: v.string(),
    categoria: v.optional(v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("ia"),
      v.literal("automatizacion"),
      v.literal("consultoria"),
      v.literal("personal"),
      v.literal("otro")
    )),
    fase: v.optional(v.union(v.literal("empatizar"), v.literal("definir"), v.literal("idear"), v.literal("prototipar"), v.literal("testear"))),
    prioridad: v.optional(v.union(v.literal("baja"), v.literal("media"), v.literal("alta"), v.literal("urgente"))),
    insights: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log(`📝 Creando proyecto completo: ${args.nombre}`);
    
    // 1. Crear proyecto en tabla de proyectos
    const proyectoId = await ctx.db.insert("proyectos", {
      nombre: args.nombre,
      descripcion: args.descripcion,
      objetivo: undefined,
      categoria: args.categoria || "personal",
      estado: "activo",
      prioridad: args.prioridad || "media",
      fecha_inicio: Date.now(),
      fecha_fin_estimada: undefined,
      fecha_fin_real: undefined,
      progreso: 0,
      presupuesto_estimado: undefined,
      presupuesto_gastado: 0,
      moneda: "CLP",
      cliente_nombre: undefined,
      cliente_email: undefined,
      equipo: undefined,
      tags: args.tags,
      notas: undefined,
      archivos_adjuntos: undefined,
      creado_por: "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Proyecto creado con ID: ${proyectoId}`);
    
    // 2. Crear fase de design thinking vinculada al proyecto
    const faseDT = args.fase || "idear";
    // Mapear prioridad: design_thinking no soporta "urgente", usar "alta"
    const prioridadDT = (args.prioridad === "urgente" ? "alta" : args.prioridad) || "media";
    const dtId = await ctx.db.insert("design_thinking", {
      proyecto_id: proyectoId,
      fase: faseDT,
      titulo: args.nombre,
      descripcion: args.descripcion,
      insights: args.insights,
      archivos_adjuntos: undefined,
      stakeholders: undefined,
      prioridad: prioridadDT as "baja" | "media" | "alta",
      estado: "activo",
      creado_por: "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    console.log(`✅ Fase de Design Thinking creada con ID: ${dtId}`);
    
    return { 
      success: true, 
      proyectoId,
      designThinkingId: dtId,
      mensaje: `Proyecto "${args.nombre}" creado exitosamente en fase ${faseDT}`
    };
  },
});


// Queries para Dashboard Admin
export const obtenerResumenFinanciero = query({
  handler: async (ctx) => {
    const transacciones = await ctx.db.query("contabilidad").collect();
    
    const ingresos = transacciones
      .filter(t => t.tipo === "ingreso")
      .reduce((sum, t) => sum + (t.monto_total || t.monto || 0), 0);
    
    const gastos = transacciones
      .filter(t => t.tipo === "gasto")
      .reduce((sum, t) => sum + (t.monto_total || t.monto || 0), 0);
    
    const balance = ingresos - gastos;
    
    return {
      total_ingresos: ingresos,
      total_gastos: gastos,
      balance,
      total_transacciones: transacciones.length,
    };
  },
});

export const obtenerProyectosDT = query({
  args: { 
    proyecto_id: v.optional(v.string()),
    fase: v.optional(v.union(v.literal("empatizar"), v.literal("definir"), v.literal("idear"), v.literal("prototipar"), v.literal("testear"))),
  },
  handler: async (ctx, args) => {
    let proyectos = ctx.db.query("design_thinking");
    
    if (args.proyecto_id) {
      proyectos = proyectos.filter(q => q.eq(q.field("proyecto_id"), args.proyecto_id));
    }
    if (args.fase) {
      proyectos = proyectos.filter(q => q.eq(q.field("fase"), args.fase));
    }
    
    return await proyectos.collect();
  },
});

// Query para listar todas las transacciones
export const obtenerTransacciones = query({
  args: {
    limite: v.optional(v.number()),
    tipo: v.optional(v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia"))),
  },
  handler: async (ctx, args) => {
    let transacciones = ctx.db.query("contabilidad")
      .withIndex("por_fecha")
      .order("desc");
    
    if (args.tipo) {
      transacciones = transacciones.filter(q => q.eq(q.field("tipo"), args.tipo));
    }
    
    const limite = args.limite || 20;
    const resultado = await transacciones.take(limite);
    
    return resultado.map(t => ({
      _id: t._id,
      tipo: t.tipo,
      categoria: t.categoria,
      monto: t.monto,
      descripcion: t.descripcion,
      fecha: t.fecha,
      comprobante_url: t.comprobante_url,
      creado_por: t.creado_por,
      creado_en: t.creado_en,
    }));
  },
});

// Mutation para editar una transacción
export const editarTransaccion = mutation({
  args: {
    id: v.id("contabilidad"),
    tipo: v.optional(v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia"))),
    categoria: v.optional(v.string()),
    monto: v.optional(v.number()),
    descripcion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...cambios } = args;
    
    // Verificar que la transacción existe
    const transaccion = await ctx.db.get(id);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }
    
    // Actualizar solo los campos que se proporcionaron
    await ctx.db.patch(id, cambios);
    
    console.log(`✅ Transacción ${id} actualizada`);
    
    return {
      success: true,
      mensaje: `Transacción actualizada: ${cambios.tipo || transaccion.tipo} de $${cambios.monto || transaccion.monto}`,
    };
  },
});

// Mutation para eliminar una transacción
export const eliminarTransaccion = mutation({
  args: {
    id: v.id("contabilidad"),
  },
  handler: async (ctx, args) => {
    const transaccion = await ctx.db.get(args.id);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }
    
    await ctx.db.delete(args.id);
    
    console.log(`🗑️ Transacción ${args.id} eliminada`);
    
    return {
      success: true,
      mensaje: `Transacción eliminada: ${transaccion.tipo} de $${transaccion.monto || transaccion.monto_total}`,
    };
  },
});

// ===================================
// SISTEMA DE IVA CHILENO - F29
// ===================================

// Mutation mejorada con cálculo automático de IVA (19% Chile)
export const registrarTransaccionConIVA = mutation({
  args: {
    tipo: v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia")),
    categoria: v.string(),
    descripcion: v.string(),
    
    // Montos: puede recibir monto_total o monto_neto
    monto_total: v.optional(v.number()), // Monto con IVA incluido
    monto_neto: v.optional(v.number()), // Monto sin IVA
    
    // Información tributaria
    afecto_iva: v.optional(v.boolean()), // Default: true
    iva_porcentaje: v.optional(v.number()), // Default: 19
    tipo_documento: v.optional(v.union(
      v.literal("factura"),
      v.literal("boleta"),
      v.literal("nota_credito"),
      v.literal("nota_debito"),
      v.literal("factura_exenta"),
      v.literal("otro")
    )),
    numero_documento: v.optional(v.string()),
    folio: v.optional(v.string()),
    
    // Partes involucradas
    rut_emisor: v.optional(v.string()),
    razon_social_emisor: v.optional(v.string()),
    rut_receptor: v.optional(v.string()),
    razon_social_receptor: v.optional(v.string()),
    
    // Otros campos
    fecha: v.optional(v.number()), // Si no se provee, usa Date.now()
    etiquetas: v.optional(v.array(v.string())),
    comprobante_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("🧾 REGISTRAR TRANSACCIÓN CON IVA");
    
    // Determinar si está afecto a IVA
    const afecto = args.afecto_iva !== undefined ? args.afecto_iva : true;
    const porcentaje_iva = args.iva_porcentaje || 19;
    
    // Calcular montos de IVA
    let monto_neto: number;
    let monto_iva: number;
    let monto_total: number;
    
    if (afecto) {
      if (args.monto_total) {
        // Si recibimos monto total, calculamos neto e IVA
        monto_total = args.monto_total;
        monto_neto = monto_total / (1 + porcentaje_iva / 100);
        monto_iva = monto_total - monto_neto;
      } else if (args.monto_neto) {
        // Si recibimos monto neto, calculamos IVA y total
        monto_neto = args.monto_neto;
        monto_iva = monto_neto * (porcentaje_iva / 100);
        monto_total = monto_neto + monto_iva;
      } else {
        throw new Error("Debe proporcionar monto_total o monto_neto");
      }
    } else {
      // No afecto a IVA (exento)
      monto_total = args.monto_total || args.monto_neto || 0;
      monto_neto = monto_total;
      monto_iva = 0;
    }
    
    // Calcular período tributario
    const fecha = args.fecha || Date.now();
    const fechaObj = new Date(fecha);
    const periodo_tributario = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}`;
    const mes_declaracion = fechaObj.getMonth() + 1;
    const anio_declaracion = fechaObj.getFullYear();
    
    // Insertar en BD
    const transaccionId = await ctx.db.insert("contabilidad", {
      tipo: args.tipo,
      categoria: args.categoria,
      descripcion: args.descripcion,
      fecha,
      
      // Montos calculados
      monto_neto: Math.round(monto_neto),
      monto_iva: Math.round(monto_iva),
      monto_total: Math.round(monto_total),
      
      // IVA
      afecto_iva: afecto,
      iva_porcentaje: afecto ? porcentaje_iva : 0,
      
      // Documento tributario
      tipo_documento: args.tipo_documento,
      numero_documento: args.numero_documento,
      folio: args.folio,
      
      // Partes
      rut_emisor: args.rut_emisor,
      razon_social_emisor: args.razon_social_emisor,
      rut_receptor: args.rut_receptor,
      razon_social_receptor: args.razon_social_receptor,
      
      // Período
      periodo_tributario,
      mes_declaracion,
      anio_declaracion,
      
      // Legacy (compatibilidad)
      monto: monto_total,
      etiquetas: args.etiquetas,
      comprobante_url: args.comprobante_url,
      
      // Metadata
      creado_por: "gemini",
      creado_en: Date.now(),
    });
    
    console.log(`✅ Transacción con IVA registrada: ${transaccionId}`);
    console.log(`   Neto: $${Math.round(monto_neto)} | IVA: $${Math.round(monto_iva)} | Total: $${Math.round(monto_total)}`);
    
    return {
      success: true,
      transaccionId,
      mensaje: `${args.tipo.toUpperCase()} registrado: $${Math.round(monto_neto)} + IVA $${Math.round(monto_iva)} = $${Math.round(monto_total)}`,
      detalles: {
        monto_neto: Math.round(monto_neto),
        monto_iva: Math.round(monto_iva),
        monto_total: Math.round(monto_total),
        periodo: periodo_tributario,
      },
    };
  },
});

// Query: Resumen de IVA por mes (para Formulario 29)
export const obtenerResumenIVA = query({
  args: {
    periodo: v.string(), // Formato: "YYYY-MM" ej: "2026-02"
  },
  handler: async (ctx, args) => {
    console.log(`📊 Calculando resumen IVA para período: ${args.periodo}`);
    
    // Obtener todas las transacciones del período
    const transacciones = await ctx.db
      .query("contabilidad")
      .withIndex("por_periodo", q => q.eq("periodo_tributario", args.periodo))
      .collect();
    
    console.log(`   Encontradas ${transacciones.length} transacciones`);
    
    // Separar ingresos y gastos
    const ingresos = transacciones.filter(t => t.tipo === "ingreso");
    const gastos = transacciones.filter(t => t.tipo === "gasto");
    
    // Calcular totales de INGRESOS (Débito Fiscal)
    const ventas_netas = ingresos.reduce((sum, t) => sum + (t.monto_neto || 0), 0);
    const iva_debito_fiscal = ingresos.reduce((sum, t) => sum + (t.monto_iva || 0), 0);
    const ventas_totales = ingresos.reduce((sum, t) => sum + (t.monto_total || t.monto || 0), 0);
    const ventas_exentas = ingresos.filter(t => !t.afecto_iva).reduce((sum, t) => sum + (t.monto_total || 0), 0);
    
    // Calcular totales de GASTOS (Crédito Fiscal)
    const compras_netas = gastos.reduce((sum, t) => sum + (t.monto_neto || 0), 0);
    const iva_credito_fiscal = gastos.reduce((sum, t) => sum + (t.monto_iva || 0), 0);
    const compras_totales = gastos.reduce((sum, t) => sum + (t.monto_total || t.monto || 0), 0);
    const compras_exentas = gastos.filter(t => !t.afecto_iva).reduce((sum, t) => sum + (t.monto_total || 0), 0);
    
    // CÁLCULO F29: Débito - Crédito = IVA a Pagar
    const iva_determinado = iva_debito_fiscal - iva_credito_fiscal;
    const iva_a_pagar = Math.max(iva_determinado, 0); // Si es negativo, hay saldo a favor
    const saldo_a_favor = Math.abs(Math.min(iva_determinado, 0));
    
    const resultado = {
      periodo: args.periodo,
      
      // VENTAS (Facturas emitidas)
      ventas: {
        ventas_afectas_netas: Math.round(ventas_netas),
        iva_debito_fiscal: Math.round(iva_debito_fiscal),
        ventas_totales: Math.round(ventas_totales),
        ventas_exentas: Math.round(ventas_exentas),
        numero_facturas_emitidas: ingresos.filter(t => t.tipo_documento === "factura").length,
      },
      
      // COMPRAS (Facturas recibidas)
      compras: {
        compras_afectas_netas: Math.round(compras_netas),
        iva_credito_fiscal: Math.round(iva_credito_fiscal),
        compras_totales: Math.round(compras_totales),
        compras_exentas: Math.round(compras_exentas),
        numero_facturas_recibidas: gastos.filter(t => t.tipo_documento === "factura").length,
      },
      
      // RESUMEN F29
      f29: {
        debito_fiscal: Math.round(iva_debito_fiscal),
        credito_fiscal: Math.round(iva_credito_fiscal),
        iva_determinado: Math.round(iva_determinado),
        iva_a_pagar: Math.round(iva_a_pagar),
        saldo_a_favor: Math.round(saldo_a_favor),
      },
      
      // Metadata
      total_transacciones: transacciones.length,
      total_ingresos: ingresos.length,
      total_gastos: gastos.length,
    };
    
    console.log(`   IVA Débito: $${resultado.ventas.iva_debito_fiscal}`);
    console.log(`   IVA Crédito: $${resultado.compras.iva_credito_fiscal}`);
    console.log(`   IVA a Pagar: $${resultado.f29.iva_a_pagar}`);
    
    return resultado;
  },
});

// Query: Listar transacciones por período (para revisión F29)
export const obtenerTransaccionesPorPeriodo = query({
  args: {
    periodo: v.string(), // "YYYY-MM"
    tipo: v.optional(v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia"))),
    afecto_iva: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("contabilidad")
      .withIndex("por_periodo", q => q.eq("periodo_tributario", args.periodo));
    
    const transacciones = await query.collect();
    
    // Filtrar por tipo si se especifica
    let resultado = transacciones;
    if (args.tipo) {
      resultado = resultado.filter(t => t.tipo === args.tipo);
    }
    if (args.afecto_iva !== undefined) {
      resultado = resultado.filter(t => t.afecto_iva === args.afecto_iva);
    }
    
    return resultado.map(t => ({
      _id: t._id,
      tipo: t.tipo,
      categoria: t.categoria,
      descripcion: t.descripcion,
      fecha: t.fecha,
      monto_neto: t.monto_neto,
      monto_iva: t.monto_iva,
      monto_total: t.monto_total,
      afecto_iva: t.afecto_iva,
      tipo_documento: t.tipo_documento,
      numero_documento: t.numero_documento,
      folio: t.folio,
      rut_emisor: t.rut_emisor,
      razon_social_emisor: t.razon_social_emisor,
      rut_receptor: t.rut_receptor,
      razon_social_receptor: t.razon_social_receptor,
      comprobante_url: t.comprobante_url,
    }));
  },
});

// Query: Períodos disponibles para declaración
export const obtenerPeriodosDisponibles = query({
  args: {},
  handler: async (ctx) => {
    const transacciones = await ctx.db
      .query("contabilidad")
      .collect();
    
    // Extraer períodos únicos
    const periodosSet = new Set(
      transacciones
        .map(t => t.periodo_tributario)
        .filter(p => p !== undefined)
    );
    
    const periodos = Array.from(periodosSet).sort().reverse();
    
    return periodos;
  },
});

// Actions de IA con Gemini para Telegram
export const procesarMensajeTelegram = action({
  args: {
    mensaje: v.string(),
    chat_id: v.string(),
    username: v.string(),
    message_id: v.number(),
    tipo_mensaje: v.optional(v.union(
      v.literal("texto"),
      v.literal("voz"),
      v.literal("foto"),
      v.literal("documento")
    )),
    file_id: v.optional(v.string()),
    file_name: v.optional(v.string()),
    mime_type: v.optional(v.string()),
    file_size: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ respuesta: string; accion: string; datos: any }> => {
    // 🔐 SEGURIDAD: Verificar que el chat_id esté autorizado
    const MY_TELEGRAM_ID = process.env.MY_TELEGRAM_ID;
    if (!MY_TELEGRAM_ID || args.chat_id !== MY_TELEGRAM_ID) {
      throw new Error(`Unauthorized access from chat_id: ${args.chat_id}`);
    }
    
    // 🧠 MEMORIA CONTEXTUAL: Obtener mensajes recientes (últimos 2 minutos)
    const dosMinutosAtras = Date.now() - (2 * 60 * 1000);
    let contextoMemoria = "";
    
    try {
      const mensajesRecientes = await ctx.runQuery(
        api.functions.ai.gemini.obtenerMensajesRecientes,
        {
          chat_id: args.chat_id,
          desde: dosMinutosAtras,
          limite: 5
        }
      );
      
      if (mensajesRecientes.length > 0) {
        console.log(`🧠 Encontrados ${mensajesRecientes.length} mensajes recientes para contexto`);
        
        const historial = mensajesRecientes
          .reverse() // Orden cronológico (más antiguo primero)
          .map((m: any) => {
            const contenido = m.contenido_texto || m.contenido_transcrito || "[audio/imagen]";
            return `- Tú: "${contenido}"\n  Bot: "${m.respuesta_bot.substring(0, 100)}..."`;
          })
          .join('\n');
        
        contextoMemoria = `\n\n📜 CONTEXTO DE CONVERSACIÓN RECIENTE (últimos 2 minutos):\n${historial}\n\n`;
      } else {
        console.log(`ℹ️ No hay mensajes recientes en los últimos 2 minutos`);
      }
    } catch (memoryError) {
      console.warn(`⚠️ Error obteniendo memoria contextual:`, memoryError);
      // Continuar sin contexto si hay error
    }
    
    // 📄 PROCESAMIENTO DE DOCUMENTOS (PDF, Imágenes)
    if ((args.tipo_mensaje === "documento" || args.tipo_mensaje === "foto") && args.file_id) {
      console.log(`📄 Procesando ${args.tipo_mensaje}: ${args.file_name || 'archivo'} (${args.mime_type})`);
      
      let fileUrl = "";
      
      try {
        // Obtener archivo de Telegram usando file_id
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          throw new Error("TELEGRAM_BOT_TOKEN no configurado");
        }
        
        console.log(`📲 Obteniendo información del archivo: ${args.file_id}`);
        
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/getFile?file_id=${args.file_id}`
        );
        const fileData = await fileResponse.json();
        
        if (!fileData.ok) {
          throw new Error(`Error obteniendo archivo: ${JSON.stringify(fileData)}`);
        }
        
        fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        console.log(`📥 Descargando archivo desde: ${fileUrl}`);
        
        // Descargar el archivo
        const fileDownloadResponse = await fetch(fileUrl);
        const arrayBuffer = await fileDownloadResponse.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);
        
        console.log(`📊 Archivo descargado: ${fileBytes.length} bytes`);
        
        // Convertir a base64
        let binaryString = '';
        for (let i = 0; i < fileBytes.length; i++) {
          binaryString += String.fromCharCode(fileBytes[i]);
        }
        const base64File = btoa(binaryString);
        
        console.log(`📤 Archivo convertido a base64: ${base64File.length} caracteres`);
        
        // Determinar mime type correcto
        let actualMimeType = args.mime_type || "application/pdf";
        if (args.tipo_mensaje === "foto") {
          actualMimeType = "image/jpeg";
        }
        
        // Obtener datos de la empresa configurada
        const empresaConfig = await ctx.runQuery(api.functions.ai.gemini.obtenerConfiguracionEmpresa);
        const datosEmpresa = empresaConfig.rut ? 
          `\n\n🏢 **DATOS DE TU EMPRESA:**\n- RUT: ${empresaConfig.rut}\n- Razón Social: ${empresaConfig.razon_social || "No configurada"}` :
          "\n\n⚠️ *No has configurado los datos de tu empresa. Usa `/empresa RUT | RAZÓN SOCIAL` para configurarlos.*";
        
        // Prompt para análisis de documento/factura
        const promptDocumento = `Eres FinBot Pro, asistente de FINANZAS especializado en facturas y boletas chilenas.

📄 DOCUMENTO: ${args.file_name || args.tipo_mensaje}
${datosEmpresa}

🎯 ANALIZA Y EXTRAE:
1. **Monto Total** (con IVA)
2. **Fecha** (formato: YYYY-MM-DD)
3. **Folio** o número
4. **Emisor** (RUT y nombre de quien emite)
5. **Receptor** (RUT y nombre de quien recibe) - si aparece
6. **Descripción** del producto/servicio
7. **Tipo**: factura, boleta, nota_credito, etc.

🔍 **CLASIFICACIÓN AUTOMÁTICA:**

✅ **Es GASTO si:**
   - El RECEPTOR es "${empresaConfig.rut || "N/A"}" o "${empresaConfig.razon_social || "N/A"}"
   - O si es una boleta de compra (tú compraste algo)
   - O si dice "pagado a", "compra", "adquisición"

✅ **Es INGRESO si:**
   - El EMISOR es "${empresaConfig.rut || "N/A"}" o "${empresaConfig.razon_social || "N/A"}"
   - O si es una factura que TÚ emitiste
   - O si dice "vendido a", "servicio prestado", "cobro"

📋 **FORMATO DE RESPUESTA** (separa con |):
ACCION:GASTO|monto|fecha|categoria|descripcion|folio|rut_emisor|razon_emisor|rut_receptor|razon_receptor|tipo_doc

⚠️ **SI FALTA INFORMACIÓN**, usa "N/A" en ese campo pero SIEMPRE mantén el formato.

💡 **EJEMPLOS:**

**Boleta de compra (GASTO):**
ACCION:GASTO|15000|2026-01-15|alimentacion|Almuerzo SIBN|N/A|76555666-7|SIBN SPA|N/A|N/A|boleta

**Factura emitida por ti (INGRESO):**
ACCION:INGRESO|500000|2026-01-20|servicios|Diseño web|123|${empresaConfig.rut || "78318808-2"}|${empresaConfig.razon_social || "MI EMPRESA"}|77999888-7|CLIENTE ABC|factura

**Factura de arriendo (GASTO):**
ACCION:GASTO|450000|2026-01-10|arriendo|Oficina enero|456|76111222-3|INMOBILIARIA XYZ|${empresaConfig.rut || "N/A"}|${empresaConfig.razon_social || "N/A"}|factura

🚨 **MUY IMPORTANTE:** 
- Categorías válidas: servicios, arriendo, alimentacion, transporte, insumos, honorarios, ventas, etc.
- Si es BOLETA de compra → casi siempre GASTO
- Si dudas, analiza el contexto del documento

📝 Si NO puedes leer el documento, responde:
"No pude extraer información de factura. ¿Podrías confirmar el monto y categoría?"

${contextoMemoria}Analiza el siguiente documento:`;
        
        // Llamar a Gemini con documento en base64
        console.log("🤖 Llamando a Gemini con documento...");
        
        const contents = [
          {
            inlineData: {
              mimeType: actualMimeType,
              data: base64File,
            },
          },
          { text: promptDocumento },
        ];
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: contents,
        });
        
        const respuestaGemini = response.text || "No pude procesar el documento.";
        console.log(`🤖 Gemini respondió:`, respuestaGemini);
        
        // Analizar respuesta para detectar acción
        const accionMatch = respuestaGemini.match(/ACCION:(GASTO|INGRESO)\|(.+)/i);
        
        if (accionMatch) {
          let tipoAccion = accionMatch[1].toUpperCase();
          const datosStr = accionMatch[2];
          
          // Parsear: monto_total|fecha|categoria|descripcion|folio|rut_emisor|razon_emisor|rut_receptor|razon_receptor|tipo_doc
          const partes = datosStr.split("|");
          const monto_total = parseFloat(partes[0].replace(/[^0-9.]/g, ""));
          const fechaStr = partes[1]?.trim(); // YYYY-MM-DD
          const categoria = partes[2]?.trim() || "Sin categoría";
          const descripcion = partes[3]?.trim() || args.file_name || "Documento";
          const folio = partes[4]?.trim();
          const rut_emisor = partes[5]?.trim();
          const razon_social_emisor = partes[6]?.trim();
          const rut_receptor = partes[7]?.trim();
          const razon_social_receptor = partes[8]?.trim();
          const tipo_documento = partes[9]?.trim() || "factura";
          
          // 🔍 INFERENCIA INTELIGENTE: Si es boleta sin receptor, es GASTO
          if (tipo_documento === "boleta" && (!rut_receptor || rut_receptor === "N/A")) {
            console.log("🤖 Inferencia: Boleta sin receptor → GASTO");
            tipoAccion = "GASTO";
          }
          
          // 🔍 INFERENCIA: Si el emisor es la empresa configurada, es INGRESO
          if (empresaConfig.rut && rut_emisor && rut_emisor.includes(empresaConfig.rut.replace(/-/g, ""))) {
            console.log("🤖 Inferencia: Emisor es mi empresa → INGRESO");
            tipoAccion = "INGRESO";
          }
          
          // 🔍 INFERENCIA: Si el receptor es la empresa configurada, es GASTO
          if (empresaConfig.rut && rut_receptor && rut_receptor.includes(empresaConfig.rut.replace(/-/g, ""))) {
            console.log("🤖 Inferencia: Receptor es mi empresa → GASTO");
            tipoAccion = "GASTO";
          }
          
          // Convertir fecha ISO a timestamp
          let fechaTimestamp = Date.now(); // Default: hoy
          if (fechaStr && fechaStr !== "N/A" && fechaStr.match(/\d{4}-\d{2}-\d{2}/)) {
            try {
              fechaTimestamp = new Date(fechaStr).getTime();
              console.log(`📅 Fecha de factura detectada: ${fechaStr} -> ${new Date(fechaTimestamp).toLocaleDateString('es-CL')}`);
            } catch (e) {
              console.warn(`⚠️ Error parseando fecha ${fechaStr}, usando fecha actual`);
            }
          } else {
            console.warn(`⚠️ Fecha no detectada en formato correcto, usando fecha actual`);
          }
          
          console.log(`💾 Guardando factura: ${tipoAccion} de $${monto_total} del ${fechaStr || 'hoy'}`);
          console.log(`   Tipo Doc: ${tipo_documento} | Folio: ${folio || 'N/A'}`);
          console.log(`   Emisor: ${razon_social_emisor || rut_emisor || 'N/A'}`);
          console.log(`   Receptor: ${razon_social_receptor || rut_receptor || 'N/A'}`);
          
          // Usar registrarTransaccionConIVA para guardar con todos los datos tributarios
          const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccionConIVA, {
            tipo: tipoAccion.toLowerCase() as "gasto" | "ingreso",
            categoria,
            descripcion: `📄 ${descripcion}`,
            monto_total,
            fecha: fechaTimestamp,
            afecto_iva: true,
            iva_porcentaje: 19,
            tipo_documento: tipo_documento as any,
            folio: folio && folio !== "N/A" ? folio : undefined,
            numero_documento: folio && folio !== "N/A" ? folio : undefined,
            rut_emisor: rut_emisor && rut_emisor !== "N/A" ? rut_emisor : undefined,
            razon_social_emisor: razon_social_emisor && razon_social_emisor !== "N/A" ? razon_social_emisor : undefined,
            rut_receptor: rut_receptor && rut_receptor !== "N/A" ? rut_receptor : undefined,
            razon_social_receptor: razon_social_receptor && razon_social_receptor !== "N/A" ? razon_social_receptor : undefined,
            comprobante_url: fileUrl,
          });
          
          // Guardar mensaje en historial
          await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
            message_id: args.message_id,
            chat_id: args.chat_id,
            username: args.username,
            tipo_mensaje: args.tipo_mensaje,
            contenido_texto: `Documento: ${args.file_name}`,
            archivo_url: fileUrl,
            respuesta_bot: `✅ ${tipoAccion === "GASTO" ? "💸 Gasto" : "💰 Ingreso"} registrado: $${monto_total}`,
            accion_realizada: "transaccion",
            datos_extraidos: resultado,
            timestamp: Date.now(),
          });
          
          // Calcular montos de IVA
          const monto_neto = Math.round(monto_total / 1.19);
          const monto_iva = monto_total - monto_neto;
          
          // Extraer período tributario de la fecha
          const fechaObj = new Date(fechaTimestamp);
          const periodo = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}`;
          
          // Determinar emoji del tipo de documento
          const emojiDoc = tipo_documento === "boleta" ? "🧾" : 
                          tipo_documento === "factura" ? "🧾" :
                          tipo_documento === "nota_credito" ? "📝" : "📄";
          
          let respuestaFinal = `✅ ${emojiDoc} *${tipoAccion === "GASTO" ? "Gasto" : "Ingreso"} Registrado*\n\n`;
          respuestaFinal += `💰 **Total:** $${monto_total.toLocaleString('es-CL')}\n`;
          respuestaFinal += `   ├ Neto: $${monto_neto.toLocaleString('es-CL')}\n`;
          respuestaFinal += `   └ IVA (19%): $${monto_iva.toLocaleString('es-CL')}\n\n`;
          respuestaFinal += `📅 **Fecha:** ${fechaObj.toLocaleDateString('es-CL')}\n`;
          respuestaFinal += `📊 **Período:** ${periodo}\n`;
          respuestaFinal += `💼 **Categoría:** ${categoria}\n`;
          respuestaFinal += `📋 **Tipo:** ${tipo_documento.replace('_', ' ')}\n`;
          if (folio && folio !== "N/A") {
            respuestaFinal += `📎 **Folio:** ${folio}\n`;
          }
          if (razon_social_emisor && razon_social_emisor !== "N/A") {
            respuestaFinal += `🏢 **Emisor:** ${razon_social_emisor}\n`;
          }
          if (descripcion && descripcion !== "Documento") {
            respuestaFinal += `📝 **Detalle:** ${descripcion}\n`;
          }
          respuestaFinal += `\n✅ ¡Registrado para F29 ${periodo}!`;
          
          return {
            respuesta: respuestaFinal,
            accion: "transaccion",
            datos: resultado
          };
        }
        
        // Si no hay acción específica, responder con análisis
        const respuestaLimpia = respuestaGemini.replace(/ACCION:.+/gi, "").trim();
        
        // Guardar mensaje en historial
        await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
          message_id: args.message_id,
          chat_id: args.chat_id,
          username: args.username,
          tipo_mensaje: args.tipo_mensaje,
          contenido_texto: `Documento: ${args.file_name}`,
          archivo_url: fileUrl,
          respuesta_bot: respuestaLimpia,
          accion_realizada: "consulta_documento",
          datos_extraidos: null,
          timestamp: Date.now(),
        });
        
        return {
          respuesta: respuestaLimpia,
          accion: "consulta_documento",
          datos: null
        };
        
      } catch (docError) {
        console.error("❌ Error procesando documento:", docError);
        return {
          respuesta: `❌ No pude procesar el documento. Por favor, envía los datos manualmente:\n\nEjemplo: \`/gasto 1500 servicios\``,
          accion: "error",
          datos: { error: String(docError) }
        };
      }
    }
    
    // 🎤 PROCESAMIENTO DE AUDIO (Mensajes de Voz)
    if (args.tipo_mensaje === "voz" && args.file_id) {
      console.log(`🎤 Procesando mensaje de voz (${args.file_size}s)...`);
      
      let audioUrl = "";
      
      try {
        // Obtener archivo de Telegram usando file_id
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          throw new Error("TELEGRAM_BOT_TOKEN no configurado");
        }
        
        console.log(`📲 Obteniendo información del archivo: ${args.file_id}`);
        
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/getFile?file_id=${args.file_id}`
        );
        const fileData = await fileResponse.json();
        
        if (!fileData.ok) {
          throw new Error(`Error obteniendo archivo: ${JSON.stringify(fileData)}`);
        }
        
        audioUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        console.log(`📥 Descargando audio desde: ${audioUrl}`);
        
        // Descargar el archivo de audio
        const audioResponse = await fetch(audioUrl);
        const arrayBuffer = await audioResponse.arrayBuffer();
        
        // Convertir a Uint8Array
        const audioData = new Uint8Array(arrayBuffer);
        
        console.log(`📊 Audio descargado y convertido: ${audioData.length} bytes`);
        
        // Crear un Blob del audio para subirlo
        const audioBlob = new Blob([audioData], { type: 'audio/ogg' });
        
        // Subir el archivo de audio a Google Files API
        console.log("📤 Subiendo audio a Google Files API...");
        
        const uploadedFile = await ai.files.upload({
          file: audioBlob,
          config: { 
            mimeType: "audio/ogg",
            displayName: `telegram_voice_${args.message_id}.ogg`
          },
        });
        
        console.log(`✅ Archivo subido: ${uploadedFile.uri}`);
        
        // Verificar que el archivo se subió correctamente
        if (!uploadedFile.uri || !uploadedFile.mimeType) {
          throw new Error("Error al subir archivo de audio a Google");
        }
        
        // Prompt multimodal para análisis de audio
        const promptAudio = `Eres FinBot Pro, asistente personal especializado en FINANZAS y DESIGN THINKING (solo para Jorge).

🎯 TU ROL DUAL:

1️⃣ **GESTOR FINANCIERO**:
   Registra gastos, ingresos y transacciones con formato:
   "ACCION:GASTO|$monto|categoría|descripción"

2️⃣ **CONSULTOR DE DISEÑO**:
   Captura ideas y proyectos con formato:
   "ACCION:IDEA|título|descripción|fase"

🎤 INSTRUCCIONES:
1. Transcribe el audio en español
2. Identifica la intención (finanzas vs diseño vs consulta)
3. Extrae datos relevantes
4. Responde de forma clara y concisa

💡 EJEMPLOS:
Audio: "Gasté 35 dólares en Uber"
→ ACCION:GASTO|35|transporte|Uber

Audio: "Idea para el proyecto: usar colores pasteles"
→ ACCION:IDEA|Colores pasteles|Usar colores pasteles en el diseño|idear

Audio: "¿Cuánto he gastado esta semana?"
→ [Respuesta conversacional sin ACCION]

${contextoMemoria}Transcribe y analiza el siguiente audio:`;

        // Llamar a Gemini con audio usando File URI
        console.log("🤖 Llamando a Gemini con audio...");
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: createUserContent([
            createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
            promptAudio,
          ]),
        });
        
        const respuestaGemini = response.text || "No pude procesar el audio.";
        console.log(`🤖 Gemini respondió:`, respuestaGemini);
        
        // Limpiar archivo temporal de Google Files
        try {
          if (uploadedFile.name) {
            await ai.files.delete({ name: uploadedFile.name });
            console.log(`🗑️ Archivo temporal eliminado: ${uploadedFile.name}`);
          }
        } catch (cleanupError) {
          console.warn(`⚠️ No se pudo eliminar archivo temporal:`, cleanupError);
        }
        
        // Analizar respuesta para detectar acción
        const accionMatch = respuestaGemini.match(/ACCION:(GASTO|INGRESO|IDEA)\|(.+)/i);
        
        if (accionMatch) {
          const tipoAccion = accionMatch[1].toUpperCase();
          const datosStr = accionMatch[2];
          
          if (tipoAccion === "GASTO" || tipoAccion === "INGRESO") {
            // Parsear: $monto|categoría|descripción
            const partes = datosStr.split("|");
            const monto = parseInt(partes[0].replace(/\$/g, "").trim());
            const categoria = partes[1]?.trim() || "Sin categoría";
            const descripcion = partes[2]?.trim() || "Vía audio";
            
            console.log(`💾 Guardando transacción: ${tipoAccion} de $${monto} en ${categoria}`);
            
            const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccion, {
              tipo: tipoAccion.toLowerCase() as "gasto" | "ingreso",
              categoria,
              monto,
              descripcion: `🎤 ${descripcion}`,
            });
            
            // Guardar mensaje en historial
            await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
              message_id: args.message_id,
              chat_id: args.chat_id,
              username: args.username,
              tipo_mensaje: "voz",
              contenido_transcrito: respuestaGemini,
              archivo_url: audioUrl,
              duracion_audio: args.file_size,
              respuesta_bot: `✅ ${tipoAccion === "GASTO" ? "💸 Gasto" : "💰 Ingreso"} registrado: $${monto} en ${categoria}`,
              accion_realizada: "transaccion",
              datos_extraidos: resultado,
              timestamp: Date.now(),
            });
            
            return {
              respuesta: `✅ ${tipoAccion === "GASTO" ? "💸 Gasto" : "💰 Ingreso"} *Registrado*\n\`\`\`${categoria}\`\`\`\n💰 **$${monto}**\n📝 ${descripcion}`,
              accion: "transaccion",
              datos: resultado
            };
          }
          
          if (tipoAccion === "IDEA") {
            // Parsear: título|descripción|fase
            const partes = datosStr.split("|");
            const titulo = partes[0]?.trim() || "Idea sin título";
            const descripcion = partes[1]?.trim() || respuestaGemini;
            const fase = partes[2]?.trim() || "idear";
            
            console.log(`💡 Guardando idea: ${titulo}`);
            
            // Usar crearProyectoCompleto para crear en tabla de proyectos + design_thinking
            const resultado = await ctx.runMutation(api.functions.ai.gemini.crearProyectoCompleto, {
              nombre: titulo,
              descripcion: `🎤 ${descripcion}`,
              categoria: "personal",
              fase: fase as any,
              prioridad: "media",
              tags: ["telegram", "audio"],
            });
            
            // Guardar mensaje en historial
            await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
              message_id: args.message_id,
              chat_id: args.chat_id,
              username: args.username,
              tipo_mensaje: "voz",
              contenido_transcrito: respuestaGemini,
              archivo_url: audioUrl,
              duracion_audio: args.file_size,
              respuesta_bot: `💡 Proyecto creado: ${titulo}`,
              accion_realizada: "proyecto_dt",
              datos_extraidos: resultado,
              timestamp: Date.now(),
            });
            
            return {
              respuesta: `💡 *Proyecto Creado*\n**${titulo}**\n📂 Categoría: personal\n🎯 Fase: ${fase}\n✅ ¡Registrado en Convex!`,
              accion: "proyecto_dt",
              datos: resultado
            };
          }
        }
        
        // Si no hay acción específica, es una consulta
        const respuestaLimpia = respuestaGemini.replace(/ACCION:.+/gi, "").trim();
        
        // Guardar mensaje en historial
        await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
          message_id: args.message_id,
          chat_id: args.chat_id,
          username: args.username,
          tipo_mensaje: "voz",
          contenido_transcrito: respuestaLimpia,
          archivo_url: audioUrl,
          duracion_audio: args.file_size,
          respuesta_bot: respuestaLimpia,
          accion_realizada: "consulta",
          datos_extraidos: null,
          timestamp: Date.now(),
        });
        
        return {
          respuesta: respuestaLimpia,
          accion: "consulta_audio",
          datos: null
        };
        
      } catch (audioError) {
        console.error("❌ Error procesando audio con Gemini:", audioError);
        return {
          respuesta: "❌ Lo siento, no pude procesar el audio. Intenta enviar un mensaje de texto.",
          accion: "error",
          datos: { error: String(audioError) }
        };
      }
    }
    
    // � PROCESAMIENTO DE DOCUMENTOS Y FOTOS
    if ((args.tipo_mensaje === "documento" || args.tipo_mensaje === "foto") && args.file_id) {
      console.log(`📄 Procesando ${args.tipo_mensaje}: ${args.file_name || 'imagen'} (${args.mime_type})`);
      
      let fileUrl = "";
      
      try {
        // Obtener archivo de Telegram
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          throw new Error("TELEGRAM_BOT_TOKEN no configurado");
        }
        
        console.log(`📲 Obteniendo archivo: ${args.file_id}`);
        
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/getFile?file_id=${args.file_id}`
        );
        const fileData = await fileResponse.json();
        
        if (!fileData.ok) {
          throw new Error(`Error obteniendo archivo: ${JSON.stringify(fileData)}`);
        }
        
        fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        console.log(`📥 Descargando archivo desde: ${fileUrl}`);
        
        // Descargar el archivo
        const docResponse = await fetch(fileUrl);
        const arrayBuffer = await docResponse.arrayBuffer();
        const fileData2 = new Uint8Array(arrayBuffer);
        
        console.log(`📊 Archivo descargado: ${fileData2.length} bytes`);
        
        // Crear Blob del archivo
        const fileBlob = new Blob([fileData2], { type: args.mime_type || 'application/octet-stream' });
        
        // Subir a Google Files API
        console.log("📤 Subiendo archivo a Google Files API...");
        
        const uploadedFile = await ai.files.upload({
          file: fileBlob,
          config: { 
            mimeType: args.mime_type || 'application/pdf',
            displayName: args.file_name || `telegram_file_${args.message_id}`
          },
        });
        
        console.log(`✅ Archivo subido: ${uploadedFile.uri}`);
        
        if (!uploadedFile.uri || !uploadedFile.mimeType) {
          throw new Error("Error al subir archivo a Google");
        }
        
        // Obtener datos de la empresa configurada
        const empresaConfig = await ctx.runQuery(api.functions.ai.gemini.obtenerConfiguracionEmpresa);
        const datosEmpresa = empresaConfig.rut ? 
          `\n\n🏢 **DATOS DE TU EMPRESA:**\n- RUT: ${empresaConfig.rut}\n- Razón Social: ${empresaConfig.razon_social || "No configurada"}` :
          "";
        
        // Prompt para análisis de documentos (F29 Chile)
        const promptDocumento = `Eres FinBot Pro, asistente contable especializado en declaración de IVA (F29) de Chile.
${datosEmpresa}

🎯 ANÁLISIS DE DOCUMENTOS TRIBUTARIOS:
Has recibido un ${args.tipo_mensaje === "foto" ? "imagen/foto" : "documento PDF"} llamado "${args.file_name}".

📊 INSTRUCCIONES PARA FACTURAS/DOCUMENTOS TRIBUTARIOS:

1️⃣ **DETECTAR TIPO DE TRANSACCIÓN:**
   - Si EMISOR (quien emite la factura) es RUT "${empresaConfig.rut || "mi RUT"}" o "${empresaConfig.razon_social || "mi empresa"}" → Es **INGRESO** (débito fiscal)
   - Si RECEPTOR (quien recibe la factura) es RUT "${empresaConfig.rut || "mi RUT"}" o "${empresaConfig.razon_social || "mi empresa"}" → Es **GASTO** (crédito fiscal)

2️⃣ **EXTRAER DATOS TRIBUTARIOS (F29 Chile):**
   Busca y extrae:
   ✓ Tipo documento: factura, boleta, nota_credito, nota_debito, factura_exenta
   ✓ Número documento/folio
   ✓ RUT emisor (11.111.111-1)
   ✓ Razón social emisor
   ✓ RUT receptor
   ✓ Razón social receptor
   ✓ Monto neto (sin IVA)
   ✓ IVA (19% en Chile)
   ✓ Monto total (neto + IVA)
   ✓ Fecha emisión
   ✓ Afecto a IVA (sí/no - si es factura exenta = NO)

3️⃣ **FORMATO DE RESPUESTA:**
   Responde en este formato exacto:
   
   ACCION:FACTURA_IVA|TIPO|DATOS_JSON
   
   Donde:
   - TIPO: "INGRESO" o "GASTO"
   - DATOS_JSON: objeto JSON con todos los campos
   
   **EJEMPLO 1 - Factura recibida (compra):**
   ACCION:FACTURA_IVA|GASTO|{"monto_neto":100000,"monto_iva":19000,"monto_total":119000,"tipo_documento":"factura","numero_documento":"12345","folio":"12345","rut_emisor":"76123456-7","razon_social_emisor":"Proveedor SPA","rut_receptor":"${empresaConfig.rut}","razon_social_receptor":"${empresaConfig.razon_social}","afecto_iva":true,"categoria":"servicios","descripcion":"Hosting web mensual"}
   
   **EJEMPLO 2 - Factura emitida (venta):**
   ACCION:FACTURA_IVA|INGRESO|{"monto_neto":200000,"monto_iva":38000,"monto_total":238000,"tipo_documento":"factura","numero_documento":"5678","folio":"5678","rut_emisor":"${empresaConfig.rut}","razon_social_emisor":"${empresaConfig.razon_social}","rut_receptor":"77987654-3","razon_social_receptor":"Cliente ABC","afecto_iva":true,"categoria":"servicios_profesionales","descripcion":"Diseño web"}
   
   **EJEMPLO 3 - Boleta (siempre GASTO):**
   ACCION:FACTURA_IVA|GASTO|{"monto_total":15000,"tipo_documento":"boleta","numero_documento":"9999","afecto_iva":false,"categoria":"alimentacion","descripcion":"Almuerzo"}

4️⃣ **SI NO ES FACTURA:**
   - Wireframe/Diseño → ACCION:IDEA|título|descripción|fase
   - Otro → Responde conversacionalmente

💡 **IMPORTANTE CHILE:**
- IVA estándar: 19%
- Facturas = afecto IVA (salvo exentas)
- Boletas = NO generan crédito fiscal
- Notas de crédito = restan del período

${contextoMemoria}Usuario envió: ${args.mensaje || "archivo sin descripción"}

Analiza el documento:`;

        // Llamar a Gemini con el archivo
        console.log("🤖 Llamando a Gemini con documento...");
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: createUserContent([
            createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
            promptDocumento,
          ]),
        });
        
        const respuestaGemini = response.text || "No pude procesar el documento.";
        console.log(`🤖 Gemini respondió:`, respuestaGemini);
        
        // Limpiar archivo
        try {
          if (uploadedFile.name) {
            await ai.files.delete({ name: uploadedFile.name });
            console.log(`🗑️ Archivo temporal eliminado`);
          }
        } catch (cleanupError) {
          console.warn(`⚠️ No se pudo eliminar archivo temporal:`, cleanupError);
        }
        
        // ==========================================
        // PROCESAR RESPUESTA DE FACTURA CON IVA (F29)
        // ==========================================
        const facturaIvaMatch = respuestaGemini.match(/ACCION:FACTURA_IVA\|(INGRESO|GASTO)\|(\{.+\})/i);
        
        if (facturaIvaMatch) {
          const tipoTransaccion = facturaIvaMatch[1].toLowerCase() as "ingreso" | "gasto";
          const datosJsonStr = facturaIvaMatch[2];
          
          try {
            const datosFactura = JSON.parse(datosJsonStr);
            
            console.log(`🧾 Procesando factura con IVA:`, datosFactura);
            
            // Registrar transacción con sistema de IVA
            const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccionConIVA, {
              tipo: tipoTransaccion,
              categoria: datosFactura.categoria || "sin_categoria",
              descripcion: datosFactura.descripcion || args.file_name || "Documento tributario",
              
              // Montos
              monto_total: datosFactura.monto_total,
              monto_neto: datosFactura.monto_neto,
              
              // Datos tributarios
              afecto_iva: datosFactura.afecto_iva !== false, // Default true
              iva_porcentaje: datosFactura.iva_porcentaje || 19,
              tipo_documento: datosFactura.tipo_documento,
              numero_documento: datosFactura.numero_documento,
              folio: datosFactura.folio,
              
              // Partes involucradas
              rut_emisor: datosFactura.rut_emisor,
              razon_social_emisor: datosFactura.razon_social_emisor,
              rut_receptor: datosFactura.rut_receptor,
              razon_social_receptor: datosFactura.razon_social_receptor,
              
              // Otros
              comprobante_url: fileUrl,
            });
            
            // Guardar en historial
            await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
              message_id: args.message_id,
              chat_id: args.chat_id,
              username: args.username,
              tipo_mensaje: args.tipo_mensaje,
              contenido_texto: respuestaGemini,
              archivo_url: fileUrl,
              respuesta_bot: `✅ Factura registrada con IVA`,
              accion_realizada: "factura_iva",
              datos_extraidos: resultado,
              timestamp: Date.now(),
            });
            
            // Construir respuesta detallada
            const iconoTipo = tipoTransaccion === "ingreso" ? "💰" : "💸";
            const etiquetaTipo = tipoTransaccion === "ingreso" ? "INGRESO (Débito Fiscal)" : "GASTO (Crédito Fiscal)";
            const detalles = resultado.detalles || {};
            
            let respuestaDetallada = `${iconoTipo} *${etiquetaTipo}*\n\n`;
            respuestaDetallada += `🧾 ${datosFactura.tipo_documento?.toUpperCase() || "DOCUMENTO"} N° ${datosFactura.numero_documento || "S/N"}\n`;
            respuestaDetallada += `📊 **Montos:**\n`;
            respuestaDetallada += `   Neto: $${detalles.monto_neto?.toLocaleString() || 0}\n`;
            respuestaDetallada += `   IVA (${datosFactura.iva_porcentaje || 19}%): $${detalles.monto_iva?.toLocaleString() || 0}\n`;
            respuestaDetallada += `   Total: $${detalles.monto_total?.toLocaleString() || 0}\n\n`;
            
            if (datosFactura.rut_emisor) {
              respuestaDetallada += `📤 Emisor: ${datosFactura.razon_social_emisor || "N/A"}\n`;
              respuestaDetallada += `   RUT: ${datosFactura.rut_emisor}\n\n`;
            }
            
            if (datosFactura.rut_receptor) {
              respuestaDetallada += `📥 Receptor: ${datosFactura.razon_social_receptor || "N/A"}\n`;
              respuestaDetallada += `   RUT: ${datosFactura.rut_receptor}\n\n`;
            }
            
            respuestaDetallada += `📅 Período: ${detalles.periodo || "N/A"}\n`;
            respuestaDetallada += `🔗 Comprobante guardado`;
            
            return {
              respuesta: respuestaDetallada,
              accion: "factura_iva",
              datos: resultado
            };
            
          } catch (parseError) {
            console.error("❌ Error parseando JSON de factura:", parseError);
            console.log("JSON recibido:", datosJsonStr);
            // Continuar con el procesamiento legacy
          }
        }
        
        // ==========================================
        // PROCESAMIENTO LEGACY (compatibilidad)
        // ==========================================
        const accionMatch = respuestaGemini.match(/ACCION:(GASTO|INGRESO|IDEA)\|(.+)/i);
        
        if (accionMatch) {
          const tipoAccion = accionMatch[1].toUpperCase();
          const datosStr = accionMatch[2];
          
          if (tipoAccion === "GASTO" || tipoAccion === "INGRESO") {
            const partes = datosStr.split("|");
            const monto = parseInt(partes[0].replace(/\$/g, "").trim());
            const categoria = partes[1]?.trim() || "Sin categoría";
            const descripcion = partes[2]?.trim() || args.file_name || "Documento";
            
            console.log(`💾 Guardando transacción: ${tipoAccion} de $${monto} en ${categoria}`);
            
            const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccion, {
              tipo: tipoAccion.toLowerCase() as "gasto" | "ingreso",
              categoria,
              monto,
              descripcion: `📄 ${descripcion}`,
              comprobante_url: fileUrl,
            });
            
            // Guardar en historial
            await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
              message_id: args.message_id,
              chat_id: args.chat_id,
              username: args.username,
              tipo_mensaje: args.tipo_mensaje,
              contenido_texto: respuestaGemini,
              archivo_url: fileUrl,
              respuesta_bot: `✅ ${tipoAccion === "GASTO" ? "💸 Gasto" : "💰 Ingreso"} registrado: $${monto} en ${categoria}`,
              accion_realizada: "transaccion",
              datos_extraidos: resultado,
              timestamp: Date.now(),
            });
            
            return {
              respuesta: `✅ ${tipoAccion === "GASTO" ? "💸 Gasto" : "💰 Ingreso"} *Registrado*\n\`\`\`${categoria}\`\`\`\n💰 **$${monto}**\n📄 ${descripcion}\n\n🔗 Comprobante guardado`,
              accion: "transaccion",
              datos: resultado
            };
          }
          
          if (tipoAccion === "IDEA") {
            const partes = datosStr.split("|");
            const titulo = partes[0]?.trim() || "Idea sin título";
            const descripcion = partes[1]?.trim() || respuestaGemini;
            const fase = partes[2]?.trim() || "idear";
            
            // Usar crearProyectoCompleto para crear en tabla de proyectos + design_thinking
            const resultado = await ctx.runMutation(api.functions.ai.gemini.crearProyectoCompleto, {
              nombre: titulo,
              descripcion: `📄 ${descripcion}`,
              categoria: "personal",
              fase: fase as any,
              prioridad: "media",
              tags: ["telegram", "documento"],
            });
            
            await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
              message_id: args.message_id,
              chat_id: args.chat_id,
              username: args.username,
              tipo_mensaje: args.tipo_mensaje,
              contenido_texto: respuestaGemini,
              archivo_url: fileUrl,
              respuesta_bot: `💡 Proyecto creado: ${titulo}`,
              accion_realizada: "proyecto_dt",
              datos_extraidos: resultado,
              timestamp: Date.now(),
            });
            
            return {
              respuesta: `💡 *Proyecto Creado*\n**${titulo}**\n📂 Categoría: personal\n🎯 Fase: ${fase}\n📎 Archivo adjunto guardado\n✅ ¡Registrado en Convex!`,
              accion: "proyecto_dt",
              datos: resultado
            };
          }
        }
        
        // Respuesta informativa sin acción
        await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
          message_id: args.message_id,
          chat_id: args.chat_id,
          username: args.username,
          tipo_mensaje: args.tipo_mensaje,
          contenido_texto: respuestaGemini,
          archivo_url: fileUrl,
          respuesta_bot: respuestaGemini,
          accion_realizada: "consulta",
          datos_extraidos: null,
          timestamp: Date.now(),
        });
        
        return {
          respuesta: `📄 *Documento Analizado*\n\n${respuestaGemini}`,
          accion: "analisis_documento",
          datos: { file_name: args.file_name, mime_type: args.mime_type }
        };
        
      } catch (docError) {
        console.error("❌ Error procesando documento:", docError);
        return {
          respuesta: `❌ Lo siento, no pude procesar el ${args.tipo_mensaje}.\n\n💡 Intenta:\n- Enviar un PDF más pequeño\n- Asegúrate que sea legible\n- O descríbelo por texto/voz`,
          accion: "error",
          datos: { error: String(docError) }
        };
      }
    }
    
    // 📝 PROCESAMIENTO DE MENSAJES DE TEXTO
    // Analizar intención del mensaje con Gemini
    const prompt = `Eres FinBot Pro, tu asistente personal especializado en FINANZAS y DESIGN THINKING.

🎯 TU ROL DUAL (solo para Jorge):

1️⃣ **GESTOR FINANCIERO**:
   - Registra gastos, ingresos, transacciones
   - Gestiona IVA y Formulario 29 (Chile)
   - Extrae datos de forma estricta
   - Responde solo confirmando datos

2️⃣ **CONSULTOR DE DISEÑO**:
   - Captura insights y ideas de proyectos
   - Organiza fases de Design Thinking
   - Ayuda con planificación de proyectos

📊 CLASIFICACIÓN AUTOMÁTICA:

**Si menciona: gastos, ingresos, transacciones, IVA, F29, contabilidad, factura**
→ Modo: Gestor Financiero (extracción estricta)

**Si menciona: idea, diseño, insight, proyecto, fase, empatizar, prototipar**
→ Modo: Consultor de Diseño (conversacional)

**Para otras consultas:**
→ Responde de forma conversacional pero concisa

📱 COMANDOS FINANCIEROS DISPONIBLES:
/gasto $50 categoría - Registrar gasto rápido
/ingreso $100 categoría - Registrar ingreso  
/resumen - Resumen financiero breve
/listar - Lista transacciones recientes
/iva 2026-02 - Ver IVA del mes (Formulario 29)
/iva - IVA del mes actual
/empresa - Ver/configurar datos empresa
/proyectos - Lista proyectos Design Thinking
/ayuda - Mostrar todos los comandos

💡 EJEMPLOS:

Usuario: "Gasté $25 en comida"
Tú: "✅ Gasto registrado: $25 en comida"

Usuario: "Ingreso de $500 por freelance"
Tú: "✅ Ingreso registrado: $500 - freelance"

Usuario: "¿Cuánto IVA debo pagar este mes?"
Tú: "Para ver tu declaración F29 del mes actual, usa: /iva"

Usuario: "Idea: usar colores pasteles en el diseño"
Tú: "[Respuesta conversacional capturando la idea]"

Responde SIEMPRE en español, sé CONCISO (máximo 3 líneas).

${contextoMemoria}Usuario escribió: ${args.mensaje}`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const respuesta = result.text || "Lo siento, no pude procesar tu mensaje.";
    
    // Procesar comandos específicos optimizados para mobile
    const lowerMensaje = args.mensaje.toLowerCase().trim();
    
    console.log(`🔍 Procesando comando: "${args.mensaje}"`);
    console.log(`🔍 Mensaje en minúsculas: "${lowerMensaje}"`);
    
    // 📱 COMANDOS RÁPIDOS CON /
    if (lowerMensaje.startsWith("/gasto")) {
      console.log("💸 Detectado comando /gasto");
      // Regex flexible: acepta con o sin $, con o sin espacios extras
      const match = args.mensaje.match(/\/gasto\s+\$?(\d+)\s+(.+)/) || 
                    args.mensaje.match(/\/gasto\s+(\d+)\s+(.+)/);
      
      console.log(`🔍 Regex match:`, match ? `✅ [${match[1]}, ${match[2]}]` : "❌ No match");
      
      if (match) {
        console.log(`💾 Registrando gasto: $${match[1]} en ${match[2].trim()}`);
        const resultado: any = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccion, {
          tipo: "gasto",
          categoria: match[2].trim(),
          monto: parseInt(match[1]),
          descripcion: `Gasto vía Telegram móvil`,
        });
        
        console.log(`✅ Gasto registrado:`, resultado);
        
        return {
          respuesta: `💸 *Gasto Registrado*\n\`\`\`${match[2].trim()}\`\`\`\n💰 **$${match[1]}**\n✅ ¡Listo!`,
          accion: "transaccion_registrada",
          datos: resultado
        };
      } else {
        console.log("❌ Formato incorrecto de comando /gasto");
        return {
          respuesta: `❌ *Formato incorrecto*\n\n📝 Usa:\n\`/gasto 50 comida\` o\n\`/gasto $50 comida\``,
          accion: "error_formato",
          datos: null
        };
      }
    }
    
    if (lowerMensaje.startsWith("/ingreso")) {
      console.log("💰 Detectado comando /ingreso");
      const match = args.mensaje.match(/\/ingreso\s+\$?(\d+)\s+(.+)/) || 
                    args.mensaje.match(/\/ingreso\s+(\d+)\s+(.+)/);
      
      console.log(`🔍 Regex match:`, match ? `✅ [${match[1]}, ${match[2]}]` : "❌ No match");
      
      if (match) {
        console.log(`💾 Registrando ingreso: $${match[1]} en ${match[2].trim()}`);
        const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccion, {
          tipo: "ingreso",
          categoria: match[2].trim(),
          monto: parseInt(match[1]),
          descripcion: `Ingreso vía Telegram móvil`,
        });
        
        console.log(`✅ Ingreso registrado:`, resultado);
        
        return {
          respuesta: `💰 *Ingreso Registrado*\n\`\`\`${match[2].trim()}\`\`\`\n💵 **$${match[1]}**\n✅ ¡Listo!`,
          accion: "transaccion_registrada",
          datos: resultado
        };
      } else {
        console.log("❌ Formato incorrecto de comando /ingreso");
        return {
          respuesta: `❌ *Formato incorrecto*\n\n📝 Usa:\n\`/ingreso 100 freelance\` o\n\`/ingreso $100 freelance\``,
          accion: "error_formato",
          datos: null
        };
      }
    }
    
    if (lowerMensaje === "/resumen") {
      const resumen = await ctx.runQuery(api.functions.ai.gemini.obtenerResumenFinanciero);
      
      return {
        respuesta: `📊 *Resumen Financiero*\n\n💵 *Ingresos:* $${resumen.total_ingresos}\n💸 *Gastos:* $${resumen.total_gastos}\n💰 *Balance:* $${resumen.balance}\n📝 *Transacciones:* ${resumen.total_transacciones}`,
        accion: "resumen_financiero",
        datos: resumen
      };
    }
    
    if (lowerMensaje === "/listar" || lowerMensaje.startsWith("/listar ")) {
      // Detectar tipo de transacción (si se especifica)
      let tipoFiltro = null;
      if (lowerMensaje.includes("ingreso")) tipoFiltro = "ingreso";
      if (lowerMensaje.includes("gasto")) tipoFiltro = "gasto";
      
      const transacciones = await ctx.runQuery(api.functions.ai.gemini.obtenerTransacciones, {
        limite: 10,
        tipo: tipoFiltro as any,
      });
      
      if (transacciones.length === 0) {
        return {
          respuesta: `📋 *Transacciones*\n\n🔍 No hay transacciones registradas`,
          accion: "lista_transacciones_vacia",
          datos: []
        };
      }
      
      const lista = transacciones.map((t: any, idx: number) => {
        const emoji = t.tipo === "ingreso" ? "💰" : "💸";
        const fecha = new Date(t.fecha).toLocaleDateString('es-ES');
        return `${idx + 1}. ${emoji} $${t.monto} - ${t.categoria}\n   📅 ${fecha}\n   🆔 ${t._id.substring(0, 8)}...`;
      }).join('\n\n');
      
      return {
        respuesta: `📋 *Últimas ${transacciones.length} Transacciones*\n\n${lista}\n\n💡 *Para editar:* \`/editar ID tipo monto\`\n🗑️ *Para eliminar:* \`/eliminar ID\``,
        accion: "lista_transacciones",
        datos: transacciones
      };
    }
    
    if (lowerMensaje.startsWith("/editar ")) {
      // Formato: /editar ID tipo [monto]
      // Ejemplo: /editar abc123 ingreso
      // Ejemplo: /editar abc123 ingreso 150
      const partes = args.mensaje.split(" ").filter(p => p.trim());
      
      if (partes.length < 3) {
        return {
          respuesta: `❌ *Formato incorrecto*\n\n📝 Usa:\n\`/editar ID tipo\` o\n\`/editar ID tipo monto\`\n\nEjemplos:\n\`/editar abc123 ingreso\`\n\`/editar abc123 ingreso 150\`\n\n💡 *Obtén el ID con* \`/listar\``,
          accion: "error_formato",
          datos: null
        };
      }
      
      const idParcial = partes[1];
      const nuevoTipo = partes[2].toLowerCase();
      const nuevoMonto = partes[3] ? parseInt(partes[3]) : undefined;
      
      if (nuevoTipo !== "ingreso" && nuevoTipo !== "gasto") {
        return {
          respuesta: `❌ Tipo inválido. Usa \`ingreso\` o \`gasto\``,
          accion: "error_formato",
          datos: null
        };
      }
      
      // Buscar transacción por ID parcial
      const todasTransacciones = await ctx.runQuery(api.functions.ai.gemini.obtenerTransacciones, { limite: 100 });
      const transaccion = todasTransacciones.find((t: any) => t._id.startsWith(idParcial));
      
      if (!transaccion) {
        return {
          respuesta: `❌ No se encontró transacción con ID: ${idParcial}\n\n💡 Usa \`/listar\` para ver los IDs`,
          accion: "transaccion_no_encontrada",
          datos: null
        };
      }
      
      try {
        const cambios: any = { tipo: nuevoTipo };
        if (nuevoMonto) cambios.monto = nuevoMonto;
        
        const resultado = await ctx.runMutation(api.functions.ai.gemini.editarTransaccion, {
          id: transaccion._id,
          ...cambios,
        });
        
        return {
          respuesta: `✅ *Transacción Actualizada*\n\n${nuevoTipo === "ingreso" ? "💰 Ingreso" : "💸 Gasto"} de $${nuevoMonto || transaccion.monto}\n📂 ${transaccion.categoria}\n\n✨ Cambios guardados`,
          accion: "transaccion_editada",
          datos: resultado
        };
      } catch (error: any) {
        return {
          respuesta: `❌ Error al editar: ${error.message}`,
          accion: "error_editar",
          datos: null
        };
      }
    }
    
    if (lowerMensaje.startsWith("/eliminar ")) {
      const partes = args.mensaje.split(" ");
      
      if (partes.length < 2) {
        return {
          respuesta: `❌ *Formato incorrecto*\n\n📝 Usa: \`/eliminar ID\`\n\nEjemplo: \`/eliminar abc123\`\n\n💡 *Obtén el ID con* \`/listar\``,
          accion: "error_formato",
          datos: null
        };
      }
      
      const idParcial = partes[1];
      
      // Buscar transacción por ID parcial
      const todasTransacciones = await ctx.runQuery(api.functions.ai.gemini.obtenerTransacciones, { limite: 100 });
      const transaccion = todasTransacciones.find((t: any) => t._id.startsWith(idParcial));
      
      if (!transaccion) {
        return {
          respuesta: `❌ No se encontró transacción con ID: ${idParcial}\n\n💡 Usa \`/listar\` para ver los IDs`,
          accion: "transaccion_no_encontrada",
          datos: null
        };
      }
      
      try {
        const resultado = await ctx.runMutation(api.functions.ai.gemini.eliminarTransaccion, {
          id: transaccion._id,
        });
        
        return {
          respuesta: `🗑️ *Transacción Eliminada*\n\n${transaccion.tipo === "ingreso" ? "💰" : "💸"} $${transaccion.monto} - ${transaccion.categoria}\n\n✅ Eliminada correctamente`,
          accion: "transaccion_eliminada",
          datos: resultado
        };
      } catch (error: any) {
        return {
          respuesta: `❌ Error al eliminar: ${error.message}`,
          accion: "error_eliminar",
          datos: null
        };
      }
    }
    
    // 🧾 COMANDO /IVA - Resumen F29 mensual
    if (lowerMensaje.startsWith("/iva")) {
      console.log("🧾 Detectado comando /iva");
      
      // Parsear período: /iva 2026-02 o /iva febrero o /iva este mes
      let periodo = "";
      
      if (lowerMensaje === "/iva" || lowerMensaje.includes("este mes") || lowerMensaje.includes("actual")) {
        // Usar mes actual
        const ahora = new Date();
        periodo = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
      } else {
        // Intentar extraer YYYY-MM
        const matchPeriodo = args.mensaje.match(/(\d{4})-(\d{1,2})/);
        if (matchPeriodo) {
          const anio = matchPeriodo[1];
          const mes = matchPeriodo[2].padStart(2, '0');
          periodo = `${anio}-${mes}`;
        } else {
          // Intentar nombres de meses en español
          const meses: Record<string, string> = {
            'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
            'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
            'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
          };
          
          const ahora = new Date();
          const anioActual = ahora.getFullYear();
          
          for (const [nombre, numero] of Object.entries(meses)) {
            if (lowerMensaje.includes(nombre)) {
              periodo = `${anioActual}-${numero}`;
              break;
            }
          }
        }
      }
      
      if (!periodo) {
        return {
          respuesta: `📊 *Consulta IVA (F29)*\n\n⚠️ No pude entender el período.\n\n💡 *Ejemplos:*\n\`/iva\` - Mes actual\n\`/iva 2026-02\` - Febrero 2026\n\`/iva enero\` - Enero del año actual\n\`/iva este mes\``,
          accion: "error_formato_periodo",
          datos: null
        };
      }
      
      try {
        const resumenIVA = await ctx.runQuery(api.functions.ai.gemini.obtenerResumenIVA, { periodo });
        
        if (resumenIVA.total_transacciones === 0) {
          return {
            respuesta: `📊 *IVA ${periodo}*\n\n🔍 No hay transacciones registradas para este período.\n\n💡 Sube facturas o usa \`/gasto\` / \`/ingreso\` para registrar movimientos.`,
            accion: "iva_sin_datos",
            datos: resumenIVA
          };
        }
        
        // Construir respuesta detallada del F29
        let respuestaIVA = `📊 *Resumen IVA - ${periodo}*\n`;
        respuestaIVA += `📝 Formulario 29 (Chile)\n\n`;
        
        respuestaIVA += `💰 *VENTAS (Débito Fiscal)*\n`;
        respuestaIVA += `   Facturas emitidas: ${resumenIVA.ventas.numero_facturas_emitidas}\n`;
        respuestaIVA += `   Ventas netas: $${resumenIVA.ventas.ventas_afectas_netas.toLocaleString()}\n`;
        respuestaIVA += `   IVA débito: $${resumenIVA.ventas.iva_debito_fiscal.toLocaleString()}\n`;
        if (resumenIVA.ventas.ventas_exentas > 0) {
          respuestaIVA += `   Ventas exentas: $${resumenIVA.ventas.ventas_exentas.toLocaleString()}\n`;
        }
        respuestaIVA += `\n`;
        
        respuestaIVA += `💸 *COMPRAS (Crédito Fiscal)*\n`;
        respuestaIVA += `   Facturas recibidas: ${resumenIVA.compras.numero_facturas_recibidas}\n`;
        respuestaIVA += `   Compras netas: $${resumenIVA.compras.compras_afectas_netas.toLocaleString()}\n`;
        respuestaIVA += `   IVA crédito: $${resumenIVA.compras.iva_credito_fiscal.toLocaleString()}\n`;
        if (resumenIVA.compras.compras_exentas > 0) {
          respuestaIVA += `   Compras exentas: $${resumenIVA.compras.compras_exentas.toLocaleString()}\n`;
        }
        respuestaIVA += `\n`;
        
        respuestaIVA += `🧾 *DECLARACIÓN F29*\n`;
        respuestaIVA += `━━━━━━━━━━━━━━━━━━━━\n`;
        respuestaIVA += `Débito fiscal:  $${resumenIVA.f29.debito_fiscal.toLocaleString()}\n`;
        respuestaIVA += `Crédito fiscal: -$${resumenIVA.f29.credito_fiscal.toLocaleString()}\n`;
        respuestaIVA += `━━━━━━━━━━━━━━━━━━━━\n`;
        
        if (resumenIVA.f29.iva_a_pagar > 0) {
          respuestaIVA += `✅ **IVA a Pagar: $${resumenIVA.f29.iva_a_pagar.toLocaleString()}**\n`;
        } else {
          respuestaIVA += `💚 **Saldo a Favor: $${resumenIVA.f29.saldo_a_favor.toLocaleString()}**\n`;
        }
        
        respuestaIVA += `\n📅 Total transacciones: ${resumenIVA.total_transacciones}`;
        
        return {
          respuesta: respuestaIVA,
          accion: "resumen_iva",
          datos: resumenIVA
        };
        
      } catch (error: any) {
        console.error("❌ Error obteniendo resumen IVA:", error);
        return {
          respuesta: `❌ Error al calcular IVA: ${error.message}`,
          accion: "error_iva",
          datos: null
        };
      }
    }
    
    if (lowerMensaje === "/proyectos") {
      const proyectos = await ctx.runQuery(api.functions.ai.gemini.obtenerProyectosDT, {});
      
      if (proyectos.length === 0) {
        return {
          respuesta: `📋 *Proyectos*\n\n🔍 No hay proyectos activos\n\n💡 Usa \`/crear proyecto\` para empezar`,
          accion: "lista_proyectos_vacia",
          datos: []
        };
      }
      
      const listaProyectos = proyectos.slice(0, 5).map((p: any) => 
        `🔹 ${p.titulo}\n   📂 ${p.fase} ⭐ ${p.prioridad}`
      ).join('\n\n');
      
      return {
        respuesta: `📋 *Proyectos Activos*\n\n${listaProyectos}\n\n📱 Mostrando ${Math.min(5, proyectos.length)} de ${proyectos.length}`,
        accion: "lista_proyectos",
        datos: proyectos
      };
    }
    
    if (lowerMensaje === "/ayuda") {
      return {
        respuesta: `🤖 *FinBot Pro - Tu Asistente Personal*\n\n📱 *Comandos Rápidos:*\n\n💸 \`/gasto $50 comida\`\n💰 \`/ingreso $100 freelance\`\n📊 \`/resumen\`\n📋 \`/listar\`\n✏️ \`/editar ID tipo\`\n🗑️ \`/eliminar ID\`\n🧾 \`/iva 2026-02\` - IVA mensual (F29)\n🏢 \`/empresa\` - Ver/Configurar empresa\n📋 \`/proyectos\` - Design Thinking\n❓ \`/ayuda\`\n\n💡 *Ejemplos:*\n\`/gasto $25 uber\`\n\`/ingreso $500 cliente\`\n\`/iva\` - IVA mes actual\n\`/iva febrero\` - IVA de febrero\n\n📄 *Facturas:*\nEnvía foto/PDF de factura para registro automático con IVA\n\n🚀 *Rápido y fácil!*`,
        accion: "ayuda",
        datos: null
      };
    }
    
    if (lowerMensaje === "/empresa" || lowerMensaje.startsWith("/empresa ")) {
      // Si solo es /empresa, mostrar configuración actual
      if (lowerMensaje === "/empresa") {
        const empresaConfig = await ctx.runQuery(api.functions.ai.gemini.obtenerConfiguracionEmpresa);
        
        if (!empresaConfig.rut) {
          return {
            respuesta: `🏢 *Configuración de Empresa*\n\n⚠️ No has configurado tu empresa aún.\n\n📝 *Para configurar:*\n\`/empresa RUT | RAZÓN SOCIAL\`\n\nEjemplo:\n\`/empresa 78318808-2 | ÁPERCA SPA\`\n\n💡 Esto permite que el bot detecte automáticamente si una factura es ingreso (emites tú) o gasto (pagas tú).`,
            accion: "info_empresa",
            datos: null
          };
        }
        
        return {
          respuesta: `🏢 *Configuración de Empresa*\n\n📋 *Datos Actuales:*\n\n✅ **RUT:** ${empresaConfig.rut}\n✅ **Razón Social:** ${empresaConfig.razon_social || "No configurada"}\n\n💡 *Para actualizar:*\n\`/empresa RUT | RAZÓN SOCIAL\``,
          accion: "ver_empresa",
          datos: empresaConfig
        };
      }
      
      // Parsear datos de empresa: RUT | RAZÓN SOCIAL
      const partes = args.mensaje.substring(8).trim().split("|").map(p => p.trim());
      
      if (partes.length < 2) {
        return {
          respuesta: `❌ *Formato incorrecto*\n\n📝 Usa:\n\`/empresa RUT | RAZÓN SOCIAL\`\n\nEjemplo:\n\`/empresa 78318808-2 | ÁPERCA SPA\``,
          accion: "error_formato",
          datos: null
        };
      }
      
      const rut = partes[0];
      const razonSocial = partes[1];
      
      try {
        const resultado = await ctx.runMutation(api.functions.ai.gemini.configurarEmpresa, {
          rut: rut,
          razon_social: razonSocial,
        });
        
        return {
          respuesta: `✅ *Empresa Configurada*\n\n📋 **RUT:** ${rut}\n🏢 **Razón Social:** ${razonSocial}\n\n✨ Ahora cuando subas facturas, el bot detectará automáticamente:\n• Si TÚ emites → INGRESO 💰\n• Si TÚ pagas → GASTO 💸`,
          accion: "empresa_configurada",
          datos: resultado
        };
      } catch (error: any) {
        return {
          respuesta: `❌ Error al configurar empresa: ${error.message}`,
          accion: "error_configurar",
          datos: null
        };
      }
    }
    
    // Comandos tradicionales (compatibilidad)
    if (lowerMensaje.includes("registrar") && (lowerMensaje.includes("gasto") || lowerMensaje.includes("ingreso"))) {
      const montoMatch = args.mensaje.match(/\$(\d+)/);
      const categoriaMatch = args.mensaje.match(/en\s+([^:]+)/);
      
      if (montoMatch && categoriaMatch) {
        const resultado = await ctx.runMutation(api.functions.ai.gemini.registrarTransaccion, {
          tipo: lowerMensaje.includes("gasto") ? "gasto" : "ingreso",
          categoria: categoriaMatch[1].trim(),
          monto: parseInt(montoMatch[1]),
          descripcion: args.mensaje.split(":")[1]?.trim() || "Registro vía Telegram",
        });
        
        return {
          respuesta: `✅ ${resultado.mensaje}\n\n💡 *Tip:* Usa \`${lowerMensaje.includes("gasto") ? "/gasto" : "/ingreso"} $${montoMatch[1]} ${categoriaMatch[1].trim()}\` para más rápido`,
          accion: "transaccion_registrada",
          datos: resultado
        };
      }
    }
    
    if (lowerMensaje.includes("resumen financiero")) {
      const resumen = await ctx.runQuery(api.functions.ai.gemini.obtenerResumenFinanciero);
      
      return {
        respuesta: `📊 *Resumen Financiero*\n\n💵 *Ingresos:* $${resumen.total_ingresos}\n💸 *Gastos:* $${resumen.total_gastos}\n💰 *Balance:* $${resumen.balance}\n\n💡 *Tip:* Usa \`/resumen\` para más rápido`,
        accion: "resumen_financiero",
        datos: resumen
      };
    }
    
    return {
      respuesta,
      accion: "respuesta_general",
      datos: null
    };
  },
});

// Mutación para registrar mensajes de Telegram (logs)
export const registrarMensajeTelegram = mutation({
  args: {
    message_id: v.string(),
    chat_id: v.string(),
    username: v.string(),
    mensaje_usuario: v.string(),
    respuesta_bot: v.string(),
    accion: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    // Guardar en tabla de logs (podrías crear una tabla específica para logs de Telegram)
    // Por ahora, solo logueamos a consola
    console.log(`📝 Telegram message logged: ${args.username} - ${args.accion}`);
    
    return { 
      success: true, 
      logged: true,
      timestamp: Date.now()
    };
  },
});

// Mutation para inicializar empresa (seed con datos reales)
export const inicializarEmpresa = mutation({
  handler: async (ctx) => {
    // Verificar si ya existe configuración
    const existente = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("clave"), "empresa_rut"))
      .first();
    
    if (existente) {
      return {
        success: false,
        mensaje: "Empresa ya configurada. Usa /empresa para actualizar."
      };
    }
    
    // Insertar datos de ÁPERCA SPA
    await ctx.db.insert("configuracion", {
      clave: "empresa_rut",
      valor: "78318808-2",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "RUT de ÁPERCA SPA",
      creado_por: "sistema",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    await ctx.db.insert("configuracion", {
      clave: "empresa_razon_social",
      valor: "ÁPERCA SPA",
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      descripcion: "Razón Social de la empresa",
      creado_por: "sistema",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    return {
      success: true,
      mensaje: "✅ Empresa ÁPERCA SPA (RUT: 78318808-2) configurada correctamente"
    };
  },
});

// Mutation para configuración de empresa
export const configurarEmpresa = mutation({
  args: {
    rut: v.string(),
    razon_social: v.string(),
  },
  handler: async (ctx, args) => {
    // Eliminar configuraciones anteriores de empresa
    const configsAnteriores = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("categoria"), "contabilidad"))
      .collect();
    
    for (const config of configsAnteriores) {
      if (config.clave.startsWith("empresa_")) {
        await ctx.db.delete(config._id);
      }
    }
    
    // Guardar configuración de empresa
    await ctx.db.insert("configuracion", {
      clave: "empresa_rut",
      valor: args.rut,
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      creado_por: "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    await ctx.db.insert("configuracion", {
      clave: "empresa_razon_social",
      valor: args.razon_social,
      tipo: "string",
      categoria: "contabilidad",
      acceso: "privado",
      creado_por: "gemini",
      creado_en: Date.now(),
      actualizado_en: Date.now(),
    });
    
    return {
      success: true,
      mensaje: `Empresa "${args.razon_social}" (RUT: ${args.rut}) configurada correctamente`,
    };
  },
});

// Query para obtener configuración de empresa
export const obtenerConfiguracionEmpresa = query({
  handler: async (ctx) => {
    const configs = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("categoria"), "contabilidad"))
      .collect();
    
    const empresa: any = {};
    configs.forEach(config => {
      if (config.clave.startsWith("empresa_")) {
        const key = config.clave.replace("empresa_", "");
        empresa[key] = config.valor;
      }
    });
    
    return empresa;
  },
});

// Mutación para configuración
export const actualizarConfiguracion = mutation({
  args: {
    clave: v.string(),
    valor: v.union(v.string(), v.number(), v.boolean()),
    tipo: v.union(v.literal("string"), v.literal("number"), v.literal("boolean")),
    descripcion: v.optional(v.string()),
    categoria: v.union(v.literal("ia"), v.literal("whatsapp"), v.literal("web"), v.literal("contabilidad")),
  },
  handler: async (ctx, args) => {
    // Verificar si ya existe
    const existente = await ctx.db
      .query("configuracion")
      .filter(q => q.eq(q.field("clave"), args.clave))
      .first();
    
    if (existente) {
      await ctx.db.patch(existente._id, {
        valor: args.valor,
        actualizado_en: Date.now(),
      });
      
      return { 
        success: true, 
        mensaje: `Configuración "${args.clave}" actualizada`,
        accion: "actualizada"
      };
    } else {
      await ctx.db.insert("configuracion", {
        ...args,
        acceso: "privado",
        creado_por: "gemini",
        creado_en: Date.now(),
        actualizado_en: Date.now(),
      });
      
      return { 
        success: true, 
        mensaje: `Configuración "${args.clave}" creada`,
        accion: "creada"
      };
    }
  },
});
