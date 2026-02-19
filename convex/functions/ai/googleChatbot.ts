import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { api } from "../../_generated/api";

// Google Chatbot - Modo Cliente con Acceso Limitado
// Solo lectura de servicios y respuestas básicas

// Queries de Solo Lectura para Servicios Web
export const obtenerServiciosActivos = query({
  args: { 
    categoria: v.optional(v.union(
      v.literal("desarrollo_web"),
      v.literal("ui_ux"),
      v.literal("consultoria"),
      v.literal("automatizacion"),
      v.literal("otro")
    )),
    destacado: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let servicios = ctx.db.query("servicios_web").filter(q => q.eq(q.field("activo"), true));
    
    if (args.categoria) {
      servicios = servicios.filter(q => q.eq(q.field("categoria"), args.categoria));
    }
    
    if (args.destacado !== undefined) {
      servicios = servicios.filter(q => q.eq(q.field("destacado"), args.destacado));
    }
    
    return await servicios.collect();
  },
});

export const obtenerServicioPorNombre = query({
  args: { nombre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servicios_web")
      .filter(q => 
        q.eq(q.field("nombre"), args.nombre) && 
        q.eq(q.field("activo"), true)
      )
      .first();
  },
});

export const buscarServicios = query({
  args: { termino: v.string() },
  handler: async (ctx, args) => {
    const servicios = await ctx.db
      .query("servicios_web")
      .filter(q => q.eq(q.field("activo"), true))
      .collect();
    
    const terminoLower = args.termino.toLowerCase();
    
    return servicios.filter(servicio => 
      servicio.nombre.toLowerCase().includes(terminoLower) ||
      servicio.descripcion.toLowerCase().includes(terminoLower) ||
      servicio.categoria.toLowerCase().includes(terminoLower)
    );
  },
});

// Mutación para Registrar Mensajes del Chatbot
export const registrarMensajeChatbot = mutation({
  args: {
    session_id: v.string(),
    mensaje_usuario: v.string(),
    respuesta_bot: v.string(),
    tipo_mensaje: v.union(
      v.literal("consulta"),
      v.literal("faq"),
      v.literal("servicios"),
      v.literal("contacto"),
      v.literal("otro")
    ),
    intencion_detectada: v.optional(v.string()),
    datos_extra: v.optional(v.any()),
    ip_usuario: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const mensajeId = await ctx.db.insert("mensajes_chatbot_web", {
      ...args,
      agente: "google",
      timestamp: Date.now(),
    });
    
    return { 
      success: true, 
      mensajeId,
      timestamp: Date.now()
    };
  },
});

