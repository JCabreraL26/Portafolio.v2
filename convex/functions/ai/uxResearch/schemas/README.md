# 🎨 UX Research Schemas

## Descripción

Este módulo contiene los schemas de validación TypeScript para el sistema multi-agente de UX Research. Los schemas garantizan type-safety y validación de datos similar a Pydantic AI en Python.

## Archivos

### `designThinking.ts`

Schemas principales para las 5 fases del Design Thinking:

1. **UserPersonaSchema** - User Personas
2. **EmpathyPhaseSchema** - Fase de Empatía
3. **ProblemDefinitionSchema** - Definición del Problema
4. **IdeationPhaseSchema** - Ideación
5. **PrototypePhaseSchema** - Prototipado
6. **TestingPhaseSchema** - Testing
7. **DesignThinkingReportSchema** - Informe completo
8. **WorkflowExecutionSchema** - Tracking de workflows

## Validadores

### `validateUserPersona(persona)`
Valida que un User Persona tenga todos los campos requeridos.

**Ejemplo:**
```typescript
const persona = {
  nombre: "Carlos el Conserje",
  edad_rango: "35-50",
  ocupacion: "Conserje de edificio",
  objetivos: ["Registrar visitas rápido"],
  pain_points: ["Cuadernos lentos"],
  tech_savviness: "medio"
};

if (validateUserPersona(persona)) {
  console.log("✅ Persona válido");
}
```

### `validateEmpathyPhase(empathy)`
Valida que la fase de empatía esté completa (mínimo 2 personas, insights, etc.).

### `validateProblemDefinition(definition)`
Valida que el problema esté bien definido (POV statement > 20 chars, mínimo 3 HMW).

### `calculateReportQualityScore(report)`
Calcula un score de calidad de 0-1 para un informe completo.

**Criterios:**
- Empatía: 25%
- Definición: 25%
- Ideación: 20%
- Prototipado: 15%
- Testing: 15%

### `generateReportFeedback(report)`
Genera feedback accionable para mejorar un informe.

**Retorna:** Array de strings con sugerencias.

## Uso en Agentes

```typescript
import { 
  validateEmpathyPhase,
  calculateReportQualityScore,
  generateReportFeedback 
} from "./schemas/designThinking";

// En el agente evaluador
const qualityScore = calculateReportQualityScore(report);
const feedback = generateReportFeedback(report);

if (qualityScore >= 0.8) {
  // Aprobar informe
} else {
  // Enviar feedback al facilitador para revisión
}
```

## Integración con Convex

Los schemas están sincronizados con las tablas de Convex:
- `user_personas`
- `informes_ux`
- `workflow_executions`

## Testing

Para validar schemas:

```bash
# Ejecutar tests de validación
npm run test:schemas
```

## Próximos Pasos

- [ ] Agregar schemas para herramientas MCP
- [ ] Crear validators para cada fase individual
- [ ] Implementar serialización/deserialización JSON
- [ ] Agregar ejemplos de datos de prueba
