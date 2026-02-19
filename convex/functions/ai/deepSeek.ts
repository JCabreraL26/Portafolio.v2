import { v } from "convex/values";
import { mutation, query, action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

// FinBot Pro - Google Gemini AI con Acceso Completo via Telegram
// Control total con seguridad por chat_id

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const transaccionId = await ctx.db.insert("contabilidad", {
      ...args,
      fecha: Date.now(),
      creado_por: "deep_seek",
      creado_en: Date.now(),
    });
    
    return { 
      success: true, 
      transaccionId,
      mensaje: `Transacción ${args.tipo} de $${args.monto} registrada exitosamente`
    };
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
    stakeholders: v.optional(v.array(v.string())),
    prioridad: v.union(v.literal("baja"), v.literal("media"), v.literal("alta")),
  },
  handler: async (ctx, args) => {
    const proyectoId = await ctx.db.insert("design_thinking", {
      ...args,
      estado: "activo",
      creado_por: "deep_seek",
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

// Queries para Dashboard Admin
export const obtenerResumenFinanciero = query({
  handler: async (ctx) => {
    const transacciones = await ctx.db.query("contabilidad").collect();
    
    const ingresos = transacciones
      .filter(t => t.tipo === "ingreso")
      .reduce((sum, t) => sum + t.monto, 0);
    
    const gastos = transacciones
      .filter(t => t.tipo === "gasto")
      .reduce((sum, t) => sum + t.monto, 0);
    
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

// Actions de IA con Deep Seek para Telegram
export const procesarMensajeTelegram = action({
  args: {
    mensaje: v.string(),
    chat_id: v.string(),
    username: v.string(),
    message_id: v.number(),
  },
  handler: async (ctx, args) => {
    // 🔐 SEGURIDAD: Verificar que el chat_id esté autorizado
    const MY_TELEGRAM_ID = process.env.MY_TELEGRAM_ID;
    if (!MY_TELEGRAM_ID || args.chat_id !== MY_TELEGRAM_ID) {
      throw new Error(`Unauthorized access from chat_id: ${args.chat_id}`);
    }
    
    // Analizar intención del mensaje con Gemini
    const prompt = `Eres FinBot Pro, asistente financiero móvil personal de Jorge Cabrera. 

🎯 ENFOQUE MOBILE-FIRST:
- Responde en formato corto y estructurado
- Usa emojis para mejor visualización
- Máximo 2-3 líneas por respuesta
- Formato Markdown para legibilidad en móvil

📱 COMANDOS RÁPIDOS DISPONIBLES:
/gasto $50 categoría - Registrar gasto rápido
/ingreso $100 categoría - Registrar ingreso  
/resumen - Resumen financiero breve
/proyectos - Lista proyectos activos
/ayuda - Mostrar todos los comandos

💡 EJEMPLOS DE USO:
- "/gasto $25 comida"
- "/ingreso $500 freelance"
- "/resumen"

Responde siempre en español, sé conciso y usa emojis frecuentemente.

Usuario escribió: ${args.mensaje}`;

    const result = await model.generateContent(prompt);
    const respuesta = result.response.text();
    
    // Procesar comandos específicos optimizados para mobile
    const lowerMensaje = args.mensaje.toLowerCase().trim();
    
    // 📱 COMANDOS RÁPIDOS CON /
    if (lowerMensaje.startsWith("/gasto")) {
      const match = args.mensaje.match(/\/gasto\s+\$(\d+)\s+(.+)/);
      if (match) {
        const resultado = await ctx.runMutation(registrarTransaccion, {
          tipo: "gasto",
          categoria: match[2].trim(),
          monto: parseInt(match[1]),
          descripcion: `Gasto vía Telegram móvil`,
        });
        
        return {
          respuesta: `💸 *Gasto Registrado*\n\`\`\`${match[2].trim()}\`\`\`\n💰 **$${match[1]}**\n✅ ¡Listo!`,
          accion: "transaccion_registrada",
          datos: resultado
        };
      }
    }
    
    if (lowerMensaje.startsWith("/ingreso")) {
      const match = args.mensaje.match(/\/ingreso\s+\$(\d+)\s+(.+)/);
      if (match) {
        const resultado = await ctx.runMutation(registrarTransaccion, {
          tipo: "ingreso",
          categoria: match[2].trim(),
          monto: parseInt(match[1]),
          descripcion: `Ingreso vía Telegram móvil`,
        });
        
        return {
          respuesta: `💰 *Ingreso Registrado*\n\`\`\`${match[2].trim()}\`\`\`\n💵 **+$${match[1]}**\n🎉 ¡Genial!`,
          accion: "transaccion_registrada",
          datos: resultado
        };
      }
    }
    
    if (lowerMensaje === "/resumen") {
      const resumen = await ctx.runQuery(obtenerResumenFinanciero);
      
      return {
        respuesta: `📊 *Resumen Financiero*\n\n💵 *Ingresos:* $${resumen.total_ingresos}\n💸 *Gastos:* $${resumen.total_gastos}\n💰 *Balance:* $${resumen.balance}\n📝 *Transacciones:* ${resumen.total_transacciones}`,
        accion: "resumen_financiero",
        datos: resumen
      };
    }
    
    if (lowerMensaje === "/proyectos") {
      const proyectos = await ctx.runQuery(obtenerProyectosDT, {});
      
      if (proyectos.length === 0) {
        return {
          respuesta: `📋 *Proyectos*\n\n🔍 No hay proyectos activos\n\n💡 Usa \`/crear proyecto\` para empezar`,
          accion: "lista_proyectos_vacia",
          datos: []
        };
      }
      
      const listaProyectos = proyectos.slice(0, 5).map(p => 
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
        respuesta: `🤖 *FinBot Pro - Ayuda*\n\n📱 *Comandos Rápidos:*\n\n💸 \`/gasto $50 comida\`\n💰 \`/ingreso $100 freelance\`\n📊 \`/resumen\`\n📋 \`/proyectos\`\n❓ \`/ayuda\`\n\n💡 *Ejemplos:*\n\`/gasto $25 uber\`\n\`/ingreso $500 cliente\`\n\n🚀 *Rápido y fácil!*`,
        accion: "ayuda",
        datos: null
      };
    }
    
    // Comandos tradicionales (compatibilidad)
    if (lowerMensaje.includes("registrar") && (lowerMensaje.includes("gasto") || lowerMensaje.includes("ingreso"))) {
      const montoMatch = args.mensaje.match(/\$(\d+)/);
      const categoriaMatch = args.mensaje.match(/en\s+([^:]+)/);
      
      if (montoMatch && categoriaMatch) {
        const resultado = await ctx.runMutation(registrarTransaccion, {
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
      const resumen = await ctx.runQuery(obtenerResumenFinanciero);
      
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
        creado_por: "deep_seek",
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
