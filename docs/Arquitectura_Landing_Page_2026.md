Documento de Arquitectura de Software (SAD) – Versión Completa
Portal Principal: Estudio de Ingeniería, Consultoría de IA & Product Lifecycle

Resumen Ejecutivo (Enfoque de Ventas High-Ticket & Product Builder)
Este sistema no se concibe como una galería pasiva de proyectos, sino como una plataforma interactiva de adquisición de clientes y demostración de capacidades técnicas en tiempo real. El sitio posiciona a Jorge Cabrera L. y a su firma (Áperca SpA) como un socio estratégico capaz de liderar el ciclo de vida completo de un producto digital (Digital Product Lifecycle): desde la investigación mediante técnicas de Inteligencia de Fuentes Abiertas (OSINT) y análisis de datos, pasando por la arquitectura UX y el vibecoding/Spec-Driven Development, hasta el despliegue de sistemas escalables, agentes autónomos y prácticas de ciberseguridad DevSecOps.
Objetivo de Negocio
Convertir visitantes en leads calificados y acelerar el ciclo de ventas, posicionando a Áperca SpA como referente en consultoría de IA, desarrollo de productos digitales y seguridad desde el diseño.
Audiencias Estratégicas
Audiencia	Necesidad	Propuesta de Valor
Decision Makers & Clientes High-Ticket	Diagnóstico, consultoría de datos, desarrollo de productos de alto impacto sin fricción operativa	Diagnóstico basado en datos (OSINT), metodología STAR, agilidad con IA (vibecoding)
Hiring Managers / Reclutadores Tech	Evaluación de capacidad arquitectónica, calidad de código y visión end-to-end	Demostración técnica en vivo, arquitectura documentada, stack moderno
Stack Tecnológico (Línea Ejecutiva)
Frontend: Astro, React, Tailwind CSS, TypeScript
Backend: Node.js, Express.js, Convex (serverless)
Base de Datos: SQLite, Turso, Drizzle ORM / Prisma
AI & Agentes: LangGraph, Gemini API, Zep (memoria conversacional)
Business Intelligence: Python (Pandas, NumPy), Power BI, SQL
Ciberseguridad: Kali Linux, DevSecOps, Secure SDLC, hardening de APIs
Infraestructura: Cloud Services (Vercel, Railway, AWS S3)

1. Capa de Presentación y UX (Frontend)
La interfaz se compone de dos componentes estructurales principales: la Experiencia Narrativa (Scrollytelling STAR) y el Motor Interactivo Dual (Formulario + Agente).
A. Scrollytelling Narrativo (Método STAR & OSINT)
Técnica: Animación sincronizada con el scroll del usuario (scroll-driven video/canvas frame rendering).
Flujo Narrativo:
Etapa	Contenido	Valor para el Cliente
Situation (OSINT & Diagnóstico)	Revelación de ineficiencias operativas y brechas de mercado mediante análisis OSINT y minería de datos.	El cliente comprende su problema con datos objetivos antes de invertir.
Task (Estrategia & UX)	Mapeo de User Personas a entidades de datos y definición de arquitecturas de información.	Visualiza el camino hacia la solución.
Action (Desarrollo AI-Assisted)	Prototipado, Spec-Driven Development y construcción de sistemas escalables con asistencia de IA.	Confía en la velocidad y calidad del desarrollo.
Result (Impacto ROI)	Métricas reales de conversión, automatización y eliminación de fricciones (ej. +35% leads).	Evidencia tangible del retorno de inversión.
B. Componente 1: Formulario Interactivo (Qualifying Funnel)
Propósito: Filtro de clientes High-Ticket y canalización de consultas técnicas.
Flujo de Pantallas:
Paso	Contenido	Opciones
Paso 1 (Perfil/Rol)	Empresa buscando desarrollo/consultoría vs. Reclutador/Hiring Manager.	"Soy empresa" / "Soy reclutador"
Paso 2 (Desafío principal)	Selección del tipo de necesidad.	Automatización/IA, Desarrollo MVP desde cero, Rediseño UX/CRO, Consultoría de Datos/OSINT
Paso 3 (Alcance y Presupuesto)	Rango de inversión y tiempo esperado.	$3k-$10k / $10k-$30k / $30k+ / "No estoy seguro"
Paso 4 (Lead Capture & Hand-off)	Captura de contacto + disparo de webhook a la agenda o al agente.	Email + teléfono + mensaje breve
Valor para el Cliente: Evita reuniones improductivas; solo se contactan leads listos para invertir en soluciones de alto impacto.
C. Componente 2: Widget de Agente de IA Conversacional
Sincronización: Mantiene el mismo árbol de decisión que el formulario. Si el usuario interactúa con el chat, el agente puede ejecutar el test de cualificación (Qualifying Funnel) en lenguaje natural.
Valor para el Cliente: Atención 24/7, respuestas inmediatas, experiencia personalizada sin fricción humana.

