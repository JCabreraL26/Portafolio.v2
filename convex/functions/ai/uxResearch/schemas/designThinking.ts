import { v } from "convex/values";

// ========================================
// 🎨 SCHEMAS DE VALIDACIÓN UX RESEARCH
// ========================================
// Schemas TypeScript para validación tipo Pydantic
// Usados por los agentes para garantizar type-safety

/**
 * Schema de User Persona
 * Representa un usuario tipo identificado en la investigación
 */
export const UserPersonaSchema = {
  nombre: v.string(),
  edad_rango: v.string(),
  ocupacion: v.string(),
  objetivos: v.array(v.string()),
  pain_points: v.array(v.string()),
  tech_savviness: v.union(
    v.literal("bajo"),
    v.literal("medio"),
    v.literal("alto")
  ),
};

/**
 * Schema de Fase de Empatía
 * Primera fase del Design Thinking
 */
export const EmpathyPhaseSchema = {
  user_personas: v.array(v.any()), // Array de UserPersona
  key_insights: v.array(v.string()),
  empathy_map: v.any(), // { piensa: [], siente: [], dice: [], hace: [] }
  research_methods: v.array(v.string()),
};

/**
 * Schema de Definición del Problema
 * Segunda fase del Design Thinking
 */
export const ProblemDefinitionSchema = {
  problem_statement: v.string(), // POV statement
  how_might_we: v.array(v.string()), // Preguntas HMW
  user_needs: v.array(v.string()),
  constraints: v.array(v.string()),
};

/**
 * Schema de Fase de Ideación
 * Tercera fase del Design Thinking
 */
export const IdeationPhaseSchema = {
  ideas: v.array(v.any()), // [{ idea: string, score: number, viabilidad: string }]
  selected_concepts: v.array(v.string()),
  ideation_techniques: v.array(v.string()),
};

/**
 * Schema de Fase de Prototipado
 * Cuarta fase del Design Thinking
 */
export const PrototypePhaseSchema = {
  prototype_type: v.string(), // "low-fi", "mid-fi", "high-fi"
  prototype_url: v.optional(v.string()),
  key_features: v.array(v.string()),
  assumptions_to_test: v.array(v.string()),
};

/**
 * Schema de Fase de Testing
 * Quinta fase del Design Thinking
 */
export const TestingPhaseSchema = {
  test_participants: v.number(),
  test_method: v.string(),
  findings: v.array(v.any()), // [{ finding: string, severity: "low"|"medium"|"high" }]
  iterations_needed: v.array(v.string()),
};

/**
 * Schema completo de Informe de Design Thinking
 * Combina todas las 5 fases
 */
export const DesignThinkingReportSchema = {
  proyecto_id: v.string(),
  proyecto_nombre: v.string(),
  proyecto_descripcion: v.string(),
  
  // Fase 1: Empatía
  empathy_personas: v.array(v.string()),
  empathy_insights: v.array(v.string()),
  empathy_map: v.any(),
  empathy_methods: v.array(v.string()),
  
  // Fase 2: Definición
  problem_statement: v.string(),
  how_might_we: v.array(v.string()),
  user_needs: v.array(v.string()),
  constraints: v.array(v.string()),
  
  // Fase 3: Ideación
  ideas: v.array(v.any()),
  selected_concepts: v.array(v.string()),
  ideation_techniques: v.array(v.string()),
  
  // Fase 4: Prototipado
  prototype_type: v.string(),
  prototype_url: v.optional(v.string()),
  key_features: v.array(v.string()),
  assumptions_to_test: v.array(v.string()),
  
  // Fase 5: Testing
  test_participants: v.number(),
  test_method: v.string(),
  findings: v.array(v.any()),
  iterations_needed: v.array(v.string()),
  
  // Metadata
  next_steps: v.array(v.string()),
  confidence_score: v.number(), // 0-1
  iteration_count: v.number(),
  approved_by_evaluator: v.boolean(),
  generated_by: v.string(),
};

/**
 * Schema de Ejecución de Workflow
 * Para tracking y debugging de workflows multi-agente
 */
