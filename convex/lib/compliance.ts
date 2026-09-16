/**
 * Catálogo normativo del Diagnóstico GRC (Ley 21.663 Ciberseguridad / Ley 21.719 Datos Personales).
 *
 * Todo en este archivo es DATO VERSIONABLE, no arquitectura: el árbol de aplicabilidad,
 * los techos sancionatorios y las 3 plantillas FAIR se pueden ajustar sin tocar
 * convex/grcAssessment.ts ni el motor de simulación.
 *
 * ⚠️ Cifras y umbrales son ESTIMACIONES INDICATIVAS pendientes de verificación legal
 * (ver docs/PLAN_IMPLEMENTACION_DIAGNOSTICO_GRC.md §4, riesgo 5). No usar como fuente
 * de asesoría legal ni publicar sin validar contra el texto oficial de ambas leyes.
 */

import type {
  ThreatEventFrequency,
  Vulnerability,
  AssetValue,
  LossEventImpact,
} from "./fairTypes";

// ─── Tipos base del cuestionario ──────────────────────────────

export type SectorGRC = "salud" | "servicios_financieros" | "comercio" | "otro";
export type TamanoEmpresa = "1-10" | "11-50" | "51-200" | "200+";
export type RolLey21719 = "responsable" | "encargado" | "ambos" | "no_aplica";

export interface RespuestaGRC {
  questionId: string;
  value: string | number | boolean;
}

export interface AplicabilidadResult {
  ley21663: boolean;
  ley21719: boolean;
  rol21719: RolLey21719;
  justificacion: string[];
}

// ─── Catálogo de preguntas (usado por la UI en Fase 4) ────────

export interface GrcQuestion {
  id: string;
  texto: string;
  tipo: "boolean";
  capitulo: 1 | 2 | 3;
  ayuda?: string;
}

export interface GrcCapitulo {
  numero: 1 | 2 | 3;
  titulo: string;
  subtitulo: string;
}

export const GRC_CAPITULOS: GrcCapitulo[] = [
  { numero: 1, titulo: "Los datos que manejas", subtitulo: "Ley 21.719 — Protección de Datos Personales" },
  { numero: 2, titulo: "Qué tan crítico eres", subtitulo: "Ley 21.663 — Marco de Ciberseguridad" },
  { numero: 3, titulo: "Qué tan preparado estás", subtitulo: "Madurez operativa" },
];

export const GRC_QUESTIONS: GrcQuestion[] = [
  {
    id: "q_trata_datos_personales",
    texto: "¿Tu empresa recolecta o trata datos personales de clientes, usuarios o pacientes (nombre, email, RUT, historial, etc.)?",
    tipo: "boolean",
    capitulo: 1,
  },
  {
    id: "q_trata_datos_sensibles",
    texto: "¿Tratas datos sensibles (salud, biométricos, situación socioeconómica u otros de la misma categoría)?",
    tipo: "boolean",
    capitulo: 1,
  },
  {
    id: "q_encargado_tratamiento",
    texto: "¿Procesas datos personales por encargo de otras empresas (eres proveedor/encargado de tratamiento)?",
    tipo: "boolean",
    capitulo: 1,
  },
  {
    id: "q_servicio_esencial",
    texto: "¿Tu empresa opera infraestructura o presta servicios considerados esenciales (energía, telecomunicaciones, salud, financiero, agua, transporte)?",
    tipo: "boolean",
    capitulo: 2,
  },
  {
    id: "q_oiv_designado",
    texto: "¿Has sido notificado por la ANCI como Operador de Importancia Vital (OIV)?",
    tipo: "boolean",
    capitulo: 2,
  },
  {
    id: "q_incidentes_previos",
    texto: "¿Has sufrido incidentes de ciberseguridad (phishing, ransomware, filtración de datos) en los últimos 2 años?",
    tipo: "boolean",
    capitulo: 2,
  },
  {
    id: "q_politica_seguridad",
    texto: "¿Cuentas con una política formal de seguridad de la información?",
    tipo: "boolean",
    capitulo: 3,
  },
  {
    id: "q_plan_continuidad",
    texto: "¿Tienes un plan de continuidad operativa o respuesta a incidentes documentado?",
    tipo: "boolean",
    capitulo: 3,
  },
  {
    id: "q_capacitacion",
    texto: "¿El personal recibe capacitación periódica en ciberseguridad y protección de datos?",
    tipo: "boolean",
    capitulo: 3,
  },
  {
    id: "q_terceros_criticos",
    texto: "¿Dependes de proveedores externos críticos (cloud, pagos, CRM) para operar?",
    tipo: "boolean",
    capitulo: 3,
  },
];


