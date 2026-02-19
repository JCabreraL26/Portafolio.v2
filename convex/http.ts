import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/telegram",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const update = await req.json();
      console.log("📥 Telegram update recibido:", JSON.stringify(update));

      // Verificar si hay mensaje
      if (!update.message || !update.message.text) {
        console.log("⚠️ No hay mensaje de texto, ignorando");
        return new Response("OK");
      }

      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const messageText = update.message.text;
      const userName = update.message.from.first_name || "Usuario";
      const messageId = update.message.message_id;

      console.log(`📝 Procesando mensaje de ${userName} (${userId}): "${messageText}"`);

      // Procesar con Gemini via Convex
      console.log("🤖 Ejecutando procesarMensajeTelegram...");
      const resultado = await ctx.runAction(api["functions/ai/gemini"].procesarMensajeTelegram, {
        mensaje: messageText,
        chat_id: chatId.toString(),
        username: userName,
        message_id: messageId,
      });

      console.log("✅ Resultado:", JSON.stringify(resultado));

      // Enviar respuesta a Telegram
      if (resultado && resultado.respuesta) {
        console.log(`💬 Enviando respuesta a chat ${chatId}:`, resultado.respuesta);
        await sendTelegramMessage(chatId, resultado.respuesta);
        console.log("✅ Respuesta enviada exitosamente");
      } else {
        console.log("⚠️ No hay respuesta para enviar");
      }

      return new Response("OK");
    } catch (error) {
      console.error("❌ Error en webhook:", error);
      return new Response("OK");
    }
  }),
});

// Función auxiliar para enviar mensajes
async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      chat_id: chatId, 
      text,
      parse_mode: "Markdown"
    }),
  });
}

export default http;
