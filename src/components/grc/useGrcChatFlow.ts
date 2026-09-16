import { useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GRC_QUESTIONS } from "../../../convex/lib/compliance";

// MVP del Diagnóstico GRC conversacional — solo flujo de chips (sin interrupciones
// de texto libre todavía, ver Fase 4 del plan). El nombre y el email son los únicos
// pasos de texto libre.

export interface QuickReply {
  label: string;
  value: string;
  icon?: string;
}

export interface GrcResult {
  score: number;
  aplicabilidad: {
    ley21663: boolean;
    ley21719: boolean;
    rol21719?: string;
    justificacion?: string[];
  };
  exposicion: { p10: number; p50: number; p90: number };
  sector: string;
}

export interface GrcBotMessage {
  texto: string;
  quickReplies?: QuickReply[];
  resultCard?: GrcResult;
}

type StepKind =
  | "consent"
  | "sector"
  | "tamano"
  | "question"
  | "name"
  | "email"
  | "submitting"
  | "done"
  | "error";

export type GrcInputMode = "chips" | "text" | "email" | "none";

const SECTOR_OPTIONS: QuickReply[] = [
  { label: "Salud", value: "salud", icon: "🏥" },
  { label: "Servicios financieros / seguros", value: "servicios_financieros", icon: "💳" },
  { label: "Comercio", value: "comercio", icon: "🛒" },
  { label: "Otro", value: "otro", icon: "🏷️" },
];

const TAMANO_OPTIONS: QuickReply[] = [
  { label: "1 a 10 personas", value: "1-10" },
  { label: "11 a 50 personas", value: "11-50" },
  { label: "51 a 200 personas", value: "51-200" },
  { label: "Más de 200 personas", value: "200+" },
];

const YES_NO: QuickReply[] = [
  { label: "Sí", value: "true", icon: "✅" },
  { label: "No", value: "false", icon: "❌" },
];

function promptFor(step: StepKind, questionIndex: number, firstName: string): GrcBotMessage {
  switch (step) {
    case "consent":
      return {
        texto:
          "🛡️ **¿Tu empresa cumple con las nuevas leyes chilenas de datos y ciberseguridad?**\n\n**El diagnóstico GRC completo está disponible en una página dedicada.**\n\nDescubrirás:\n• ¿Te aplica la Ley 21.663 (Ciberseguridad) y/o la Ley 21.719 (Datos Personales)?\n• Tu score de madurez vs. empresas de tu sector\n• Rango de exposición económica indicativa (multas + interrupción)\n\n**Luego:** Agenda una reunión gratuita para recibir tu informe detallado.\n\n_Haz click abajo para ir al diagnóstico._",
        quickReplies: [{ label: "Ir al Diagnóstico GRC →", value: "redirect" }],
      };
    case "sector":
      return { texto: "¿A qué sector pertenece tu empresa?", quickReplies: SECTOR_OPTIONS };
    case "tamano":
      return { texto: "¿Cuántas personas trabajan en tu empresa?", quickReplies: TAMANO_OPTIONS };
    case "question": {
      const q = GRC_QUESTIONS[questionIndex];
      return { texto: q ? q.texto : "", quickReplies: YES_NO };
    }
    case "name":
      return { texto: "Perfecto. ¿Cuál es tu nombre?" };
    case "email":
      return { texto: `Gracias${firstName ? `, ${firstName}` : ""}. ¿A qué email te enviamos la confirmación?` };
    case "submitting":
      return { texto: "Calculando tu diagnóstico..." };
    default:
      return { texto: "" };
  }
}

export function useGrcChatFlow(appendBotMessage: (msg: GrcBotMessage) => void) {
  const submitGrcAssessment = useMutation(api.grcAssessment.submitGrcAssessment);

  const [stepKind, setStepKind] = useState<StepKind>("consent");
  const [questionIndex, setQuestionIndex] = useState(0);
  const sectorRef = useRef<string | null>(null);
  const tamanoRef = useRef<string | null>(null);
  const nameRef = useRef<string>("");
  const respuestasRef = useRef<{ questionId: string; value: boolean }[]>([]);

  const inputMode: GrcInputMode = useMemo(() => {
    if (stepKind === "name" || stepKind === "email") return stepKind === "email" ? "email" : "text";
    if (stepKind === "submitting" || stepKind === "done" || stepKind === "error") return "none";
    return "chips";
  }, [stepKind]);

  function start() {
    appendBotMessage(promptFor("consent", 0, ""));
  }

  function goTo(next: StepKind, nextQuestionIndex = questionIndex) {
    setStepKind(next);
    setQuestionIndex(nextQuestionIndex);
    appendBotMessage(promptFor(next, nextQuestionIndex, nameRef.current));
  }

  function handleQuickReply(value: string): string | null {
    switch (stepKind) {
      case "consent":
        goTo("sector");
        return "Comenzar diagnóstico →";
      case "sector": {
        sectorRef.current = value;
        goTo("tamano");
        return SECTOR_OPTIONS.find((o) => o.value === value)?.label ?? value;
      }
      case "tamano": {
        tamanoRef.current = value;
        goTo("question", 0);
        return TAMANO_OPTIONS.find((o) => o.value === value)?.label ?? value;
      }
      case "question": {
        const q = GRC_QUESTIONS[questionIndex];
        const boolVal = value === "true";
        respuestasRef.current = [...respuestasRef.current, { questionId: q.id, value: boolVal }];
        const next = questionIndex + 1;
        if (next < GRC_QUESTIONS.length) {
          goTo("question", next);
        } else {
          goTo("name");
        }
        return boolVal ? "Sí" : "No";
      }
      default:
        return null;
    }
  }

  async function handleTextReply(text: string): Promise<string | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    if (stepKind === "name") {
      nameRef.current = trimmed;
      goTo("email");
      return trimmed;
    }

    if (stepKind === "email") {
      setStepKind("submitting");
      appendBotMessage(promptFor("submitting", 0, nameRef.current));

      try {
        const res = await submitGrcAssessment({
          sector: sectorRef.current as any,
          tamano_empresa: tamanoRef.current as any,
          respuestas: respuestasRef.current,
          name: nameRef.current,
          email: trimmed,
        });

        setStepKind("done");
        appendBotMessage({
          texto: "",
          resultCard: {
            score: res.score,
            aplicabilidad: res.aplicabilidad as GrcResult["aplicabilidad"],
            exposicion: res.exposicion,
            sector: sectorRef.current ?? "otro",
          },
        });
      } catch (e) {
        console.error("Error en submitGrcAssessment:", e);
        setStepKind("error");
        appendBotMessage({
          texto: "Hubo un problema calculando tu diagnóstico. Intenta de nuevo o escríbenos a contacto@aperca.cl",
        });
      }

      return trimmed;
    }

    return null;
  }

  return { inputMode, start, handleQuickReply, handleTextReply };
}