const MATURITY_QUESTION_IDS = ["q_politica_seguridad", "q_plan_continuidad", "q_capacitacion"];

function getRespuesta(respuestas: RespuestaGRC[], id: string): string | number | boolean | undefined {
  return respuestas.find((r) => r.questionId === id)?.value;
}

// ─── Árbol de aplicabilidad ────────────────────────────────────

export function evaluarAplicabilidad(
  sector: SectorGRC,
  tamano: TamanoEmpresa,
  respuestas: RespuestaGRC[]
): AplicabilidadResult {
  const trataDatos = getRespuesta(respuestas, "q_trata_datos_personales") === true;
  const trataSensibles = getRespuesta(respuestas, "q_trata_datos_sensibles") === true;
  const esEncargado = getRespuesta(respuestas, "q_encargado_tratamiento") === true;
  const servicioEsencial = getRespuesta(respuestas, "q_servicio_esencial") === true;
  const oivDesignado = getRespuesta(respuestas, "q_oiv_designado") === true;

  const justificacion: string[] = [];

  // Ley 21.719 — Protección de Datos Personales
  let ley21719 = false;
  let rol21719: RolLey21719 = "no_aplica";
  if (trataDatos && esEncargado) {
    ley21719 = true;
    rol21719 = "ambos";
    justificacion.push(
      "Trata datos personales propios y además procesa datos por encargo de terceros — doble rol (responsable + encargado) bajo la Ley 21.719."
    );
  } else if (trataDatos) {
    ley21719 = true;
    rol21719 = "responsable";
    justificacion.push(
      trataSensibles
        ? "Trata datos personales sensibles (salud, biométricos u otros) — obligaciones reforzadas como responsable bajo la Ley 21.719."
        : "Recolecta o trata datos personales — sujeta a la Ley 21.719 como responsable de tratamiento."
    );
  } else if (esEncargado) {
    ley21719 = true;
    rol21719 = "encargado";
    justificacion.push("Procesa datos personales por encargo de terceros — sujeta a la Ley 21.719 como encargado de tratamiento.");
  }

  // Ley 21.663 — Marco de Ciberseguridad e Infraestructura Crítica
  const sectorRegulado = sector === "salud" || sector === "servicios_financieros";
  const empresaMediana = tamano === "51-200" || tamano === "200+";
  let ley21663 = false;
  if (oivDesignado) {
    ley21663 = true;
    justificacion.push("Designada por la ANCI como Operador de Importancia Vital (OIV) — sujeta directamente a la Ley 21.663.");
  } else if (servicioEsencial) {
    ley21663 = true;
    justificacion.push("Opera un servicio considerado esencial — potencialmente sujeta a la Ley 21.663 (confirmar categorización con ANCI).");
  } else if (sectorRegulado && empresaMediana) {
    ley21663 = true;
    justificacion.push(`Sector ${sector} + tamaño ${tamano} — probable alcance de la Ley 21.663, pendiente de confirmación caso a caso.`);
  }

  if (justificacion.length === 0) {
    justificacion.push(
      "Con las respuestas entregadas no se identifican obligaciones directas bajo la Ley 21.663 o la Ley 21.719 — se recomienda validar en la reunión de diagnóstico."
    );
  }

  return { ley21663, ley21719, rol21719, justificacion };
}

// ─── Score de madurez (0-100) ──────────────────────────────────

