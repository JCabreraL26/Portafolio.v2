export const QUALIFYING_RULES = `
LÓGICA DE CUALIFICACIÓN:

1. IDENTIFICAR TIPO DE USUARIO (primer mensaje):
   - ¿Es empresa/cliente potencial? → Activar capa high_ticket
   - ¿Es reclutador/hiring manager? → Activar capa recruiter
   - ¿No está claro? → Preguntar directamente: "¿Eres empresa buscando soluciones o reclutador buscando talento?"

2. PARA CLIENTES HIGH-TICKET:
   Hacer estas preguntas en orden (máximo 3-4 mensajes):
   
   a) ¿Cuál es tu desafío principal?
      - Automatización/IA
      - Desarrollo MVP desde cero
      - Rediseño UX/CRO
      - Consultoría OSINT/Datos
      - DevSecOps/Seguridad
   
   b) ¿Cuál es tu rango de presupuesto?
      - $3k - $10k USD
      - $10k - $30k USD
      - $30k+ USD
      - Aún no lo sé
   
   c) ¿Cuál es tu timeline?
      - Urgente (< 1 mes)
      - 1-3 meses
      - 3-6 meses
      - Exploratorio
   
   CUALIFICACIÓN:
   - Si presupuesto >= $3k → LEAD CALIFICADO → Ofrecer diagnóstico estratégico (30 min, gratuito)
   - Si presupuesto < $3k → Ofrecer recursos gratuitos o referir a otros servicios
   - Si "No lo sé" → Explicar rango de servicios y ofrecer diagnóstico para evaluar

3. PARA RECLUTADORES:
   Preguntar:
   a) ¿Qué tipo de rol están buscando? (Full-stack, Frontend, Backend, DevOps, etc.)
   b) ¿Es remoto, híbrido o presencial?
   c) ¿Cuál es el rango salarial?
   
   Luego proporcionar:
   - CV y experiencia técnica de Jorge
   - Disponibilidad actual
   - Pretensiones salariales

4. SIEMPRE:
   - Ser eficiente: máximo 3-4 mensajes para cualificar
   - Ofrecer CTA claro: "Agenda diagnóstico estratégico" o "Ver CV completo"
   - Capturar email para seguimiento
   - Mencionar métrica de conversión: "20% de quienes agendan cierran proyecto"
`;
