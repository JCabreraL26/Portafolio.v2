import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Esquema para Agente de IA Personal Deep Seek + Chatbot Web Google

export default defineSchema({
  // Tabla de Contabilidad - Solo Deep Seek (Admin)
  contabilidad: defineTable({
    tipo: v.union(v.literal("ingreso"), v.literal("gasto"), v.literal("transferencia")),
    categoria: v.string(),
    monto: v.number(),
    descripcion: v.string(),
    fecha: v.number(), // Timestamp Unix
    cuenta_origen: v.optional(v.string()),
    cuenta_destino: v.optional(v.string()),
    etiquetas: v.optional(v.array(v.string())),
    comprobante_url: v.optional(v.string()),
    creado_por: v.string(), // "deep_seek"
    creado_en: v.number(),
  })
    .index("por_fecha", ["fecha"])
    .index("por_tipo", ["tipo"])
    .index("por_categoria", ["categoria"]),

  // Tabla de Design Thinking - Solo Deep Seek (Admin)
  design_thinking: defineTable({
    proyecto_id: v.string(),
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
});