export function calcularScoreMadurez(respuestas: RespuestaGRC[]): number {
  const positivos = MATURITY_QUESTION_IDS.filter((id) => getRespuesta(respuestas, id) === true).length;
  const baseScore = (positivos / MATURITY_QUESTION_IDS.length) * 100;

  const tuvoIncidentes = getRespuesta(respuestas, "q_incidentes_previos") === true;
  const penalizacion = tuvoIncidentes ? 20 : 0;

  return Math.min(100, Math.max(0, Math.round(baseScore - penalizacion)));
}

// ─── Techos sancionatorios REALES según leyes chilenas ─

export const TECHOS_SANCIONATORIOS = {
  ley21663: {
    leve: { min: 0, max: 5_000, unidad: "UTM" },
    grave: { min: 5_001, max: 20_000, unidad: "UTM" },
    gravisima: { min: 20_001, max: 40_000, unidad: "UTM" },
  },
  ley21719: {
    leve: { min: 0, max: 2_000, unidad: "UTM" },
    grave: { min: 2_001, max: 10_000, unidad: "UTM" },
    gravisima: { min: 10_001, max: 20_000, unidad: "UTM" },
  },
} as const;

// Valor UTM en CLP (Unidad Tributaria Mensual)
// ⚠️ ACTUALIZAR MENSUALMENTE desde https://www.sii.cl/valores_y_fechas/utm/utm.htm
// Valor aproximado diciembre 2024: $67.000 CLP
const UTM_CLP = 67000;

/**
 * Calcula exposición económica basada en multas REALES de las leyes chilenas
 * (Ley 21.663 y Ley 21.719), expresadas en UTM y convertidas a CLP.
 * 
 * NO usa valores de activos inventados, solo los techos sancionatorios legales.
 */
export function calcularExposicionLegal(
  aplicabilidad: AplicabilidadResult,
  scoreMadurez: number
): { p10: number; p50: number; p90: number } {
  let multaMinUTM = 0;
  let multaMaxUTM = 0;

  // Sumar techos según leyes aplicables
  if (aplicabilidad.ley21663) {
    multaMaxUTM += TECHOS_SANCIONATORIOS.ley21663.gravisima.max; // 40,000 UTM
  }
  if (aplicabilidad.ley21719) {
    multaMaxUTM += TECHOS_SANCIONATORIOS.ley21719.gravisima.max; // 20,000 UTM
  }

  // Si ninguna ley aplica, exposición mínima
  if (multaMaxUTM === 0) {
    return { p10: 0, p50: 0, p90: 0 };
  }

  // Ajustar según score de madurez (a menor madurez, mayor probabilidad de multa alta)
  const factorRiesgo = 1 - (scoreMadurez / 100) * 0.7; // 0.3 - 1.0

  // Percentiles basados en severidad probable
  const p10UTM = multaMaxUTM * 0.05 * factorRiesgo;  // Escenario optimista
  const p50UTM = multaMaxUTM * 0.15 * factorRiesgo;  // Escenario medio
  const p90UTM = multaMaxUTM * 0.40 * factorRiesgo;  // Escenario pesimista

  return {
    p10: Math.round(p10UTM * UTM_CLP),
    p50: Math.round(p50UTM * UTM_CLP),
    p90: Math.round(p90UTM * UTM_CLP),
  };
}

// ─── Plantillas FAIR por sector (3 plantillas de lanzamiento) ─

const ASSET_VALUE_POR_TAMANO: Record<TamanoEmpresa, { min: number; mode: number; max: number }> = {
  "1-10": { min: 5_000_000, mode: 15_000_000, max: 40_000_000 },      // $5M - $40M CLP
  "11-50": { min: 20_000_000, mode: 60_000_000, max: 150_000_000 },   // $20M - $150M CLP
  "51-200": { min: 80_000_000, mode: 250_000_000, max: 600_000_000 }, // $80M - $600M CLP
  "200+": { min: 300_000_000, mode: 1_000_000_000, max: 3_000_000_000 }, // $300M - $3.000M CLP
};

const TEF_POR_SECTOR: Record<SectorGRC, { min: number; mode: number; max: number }> = {
  salud: { min: 1, mode: 3, max: 10 },
  servicios_financieros: { min: 1, mode: 4, max: 12 },
  comercio: { min: 0.5, mode: 2, max: 6 },
  otro: { min: 0.5, mode: 2, max: 6 },
};

