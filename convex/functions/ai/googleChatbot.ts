import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { api, internal } from "../../_generated/api";
import { GoogleGenAI } from "@google/genai";
import { EMPRESA, SERVICIOS, DESIGN_THINKING, PROYECTOS_DESTACADOS, FAQS, CHATBOT_CONFIG } from "../../constants";

// Google Chatbot - Modo Cliente con Acceso Limitado
// Solo lectura de servicios y respuestas básicas

// Inicializar cliente de Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

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

// Action de IA con Google Gemini - MEJORADA CON CONTEXTO COMPLETO
export const procesarMensajeWeb = action({
  args: {
    mensaje: v.string(),
    session_id: v.string(),
    ip_usuario: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ respuesta: string; tipo_mensaje: string; intencion_detectada: string; agente: string; servicios_sugeridos: any[] }> => {
    console.log(`🌐 WEB CHATBOT - Mensaje recibido: "${args.mensaje}"`);
    console.log(`📱 Session ID: ${args.session_id}`);
    
    // Obtener servicios disponibles para contexto
    const servicios: any[] = await ctx.runQuery(api.functions.ai.googleChatbot.obtenerServiciosActivos, {});
    
    // Obtener historial reciente de la sesión para contexto
    const historial = await ctx.runQuery(api.functions.ai.googleChatbot.obtenerHistorialSesion, {
      session_id: args.session_id,
      limite: 5,
    });
    
    // Construir contexto de historial
    const contextoHistorial = historial.length > 0 
      ? `\n\n📜 HISTORIAL RECIENTE (últimos ${historial.length} mensajes):\n` + 
        historial.reverse().map((msg: any) => 
          `Usuario: ${msg.mensaje_usuario}\nAsistente: ${msg.respuesta_bot}`
        ).join('\n\n')
      : "";
    
    // Construir prompt con contexto completo de la empresa
    const systemPrompt = `Eres el Asistente de Ventas de Áperca Spa (Jorge Cabrera), desarrollador fullstack especializado en soluciones digitales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TU PROPÓSITO: Convertir visitantes en clientes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INFORMACIÓN CORPORATIVA:
- Razón Social: ${EMPRESA.razon_social}
- RUT: ${EMPRESA.rut}
- Email Consultas: ${EMPRESA.propietario.email_contacto}
- Sitio Web: ${EMPRESA.sitio_web}
- Especialidad: ${EMPRESA.propietario.especialidad}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 SERVICIOS Y PRECIOS (Chile CLP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 **Landing Page Simple**
   Setup: $150.000 | Mantenimiento: $15.000/mes
   ⏱️ 2-3 días
   ✅ Diseño responsive + WhatsApp + SEO + Hosting

🏢 **Sitio Web Completo (5+ páginas)**
   Setup: $300.000 | Mantenimiento: $25.000/mes
   ⏱️ 3-7 días
   ✅ Multi-página + Panel admin + Analytics + Blog

🛒 **E-commerce con Panel Admin**
   Setup: $800.000 | Mantenimiento: $50.000/mes
   ⏱️ 5-7 días
   ✅ Sin comisiones + WhatsApp + Stock + Realtime
   📌 Caso: Más Pizza ahorra $500.000/mes vs plataformas

⚙️ **ERP Personalizado**
   Setup: $1.800.000 | Mantenimiento: $80.000/mes
   ⏱️ 7 días
   ✅ A medida + PWA + Offline + Capacitación
   📌 Caso: Importadora D&R - 0 descuadres

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 MANTENIMIENTO MENSUAL INCLUYE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Hosting + SSL + Dominio
✅ Actualizaciones de seguridad
✅ Backup automático semanal
✅ Monitoreo 24/7
✅ Soporte via WhatsApp
✅ 1 cambio de contenido/mes (2 horas)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 CASOS DE ÉXITO REALES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛒 **MenuClick - Más Pizza Ñuñoa**
   Problema: Comisiones 30% + pedidos manuales
   Solución: E-commerce + WhatsApp + Panel Admin
   Resultado: Ahorra $500.000/mes, 0% comisión
   Link: jorge-cabrera.cl/proyectos/menuclick

⚙️ **Importadora D&R**
   Problema: Descuadres de inventario constantes
   Solución: ERP con motor de conversión automático
   Resultado: 0 descuadres en 6 meses
   Link: jorge-cabrera.cl/proyectos/importadora-dr

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ESTRATEGIA DE CONVERSACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **CALIFICAR LA NECESIDAD**
   - ¿Qué necesitas mostrar/hacer en tu sitio?
   - ¿Cómo vendes actualmente?
   - ¿Qué problema estás tratando de resolver?

2️⃣ **EXPLICAR EL SERVICIO PRIMERO**
   - Describe QUÉ incluye el servicio
   - Explica CÓMO funciona y beneficios
   - Muestra caso similar de éxito:
     • MenuClick si habla de e-commerce/ventas
     • Importadora D&R si habla de gestión/inventario

3️⃣ **LUEGO DAR PRECIOS CON CONTEXTO**
   - "Para algo así, la inversión es de $X (setup) + $Y/mes (mantenimiento)"
   - Explica QUÉ incluye ese precio
   - Menciona: "Precios flexibles según tu realidad"
   - Muestra ROI cuando sea relevante

4️⃣ **CERRAR CON CONTACTO**
   SIEMPRE termina con:
   📧 **contacto@aperca.cl** (respuesta en menos de 2 horas)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ MANEJO DE OBJECIONES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   ❓ "Es muy caro"
   → Muestra ROI: "Si usas Rappi/Uber con 30% comisión en ventas de $2M/mes, pierdes $600K/mes. Con tu plataforma, recuperas inversión en 1-2 meses"
   → "Podemos ajustar alcance a tu presupuesto"

   ❓ "¿Por qué no Wix/WordPress?"
   → "Para necesidades simples, usa plantilla"
   → "Para procesos específicos de tu negocio, desarrollo custom te da control total y mejor rendimiento"
   → Menciona caso donde plantilla no funcionó (ej: personalización Más Pizza)

   ❓ "¿Y después quién mantiene?"
   → Explica mantenimiento mensual
   → "Código es tuyo, no te encierro"
   → "Stack moderno, fácil de mantener"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 TONO Y ESTILO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Profesional pero cercano
✅ "Te ayudo a..." en vez de "Ofrezco..."
✅ Transparente y honesto
✅ Enfocado en resolver problemas, no vender por vender
✅ Respuestas concisas (máximo 150 palabras)
✅ Usa emojis para mejor visualización
✅ Formato Markdown para legibilidad

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ RESTRICCIONES DE SEGURIDAD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ NUNCA inventes datos que no están en el contexto
❌ NUNCA menciones información financiera privada de Jorge
❌ NUNCA accedas a tablas de contabilidad/gastos/ingresos
❌ SOLO información pública del portafolio

Si preguntan por finanzas privadas:
→ "${CHATBOT_CONFIG.respuestas_seguridad.datos_financieros}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 CONTACTO (Menciona SIEMPRE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Email:** contacto@aperca.cl
**Web:** jorge-cabrera.cl
**Respuesta:** Menos de 2 horas (horario laboral)

${contextoHistorial}`;

    // Llamar a Gemini con Function Calling (Tools)
    let respuesta = "";
    let tipo_mensaje: "consulta" | "faq" | "servicios" | "contacto" | "otro" = "consulta";
    let intencion_detectada = "general";
    
    try {
      // Detectar si el mensaje es sobre agendamiento
      const esAgendamiento = args.mensaje.toLowerCase().includes("agendar") || 
                             args.mensaje.toLowerCase().includes("reunión") || 
                             args.mensaje.toLowerCase().includes("cita") || 
                             args.mensaje.toLowerCase().includes("disponibilidad") || 
                             args.mensaje.toLowerCase().includes("horario");
      
      if (esAgendamiento) {
        tipo_mensaje = "contacto";
        intencion_detectada = "agendamiento";
        
        // Paso 1: Usar Gemini para extraer datos estructurados del mensaje
        const extractorPrompt = `Analiza el siguiente mensaje y extrae información para agendar una reunión.

Mensaje del usuario: "${args.mensaje}"

Contexto de conversación previa (si existe):
${historial.length > 0 ? historial.slice(-3).map((m: any) => `Usuario: ${m.mensaje_usuario}\nBot: ${m.respuesta_bot}`).join('\n') : 'Primera interacción'}

EXTRAE (si están disponibles):
- nombre: El nombre completo del cliente
- email: El email de contacto
- fecha: Fecha deseada en formato YYYY-MM-DD
- hora: Hora en formato HH:MM (24 horas)
- motivo: Razón de la reunión

RESPONDE EN JSON ESTRICTO:
{
  "tiene_datos_completos": true/false,
  "nombre": "...",
  "email": "...",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM",
  "motivo": "...",
  "faltan": ["campo1", "campo2"]
}

Si falta información, marca tiene_datos_completos: false y lista qué falta en "faltan".`;

        const extractorResult = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: extractorPrompt,
        });
        
        let datosExtraidos;
        try {
          // Limpiar respuesta de Gemini (puede venir con ```json o texto extra)
          const textoRaw = extractorResult.text || "{}";
          const textoLimpio = textoRaw
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
          datosExtraidos = JSON.parse(textoLimpio);
          console.log("📊 Datos extraídos:", datosExtraidos);
        } catch (parseError) {
          console.error("❌ Error parseando JSON de Gemini:", parseError);
          datosExtraidos = { tiene_datos_completos: false, faltan: ["todos"] };
        }
        
        // Paso 2: Si tenemos todos los datos, agendar la cita
        if (datosExtraidos.tiene_datos_completos && datosExtraidos.fecha && datosExtraidos.hora) {
          try {
            // Convertir fecha y hora a timestamp
            const [year, month, day] = datosExtraidos.fecha.split('-').map(Number);
            const [hour, minute] = datosExtraidos.hora.split(':').map(Number);
            const fechaInicio = new Date(year, month - 1, day, hour, minute, 0, 0);
            const timestampInicio = fechaInicio.getTime();
            
            // Llamar a la mutation para agendar
            const resultado = await ctx.runMutation(api.functions.agenda.agendarCita as any, {
              fecha_inicio: timestampInicio,
              duracion: 30,
              cliente_nombre: datosExtraidos.nombre,
              cliente_email: datosExtraidos.email,
              motivo: datosExtraidos.motivo,
              source: "web",
            });
            
            console.log("✅ Cita agendada:", resultado);
            
            // Formatear fecha para mostrar
            const fechaFormateada = fechaInicio.toLocaleDateString('es-CL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            const horaFormateada = fechaInicio.toLocaleTimeString('es-CL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            
            respuesta = `✅ **¡Cita confirmada exitosamente!**

📅 **Fecha**: ${fechaFormateada}
🕐 **Hora**: ${horaFormateada}
👤 **Nombre**: ${datosExtraidos.nombre}
📧 **Email**: ${datosExtraidos.email}
📝 **Motivo**: ${datosExtraidos.motivo}

Jorge Cabrera te estará esperando. Recibirás un recordatorio por email 24 horas antes.

Si necesitas cancelar o reprogramar, responde aquí mismo. ¡Nos vemos! 🎉`;
            
          } catch (errorAgendamiento: any) {
            console.error("❌ Error al agendar cita:", errorAgendamiento);
            respuesta = `❌ Lo siento, hubo un problema al agendar la cita: ${errorAgendamiento.message}

Por favor intenta con otro horario o contacta directamente a jcabreralabbe@gmail.com`;
          }
        } else {
          // Paso 3: Si faltan datos, pedir lo que falta conversacionalmente
          const promptSeguimiento = `El usuario quiere agendar una reunión pero falta información.

Datos que ya tenemos:
${JSON.stringify(datosExtraidos, null, 2)}

Genera una respuesta amable pidiendo SOLO la información faltante. Sé conciso y directo.
Incluye disponibilidad: Lunes a Domingo, 8:00 AM - 10:00 PM.`;

          const seguimientoResult = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: promptSeguimiento,
          });
          
          respuesta = seguimientoResult.text || `🗓️ Para agendar tu reunión necesito:

${datosExtraidos.faltan?.map((f: string) => `• ${f}`).join('\n')}

📅 Disponibilidad: Lunes a Domingo, 8:00 AM - 10:00 PM
⏱️ Duración: 30 minutos

¡Comparte los datos y agendamos! 📧`;
        }
        
      } else {
        // Respuesta normal sin agendamiento
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `${systemPrompt}\n\n---\n\nUsuario pregunta: ${args.mensaje}\n\nResponde de forma profesional, concisa y útil:`,
        });
        
        respuesta = result.text || "Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?";
      }
      
      console.log(`✅ Respuesta generada por Gemini (${respuesta.length} caracteres)`);
      
    } catch (error) {
      console.error("❌ Error llamando a Gemini:", error);
      respuesta = "Lo siento, estoy experimentando problemas técnicos. Por favor contacta directamente a jcabreralabbe@gmail.com";
    }
    
    // Detectar intención basada en el contenido del mensaje
    const lowerMensaje = args.mensaje.toLowerCase();
    
    if (lowerMensaje.includes("hola") || lowerMensaje.includes("buenos") || lowerMensaje.includes("saludos")) {
      tipo_mensaje = "faq";
      intencion_detectada = "saludo";
    }
    else if (lowerMensaje.includes("rut") || lowerMensaje.includes("razón social") || lowerMensaje.includes("empresa")) {
      tipo_mensaje = "faq";
      intencion_detectada = "informacion_corporativa";
    }
    else if (lowerMensaje.includes("servicio") || lowerMensaje.includes("qué ofrec") || lowerMensaje.includes("qué hac")) {
      tipo_mensaje = "servicios";
      intencion_detectada = "lista_servicios";
    }
    else if (lowerMensaje.includes("precio") || lowerMensaje.includes("costo") || lowerMensaje.includes("cotiza") || lowerMensaje.includes("cuánto")) {
      tipo_mensaje = "servicios";
      intencion_detectada = "consulta_precio";
    }
    else if (lowerMensaje.includes("contacto") || lowerMensaje.includes("email") || lowerMensaje.includes("contactar") || lowerMensaje.includes("hablar")) {
      tipo_mensaje = "contacto";
      intencion_detectada = "informacion_contacto";
    }
    else if (lowerMensaje.includes("agendar") || lowerMensaje.includes("reunión") || lowerMensaje.includes("cita") || 
             lowerMensaje.includes("calendario") || lowerMensaje.includes("disponibilidad") || lowerMensaje.includes("horario")) {
      tipo_mensaje = "contacto";
      intencion_detectada = "agendamiento";
    }
    else if (lowerMensaje.includes("cancelar") && (lowerMensaje.includes("cita") || lowerMensaje.includes("reunión"))) {
      tipo_mensaje = "contacto";
      intencion_detectada = "cancelar_cita";
    }
    else if (lowerMensaje.includes("proyecto") || lowerMensaje.includes("caso") || lowerMensaje.includes("ejemplo")) {
      tipo_mensaje = "consulta";
      intencion_detectada = "interes_proyecto";
    }
    else if (lowerMensaje.includes("design thinking") || lowerMensaje.includes("metodología") || lowerMensaje.includes("proceso")) {
      tipo_mensaje = "faq";
      intencion_detectada = "metodologia";
    }
    // SEGURIDAD: Detectar intentos de acceso a datos privados
    else if (lowerMensaje.includes("gasto") || lowerMensaje.includes("ingreso") || lowerMensaje.includes("contabilidad") || 
             lowerMensaje.includes("factura") || lowerMensaje.includes("iva") || lowerMensaje.includes("finanzas")) {
      tipo_mensaje = "otro";
      intencion_detectada = "intento_acceso_restringido";
      respuesta = CHATBOT_CONFIG.respuestas_seguridad.datos_financieros;
      console.warn(`⚠️ INTENTO DE ACCESO RESTRINGIDO detectado: "${args.mensaje}"`);
    }
    
    // Sugerir servicios relevantes si aplica
    let servicios_sugeridos: any[] = [];
    if (tipo_mensaje === "servicios") {
      // Buscar servicios relacionados con el mensaje
      const serviciosEncontrados = await ctx.runQuery(api.functions.ai.googleChatbot.buscarServicios, { 
        termino: args.mensaje 
      });
      servicios_sugeridos = serviciosEncontrados.slice(0, 3);
    }
    
    // Registrar la conversación en la base de datos
    await ctx.runMutation(api.functions.ai.googleChatbot.registrarMensajeChatbot, {
      session_id: args.session_id,
      mensaje_usuario: args.mensaje,
      respuesta_bot: respuesta,
      tipo_mensaje,
      intencion_detectada,
      ip_usuario: args.ip_usuario,
      user_agent: args.user_agent,
    });
    
    console.log(`✅ Conversación guardada - Tipo: ${tipo_mensaje}, Intención: ${intencion_detectada}`);
    
    return {
      respuesta,
      tipo_mensaje,
      intencion_detectada,
      agente: "google",
      servicios_sugeridos,
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
    const historial = ctx.db
      .query("mensajes_chatbot_web")
      .filter(q => q.eq(q.field("session_id"), args.session_id))
      .order("desc");
    
    const limite = args.limite || 50;
    const resultado = await historial.take(limite);
    return resultado;
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

// ====================================================================
// ACTION PARA TELEGRAM BOT - Con capacidad de agendamiento
// ====================================================================

export const procesarMensajeTelegram = action({
  args: {
    mensaje: v.string(),
    chat_id: v.string(),
    username: v.string(),
    message_id: v.number(),
  },
  handler: async (ctx, args): Promise<{ respuesta: string }> => {
    console.log(`📱 TELEGRAM - Mensaje de ${args.username}: "${args.mensaje}"`);
    
    // Construir prompt con capacidad de agendamiento
    const systemPrompt = `${CHATBOT_CONFIG.system_prompt}

NOTA: Este mensaje viene de Telegram del usuario ${args.username}.`;

    let respuesta = "";
    
    try {
      // Detectar si el mensaje es sobre agendamiento
      const lowerMensaje = args.mensaje.toLowerCase();
      const esAgendamiento = lowerMensaje.includes("agendar") || 
                             lowerMensaje.includes("reunión") || 
                             lowerMensaje.includes("reunion") ||
                             lowerMensaje.includes("cita") || 
                             lowerMensaje.includes("disponibilidad") || 
                             lowerMensaje.includes("horario");
      
      if (esAgendamiento) {
        // Respuesta de agendamiento conversacional
        respuesta = `🗓️ ¡Perfecto! Me encantaría ayudarte a agendar una reunión con Jorge Cabrera.

📅 **Disponibilidad**: Lunes a Domingo, 8:00 AM - 10:00 PM
⏱️ **Duración**: Reuniones de 30 minutos

Para coordinar, necesito:
1. ¿Qué día prefieres? (ej: mañana, viernes, 25 de febrero)
2. ¿Horario aproximado? (mañana/tarde/noche)
3. Tu nombre completo
4. Tu email
5. Motivo de la reunión

También puedes escribir directamente a jcabreralabbe@gmail.com 📧`;
      } else {
        // Respuesta normal con Gemini
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `${systemPrompt}\n\n---\n\nUsuario pregunta: ${args.mensaje}\n\nResponde de forma profesional, concisa y útil:`,
        });
        
        respuesta = result.text || "Lo siento, no pude procesar tu mensaje.";
      }
      
      console.log(`✅ Respuesta generada (${respuesta.length} caracteres)`);
      
    } catch (error) {
      console.error("❌ Error en Telegram bot:", error);
      respuesta = "Lo siento, hubo un error. Contacta a jcabreralabbe@gmail.com";
    }
    
    return { respuesta };
  },
});
