# 🤖 Arquitectura: Bot de Telegram → Equipo de Investigadores UX

## 📋 Documento de Implementación por Fases Incrementales

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Objetivo:** Transformar bot de Telegram en un equipo multi-agente de investigadores UX usando arquitectura agentic moderna

---

## 🎯 Visión General

### Problema a Resolver
Convertir un bot de Telegram tradicional en un sistema multi-agente inteligente capaz de:
- Realizar investigación UX completa (Design Thinking)
- Generar informes estructurados y validados
- Mantener memoria de largo plazo de proyectos
- Proporcionar interfaces visuales interactivas
- Trabajar de forma autónoma con supervisión humana

### Stack Tecnológico Propuesto

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **LLM Orchestration** | Pydantic AI + Gemini | Validación type-safe y generación de contenido |
| **Multi-Agent Framework** | LangGraph | Orquestación de flujos multi-agente con reflexión |
| **Context Protocol** | MCP (Model Context Protocol) | Acceso a archivos locales y herramientas externas |
| **Memory Layer** | Zep + Convex | Memoria conversacional + Vector store para RAG |
| **Interface** | Telegram Bot API | Input del usuario |
| **Generative UI** | Vercel AI SDK + Astro/Next.js | Dashboards interactivos |
| **Backend** | Python (FastAPI) + Node.js | API Routes y webhooks |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     TELEGRAM INTERFACE                       │
│                    (User Input/Output)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   WEBHOOK HANDLER                            │
│              (Next.js API Route / FastAPI)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  LANGGRAPH ORCHESTRATOR                      │
│                  (Multi-Agent Workflow)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Agente      │→ │  Agente      │→ │  Agente      │      │
│  │ Investigador │  │ Facilitador  │  │  Evaluador   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│     MCP      │ │   ZEP    │ │    CONVEX    │
│   Server     │ │ Memory   │ │ Vector Store │
│ (Tools/RAG)  │ │  Graph   │ │     RAG      │
└──────────────┘ └──────────┘ └──────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│        PYDANTIC AI SCHEMAS                  │
│   (Type-safe Report Structures)             │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│     GENERATIVE UI (Vercel AI SDK)           │
│   Astro/Next.js Dashboard Components        │
└─────────────────────────────────────────────┘
```

---

## 📊 Evaluación de Viabilidad Técnica

### ✅ Fortalezas de la Arquitectura Propuesta

1. **Type Safety End-to-End**
   - Pydantic AI garantiza validación de datos estructurados
   - Reduce errores de parsing y "alucinaciones" del LLM
   - Facilita testing y debugging

2. **Escalabilidad Multi-Agente**
   - LangGraph permite flujos complejos con reflexión
   - Patrón de "pensar-actuar-corregir" mejora calidad
   - Fácil agregar nuevos agentes especializados

3. **Memoria Persistente**
   - Zep: Memoria conversacional con grafos de conocimiento
   - Convex: Vector store integrado para RAG semántico
   - Reduce latencia y costos de tokens

4. **Extensibilidad**
   - MCP permite agregar herramientas custom
   - Integración con APIs externas (Figma, Miro, etc.)
   - Modular y desacoplado

### ⚠️ Desafíos y Consideraciones

1. **Complejidad de Integración**
   - Stack multi-lenguaje (Python + Node.js)
   - Requiere orquestación cuidadosa de servicios
   - Curva de aprendizaje para LangGraph

2. **Latencia**
   - Múltiples llamadas LLM en cadena
   - Necesario optimizar con streaming y caché
   - Considerar timeouts de Telegram (60s)

3. **Costos**
   - Gemini API calls pueden acumularse
   - Convex tiene límites en plan gratuito
   - Considerar rate limiting

4. **Seguridad**
   - Prompt injection en inputs de usuario
   - Validación de herramientas MCP
   - Sanitización de datos antes de almacenar

### 🎯 Veredicto: **VIABLE CON IMPLEMENTACIÓN INCREMENTAL**

La arquitectura es sólida y moderna, pero requiere implementación por fases para:
- Validar cada componente antes de integrar
- Minimizar riesgos técnicos
- Permitir iteración basada en feedback

---

## 🚀 Plan de Implementación por Fases

### **FASE 0: Preparación y Setup (Semana 1)**

#### Objetivos
- Configurar entorno de desarrollo
- Definir estructura de proyecto
- Establecer CI/CD básico

#### Tareas
1. **Estructura de Carpetas**
   ```
   ux-research-bot/
   ├── backend/
   │   ├── python/              # FastAPI + LangGraph + Pydantic AI
   │   │   ├── agents/          # Agentes individuales
   │   │   ├── schemas/         # Modelos Pydantic
   │   │   ├── tools/           # MCP tools
   │   │   ├── workflows/       # LangGraph workflows
   │   │   └── main.py
   │   └── node/                # Next.js API Routes
   │       ├── api/
   │       │   └── telegram/    # Webhook handler
   │       └── lib/
   ├── frontend/
   │   └── dashboard/           # Astro/Next.js UI
   │       ├── components/
   │       └── pages/
   ├── mcp-server/              # MCP Server custom
   │   └── tools/
   ├── docs/
   └── tests/
   ```

2. **Dependencias Core**
   ```python
   # Python (pyproject.toml)
   pydantic-ai = "^0.0.13"
   langgraph = "^0.2.0"
   google-generativeai = "^0.8.0"
   fastapi = "^0.115.0"
   zep-cloud = "^2.0.0"
   convex = "^0.1.0"
   python-telegram-bot = "^21.0"
   ```

   ```json
   // Node.js (package.json)
   {
     "dependencies": {
       "@ai-sdk/google": "^1.0.0",
       "ai": "^4.0.0",
       "convex": "^1.17.0",
       "next": "^15.0.0",
       "astro": "^5.0.0"
     }
   }
   ```

3. **Variables de Entorno**
   ```env
   # .env.example
   GEMINI_API_KEY=
   TELEGRAM_BOT_TOKEN=
   TELEGRAM_WEBHOOK_SECRET=
   CONVEX_DEPLOYMENT=
   ZEP_API_KEY=
   VERCEL_URL=
   NODE_ENV=development
   ```

#### Entregables
- ✅ Repositorio configurado
- ✅ Docker Compose para desarrollo local
- ✅ CI/CD pipeline básico (GitHub Actions)

---

### **FASE 1: Estructura de Datos y "Cerebro" (Semana 2-3)**

#### Objetivos
- Definir esquemas Pydantic para informes UX
- Integrar Gemini con validación type-safe
- Crear primer agente básico

#### Tareas

1. **Definir Esquemas Pydantic**

```python
# backend/python/schemas/design_thinking.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserPersona(BaseModel):
    """Representa un User Persona identificado"""
    name: str = Field(description="Nombre del persona")
    age_range: str = Field(description="Rango de edad (ej: 25-35)")
    occupation: str = Field(description="Ocupación principal")
    goals: List[str] = Field(description="Objetivos principales")
    pain_points: List[str] = Field(description="Puntos de dolor")
    tech_savviness: str = Field(description="Nivel tecnológico: bajo/medio/alto")

