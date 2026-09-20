import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {
  evaluarAplicabilidad,
  calcularScoreMadurez,
  calcularExposicionLegal,
  type SectorGRC,
  type TamanoEmpresa,
} from "./lib/compliance";

// Mutation del Diagnóstico GRC (Ley 21.663 / Ley 21.719)
// Reutiliza el motor FAIR (convex/lib/fairEngine.ts) y el catálogo normativo
// (convex/lib/compliance.ts) ya portados; inserta lead + resultado en la misma llamada
// y reusa el mismo canal de notificación Telegram que agendarCita (convex/functions/agenda.ts).

export const submitGrcAssessment = mutation({
  args: {
    sector: v.union(
      v.literal("salud"),
      v.literal("servicios_financieros"),
      v.literal("comercio"),
      v.literal("otro")
    ),
    tamano_empresa: v.union(v.literal("1-10"), v.literal("11-50"), v.literal("51-200"), v.literal("200+")),
    respuestas: v.array(
      v.object({
        questionId: v.string(),
        value: v.union(v.string(), v.number(), v.boolean()),
      })
    ),
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sector = args.sector as SectorGRC;
    const tamano = args.tamano_empresa as TamanoEmpresa;

    const aplicabilidad = evaluarAplicabilidad(sector, tamano, args.respuestas);
    const score = calcularScoreMadurez(args.respuestas);

    // Calcular exposición basada en multas legales reales (UTM → CLP)
    const exposicion = calcularExposicionLegal(aplicabilidad, score);
    const exposicionP10 = exposicion.p10;
    const exposicionP50 = exposicion.p50;
    const exposicionP90 = exposicion.p90;

    const leadId = await ctx.db.insert("leads", {
      type: "GRC_ASSESSMENT",
      name: args.name,
      email: args.email,
      company: args.company,
      budget_range: undefined,
      challenge: "security",
      project_summary: `Diagnóstico GRC — sector ${sector}, score madurez ${score}/100, exposición P50 ≈ $${Math.round(
        exposicionP50
      ).toLocaleString("es-CL")} CLP`,
      source: "GRC_FUNNEL",
      created_at: Date.now(),
    });

    const assessmentId = await ctx.db.insert("grc_assessments", {
      leadId,
      sector,
      tamano_empresa: tamano,
      respuestas: args.respuestas,
      aplicabilidad: {
        ley21663: aplicabilidad.ley21663,
        ley21719: aplicabilidad.ley21719,
        rol21719: aplicabilidad.rol21719,
        esOIV: aplicabilidad.esOIV,
        esPSE: aplicabilidad.esPSE,
        justificacion: aplicabilidad.justificacion,
      },
      score,
      exposicionP10,
      exposicionP50,
      exposicionP90,
      moneda: "CLP",
      seedUsada: Date.now(), // Seed para reproducibilidad (aunque no usamos Monte Carlo aquí)
      created_at: Date.now(),
    });

    // 📱 NOTIFICACIÓN POR TELEGRAM — mismo patrón que agendarCita (convex/functions/agenda.ts)
    try {
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.TELEGRAM_AUTHORIZED_USER;

      console.log("🔍 Telegram config:", { 
        hasToken: !!BOT_TOKEN, 
        hasChat: !!CHAT_ID,
        tokenLength: BOT_TOKEN?.length,
        chatId: CHAT_ID 
      });

      if (BOT_TOKEN && CHAT_ID) {
        const fmtCLP = (n: number) => `$${Math.round(n).toLocaleString("es-CL")} CLP`;

        const mensaje = `🛡️ *NUEVO DIAGNÓSTICO GRC*

👤 *Nombre:* ${args.name}
📧 *Email:* ${args.email}
${args.company ? `🏢 *Empresa:* ${args.company}\n` : ""}${args.phone ? `📱 *Teléfono:* ${args.phone}\n` : ""}
🏷️ *Sector:* ${sector} · *Tamaño:* ${tamano}
📊 *Score madurez:* ${score}/100
⚖️ *Ley 21.663:* ${aplicabilidad.ley21663 ? "Aplica" : "No aplica"}
⚖️ *Ley 21.719:* ${aplicabilidad.ley21719 ? `Aplica (${aplicabilidad.rol21719})` : "No aplica"}
💰 *Exposición (P10–P90):* ${fmtCLP(exposicionP10)} — ${fmtCLP(exposicionP90)}

_Lead ID: ${leadId}_`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: mensaje,
            parse_mode: "Markdown",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error enviando notificación a Telegram:", errorText);
        } else {
          console.log("✅ Notificación enviada a Telegram correctamente");
        }
      } else {
        console.warn("⚠️ Telegram no configurado - notificación no enviada");
      }
    } catch (notifError) {
      console.error("❌ Error enviando notificación Telegram:", notifError);
      // No lanzamos error para que no falle el guardado del diagnóstico
    }

    return {
      leadId,
      assessmentId,
      aplicabilidad,
      score,
      exposicion: { p10: exposicionP10, p50: exposicionP50, p90: exposicionP90 },
      moneda: "CLP",
    };
  },
});
