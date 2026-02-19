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

    // Llamar a Convex action
    const resultado = await client.action("functions/ai/deepSeek:procesarMensajeTelegram" as any, {
      mensaje: text,
      chat_id: chatId,
      username: username,
      message_id: messageId,
    });

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