export const WorkflowExecutionSchema = {
  workflow_type: v.string(),
  proyecto_id: v.string(),
  estado: v.union(
    v.literal("running"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("cancelled")
  ),
  current_step: v.string(),
  iteration_count: v.number(),
  max_iterations: v.number(),
  research_data: v.optional(v.string()),
  draft_report: v.optional(v.any()),
  evaluation_feedback: v.optional(v.array(v.string())),
  started_at: v.number(),
  completed_at: v.optional(v.number()),
  duration_ms: v.optional(v.number()),
  triggered_by: v.string(),
  error_message: v.optional(v.string()),
};

// ========================================
// 🔍 VALIDADORES Y HELPERS
// ========================================

/**
 * Valida que un User Persona tenga todos los campos requeridos
 */
export function validateUserPersona(persona: any): boolean {
  return !!(
    persona.nombre &&
    persona.edad_rango &&
    persona.ocupacion &&
    Array.isArray(persona.objetivos) &&
    persona.objetivos.length > 0 &&
    Array.isArray(persona.pain_points) &&
    persona.pain_points.length > 0 &&
    ["bajo", "medio", "alto"].includes(persona.tech_savviness)
  );
}

/**
 * Valida que la fase de empatía esté completa
 */
export function validateEmpathyPhase(empathy: any): boolean {
  return !!(
    Array.isArray(empathy.user_personas) &&
    empathy.user_personas.length >= 2 && // Mínimo 2 personas
    empathy.user_personas.length <= 5 && // Máximo 5 personas
    Array.isArray(empathy.key_insights) &&
    empathy.key_insights.length > 0 &&
    empathy.empathy_map &&
    Array.isArray(empathy.research_methods) &&
    empathy.research_methods.length > 0
  );
}

/**
 * Valida que el problema esté bien definido
 */
export function validateProblemDefinition(definition: any): boolean {
  return !!(
    definition.problem_statement &&
    definition.problem_statement.length > 20 && // Mínimo 20 caracteres
    Array.isArray(definition.how_might_we) &&
    definition.how_might_we.length >= 3 && // Mínimo 3 preguntas HMW
    Array.isArray(definition.user_needs) &&
    definition.user_needs.length > 0 &&
    Array.isArray(definition.constraints)
  );
}

/**
 * Calcula score de calidad de un informe completo
 */
export function calculateReportQualityScore(report: any): number {
  let score = 0;
  let maxScore = 0;

  // Empatía (25%)
  maxScore += 25;
  if (validateEmpathyPhase(report)) score += 25;
  else if (report.empathy_personas?.length > 0) score += 15;

  // Definición (25%)
  maxScore += 25;
  if (validateProblemDefinition(report)) score += 25;
  else if (report.problem_statement) score += 15;

  // Ideación (20%)
  maxScore += 20;
  if (report.ideas?.length >= 5) score += 20;
  else if (report.ideas?.length > 0) score += 10;

  // Prototipado (15%)
  maxScore += 15;
  if (report.prototype_type && report.key_features?.length > 0) score += 15;
  else if (report.prototype_type) score += 8;

  // Testing (15%)
  maxScore += 15;
  if (report.test_participants >= 3 && report.findings?.length > 0) score += 15;
  else if (report.test_participants > 0) score += 8;

  return score / maxScore; // Retorna 0-1
}

/**
 * Genera feedback para mejorar un informe
 */
export function generateReportFeedback(report: any): string[] {
  const feedback: string[] = [];

  // Validar empatía
  if (!report.empathy_personas || report.empathy_personas.length < 2) {
    feedback.push("❌ Necesitas al menos 2 User Personas");
  }
  if (!report.empathy_insights || report.empathy_insights.length === 0) {
    feedback.push("❌ Falta agregar Key Insights de la investigación");
  }

  // Validar definición
  if (!report.problem_statement || report.problem_statement.length < 20) {
    feedback.push("❌ El Problem Statement es muy corto o falta");
  }
  if (!report.how_might_we || report.how_might_we.length < 3) {
    feedback.push("❌ Necesitas al menos 3 preguntas 'How Might We'");
  }

  // Validar ideación
  if (!report.ideas || report.ideas.length < 5) {
    feedback.push("⚠️ Idealmente deberías tener al menos 5 ideas generadas");
  }

  // Validar prototipado
  if (!report.prototype_type) {
    feedback.push("❌ Falta definir el tipo de prototipo (low-fi/mid-fi/high-fi)");
  }

  // Validar testing
  if (!report.test_participants || report.test_participants < 3) {
    feedback.push("⚠️ Se recomienda al menos 3 participantes para testing");
  }

  if (feedback.length === 0) {
    feedback.push("✅ Informe completo y de buena calidad");
  }

  return feedback;
}
