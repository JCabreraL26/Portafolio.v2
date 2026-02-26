// Telegram Bot con Long Polling + Convex + Gemini
// Ejecutar con: node telegram-bot.js

import { ConvexHttpClient } from "convex/browser";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const AUTHORIZED_ID = process.env.TELEGRAM_AUTHORIZED_USER;
const CONVEX_URL = process.env.CONVEX_URL || "https://bright-rooster-475.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);
let offset = 0;

console.log("🤖 FinBot Pro - Starting with Convex + Gemini...\n");

async function sendMessage(chatId, text, replyToMessageId) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_to_message_id: replyToMessageId,
      parse_mode: "Markdown",
    }),
  });
}

async function processUpdate(update) {
  if (!update.message) return;
  
  const msg = update.message;
  const chatId = msg.chat.id.toString();
  const messageId = msg.message_id;
  const username = msg.from.username || msg.from.first_name;
  
  // Verificar autorización
  if (chatId !== AUTHORIZED_ID) {
    console.log(`❌ Unauthorized: ${chatId}`);
    await sendMessage(chatId, "⛔ Acceso no autorizado.", messageId);
    return;
  }
  
  // Detectar tipo de mensaje
  let tipoMensaje = "texto";
  let mensaje = "";
  let fileId = undefined;
  let fileName = undefined;
  let mimeType = undefined;
  let fileSize = undefined;
  
  if (msg.voice) {
    // Mensaje de voz
    tipoMensaje = "voz";
    mensaje = "[Audio de voz]";
    fileId = msg.voice.file_id;
    mimeType = msg.voice.mime_type || "audio/ogg";
    fileSize = msg.voice.duration;
    console.log(`🎤 ${username}: Audio (${fileSize}s)`);
  } else if (msg.document) {
    // Documento (PDF, etc)
    tipoMensaje = "documento";
    mensaje = msg.caption || "[Documento adjunto]";
    fileId = msg.document.file_id;
    fileName = msg.document.file_name;
    mimeType = msg.document.mime_type;
    fileSize = msg.document.file_size;
    console.log(`📄 ${username}: ${fileName}`);
  } else if (msg.photo) {
    // Foto
    tipoMensaje = "foto";
    mensaje = msg.caption || "[Imagen adjunta]";
    fileId = msg.photo[msg.photo.length - 1].file_id; // La foto más grande
    mimeType = "image/jpeg";
    fileSize = msg.photo[msg.photo.length - 1].file_size;
    console.log(`📷 ${username}: Foto`);
  } else if (msg.text) {
    // Mensaje de texto
    mensaje = msg.text;
    console.log(`📨 ${username}: ${mensaje}`);
  } else {
    // Tipo de mensaje no soportado
    console.log(`⚠️ Tipo de mensaje no soportado`);
    return;
  }
  
  try {
    // Llamar a Convex action (Agente Personal - Gemini)
    const resultado = await client.action("functions/ai/gemini:procesarMensajeTelegram", {
      mensaje: mensaje,
      chat_id: chatId,
      username: username,
      message_id: messageId,
      tipo_mensaje: tipoMensaje,
      file_id: fileId,
      file_name: fileName,
      mime_type: mimeType,
      file_size: fileSize,
    });
    
    console.log(`✅ Response sent`);
    
    // Enviar respuesta
    if (resultado.respuesta) {
      await sendMessage(chatId, resultado.respuesta, messageId);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    await sendMessage(chatId, "❌ Error procesando tu mensaje.", messageId);
  }
}

// Loop principal
async function main() {
  // Remover webhook
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`, {
    method: "POST",
  });
  
  console.log("✅ Webhook removed. Polling active.\n");
  
  while (true) {
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await processUpdate(update);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error:", error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

main().catch(console.error);