class EmpathyPhase(BaseModel):
    """Fase de Empatía del Design Thinking"""
    user_personas: List[UserPersona] = Field(min_length=1, max_length=5)
    key_insights: List[str] = Field(description="Insights clave de la investigación")
    empathy_map: dict = Field(description="Mapa de empatía (piensa/siente/dice/hace)")
    research_methods: List[str] = Field(description="Métodos usados: entrevistas, observación, etc.")

class ProblemDefinition(BaseModel):
    """Fase de Definición del Problema"""
    problem_statement: str = Field(description="Declaración del problema (POV)")
    how_might_we: List[str] = Field(description="Preguntas HMW generadas", min_length=3)
    user_needs: List[str] = Field(description="Necesidades del usuario identificadas")
    constraints: List[str] = Field(description="Restricciones técnicas/negocio")

class IdeationPhase(BaseModel):
    """Fase de Ideación"""
    ideas: List[dict] = Field(description="Ideas generadas con score de viabilidad")
    selected_concepts: List[str] = Field(description="Conceptos seleccionados para prototipar")
    ideation_techniques: List[str] = Field(description="Técnicas usadas: brainstorming, SCAMPER, etc.")

class PrototypePhase(BaseModel):
    """Fase de Prototipado"""
    prototype_type: str = Field(description="Tipo: low-fi/mid-fi/high-fi")
    prototype_url: Optional[str] = Field(description="URL del prototipo (Figma, etc.)")
    key_features: List[str] = Field(description="Features principales del prototipo")
    assumptions_to_test: List[str] = Field(description="Hipótesis a validar")

class TestingPhase(BaseModel):
    """Fase de Testing"""
    test_participants: int = Field(ge=3, description="Número de participantes")
    test_method: str = Field(description="Método: usability testing, A/B, etc.")
    findings: List[dict] = Field(description="Hallazgos con severidad")
    iterations_needed: List[str] = Field(description="Iteraciones recomendadas")

class DesignThinkingReport(BaseModel):
    """Informe completo de Design Thinking"""
    project_name: str
    project_description: str
    created_at: datetime = Field(default_factory=datetime.now)
    
    empathy: EmpathyPhase
    definition: ProblemDefinition
    ideation: IdeationPhase
    prototype: PrototypePhase
    testing: TestingPhase
    
    next_steps: List[str] = Field(description="Próximos pasos recomendados")
    confidence_score: float = Field(ge=0.0, le=1.0, description="Confianza del agente en el informe")
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_name": "App de Gestión de Conserjería",
                "project_description": "Sistema QR para edificios residenciales",
                "empathy": {
                    "user_personas": [
                        {
                            "name": "Carlos el Conserje",
                            "age_range": "35-50",
                            "occupation": "Conserje de edificio",
                            "goals": ["Registrar visitas rápido", "Evitar errores"],
                            "pain_points": ["Cuadernos lentos", "Letra ilegible"],
                            "tech_savviness": "medio"
                        }
                    ],
                    "key_insights": ["85% del tiempo se pierde en escritura manual"],
                    "empathy_map": {},
                    "research_methods": ["Entrevistas", "Observación contextual"]
                }
            }
        }
