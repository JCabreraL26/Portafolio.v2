import { v } from "convex/values";
import { action } from "./_generated/server";

// Action pública que puede ser llamada desde Telegram
export const telegramWebhook = action({
  args: {
    update: v.any(),
  },
  handler: async (ctx, args) => {
    console.log("📱 Telegram update received:", args.update);
    
    // Por ahora solo logeamos
    return { ok: true, received: true };
  },
});
