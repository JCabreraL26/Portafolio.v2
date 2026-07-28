import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Esquema para Agente de IA Personal Deep Seek + Chatbot Web Google

export default defineSchema({
  // Tabla de Contabilidad - Solo Deep Seek (Admin)
  // Adaptada para declaración F29 Chile
  contabilidad: defineTable({
    tipo: v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia")),
    categoria: v.string(),
    descripcion: v.string(),
    fecha: v.number(), // Timestamp Unix
    
    // Montos financieros
    monto_neto: v.optional(v.number()), // Monto sin IVA
    monto_iva: v.optional(v.number()), // Monto del IVA (19%)
    monto_total: v.optional(v.number()), // Monto total con IVA incluido
    
    // Información tributaria (F29 Chile)
    afecto_iva: v.optional(v.boolean()), // Si está afecto a IVA (default: true para facturas)
    iva_porcentaje: v.optional(v.number()), // Porcentaje de IVA (normalmente 19)
    tipo_documento: v.optional(v.union(
      v.literal("factura"),
      v.literal("boleta"),
      v.literal("nota_credito"),
      v.literal("nota_debito"),
      v.literal("factura_exenta"),
      v.literal("otro")
    )),
    numero_documento: v.optional(v.string()), // Número de factura/boleta
    folio: v.optional(v.string()), // Folio del documento tributario
    
    // Partes involucradas
    rut_emisor: v.optional(v.string()), // RUT de quien emite el documento
    razon_social_emisor: v.optional(v.string()),
    rut_receptor: v.optional(v.string()), // RUT de quien recibe
    razon_social_receptor: v.optional(v.string()),
    
    // Período tributario (para F29)
    periodo_tributario: v.optional(v.string()), // Formato: "YYYY-MM" (ej: "2026-02")
    mes_declaracion: v.optional(v.number()), // Mes (1-12)
    anio_declaracion: v.optional(v.number()), // Año
    
    // Campos legacy (mantener compatibilidad)
    monto: v.optional(v.number()), // DEPRECATED: usar monto_total
    cuenta_origen: v.optional(v.string()),
    cuenta_destino: v.optional(v.string()),
    etiquetas: v.optional(v.array(v.string())),
    comprobante_url: v.optional(v.string()),
    
    // Metadata
    creado_por: v.string(), // "gemini", "sistema", etc.
    creado_en: v.number(),
  })
    .index("por_fecha", ["fecha"])
    .index("por_tipo", ["tipo"])
    .index("por_categoria", ["categoria"])
    .index("por_periodo", ["periodo_tributario"])
    .index("por_tipo_doc", ["tipo_documento"])
    .index("por_afecto_iva", ["afecto_iva"]),

  // Tabla de Proyectos - Lista maestra de proyectos
  proyectos: defineTable({
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
    estado: v.union(
      v.literal("activo"),
      v.literal("pausado"),
      v.literal("completado"),
      v.literal("cancelado")
    ),
    prioridad: v.union(v.literal("baja"), v.literal("media"), v.literal("alta"), v.literal("urgente")),
    
    // Planificación
    fecha_inicio: v.optional(v.number()),
    fecha_fin_estimada: v.optional(v.number()),
    fecha_fin_real: v.optional(v.number()),
    progreso: v.optional(v.number()), // 0-100
    
    // Presupuesto (para proyectos con costo)
    presupuesto_estimado: v.optional(v.number()),
    presupuesto_gastado: v.optional(v.number()),
    moneda: v.optional(v.string()), // "CLP", "USD"
    
    // Stakeholders
    cliente_nombre: v.optional(v.string()),
    cliente_email: v.optional(v.string()),
    equipo: v.optional(v.array(v.string())),
    
    // Metadata
    tags: v.optional(v.array(v.string())),
    notas: v.optional(v.string()),
    archivos_adjuntos: v.optional(v.array(v.string())),
    
    creado_por: v.string(), // "gemini", "deep_seek", "sistema"
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_estado", ["estado"])
    .index("por_prioridad", ["prioridad"])
    .index("por_categoria", ["categoria"])
    .index("por_fecha_inicio", ["fecha_inicio"])
    .index("por_creado_en", ["creado_en"]),

  // Tabla de Design Thinking - Solo Deep Seek (Admin)
  design_thinking: defineTable({
    proyecto_id: v.string(), // Referencia a proyectos._id
    fase: v.union(
      v.literal("empatizar"),
      v.literal("definir"),
      v.literal("idear"),
      v.literal("prototipar"),
      v.literal("testear")
    ),
    titulo: v.string(),
    descripcion: v.string(),
    insights: v.optional(v.array(v.string())),
    archivos_adjuntos: v.optional(v.array(v.string())),
    stakeholders: v.optional(v.array(v.string())),
    prioridad: v.union(v.literal("baja"), v.literal("media"), v.literal("alta")),
    estado: v.union(v.literal("activo"), v.literal("completado"), v.literal("pausado")),
    creado_por: v.string(), // "deep_seek"
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_proyecto", ["proyecto_id"])
    .index("por_fase", ["fase"])
    .index("por_prioridad", ["prioridad"])
    .index("por_estado", ["estado"]),

  // Tabla de Configuración - Solo Deep Seek (Admin)
  configuracion: defineTable({
    clave: v.string(),
    valor: v.union(v.string(), v.number(), v.boolean()),
    tipo: v.union(v.literal("string"), v.literal("number"), v.literal("boolean")),
    descripcion: v.optional(v.string()),
    categoria: v.union(v.literal("ia"), v.literal("whatsapp"), v.literal("web"), v.literal("contabilidad")),
    acceso: v.union(v.literal("publico"), v.literal("privado")),
    creado_por: v.string(), // "deep_seek"
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_clave", ["clave"])
    .index("por_categoria", ["categoria"])
    .index("por_acceso", ["acceso"]),

  // Tabla de Servicios Web - Acceso Público (Google + Deep Seek)
  servicios_web: defineTable({
    nombre: v.string(),
    descripcion: v.string(),
    precio_base: v.number(),
    categoria: v.union(
      v.literal("desarrollo_web"),
      v.literal("ui_ux"),
      v.literal("consultoria"),
      v.literal("automatizacion"),
      v.literal("otro")
    ),
    duracion_estimada: v.optional(v.string()), // ej: "2 semanas", "1 mes"
    requisitos: v.optional(v.array(v.string())),
    entregables: v.optional(v.array(v.string())),
    moneda: v.optional(v.string()), // ej: "USD", "CLP"
    activo: v.boolean(),
    destacado: v.optional(v.boolean()),
    creado_por: v.string(),
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_categoria", ["categoria"])
    .index("por_activo", ["activo"])
    .index("por_destacado", ["destacado"]),

  // Tabla de Mensajes Telegram - Gemini Bot (Admin personal)
  mensajes_telegram: defineTable({
    message_id: v.number(),        // ID único del mensaje de Telegram
    chat_id: v.string(),            // ID del chat (para filtrar por usuario)
    username: v.string(),           // Nombre del usuario que envió el mensaje
    
    // Tipo de mensaje recibido
    tipo_mensaje: v.union(
      v.literal("texto"),           // Mensaje de texto normal
      v.literal("voz"),             // Nota de voz
      v.literal("foto"),            // Imagen (futuro: OCR de recibos)
      v.literal("documento")        // Documento adjunto
    ),
    
    // Contenido del mensaje
    contenido_texto: v.optional(v.string()),        // Texto original si tipo="texto"
    contenido_transcrito: v.optional(v.string()),   // Transcripción si tipo="voz"
    archivo_url: v.optional(v.string()),            // URL del archivo de Telegram
    duracion_audio: v.optional(v.number()),         // Duración en segundos (solo voz)
    
    // Respuesta del bot
    respuesta_bot: v.string(),                      // Respuesta enviada por Gemini
    
    // Análisis y acción realizada
    accion_realizada: v.string(),   // "transaccion" | "proyecto_dt" | "consulta" | "comando"
    datos_extraidos: v.optional(v.any()), // JSON con datos relevantes (monto, categoría, etc.)
    
    // Metadata temporal
    timestamp: v.number(),          // Timestamp Unix para memoria contextual
  })
    .index("por_chat_id", ["chat_id"])              // Filtrar mensajes por usuario
    .index("por_timestamp", ["timestamp"])          // Ordenar cronológicamente
    .index("por_tipo_mensaje", ["tipo_mensaje"])    // Filtrar por tipo (voz, texto, etc.)
    .index("por_chat_timestamp", ["chat_id", "timestamp"]), // Memoria contextual optimizada

  // Tabla de Mensajes Chatbot Web - Acceso Público (solo escritura)
  mensajes_chatbot_web: defineTable({
    session_id: v.string(),
    mensaje_usuario: v.string(),
    respuesta_bot: v.string(),
    agente: v.union(v.literal("google"), v.literal("deep_seek")),
    tipo_mensaje: v.union(
      v.literal("consulta"),
      v.literal("faq"),
      v.literal("servicios"),
      v.literal("contacto"),
      v.literal("otro")
    ),
    intencion_detectada: v.optional(v.string()),
    datos_extra: v.optional(v.any()), // JSON flexible
    ip_usuario: v.optional(v.string()),
    user_agent: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("por_session", ["session_id"])
    .index("por_agente", ["agente"])
    .index("por_timestamp", ["timestamp"])
    .index("por_tipo", ["tipo_mensaje"]),

  // Tabla de Agenda - Sistema de Agendamiento Inteligente
  agenda: defineTable({
    // Fecha y tiempo
    fecha_inicio: v.number(),     // Timestamp Unix del inicio de la reunión
    fecha_fin: v.number(),        // Timestamp Unix del fin de la reunión
    duracion: v.number(),         // Duración en minutos (default: 30)
    
    // Información del cliente
    cliente_nombre: v.string(),
    cliente_email: v.string(),
    cliente_telefono: v.optional(v.string()),
    
    // Detalles de la reunión
    motivo: v.string(),           // Razón de la reunión
    notas: v.optional(v.string()), // Notas adicionales
    
    // Estado y origen
    estado: v.union(
      v.literal("confirmada"),
      v.literal("cancelada"),
      v.literal("completada"),
      v.literal("no_asistio")
    ),
    source: v.union(
      v.literal("web"),
      v.literal("telegram")
    ),
    
    // Metadata
    creado_en: v.number(),
    actualizado_en: v.number(),
    cancelado_en: v.optional(v.number()),
    razon_cancelacion: v.optional(v.string()),
  })
    .index("por_fecha_inicio", ["fecha_inicio"])
    .index("por_estado", ["estado"])
    .index("por_cliente_email", ["cliente_email"])
    .index("por_fecha_estado", ["fecha_inicio", "estado"])
    .index("por_source", ["source"]),

  // Configuración de Agenda - Horarios laborales
  configuracion_agenda: defineTable({
    // Horarios laborales
    hora_inicio: v.number(),       // Ej: 8 (8:00 AM)
    hora_fin: v.number(),          // Ej: 24 (12:00 AM - medianoche)
    dias_laborales: v.array(v.number()), // [1,2,3,4,5,6,7] = Lun-Dom
    duracion_slot: v.number(),     // Minutos por slot (default: 30)
    zona_horaria: v.string(),      // 'America/Santiago'
    
    // Bloqueos y excepciones
    dias_bloqueados: v.optional(v.array(v.number())), // Timestamps de días no disponibles
    
    // Metadata
    activo: v.boolean(),
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_activo", ["activo"]),

  // ========================================
  // 🎨 UX RESEARCH - MÓDULO MULTI-AGENTE
  // ========================================

  // Tabla de User Personas
  user_personas: defineTable({
    proyecto_id: v.string(),           // Referencia a proyectos._id
    nombre: v.string(),
    edad_rango: v.string(),            // "25-35"
    ocupacion: v.string(),
    objetivos: v.array(v.string()),
    pain_points: v.array(v.string()),
    tech_savviness: v.union(
      v.literal("bajo"),
      v.literal("medio"),
      v.literal("alto")
    ),
    
    // Metadata
    creado_por: v.string(),            // "ux_researcher_agent"
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_proyecto", ["proyecto_id"])
    .index("por_creado_en", ["creado_en"]),

  // Tabla de Informes de Design Thinking Completos
  informes_ux: defineTable({
    proyecto_id: v.string(),
    proyecto_nombre: v.string(),
    proyecto_descripcion: v.string(),
    
    // Fase 1: Empatía
    empathy_personas: v.array(v.string()),      // IDs de user_personas
    empathy_insights: v.array(v.string()),
    empathy_map: v.any(),                       // JSON del mapa de empatía
    empathy_methods: v.array(v.string()),       // Métodos de investigación
    
    // Fase 2: Definición
    problem_statement: v.string(),              // POV statement
    how_might_we: v.array(v.string()),          // Preguntas HMW
    user_needs: v.array(v.string()),
    constraints: v.array(v.string()),
    
    // Fase 3: Ideación
    ideas: v.array(v.any()),                    // [{idea, score, viabilidad}]
    selected_concepts: v.array(v.string()),
    ideation_techniques: v.array(v.string()),
    
    // Fase 4: Prototipado
    prototype_type: v.string(),                 // "low-fi", "mid-fi", "high-fi"
    prototype_url: v.optional(v.string()),
    key_features: v.array(v.string()),
    assumptions_to_test: v.array(v.string()),
    
    // Fase 5: Testing
    test_participants: v.number(),
    test_method: v.string(),
    findings: v.array(v.any()),                 // [{finding, severity}]
    iterations_needed: v.array(v.string()),
    
    // Metadata del informe
    next_steps: v.array(v.string()),
    confidence_score: v.number(),               // 0-1
    iteration_count: v.number(),                // Cuántas veces fue revisado
    approved_by_evaluator: v.boolean(),
    
    // Agente que lo generó
    generated_by: v.string(),                   // "langgraph_workflow"
    creado_en: v.number(),
    actualizado_en: v.number(),
  })
    .index("por_proyecto", ["proyecto_id"])
    .index("por_confidence", ["confidence_score"])
    .index("por_aprobado", ["approved_by_evaluator"])
    .index("por_creado_en", ["creado_en"]),

  // Tabla de Ejecuciones de Workflow (para debugging)
  workflow_executions: defineTable({
    workflow_type: v.string(),                  // "design_thinking_full"
    proyecto_id: v.string(),
    estado: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    
    // Progreso
    current_step: v.string(),                   // "researcher", "facilitator", "evaluator"
    iteration_count: v.number(),
    max_iterations: v.number(),
    
    // Resultados parciales
    research_data: v.optional(v.string()),
    draft_report: v.optional(v.any()),
    evaluation_feedback: v.optional(v.array(v.string())),
    
    // Tiempos
    started_at: v.number(),
    completed_at: v.optional(v.number()),
    duration_ms: v.optional(v.number()),
    
    // Metadata
    triggered_by: v.string(),                   // chat_id de Telegram
    error_message: v.optional(v.string()),
  })
    .index("por_proyecto", ["proyecto_id"])
    .index("por_estado", ["estado"])
    .index("por_started_at", ["started_at"]),

  // Tabla de Leads - Qualifying Funnel
  leads: defineTable({
    type: v.string(), // "HIGH_TICKET_CLIENT" | "RECRUITER" | "GENERAL"
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    budget_range: v.optional(v.string()),
    challenge: v.optional(v.string()),
    project_summary: v.string(),
    source: v.string(), // "FUNNEL_FORM" | "AI_AGENT" | "DIRECT"
    created_at: v.number(),
  })
    .index("por_email", ["email"])
    .index("por_type", ["type"])
    .index("por_source", ["source"])
    .index("por_created_at", ["created_at"]),
});
