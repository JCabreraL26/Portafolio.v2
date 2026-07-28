import { CORE_IDENTITY } from "./context/00_core_identity";
import { QUALIFYING_RULES } from "./context/01_qualifying_rules";
import { HIGH_TICKET_LAYER } from "./context/layers/high_ticket";
import { RECRUITER_LAYER } from "./context/layers/recruiter";
import { GENERAL_FAQ_LAYER } from "./context/layers/general_faq";

export type UserType = "HIGH_TICKET" | "RECRUITER" | "UNKNOWN";

/**
 * Construye el system prompt dinámicamente según el tipo de usuario
 * usando Context Layering para optimizar tokens y relevancia
 */
export function buildSystemPrompt(userType: UserType): string {
  // Base: Core Identity + Qualifying Rules (siempre presentes)
  let systemPrompt = CORE_IDENTITY + "\n\n" + QUALIFYING_RULES;
  
  // Capa específica según tipo de usuario
  switch (userType) {
    case "HIGH_TICKET":
      systemPrompt += "\n\n" + HIGH_TICKET_LAYER;
      break;
    case "RECRUITER":
      systemPrompt += "\n\n" + RECRUITER_LAYER;
      break;
    case "UNKNOWN":
      systemPrompt += "\n\n" + GENERAL_FAQ_LAYER;
      break;
  }
  
  return systemPrompt;
}

/**
 * Clasifica la intención del usuario basándose en keywords
 * para determinar qué capa de contexto activar
 */
export function classifyUserIntent(message: string): UserType {
  const lowerMessage = message.toLowerCase();
  
  // Keywords para cliente high-ticket
  const clientKeywords = [
    "proyecto", "desarrollo", "consultoría", "automatización", "ia", "mvp",
    "presupuesto", "cotización", "contratar", "servicio", "producto",
    "osint", "power bi", "python", "arquitectura", "devsecops", "seguridad",
    "agentic", "rag", "growth", "marketing", "ads", "funnel", "conversión"
  ];
  
  // Keywords para reclutador
  const recruiterKeywords = [
    "reclutador", "recruiter", "hiring", "vacante", "puesto", "trabajo",
    "empleo", "cv", "curriculum", "sueldo", "salario", "disponibilidad",
    "contratar desarrollador", "busco talento", "oferta laboral"
  ];
  
  // Contar matches
  const clientMatches = clientKeywords.filter(kw => lowerMessage.includes(kw)).length;
  const recruiterMatches = recruiterKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  // Clasificar según matches
  if (recruiterMatches > 0 && recruiterMatches >= clientMatches) {
    return "RECRUITER";
  } else if (clientMatches > 0) {
    return "HIGH_TICKET";
  } else {
    return "UNKNOWN";
  }
}

/**
 * Detecta si el usuario está listo para agendar diagnóstico
 */
export function shouldOfferScheduling(
  userType: UserType,
  conversationHistory: Array<{ mensaje_usuario: string; respuesta_bot: string }>
): boolean {
  if (userType !== "HIGH_TICKET") {
    return false;
  }
  
  // Si ya se mencionó presupuesto o desafío, ofrecer agendamiento
  const allMessages = conversationHistory
    .map(h => h.mensaje_usuario.toLowerCase())
    .join(" ");
  
  const hasDiscussedBudget = allMessages.includes("presupuesto") || 
                             allMessages.includes("$") ||
                             allMessages.includes("usd") ||
                             allMessages.includes("precio");
  
  const hasDiscussedChallenge = allMessages.includes("automatización") ||
                                allMessages.includes("mvp") ||
                                allMessages.includes("osint") ||
                                allMessages.includes("ia") ||
                                allMessages.includes("seguridad");
  
  return hasDiscussedBudget || hasDiscussedChallenge || conversationHistory.length >= 2;
}

/**
 * Extrae información de cualificación del historial de conversación
 */
export function extractQualificationData(
  conversationHistory: Array<{ mensaje_usuario: string; respuesta_bot: string }>
): {
  challenge?: string;
  budgetRange?: string;
  timeline?: string;
} {
  const allMessages = conversationHistory
    .map(h => h.mensaje_usuario.toLowerCase())
    .join(" ");
  
  const data: {
    challenge?: string;
    budgetRange?: string;
    timeline?: string;
  } = {};
  
  // Detectar desafío
  if (allMessages.includes("automatización") || allMessages.includes("ia")) {
    data.challenge = "automation";
  } else if (allMessages.includes("mvp")) {
    data.challenge = "mvp";
  } else if (allMessages.includes("ux") || allMessages.includes("diseño")) {
    data.challenge = "ux";
  } else if (allMessages.includes("osint") || allMessages.includes("datos")) {
    data.challenge = "osint";
  } else if (allMessages.includes("seguridad") || allMessages.includes("devsecops")) {
    data.challenge = "security";
  }
  
  // Detectar presupuesto
  if (allMessages.includes("3k") || allMessages.includes("3000")) {
    data.budgetRange = "3k-10k";
  } else if (allMessages.includes("10k") || allMessages.includes("10000")) {
    data.budgetRange = "10k-30k";
  } else if (allMessages.includes("30k") || allMessages.includes("30000")) {
    data.budgetRange = "30k+";
  }
  
  // Detectar timeline
  if (allMessages.includes("urgente") || allMessages.includes("rápido")) {
    data.timeline = "urgent";
  } else if (allMessages.includes("1 mes") || allMessages.includes("2 meses")) {
    data.timeline = "1-3 months";
  } else if (allMessages.includes("3 meses") || allMessages.includes("6 meses")) {
    data.timeline = "3-6 months";
  }
  
  return data;
}