2. Capa de Comunicación e Interfaz (API Layer)
Arquitectura de Endpoints (Restful & Streaming API)
Endpoint	Método	Descripción	Payload Entrada	Respuesta
/api/v1/funnel/step	POST	Procesa un paso del formulario interactivo	{ stepId, answers, sessionId }	{ nextStep, validation, state }
/api/v1/funnel/submit	POST	Entrega final del formulario de cualificación	{ sessionId, leadData, answers }	{ status: "success", leadCategory: "HIGH_TICKET", bookingUrl }
/api/v1/agent/chat	POST	Endpoint de streaming para chat con IA	{ sessionId, message, contextOverride }	Server-Sent Events (SSE) con tokens de Gemini
/api/v1/agent/memory	GET/PUT	Lee o actualiza el perfil y contexto del agente	{ agentSecretKey, coreSystemPrompt, businessData }	{ updated: true, version }
/api/v1/analytics/event	POST	Ingesta de eventos de scroll y OSINT tracking	{ eventName, scrollDepth, timestamp }	{ ack: true }
Flujo de Datos Exhaustivo: Formulario vs. Agente Conversacional
text
1.	[Usuario]
2.	    |
3.	    v
4.	Interfaz Frontend (Astro/React)
5.	    |
6.	    +---> (Opción A: Formulario GUI) ---> POST /api/v1/funnel/submit
7.	    |                                         |
8.	    |                                         v
9.	    |                               [Validador Zod / Middleware]
10.	    |                                         |
11.	    +---> (Opción B: Chatbot IA)   ---> POST /api/v1/agent/chat
12.	                                            |
13.	                                            v
14.	                                 [Motor Context Layering]
15.	                                            |
16.	                                            v
17.	                                [Backend API (Convex/Express)]
18.	                                            |
19.	                                +-----------+-----------+
20.	                                |                       |
21.	                                v                       v
                          [Database SQLite/Convex] [Gemini API / LLM]
Valor para el Cliente (Resumen API)
●	Transparencia: Cada interacción es rastreable y auditable.
●	Eficiencia: El sistema cualifica automáticamente, ahorrando tiempo de ventas.
●	Escalabilidad: La arquitectura soporta desde 10 hasta 10,000 leads mensuales.

3. Capa de Aplicación y Lógica de Negocio (Backend)
Actualmente, el sistema opera sobre Convex. A continuación se especifica la arquitectura para Convex y la opción alternativa con Backend Propio.
A. Estado Actual: Backend Serverless en Convex
Módulos:
Módulo	Función
convex/funnel.ts	Lógica de transiciones de estados y guardado de leads.
convex/agent.ts	Orquestador de la API de Gemini mediante actions (ejecución en entorno Node.js runtime dentro de Convex).
convex/memory.ts	Gestión de hilos de conversación y almacenamiento persistente.
B. Opción Alternativa: Backend Propio en Node.js + Express.js (o Fastify)
Framework: Express.js estructurado al estilo FastAPI (utilizando Zod para validación de esquemas e inyección de dependencias).
Patrón de Arquitectura: Layered Architecture (Controllers → Services → Repositories → Database Driver).
Base de Datos: SQLite (vía libsql / Turso o better-sqlite3 con ORM Prisma o Drizzle). Permite despliegues ultra rápidos, latencia cero de red al estar file-based o edge-replicated, y costos mínimos.
Idempotencia: Implementación de cabecera X-Idempotency-Key en operaciones /submit para evitar duplicación de leads por errores de red.
Rate Limiting: express-rate-limit con ventana móvil (máximo 10 peticiones por minuto para el endpoint /agent/chat por IP) para proteger la cuota de la API de Gemini.
C. Estructura de Directorios (Backend Propio)
text
22.	src/
23.	├── controllers/
24.	│   ├── funnel.controller.ts
25.	│   ├── agent.controller.ts
26.	│   └── admin.controller.ts
27.	├── services/
28.	│   ├── funnel.service.ts
29.	│   ├── agent.service.ts
30.	│   └── lead.service.ts
31.	├── repositories/
32.	│   ├── lead.repository.ts
33.	│   └── session.repository.ts
34.	├── middleware/
35.	│   ├── auth.middleware.ts
36.	│   ├── rate-limit.middleware.ts
37.	│   └── validation.middleware.ts
38.	├── agent/
39.	│   ├── context/
40.	│   │   ├── 00_core_identity.ts
41.	│   │   ├── 01_qualifying_rules.ts
42.	│   │   └── layers/
43.	│   │       ├── high_ticket.ts
44.	│   │       ├── recruiter.ts
45.	│   │       └── general_faq.ts
46.	│   ├── memory/
47.	│   │   ├── zep_client.ts
48.	│   │   └── local_override.json
49.	│   └── orchestrator.ts
50.	├── db/
51.	│   ├── schema.ts
52.	│   └── migrations/
53.	└── utils/
54.	    ├── validators.ts
    └── security.ts