```

2. **Integrar Pydantic AI con Gemini**

```python
# backend/python/agents/base_agent.py
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
import os

# Configurar modelo Gemini
gemini_model = GeminiModel(
    model_name='gemini-2.0-flash-exp',
    api_key=os.getenv('GEMINI_API_KEY')
)

# Crear agente base con validación
base_agent = Agent(
    model=gemini_model,
    system_prompt="""Eres un investigador UX senior experto en Design Thinking.
    Tu objetivo es generar informes estructurados, precisos y accionables.
    Siempre valida tus respuestas contra el esquema Pydantic proporcionado.
    Si falta información, pregunta al usuario antes de asumir."""
)
```

3. **Primer Agente: Generador de Empatía**

```python
# backend/python/agents/empathy_agent.py
from pydantic_ai import Agent
from schemas.design_thinking import EmpathyPhase, UserPersona
from typing import List

empathy_agent = Agent(
    model=gemini_model,
    result_type=EmpathyPhase,
    system_prompt="""Eres un experto en investigación de usuarios.
    Genera User Personas detallados basándote en la información proporcionada.
    Crea mapas de empatía completos y extrae insights accionables."""
)

async def generate_empathy_phase(project_context: str, research_data: str) -> EmpathyPhase:
    """
    Genera la fase de empatía del Design Thinking
    
    Args:
        project_context: Descripción del proyecto
        research_data: Datos de investigación (entrevistas, observaciones)
    
    Returns:
        EmpathyPhase validado por Pydantic
    """
    result = await empathy_agent.run(
        f"""Proyecto: {project_context}
        
        Datos de investigación:
        {research_data}
        
        Genera un análisis completo de la fase de empatía con:
        - User Personas (mínimo 2, máximo 5)
        - Key insights accionables
        - Mapa de empatía
        - Métodos de investigación utilizados
        """
    )
    
    return result.data
```

#### Testing

```python
# tests/test_empathy_agent.py
import pytest
from agents.empathy_agent import generate_empathy_phase

@pytest.mark.asyncio
async def test_empathy_generation():
    project = "App de gestión de conserjería"
    research = """
    Entrevista 1: Conserje menciona que pierde 2 horas diarias escribiendo en cuaderno.
    Entrevista 2: Administrador no puede generar reportes de visitas.
    Observación: 30% de registros tienen errores de escritura.
    """
    
    result = await generate_empathy_phase(project, research)
    
    assert len(result.user_personas) >= 2
    assert len(result.key_insights) > 0
    assert "entrevistas" in [m.lower() for m in result.research_methods]