const LOSS_FRACTION_POR_SECTOR: Record<SectorGRC, { min: number; mode: number; max: number }> = {
  salud: { min: 0.03, mode: 0.10, max: 0.25 },               // 3%-25% del valor del activo
  servicios_financieros: { min: 0.03, mode: 0.08, max: 0.20 }, // 3%-20%
  comercio: { min: 0.01, mode: 0.04, max: 0.12 },            // 1%-12%
  otro: { min: 0.01, mode: 0.05, max: 0.15 },                // 1%-15%
};

export interface EscenarioFAIRInput {
  tef: ThreatEventFrequency;
  vulnerability: Vulnerability;
  assetValue: AssetValue;
  lossEventImpact: LossEventImpact;
}

/**
 * Construye los 4 componentes FAIR (TEF, Vulnerability, AssetValue, LossEventImpact)
 * para un escenario indicativo, parametrizado por sector, tamaño y score de madurez.
 * Los rangos son órdenes de magnitud (deliberadamente amplios) — se calibran con datos
 * reales del cliente en la reunión de diagnóstico, no en esta pantalla.
 */
export function construirEscenarioFAIR(
  scenarioId: string,
  sector: SectorGRC,
  tamano: TamanoEmpresa,
  scoreMadurez: number
): EscenarioFAIRInput {
  const tefParams = TEF_POR_SECTOR[sector];
  const assetParams = ASSET_VALUE_POR_TAMANO[tamano];
  const lossParams = LOSS_FRACTION_POR_SECTOR[sector];

  // A mayor madurez, menor probabilidad de que la amenaza se concrete en pérdida.
  const vulnMode = Math.min(0.85, Math.max(0.15, 0.75 - (scoreMadurez / 100) * 0.55));
  const vulnMin = Math.max(0, vulnMode - 0.15);
  const vulnMax = Math.min(1, vulnMode + 0.15);

  const tef: ThreatEventFrequency = {
    id: crypto.randomUUID(),
    scenarioId,
    name: "Frecuencia de eventos de amenaza",
    description: `Estimación indicativa de eventos de amenaza al año para sector ${sector}.`,
    distributionType: "triangular",
    parameters: tefParams,
    unitLabel: "eventos/año",
    notes: "Plantilla de lanzamiento — calibrar con datos reales del cliente en la reunión de diagnóstico.",
  };

  const vulnerability: Vulnerability = {
    id: crypto.randomUUID(),
    scenarioId,
    name: "Vulnerabilidad (probabilidad de éxito de la amenaza)",
    description: `Ajustada por score de madurez declarado (${scoreMadurez}/100).`,
    distributionType: "triangular",
    parameters: { min: vulnMin, mode: vulnMode, max: vulnMax },
    unitLabel: "probabilidad (0-1)",
    relatedControls: [],
    notes: "Derivada del cuestionario de madurez — indicativa, no un pentest.",
  };

  const assetValue: AssetValue = {
    id: crypto.randomUUID(),
    scenarioId,
    name: "Valor en riesgo",
    description: `Estimación de ingresos/valor operativo anual para tamaño ${tamano}.`,
    distributionType: "triangular",
    parameters: assetParams,
    unitLabel: "CLP",
    valuationBasis: "revenue_impact",
    notes: "Basado en rango de tamaño de empresa declarado — no reemplaza una valorización de activos.",
  };

  const lossEventImpact: LossEventImpact = {
    id: crypto.randomUUID(),
    scenarioId,
    name: "Magnitud de pérdida",
    description: "Fracción estimada del valor en riesgo perdida por evento (multas, interrupción, reputación).",
    distributionType: "triangular",
    parameters: lossParams,
    unitLabel: "fracción del valor en riesgo (0-1)",
    impactComponents: [
      {
        type: "other",
        description: "Estimación agregada: multas regulatorias + interrupción operativa + daño reputacional.",
        estimatedImpact: 1,
      },
    ],
    notes: "Modo simple (fracción del asset value) — suficiente para el teaser del funnel, no para un informe pericial.",
  };

  return { tef, vulnerability, assetValue, lossEventImpact };
}