Valor para el Cliente (Resumen Backend)
●	Flexibilidad: Podemos operar en Convex (serverless) o en infraestructura propia según necesidades del proyecto.
●	Robustez: Validaciones, rate limiting e idempotencia garantizan un sistema confiable.
●	Bajo costo: SQLite + Turso permite escalar sin gastos innecesarios.

4. Capa de Datos y Persistencia
Modelo Entidad-Relación (SQLite / Convex Schema)
Tabla leads:
Campo	Tipo	Descripción
id	STRING / PRIMARY KEY	UUID único del lead
type	STRING	"HIGH_TICKET_CLIENT" / "RECRUITER" / "GENERAL"
name	STRING	Nombre completo
email	STRING	Email de contacto
company	STRING, Nullable	Empresa (opcional)
budget_range	STRING, Nullable	Rango de presupuesto
project_summary	TEXT	Descripción del proyecto o necesidad
source	STRING	"FUNNEL_FORM" / "AI_AGENT"
created_at	TIMESTAMP	Fecha de creación
Tabla agent_sessions:
Campo	Tipo	Descripción
session_id	STRING / PRIMARY KEY	ID único de sesión
lead_id	FOREIGN KEY → leads.id, Nullable	Relación con lead (si se capturó)
user_type	STRING	"HIGH_TICKET" / "RECRUITER" / "UNKNOWN"
created_at	TIMESTAMP	Fecha de creación
Tabla agent_memory_store (Zep / Long-term Memory):
Campo	Tipo	Descripción
memory_id	STRING / PRIMARY KEY	ID único de memoria
session_id	FOREIGN KEY → agent_sessions.session_id	Sesión asociada
summary	TEXT	Resumen consolidado de la conversación para no reenviar todo el historial
updated_at	TIMESTAMP	Última actualización
Valor para el Cliente (Resumen Datos)
●	Trazabilidad: Cada lead y conversación queda registrado para seguimiento.
●	Inteligencia: Los datos alimentan el sistema de BI para mejorar la estrategia de adquisición.
●	Privacidad: Datos sensibles protegidos con cifrado y buenas prácticas de seguridad.

5. Seguridad y Gobernanza (Cross-cutting)
A. RBAC & Clave de Edición del Agente
Para editar la capa de contexto/memoria de la empresa o prompt del agente sin redeplegar código, se expone una ruta administrativa /admin/agent-config.
Requisitos:
●	Autenticación mediante token Bearer JWT con rol SUPER_ADMIN.
●	Validación de esquema con Zod antes de persistir cambios.
B. Protección de Datos
Capa	Medida	Herramienta
Entrada	Sanitización de inputs para prevenir inyecciones (Prompt Injection, SQL, XSS)	Zod, DOMPurify
Almacenamiento	Cifrado de datos sensibles (emails, teléfonos)	bcrypt, AES-256
Comunicación	TLS 1.3 en todas las conexiones	Certificados SSL
Autenticación	Sesiones stateless con tokens cifrados en HTTP-only Cookies	JWT, httpOnly cookies
C. Autenticación Stateless
Manejo de sesiones temporales mediante tokens cifrados en HTTP-only Cookies para el tracking del funnel.
Beneficio: Sin almacenamiento de sesiones en servidor, escalabilidad horizontal inmediata.
D. DevSecOps en el Pipeline
Fase	Práctica	Herramienta
Desarrollo	Static Application Security Testing (SAST)	ESLint security plugins, SonarQube
Pre-commit	Secret scanning	Git hooks, truffleHog
Pre-deploy	Dependency scanning	Snyk, npm audit
Producción	Dynamic Application Security Testing (DAST)	OWASP ZAP
Monitoreo	Logging y alertas de seguridad	Winston, Sentry
Valor para el Cliente (Resumen Seguridad)
●	Confianza: Los datos del cliente y sus usuarios están protegidos desde el diseño.
●	Cumplimiento: Prácticas alineadas con estándares de seguridad modernos (OWASP, NIST).
●	Proactividad: Auditorías y monitoreo continuo para prevenir incidentes.