// Action de IA con Google Gemini
export const procesarMensajeWeb = action({
  args: {
    mensaje: v.string(),
    session_id: v.string(),
    ip_usuario: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Obtener servicios disponibles para contexto
    const servicios = await ctx.runQuery(api["functions/ai/googleChatbot"].obtenerServiciosActivos, {});
    
    // Detectar intención del mensaje
    const lowerMensaje = args.mensaje.toLowerCase();
    let tipo_mensaje = "consulta";
    let intencion_detectada = "general";
    let respuesta = "";
    
    // FAQ básicas
    if (lowerMensaje.includes("hola") || lowerMensaje.includes("buenos")) {
      respuesta = "¡Hola! Soy Google, el asistente virtual de Jorge Cabrera. ¿En qué puedo ayudarte hoy? Puedes consultarme sobre servicios, proyectos o información de contacto.";
      tipo_mensaje = "faq";
      intencion_detectada = "saludo";
    }
    else if (lowerMensaje.includes("servicios") || lowerMensaje.includes("qué ofreces")) {
      const categorias = [...new Set(servicios.map(s => s.categoria))];
      respuesta = `Ofrezco servicios en las siguientes áreas:\n\n${categorias.map(cat => {
        const serviciosCat = servicios.filter(s => s.categoria === cat);
        return `• **${cat.replace('_', ' ').toUpperCase()}**: ${serviciosCat.length} servicios disponibles`;
      }).join('\n')}\n\n¿Sobre qué categoría te gustaría saber más?`;
      tipo_mensaje = "servicios";
      intencion_detectada = "lista_servicios";
    }
    else if (lowerMensaje.includes("precio") || lowerMensaje.includes("cuánto cuesta")) {
      respuesta = "Los precios varían según el tipo y complejidad del proyecto. ¿Podrías indicarme qué servicio te interesa para darte información más específica?";
      tipo_mensaje = "servicios";
      intencion_detectada = "consulta_precio";
    }
    else if (lowerMensaje.includes("contacto") || lowerMensaje.includes("contactar")) {
      respuesta = "Puedes contactar a Jorge Cabrera por:\n\n📧 Email: jcabreralabbe@gmail.com\n🌐 Sitio: jorge-cabrera.cl\n\n¿Hay algún proyecto específico que te gustaría discutir?";
      tipo_mensaje = "contacto";
      intencion_detectada = "informacion_contacto";
    }
    else if (lowerMensaje.includes("proyecto") || lowerMensaje.includes("trabajo")) {
      respuesta = "Jorge trabaja en proyectos de desarrollo web, UI/UX y automatización. Si tienes un proyecto en mente, cuéntame más sobre tus necesidades y te ayudaré a encontrar la mejor solución.";
      tipo_mensaje = "consulta";
      intencion_detectada = "interes_proyecto";
    }
    else {
      // Búsqueda en servicios
      const serviciosEncontrados = await ctx.runQuery(api["functions/ai/googleChatbot"].buscarServicios, { 
        termino: args.mensaje 
      });
      
      if (serviciosEncontrados.length > 0) {
        respuesta = `Encontré ${serviciosEncontrados.length} servicio(s) relacionado(s) con tu consulta:\n\n${serviciosEncontrados.slice(0, 3).map(s => 
          `**${s.nombre}**\n${s.descripcion}\n💰 Desde $${s.precio_base}\n📂 ${s.categoria.replace('_', ' ').toUpperCase()}`
        ).join('\n\n')}\n\n¿Te gustaría más detalles sobre alguno de estos servicios?`;
        tipo_mensaje = "servicios";
        intencion_detectada = "busqueda_servicios";
      } else {
        respuesta = "Entiendo tu consulta. Para darte la mejor respuesta, ¿podrías ser más específico sobre qué información necesitas? Puedo ayudarte con:\n\n• Información sobre servicios\n• Precios y cotizaciones\n• Contacto con Jorge\n• Detalles de proyectos";
        tipo_mensaje = "consulta";
        intencion_detectada = "necesita_clarificacion";
      }
    }
    
    // Registrar la conversación
    await ctx.runMutation(api["functions/ai/googleChatbot"].registrarMensajeChatbot, {
      session_id: args.session_id,
      mensaje_usuario: args.mensaje,
      respuesta_bot: respuesta,
      tipo_mensaje,
      intencion_detectada,
      ip_usuario: args.ip_usuario,
      user_agent: args.user_agent,
    });
    
    return {
      respuesta,
      tipo_mensaje,
      intencion_detectada,
      agente: "google",
      servicios_sugeridos: tipo_mensaje === "servicios" ? servicios.slice(0, 3) : [],
    };
  },
});

// Query para obtener historial de conversación (limitado por sesión)
export const obtenerHistorialSesion = query({
  args: { 
    session_id: v.string(),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let historial = ctx.db
      .query("mensajes_chatbot_web")
      .filter(q => q.eq(q.field("session_id"), args.session_id))
      .order("desc");
    
    if (args.limite) {
      historial = historial.take(args.limite);
    }
    
    return await historial.collect();
  },
});

// Query para obtener FAQs populares
export const obtenerFAQsPopulares = query({
  handler: async (ctx) => {
    const mensajes = await ctx.db
      .query("mensajes_chatbot_web")
      .filter(q => q.eq(q.field("tipo_mensaje"), "faq"))
      .collect();
    
    // Agrupar por intención detectada y contar frecuencia
    const frecuencias = mensajes.reduce((acc, msg) => {
      const intencion = msg.intencion_detectada || "otro";
      acc[intencion] = (acc[intencion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Ordenar por frecuencia y devolver top 5
    return Object.entries(frecuencias)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([intencion, count]) => ({ intencion, count }));
  },
});
