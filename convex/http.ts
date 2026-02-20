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

      // Verificar si hay mensaje (texto, voz, documento o foto)
      const hasText = update.message?.text;
      const hasVoice = update.message?.voice;
      const hasDocument = update.message?.document;
      const hasPhoto = update.message?.photo;

      if (!update.message || (!hasText && !hasVoice && !hasDocument && !hasPhoto)) {
        console.log("⚠️ No hay mensaje válido, ignorando");
        return new Response("OK");
      }

      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const userName = update.message.from.first_name || "Usuario";
      const messageId = update.message.message_id;

      // Variables para contenido del mensaje
      let messageText = "";
      let messageType: "texto" | "voz" | "documento" | "foto" = "texto";
      let fileId: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let mimeType: string | undefined = undefined;
      let fileSize: number | undefined = undefined;

      // Procesar según tipo de mensaje
      if (hasDocument) {
        messageType = "documento";
        fileId = update.message.document.file_id;
        fileName = update.message.document.file_name;
        mimeType = update.message.document.mime_type;
        fileSize = update.message.document.file_size;
        messageText = update.message.caption || "";
        
        console.log(`📄 Documento detectado: ${fileName} (${mimeType}, ${fileSize} bytes)`);
      } else if (hasPhoto) {
        messageType = "foto";
        // Telegram envía múltiples tamaños, tomar el más grande
        const photos = update.message.photo;
        const largestPhoto = photos[photos.length - 1];
        fileId = largestPhoto.file_id;
        fileSize = largestPhoto.file_size;
        mimeType = "image/jpeg";
        messageText = update.message.caption || "";
        
        console.log(`📸 Foto detectada: ${fileSize} bytes`);
      } else if (hasVoice) {
        messageType = "voz";
        fileId = update.message.voice.file_id;
        fileSize = update.message.voice.duration;
        mimeType = "audio/ogg";
        
        console.log(`🎤 Mensaje de voz detectado: ${fileSize}s, file_id: ${fileId}`);
      } else {
        messageText = update.message.text;
        console.log(`📝 Mensaje de texto de ${userName} (${userId}): "${messageText}"`);
      }

      // Procesar con Gemini via Convex
      console.log(`🤖 Ejecutando procesarMensajeTelegram (tipo: ${messageType})...`);
      const resultado = await ctx.runAction(api.functions.ai.gemini.procesarMensajeTelegram, {
        mensaje: messageText,
        chat_id: chatId.toString(),
        username: userName,
        message_id: messageId,
        tipo_mensaje: messageType,
        file_id: fileId,
        file_name: fileName,
        mime_type: mimeType,
        file_size: fileSize,
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