```

#### Entregables
- ✅ Esquemas Pydantic completos para Design Thinking
- ✅ Agente de Empatía funcional con validación
- ✅ Tests unitarios pasando
- ✅ Documentación de esquemas

---

### **FASE 2: Conectividad y Herramientas (Semana 4-5)**

#### Objetivos
- Configurar webhook de Telegram
- Implementar servidor MCP con herramientas básicas
- Conectar bot con primer agente

#### Tareas

1. **Telegram Webhook Handler**

```typescript
// backend/node/api/telegram/webhook.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // Validar webhook secret
  const signature = req.headers.get('x-telegram-bot-api-secret-token');
  if (signature !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const update = await req.json();
  
  // Extraer mensaje
  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text;

  // Enviar a procesador Python
  const response = await fetch('http://localhost:8000/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  return NextResponse.json({ ok: true });
}
```

2. **MCP Server con Herramientas UX**

```python
# mcp-server/tools/ux_tools.py
from mcp.server import Server
from mcp.types import Tool, TextContent
import httpx

app = Server("ux-research-tools")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="buscar_tendencias_ux",
            description="Busca tendencias UX actuales en la web",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Término de búsqueda"},
                    "year": {"type": "integer", "description": "Año de tendencias"}
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="leer_guia_estilo",
            description="Lee guías de estilo de proyectos locales",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_name": {"type": "string"}
                },
                "required": ["project_name"]
            }
        ),
        Tool(
            name="analizar_competencia",
            description="Analiza apps competidoras en tiendas",
            inputSchema={
                "type": "object",
                "properties": {
                    "app_name": {"type": "string"},
                    "platform": {"type": "string", "enum": ["ios", "android", "web"]}
                },
                "required": ["app_name", "platform"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "buscar_tendencias_ux":
        # Implementar búsqueda web (Google Custom Search API)
        query = arguments["query"]
        year = arguments.get("year", 2026)
        
        async with httpx.AsyncClient() as client:
            # Ejemplo: búsqueda en Dribbble, Behance, etc.
            results = await search_design_trends(client, query, year)
        
        return [TextContent(
            type="text",
            text=f"Tendencias encontradas para '{query}' en {year}:\n{results}"
        )]
    
    elif name == "leer_guia_estilo":
        project = arguments["project_name"]
        # Leer archivo local de guía de estilo
        style_guide = read_local_style_guide(project)
        return [TextContent(type="text", text=style_guide)]
    
    elif name == "analizar_competencia":
        app = arguments["app_name"]
        platform = arguments["platform"]
        # Scraping de reviews y features
        analysis = await analyze_competitor_app(app, platform)
        return [TextContent(type="text", text=analysis)]

async def search_design_trends(client, query, year):
    # Implementación real con APIs
    return f"Mock: Tendencias de {query} en {year}"

def read_local_style_guide(project):
    # Leer de filesystem
    return f"Mock: Guía de estilo de {project}"

async def analyze_competitor_app(app, platform):
    return f"Mock: Análisis de {app} en {platform}"
```

3. **Integrar MCP con Agente**

```python
# backend/python/agents/researcher_agent.py
from pydantic_ai import Agent, RunContext
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

researcher_agent = Agent(
    model=gemini_model,
    system_prompt="""Eres un investigador UX que puede usar herramientas externas.
    Usa las herramientas disponibles para recopilar información antes de generar informes."""
)

@researcher_agent.tool
async def buscar_tendencias(ctx: RunContext[str], query: str) -> str:
    """Busca tendencias UX actuales"""
    # Conectar a MCP server
    server_params = StdioServerParameters(
        command="python",
        args=["mcp-server/tools/ux_tools.py"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            result = await session.call_tool(
                "buscar_tendencias_ux",
                arguments={"query": query, "year": 2026}
            )
            
            return result.content[0].text

# Uso
async def research_with_tools(topic: str):
    result = await researcher_agent.run(
        f"Investiga sobre: {topic}. Usa las herramientas disponibles."
    )
    return result.data
```

#### Entregables
- ✅ Webhook de Telegram funcional
- ✅ MCP Server con 3 herramientas UX
- ✅ Integración MCP + Pydantic AI
- ✅ Bot responde a mensajes básicos

---

### **FASE 3: Orquestación Multi-Agente (Semana 6-8)**

#### Objetivos
- Implementar flujo LangGraph con 3 agentes
- Patrón de reflexión (pensar-actuar-corregir)
- Sistema de evaluación de calidad

#### Tareas

1. **Definir Grafo de Estados**

```python
# backend/python/workflows/design_thinking_workflow.py
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from schemas.design_thinking import DesignThinkingReport
import operator

class WorkflowState(TypedDict):
    """Estado compartido entre agentes"""
    project_context: str
    research_data: str
    current_phase: str
    report_draft: dict
    evaluation_feedback: list[str]
    iteration_count: int
    max_iterations: int
    final_report: DesignThinkingReport | None

# Crear grafo
workflow = StateGraph(WorkflowState)

# Nodos del grafo
async def researcher_node(state: WorkflowState) -> WorkflowState:
    """Agente Investigador: Recopila datos vía MCP"""
    from agents.researcher_agent import research_with_tools
    
    additional_data = await research_with_tools(state["project_context"])
    state["research_data"] += f"\n\nDatos adicionales:\n{additional_data}"
    state["current_phase"] = "research_complete"
    
    return state

async def facilitator_node(state: WorkflowState) -> WorkflowState:
    """Agente Facilitador: Genera borrador del informe"""
    from agents.empathy_agent import generate_empathy_phase
    from agents.definition_agent import generate_definition_phase
    # ... otros agentes de fases
    
    # Generar cada fase del Design Thinking
    empathy = await generate_empathy_phase(
        state["project_context"],
        state["research_data"]
    )
    
    definition = await generate_definition_phase(
        state["project_context"],
        empathy
    )
    
    # ... generar otras fases
    
    state["report_draft"] = {
        "empathy": empathy.model_dump(),
        "definition": definition.model_dump(),
        # ...
    }
    state["current_phase"] = "draft_complete"
    
    return state

async def evaluator_node(state: WorkflowState) -> WorkflowState:
    """Agente Evaluador: Revisa calidad del informe"""
    from agents.evaluator_agent import evaluate_report
    
    evaluation = await evaluate_report(state["report_draft"])
    
    if evaluation["quality_score"] >= 0.8:
        # Informe aprobado
        state["final_report"] = DesignThinkingReport(**state["report_draft"])
        state["current_phase"] = "approved"
    else:
        # Requiere correcciones
        state["evaluation_feedback"] = evaluation["feedback"]
        state["iteration_count"] += 1
        state["current_phase"] = "needs_revision"
    
    return state

async def revision_node(state: WorkflowState) -> WorkflowState:
    """Aplica correcciones basadas en feedback"""
    from agents.facilitator_agent import revise_report
    
    revised_draft = await revise_report(
        state["report_draft"],
        state["evaluation_feedback"]
    )
    
    state["report_draft"] = revised_draft
    state["current_phase"] = "draft_complete"
    
    return state

# Agregar nodos al grafo
workflow.add_node("researcher", researcher_node)
workflow.add_node("facilitator", facilitator_node)
workflow.add_node("evaluator", evaluator_node)
workflow.add_node("revision", revision_node)

# Definir edges (flujo)
workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "facilitator")
workflow.add_edge("facilitator", "evaluator")

# Lógica condicional: aprobar o revisar
def should_continue(state: WorkflowState) -> str:
    if state["current_phase"] == "approved":
        return "end"
    elif state["iteration_count"] >= state["max_iterations"]:
        return "end"  # Forzar fin después de N iteraciones
    else:
        return "revision"

workflow.add_conditional_edges(
    "evaluator",
    should_continue,
    {
        "revision": "revision",
        "end": END
    }
)

workflow.add_edge("revision", "facilitator")

# Compilar grafo
app = workflow.compile()
```

2. **Agente Evaluador con Criterios**

```python
# backend/python/agents/evaluator_agent.py
from pydantic import BaseModel
from typing import List

class EvaluationCriteria(BaseModel):
    completeness: float  # 0-1: ¿Todas las secciones completas?
    depth: float  # 0-1: ¿Suficiente profundidad en análisis?
    actionability: float  # 0-1: ¿Insights accionables?
    coherence: float  # 0-1: ¿Coherencia entre fases?

class EvaluationResult(BaseModel):
    quality_score: float
    criteria: EvaluationCriteria
    feedback: List[str]
    approved: bool

evaluator_agent = Agent(
    model=gemini_model,
    result_type=EvaluationResult,
    system_prompt="""Eres un evaluador senior de informes UX.
    Evalúa cada informe con criterios estrictos:
    
    1. Completeness: ¿Todas las secciones tienen contenido sustancial?
    2. Depth: ¿El análisis es superficial o profundo?
    3. Actionability: ¿Los insights son accionables o genéricos?
    4. Coherence: ¿Las fases están conectadas lógicamente?
    
    Score mínimo para aprobar: 0.8
    Proporciona feedback específico y constructivo."""
)

async def evaluate_report(report_draft: dict) -> dict:
    result = await evaluator_agent.run(
        f"Evalúa este informe de Design Thinking:\n\n{report_draft}"
    )
    
    evaluation = result.data
    return {
        "quality_score": evaluation.quality_score,
        "feedback": evaluation.feedback,
        "approved": evaluation.approved
    }
```

3. **Ejecutar Workflow**

```python
# backend/python/main.py
from workflows.design_thinking_workflow import app as workflow_app

async def process_telegram_message(chat_id: int, text: str):
    """Procesa mensaje de Telegram y ejecuta workflow"""
    
    # Estado inicial
    initial_state = {
        "project_context": text,
        "research_data": "",
        "current_phase": "init",
        "report_draft": {},
        "evaluation_feedback": [],
        "iteration_count": 0,
        "max_iterations": 3,
        "final_report": None
    }
    
    # Ejecutar workflow
    final_state = await workflow_app.ainvoke(initial_state)
    
    if final_state["final_report"]:
        # Enviar informe a Telegram
        await send_report_to_telegram(chat_id, final_state["final_report"])
    else:
        await send_telegram_message(
            chat_id,
            "No pude generar un informe de calidad suficiente. Intenta proporcionar más contexto."
        )
```

#### Entregables
- ✅ LangGraph workflow funcional
- ✅ 3 agentes integrados (Investigador, Facilitador, Evaluador)
- ✅ Sistema de reflexión con máximo 3 iteraciones
- ✅ Logs de ejecución para debugging

---

### **FASE 4: Memoria de Larga Duración y RAG (Semana 9-10)**

#### Objetivos
- Integrar Zep para memoria conversacional
- Configurar Convex para vector store
- Implementar RAG semántico

#### Tareas

1. **Zep: Memoria Conversacional**

```python
# backend/python/memory/zep_integration.py
from zep_cloud.client import AsyncZep
from zep_cloud import Message
import os

zep_client = AsyncZep(api_key=os.getenv("ZEP_API_KEY"))

async def add_message_to_memory(session_id: str, role: str, content: str):
    """Agrega mensaje a memoria de Zep"""
    await zep_client.memory.add(
        session_id=session_id,
        messages=[Message(role=role, content=content)]
    )

async def get_conversation_context(session_id: str, last_n: int = 10) -> str:
    """Obtiene contexto de conversación"""
    memory = await zep_client.memory.get(session_id=session_id, memory_type="perpetual")
    
    if not memory or not memory.messages:
        return ""
    
    recent_messages = memory.messages[-last_n:]
    context = "\n".join([f"{msg.role}: {msg.content}" for msg in recent_messages])
    
    return context

async def search_memory(session_id: str, query: str) -> list:
    """Búsqueda semántica en memoria"""
    results = await zep_client.memory.search(
        session_id=session_id,
        text=query,
        search_type="mmr"  # Maximal Marginal Relevance
    )
    
    return results
```

2. **Convex: Vector Store para RAG**

```typescript
// backend/node/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    projectName: v.string(),
    projectDescription: v.string(),
    reportData: v.any(), // DesignThinkingReport serializado
    embedding: v.array(v.float64()),
    createdAt: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
      filterFields: ["userId"],
    }),
  
  projectAssets: defineTable({
    projectName: v.string(),
    assetType: v.string(), // "style_guide", "user_research", "prototype"
    content: v.string(),
    embedding: v.array(v.float64()),
  })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
    }),
});
```

```typescript
// backend/node/convex/reports.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeReport = mutation({
  args: {
    projectName: v.string(),
    projectDescription: v.string(),
    reportData: v.any(),
    embedding: v.array(v.float64()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const reportId = await ctx.db.insert("reports", {
      ...args,
      createdAt: Date.now(),
    });
    return reportId;
  },
});