6. Orquestación del Agente de IA: Context Layering vs. RAG & Zep Integration
Para maximizar el rendimiento y controlar los costos de la API de Gemini, sustituimos las llamadas masivas de RAG vectorial por un enfoque de Context Layering Estructurado por carpetas y módulos.
A. Estrategia de Context Layering (Capas de Contexto)
En lugar de consultar una base de datos vectorial en cada mensaje, el sistema carga dinámicamente solo la capa necesaria según la clasificación del usuario:
text
55.	src/agent/context/
56.	├── 00_core_identity.ts      # Visión de Jorge Cabrera, Áperca SpA, tono y límites. (SIEMPRE ACTIVO)
57.	├── 01_qualifying_rules.ts  # Lógica del funnel: preguntas y rangos High-Ticket. (SIEMPRE ACTIVO)
58.	├── layers/
59.	│   ├── high_ticket.ts      # Tarifas, metodologías (STAR, OSINT), casos de éxito (iDomo, LocalShop Pro).
60.	│   ├── recruiter.ts        # CV detallado, experiencia técnica, disponibilidad, pretensiones.
61.	│   └── general_faq.ts      # FAQ sobre servicios, contacto directo.
62.	└── memory/
63.	    ├── zep_client.ts       # Integración con Zep para memoria a largo plazo.
    └── local_override.json # Espacio editable en caliente para contexto dinámico.
B. Flujo de Inyección de Contexto (Paso a Paso)
1.	Mensaje del Usuario: El usuario envía un mensaje al chatbot.
2.	Evaluación Ligera (Classifier): Un algoritmo local (o un Prompt ultracorto de clasificación) detecta la intención: HIGH_TICKET_INTENT o RECRUITER_INTENT.
3.	Capa Combinada (System Prompt):
4.	text
5.	System Prompt = Core Identity + Qualifying Rules + Capa Específica + Memoria Zep (Resumen)
6.	Llamada a Gemini: Se envía únicamente el System Prompt ensamblado más los últimos 3 mensajes de la sesión.
7.	Ahorro de Tokens: Se evita el envío de cientos de líneas de documentación irrelevantes (ej. no se le envía la hoja de vida completa a un cliente que solo quiere cotizar desarrollo de software).
C. Panel de Edición del Agente (local_override.json)
El archivo/módulo de almacenamiento permite editar en caliente la información de la empresa, tarifas actuales o disponibilidad de agenda sin tocar la lógica del backend:
json
64.	{
65.	  "company_name": "Áperca SpA",
66.	  "founder": "Jorge Cabrera L.",
67.	  "high_ticket_minimum": "$3,000 USD",
68.	  "current_availability": "Inmediata para proyectos de consultoría / Q3 2026",
69.	  "featured_projects": ["iDomo", "LocalShop Pro", "Bodai Clinic"],
70.	  "security_practices": ["DevSecOps", "Kali Linux", "Secure SDLC"],
71.	  "ai_capabilities": ["LangGraph", "Agentes Autónomos", "Business Intelligence con Python"]
}
Valor para el Cliente (Resumen Agente IA)
●	Respuesta rápida: El agente contesta en segundos, sin largas esperas.
●	Contexto relevante: Solo recibe la información que necesita para su consulta.
●	Actualización dinámica: El equipo puede modificar tarifas y disponibilidad sin desarrolladores.

7. Business Intelligence & Analytics
A. Dashboard de Conversión (Power BI / Streamlit)
Métrica	Descripción	Objetivo
Tasa de Conversión Funnel	% de visitantes que completan el formulario	>15%
Leads Calificados / mes	Número de leads High-Ticket capturados	>20/mes
CPA (Costo por Adquisición)	Inversión en pauta / leads calificados	Optimizar continuamente
CTR Promedio	Click-through rate de campañas Meta Ads	>3%
Tasa de Agendamiento	% de leads que agendan reunión de diagnóstico	>40%
B. OSINT & Análisis de Datos
El sistema integra técnicas de OSINT para el diagnóstico inicial de clientes potenciales, identificando:
●	Brechas de mercado en la industria del cliente.
●	Ineficiencias operativas detectables en datos públicos.
●	Oportunidades de automatización basadas en patrones de comportamiento.
C. Flujo de Datos Analítico
text
72.	Eventos (scroll, clics, interacciones)
73.	    ↓
74.	API /api/v1/analytics/event
75.	    ↓
76.	Base de Datos (eventos crudos)
77.	    ↓
78.	ETL (Python + Pandas)
79.	    ↓
80.	Dashboard Power BI / Streamlit
81.	    ↓
Reportes de Conversión y Recomendaciones

