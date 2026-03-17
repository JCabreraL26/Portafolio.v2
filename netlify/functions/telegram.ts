import { ConvexHttpClient } from "convex/browser";
import type { Handler, HandlerEvent } from "@netlify/functions";

const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://bright-rooster-475.convex.cloud");

export const handler: Handler = async (event: HandlerEvent) => {
  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("📱 Telegram webhook received:", body);

    // Verificar que sea un mensaje de texto
    if (!body.message || !body.message.text) {
      return {
        statusCode: 200,
        body: "OK",
      };
    }

    const message = body.message;
    const chatId = message.chat.id.toString();
    const text = message.text;
    const messageId = message.message_id;
    const username = message.from.username || message.from.first_name;

    console.log(`📨 Processing: ${text}`);

    // 🔍 PASO 1: Clasificar intención del mensaje
    console.log("🔍 Clasificando intención...");
    const clasificacion = await client.action("functions/ai/uxResearch/router:clasificarIntencion" as any, {
      mensaje: text,
      chat_id: chatId,
      username: username,
    });

    console.log(`🎯 Intención detectada: ${clasificacion.categoria} (confianza: ${clasificacion.confianza})`);

    // 🎯 PASO 2: Rutear al módulo correspondiente
    let resultado;
    
    if (clasificacion.categoria === "ux_research") {
      // Módulo UX Research (próximamente)
      console.log("🎨 Ruta: UX Research Module");
      resultado = {
        respuesta: `🎨 **Módulo UX Research**\n\n🚧 En desarrollo...\n\nPróximamente podrás:\n• Generar user personas\n• Crear informes de Design Thinking\n• Analizar insights de usuarios\n\n💡 Por ahora, usa el módulo de finanzas o proyectos.`,
      };
    } else if (clasificacion.categoria === "agenda") {
      // Módulo de Agenda (ya implementado en gemini.ts)
      console.log("📅 Ruta: Agenda Module (via Gemini)");
      resultado = await client.action("functions/ai/gemini:procesarMensajeTelegram" as any, {
        mensaje: text,
        chat_id: chatId,
        username: username,
        message_id: messageId,
      });
    } else {
      // Módulo de Finanzas + General (existente)
      console.log("💰 Ruta: Finanzas/General Module (Gemini)");
      resultado = await client.action("functions/ai/gemini:procesarMensajeTelegram" as any, {
        mensaje: text,
        chat_id: chatId,
        username: username,
        message_id: messageId,
      });
    }

    console.log("✅ Convex response:", resultado);

    // Enviar respuesta a Telegram
    if (resultado.respuesta) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const sendUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      await fetch(sendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: resultado.respuesta,
          reply_to_message_id: messageId,
          parse_mode: "Markdown",
        }),
      });
    }

    return {
      statusCode: 200,
      body: "OK",
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};