export const searchSimilarProjects = query({
  args: {
    queryEmbedding: v.array(v.float64()),
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .vectorSearch("reports", "by_embedding", {
        vector: args.queryEmbedding,
        limit: args.limit ?? 5,
        filter: (q) => q.eq("userId", args.userId),
      })
      .collect();
    
    return results;
  },
});
```

3. **RAG: Recuperación de Contexto**

```python
# backend/python/rag/retrieval.py
from convex import ConvexClient
import google.generativeai as genai
import os

convex_client = ConvexClient(os.getenv("CONVEX_DEPLOYMENT"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_embedding(text: str) -> list[float]:
    """Genera embedding usando Gemini"""
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text
    )
    return result['embedding']

async def retrieve_similar_projects(query: str, user_id: str, limit: int = 3):
    """Busca proyectos similares en Convex"""
    query_embedding = await generate_embedding(query)
    
    results = await convex_client.query(
        "reports:searchSimilarProjects",
        {
            "queryEmbedding": query_embedding,
            "userId": user_id,
            "limit": limit
        }
    )
    
    return results

async def augment_context_with_rag(project_context: str, user_id: str) -> str:
    """Aumenta contexto con proyectos similares"""
    similar_projects = await retrieve_similar_projects(project_context, user_id)
    
    if not similar_projects:
        return project_context
    
    rag_context = "\n\n--- Proyectos similares previos ---\n"
    for project in similar_projects:
        rag_context += f"\nProyecto: {project['projectName']}\n"
        rag_context += f"Insights clave: {project['reportData']['empathy']['key_insights']}\n"
    
    return f"{project_context}\n{rag_context}"
```

4. **Integrar RAG en Workflow**

```python
# Modificar researcher_node en workflow
async def researcher_node(state: WorkflowState) -> WorkflowState:
    from agents.researcher_agent import research_with_tools
    from rag.retrieval import augment_context_with_rag
    
    # RAG: Buscar proyectos similares
    augmented_context = await augment_context_with_rag(
        state["project_context"],
        user_id=state.get("user_id", "default")
    )
    
    # Investigación con herramientas MCP
    additional_data = await research_with_tools(augmented_context)
    
    state["research_data"] = f"{augmented_context}\n\n{additional_data}"
    state["current_phase"] = "research_complete"
    
    return state
```

#### Entregables
- ✅ Zep integrado para memoria conversacional
- ✅ Convex vector store configurado
- ✅ RAG semántico funcionando
- ✅ Reducción de latencia del 40% (menos tokens enviados)

---

### **FASE 5: Interfaz y Seguridad (Semana 11-12)**

#### Objetivos
- Generative UI con Vercel AI SDK
- Dashboard interactivo en Astro
- Seguridad: sanitización y human-in-the-loop

#### Tareas

1. **Generative UI con Vercel AI SDK**

```typescript
// backend/node/api/generate-ui.ts
import { streamUI } from 'ai/rsc';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { ReportDashboard } from '@/components/ReportDashboard';

export async function generateReportUI(reportData: any) {
  const result = await streamUI({
    model: google('gemini-2.0-flash-exp'),
    prompt: `Genera un dashboard interactivo para este informe UX: ${JSON.stringify(reportData)}`,
    text: ({ content }) => <div>{content}</div>,
    tools: {
      showPersonas: {
        description: 'Muestra User Personas en cards interactivas',
        parameters: z.object({
          personas: z.array(z.object({
            name: z.string(),
            age_range: z.string(),
            goals: z.array(z.string()),
          })),
        }),
        generate: async function* ({ personas }) {
          yield <div>Generando personas...</div>;
          return <PersonaCards personas={personas} />;
        },
      },
      showInsights: {
        description: 'Muestra insights clave con visualizaciones',
        parameters: z.object({
          insights: z.array(z.string()),
        }),
        generate: async function* ({ insights }) {
          return <InsightsChart insights={insights} />;
        },
      },
    },
  });

  return result.value;
}
```

2. **Dashboard Astro con Componentes React**

```astro
---
// frontend/dashboard/src/pages/reports/[id].astro
import Layout from '@/layouts/Layout.astro';
import { ReportDashboard } from '@/components/ReportDashboard';

const { id } = Astro.params;

// Fetch report data from Convex
const reportData = await fetch(`${import.meta.env.CONVEX_URL}/reports/${id}`).then(r => r.json());
---

<Layout title={`Informe: ${reportData.projectName}`}>
  <ReportDashboard client:load reportData={reportData} />
</Layout>
```

```tsx
// frontend/dashboard/src/components/ReportDashboard.tsx
import { motion } from 'framer-motion';
import { PersonaCard } from './PersonaCard';
import { InsightsChart } from './InsightsChart';

export function ReportDashboard({ reportData }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8">
          {reportData.projectName}
        </h1>

        {/* Fase de Empatía */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
            User Personas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportData.empathy.user_personas.map((persona, i) => (
              <PersonaCard key={i} persona={persona} />
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-6">
            Key Insights
          </h2>
          <InsightsChart insights={reportData.empathy.key_insights} />
        </section>

        {/* Otras fases... */}
      </motion.div>
    </div>
  );
}
```

3. **Seguridad: Sanitización y Validación**

```python
# backend/python/security/input_sanitizer.py
import re
from typing import Optional

class InputSanitizer:
    """Previene Prompt Injection y XSS"""
    
    DANGEROUS_PATTERNS = [
        r"ignore\s+previous\s+instructions",
        r"system\s*:\s*you\s+are",
        r"<script>",
        r"javascript:",
        r"eval\(",
    ]
    
    @staticmethod
    def sanitize_user_input(text: str) -> str:
        """Limpia input del usuario"""
        # Remover HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Detectar prompt injection
        for pattern in InputSanitizer.DANGEROUS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                raise ValueError("Entrada sospechosa detectada")
        
        # Limitar longitud
        if len(text) > 5000:
            text = text[:5000]
        
        return text.strip()
    
    @staticmethod
    def validate_project_context(context: str) -> bool:
        """Valida que el contexto sea válido"""
        if len(context) < 20:
            return False
        
        # Debe contener palabras clave UX
        ux_keywords = ["usuario", "app", "sistema", "diseño", "problema"]
        has_keyword = any(kw in context.lower() for kw in ux_keywords)
        
        return has_keyword
```

4. **Human-in-the-Loop para Acciones Críticas**

```python
# backend/python/security/human_approval.py
from enum import Enum
from typing import Callable, Any
import asyncio

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class HumanApprovalRequired(Exception):
    """Excepción cuando se requiere aprobación humana"""
    pass

approval_queue = {}  # En producción: usar Redis

async def request_human_approval(
    action: str,
    details: dict,
    chat_id: int,
    timeout: int = 300  # 5 minutos
) -> bool:
    """Solicita aprobación humana para acción crítica"""
    
    approval_id = f"{chat_id}_{action}_{asyncio.get_event_loop().time()}"
    approval_queue[approval_id] = {
        "status": ApprovalStatus.PENDING,
        "action": action,
        "details": details
    }
    
    # Enviar mensaje a Telegram con botones
    await send_telegram_approval_request(chat_id, approval_id, action, details)
    
    # Esperar aprobación
    start_time = asyncio.get_event_loop().time()
    while asyncio.get_event_loop().time() - start_time < timeout:
        if approval_queue[approval_id]["status"] != ApprovalStatus.PENDING:
            break
        await asyncio.sleep(1)
    
    status = approval_queue[approval_id]["status"]
    del approval_queue[approval_id]
    
    return status == ApprovalStatus.APPROVED

# Decorador para acciones que requieren aprobación
def requires_approval(action_name: str):
    def decorator(func: Callable) -> Callable:
        async def wrapper(*args, **kwargs) -> Any:
            chat_id = kwargs.get("chat_id")
            
            # Solicitar aprobación
            approved = await request_human_approval(
                action=action_name,
                details={"args": str(args), "kwargs": str(kwargs)},
                chat_id=chat_id
            )
            
            if not approved:
                raise HumanApprovalRequired(f"Acción '{action_name}' rechazada por usuario")
            
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator

# Uso
@requires_approval("delete_project")
async def delete_project_from_convex(project_id: str, chat_id: int):
    """Elimina proyecto de Convex (requiere aprobación)"""
    await convex_client.mutation("reports:delete", {"id": project_id})
```

#### Entregables
- ✅ Dashboard interactivo en Astro con Generative UI
- ✅ Sanitización de inputs implementada
- ✅ Human-in-the-loop para acciones críticas
- ✅ Tests de seguridad pasando

---

## 📈 Roadmap de Implementación

### Timeline Completo (12 semanas)

```
Semana 1:  [████████████████████] Fase 0: Setup
Semana 2:  [████████████████████] Fase 1: Pydantic AI
Semana 3:  [████████████████████] Fase 1: Schemas
Semana 4:  [████████████████████] Fase 2: Telegram
Semana 5:  [████████████████████] Fase 2: MCP
Semana 6:  [████████████████████] Fase 3: LangGraph
Semana 7:  [████████████████████] Fase 3: Agentes
Semana 8:  [████████████████████] Fase 3: Testing
Semana 9:  [████████████████████] Fase 4: Zep
Semana 10: [████████████████████] Fase 4: Convex RAG
Semana 11: [████████████████████] Fase 5: UI
Semana 12: [████████████████████] Fase 5: Seguridad
```

### Hitos Clave

- **Semana 3:** Primer agente funcional (Empatía)
- **Semana 5:** Bot responde a mensajes de Telegram
- **Semana 8:** Workflow multi-agente completo
- **Semana 10:** RAG reduce latencia 40%
- **Semana 12:** Sistema completo en producción

---

## 🎯 Métricas de Éxito

### KPIs Técnicos
- **Latencia:** < 30s para generar informe completo
- **Calidad:** > 80% de informes aprobados en primera iteración
- **Uptime:** > 99% disponibilidad del bot
- **Costos:** < $50/mes en API calls (Gemini + Convex + Zep)

### KPIs de Producto
- **Adopción:** 10+ informes generados en primer mes
- **Satisfacción:** NPS > 8/10
- **Eficiencia:** 70% reducción de tiempo vs. manual
- **Retención:** 80% de usuarios activos mensualmente

---

## 🔒 Consideraciones de Seguridad

### Checklist de Seguridad

- [ ] Validación de inputs con regex patterns
- [ ] Rate limiting en webhook de Telegram (10 req/min)
- [ ] Encriptación de datos sensibles en Convex
- [ ] Human-in-the-loop para acciones destructivas
- [ ] Logs de auditoría para todas las operaciones
- [ ] Secrets en variables de entorno (nunca hardcoded)
- [ ] CORS configurado correctamente en API Routes
- [ ] Validación de webhooks con secret token
- [ ] Timeouts en llamadas a LLM (60s máximo)
- [ ] Sanitización de outputs antes de renderizar UI

---

## 💰 Estimación de Costos

### Costos Mensuales (100 informes/mes)

| Servicio | Uso Estimado | Costo |
|----------|--------------|-------|
| **Gemini API** | ~500k tokens/mes | $15 |
| **Convex** | 10GB storage + 100k queries | $0 (free tier) |
| **Zep Cloud** | 1000 mensajes/mes | $0 (free tier) |
| **Vercel** | Hosting Next.js | $0 (hobby) |
| **Telegram Bot** | Ilimitado | $0 |
| **Total** | | **~$15/mes** |

### Escalabilidad (1000 informes/mes)

| Servicio | Costo |
|----------|-------|
| Gemini API | $150 |
| Convex Pro | $25 |
| Zep Cloud | $49 |
| Vercel Pro | $20 |
| **Total** | **$244/mes** |

---

## 🚧 Riesgos y Mitigaciones

### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Latencia > 60s (timeout Telegram) | Alta | Alto | Streaming de respuestas, caché agresivo |
| Costos API excesivos | Media | Alto | Rate limiting, caché de embeddings |
| Alucinaciones del LLM | Alta | Medio | Validación Pydantic, agente evaluador |
| Downtime de servicios externos | Media | Alto | Fallbacks, retry logic, circuit breakers |
| Prompt injection | Media | Alto | Sanitización, validación, human-in-the-loop |

### Riesgos de Producto

| Riesgo | Mitigación |
|--------|------------|
| Usuarios no confían en IA | Mostrar transparencia (logs, scores de confianza) |
| Informes genéricos | Iterar en prompts, agregar más herramientas MCP |
| Curva de aprendizaje alta | Onboarding interactivo, ejemplos pre-cargados |

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Pydantic AI Docs](https://ai.pydantic.dev/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Zep Cloud API](https://docs.getzep.com/)
- [Convex Docs](https://docs.convex.dev/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

### Ejemplos de Código
- [Pydantic AI Examples](https://github.com/pydantic/pydantic-ai/tree/main/examples)
- [LangGraph Tutorials](https://github.com/langchain-ai/langgraph/tree/main/examples)
- [MCP Servers](https://github.com/modelcontextprotocol/servers)

### Papers y Artículos
- "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2023)
- "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)
- "Design Thinking Research Methods" (IDEO, 2024)

---

## 🎓 Próximos Pasos

### Semana 1 - Acción Inmediata

1. **Crear repositorio y estructura**
   ```bash
   mkdir ux-research-bot
   cd ux-research-bot
   git init
   # Copiar estructura de carpetas del documento
   ```

2. **Configurar entornos virtuales**
   ```bash
   # Python
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install pydantic-ai langgraph google-generativeai
   
   # Node.js
   cd backend/node
   npm init -y
   npm install next @ai-sdk/google ai convex
   ```

3. **Obtener API Keys**
   - [ ] Gemini API Key (Google AI Studio)
   - [ ] Telegram Bot Token (BotFather)
   - [ ] Convex Deployment URL
   - [ ] Zep Cloud API Key

4. **Implementar primer esquema Pydantic**
   - Copiar código de `EmpathyPhase` del documento
   - Crear test básico
   - Validar con datos mock

---

## 📝 Conclusión

Esta arquitectura es **técnicamente viable y escalable** para transformar un bot de Telegram en un equipo multi-agente de investigadores UX. La implementación incremental por fases minimiza riesgos y permite validación continua.

**Ventajas clave:**
- ✅ Type-safety end-to-end con Pydantic AI
- ✅ Flujos complejos con reflexión (LangGraph)
- ✅ Memoria de largo plazo (Zep + Convex)
- ✅ Extensible vía MCP
- ✅ UI generativa moderna (Vercel AI SDK)
- ✅ Costos controlados (~$15/mes inicial)

**Recomendación:** Comenzar con Fase 0 y Fase 1 para validar el concepto core (Pydantic AI + Gemini) antes de invertir en infraestructura completa.

---

**Autor:** Desarrollador SR con experiencia en Agentic Workflows  
**Fecha:** Marzo 2026  
**Versión:** 1.0
