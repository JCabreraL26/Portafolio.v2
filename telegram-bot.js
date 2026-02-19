// Telegram Bot con Long Polling + Convex + Gemini
// Ejecutar con: node telegram-bot.js

import { ConvexHttpClient } from "convex/browser";

const BOT_TOKEN = "8367559959:AAF44I9ZOqBM7t5e28_5br1OONeiVx8LKkE";
const AUTHORIZED_ID = "8597397136";
const CONVEX_URL = "https://bright-rooster-475.convex.cloud";

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
  if (!update.message || !update.message.text) return;
  
  const msg = update.message;
  const chatId = msg.chat.id.toString();
  const text = msg.text;
  const messageId = msg.message_id;
  const username = msg.from.username || msg.from.first_name;
  
  // Verificar autorización
  if (chatId !== AUTHORIZED_ID) {
    console.log(`❌ Unauthorized: ${chatId}`);
    await sendMessage(chatId, "⛔ Acceso no autorizado.", messageId);
    return;
  }
  
  console.log(`📨 ${username}: ${text}`);
  
  try {
    // Llamar a Convex action
    const resultado = await client.action("functions/ai/deepSeek:procesarMensajeTelegram", {
      mensaje: text,
      chat_id: chatId,
      username: username,
      message_id: messageId,
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