8. Infraestructura y Despliegue
A. Opción 1: Despliegue Serverless (Convex + Vercel)
Componente	Servicio	Justificación
Frontend	Netlify	CDN global, despliegues automáticos, preview deployments
Backend	Convex	Tiempo real, escalabilidad automática, integración nativa con IA
Base de Datos	Convex Database	Migraciones automáticas, índices optimizados
Archivos Estáticos	Vercel / S3	Imágenes, videos, assets
B. Opción 2: Despliegue en Infraestructura Propia
Componente	Servicio	Justificación
Frontend	Vercel / Cloudflare Pages	Rendimiento, bajo costo
Backend	Railway / Fly.io / AWS EC2	Control total, costos predecibles
Base de Datos	Turso (SQLite edge)	Latencia mínima, replicación global
Archivos Estáticos	Cloudflare R2 / AWS S3	Costos reducidos
C. CI/CD Pipeline
yaml
82.	# .github/workflows/deploy.yml
83.	name: Deploy Portfolio
84.	on:
85.	  push:
86.	    branches: [main]
87.	jobs:
88.	  deploy:
89.	    runs-on: windows11
90.	    steps:
91.	      - uses: actions/checkout@v4
92.	      - uses: actions/setup-node@v4
93.	      - run: npm ci
94.	      - run: npm run test
95.	      - run: npm run build
      - run: npm run deploy # Convex push / Vercel deploy
Valor para el Cliente (Resumen Infraestructura)
●	Alta disponibilidad: 99.9% uptime garantizado.
●	Rendimiento: Carga inicial <1s en cualquier región.
●	Escalabilidad: Soporte desde 100 hasta 100,000 visitas mensuales sin cambios arquitectónicos.

9. Hoja de Ruta (Roadmap)
Fase 1: Lanzamiento Inicial (Q3 2026)
☑ Scrollytelling STAR implementado
☑ Formulario interactivo de cualificación
☑ Agente IA conversacional con Context Layering
☑ Integración con calendario para agendamiento automático
☑ Dashboard de conversión básico
Fase 2: Expansión (Q4 2026)
□ Integración con CRM (HubSpot / Pipedrive)
□ Dashboard avanzado de Business Intelligence (Power BI)
□ Sistema de recomendaciones automatizadas (Agentes de IA)
□ Portal de clientes con seguimiento de proyectos
Fase 3: Escalamiento (Q1 2027)
□ Marketplace de servicios (diagnóstico automatizado)
□ Integración con herramientas de OSINT (Maltego, Shodan)
□ Sistema de referral y automatización de marketing
□ Multi-tenant para agencias asociadas

10. Conclusión y Síntesis Arquitectónica
Síntesis Técnica
Capa	Tecnología	Propósito
Frontend	Astro + React + Tailwind	Scrollytelling interactivo y componentes reactivos
Backend	Convex / Express.js + Node.js	Lógica de negocio, APIs, orquestación de agentes
Base de Datos	SQLite / Turso / Convex DB	Persistencia de leads, sesiones y memoria
Agente IA	LangGraph + Gemini API + Zep	Conversación inteligente y contextual
Analytics	Python (Pandas) + Power BI	Inteligencia de negocio y reportes
Seguridad	DevSecOps + Kali Linux + JWT	Hardening, auditoría y cumplimiento
Infraestructura	Vercel + Railway / Convex Cloud	Escalabilidad y rendimiento
Valor Agregado para Decision Makers
1.	Diagnóstico basado en datos (OSINT): No vendemos humo, mostramos evidencia.
2.	Ciclo completo del producto: Un solo socio para todo el lifecycle digital.
3.	Agilidad con IA (vibecoding): Velocidad de startup con calidad de enterprise.
4.	Seguridad desde el diseño (DevSecOps): Productos robustos desde la raíz.
5.	Business Intelligence integrado: Decisiones basadas en datos, no en corazonadas.
Próximos Pasos
El sistema está listo para desarrollo. Recomendamos comenzar con la implementación del frontend en Astro + React y el backend en Convex para acelerar el time-to-market. La migración a backend propio (Express.js + SQLite) puede realizarse en una fase posterior si se requiere independencia total de la infraestructura SaaS.

¿Listo para construir algo juntos?
Jorge Cabrera L.
Santiago, Chile | +56 9 78661970 | jcabreralabbe@gmail.com
www.jorge-cabrera.cl

96.	

