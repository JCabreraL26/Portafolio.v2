Documento de Arquitectura de Producto y Dirección de Arte – Áperca SpA
Portfolio como Herramienta de Ventas High-Ticket

1. Resumen Ejecutivo
Este sistema no es una galería pasiva de proyectos, sino una plataforma interactiva de adquisición de clientes y demostración técnica en tiempo real. El sitio posiciona a Jorge Cabrera L. y a su firma (Áperca SpA) como un socio estratégico capaz de liderar el ciclo de vida completo de un producto digital (Digital Product Lifecycle): desde la investigación mediante técnicas de Inteligencia de Fuentes Abiertas (OSINT) y análisis de datos, pasando por la arquitectura UX y el vibecoding/Spec-Driven Development, hasta el despliegue de sistemas escalables, agentes autónomos y prácticas de ciberseguridad DevSecOps.
Objetivo de negocio: Convertir visitantes en leads calificados y acelerar el ciclo de ventas, posicionando a Áperca SpA como referente en consultoría de IA, desarrollo de productos digitales y seguridad desde el diseño. Meta: 20%+ de tasa de conversión de leads calificados a reuniones de diagnóstico en los primeros 3 meses.
Audiencias estratégicas:
Audiencia
Necesidad
Propuesta de Valor
Decision Makers & Clientes High-Ticket
Diagnóstico, consultoría de datos, desarrollo de productos de alto impacto sin fricción operativa
Diagnóstico basado en datos (OSINT), metodología STAR, agilidad con IA (vibecoding), seguridad desde el diseño
Hiring Managers / Reclutadores Tech
Evaluación de capacidad arquitectónica, calidad de código y visión end-to-end
Demostración técnica en vivo, arquitectura documentada, stack moderno, DevSecOps

Stack Tecnológico (Línea Ejecutiva):
Frontend: Astro, React, Tailwind CSS, TypeScript
Backend: Node.js, Express.js, Convex (serverless)
Base de Datos: SQLite, Turso, Drizzle ORM / Prisma
AI & Agentes: LangGraph, Gemini API, Zep (memoria conversacional)
Business Intelligence: Python (Pandas, NumPy), Power BI, SQL
Ciberseguridad: Kali Linux, DevSecOps, Secure SDLC, hardening de APIs
Infraestructura: Cloud Services (Vercel, Railway, AWS S3)

2. Design System
2.1 Fundamentos Visuales
El imagotipo de Áperca proyecta una estética geométrica, estructurada y de alto contraste (brutalista/constructivista). La figura del púgil en guardia transmite precisión, disciplina, estrategia y fuerza de impacto, encajando de manera óptima con la propuesta de un Product Builder enfocado en resolver problemas complejos y generar valor comercial.
2.1.1 Paleta Cromática Core
Base Neutral Absoluto:
Negro #0A0A0A (fondo principal, texto sobre fondo claro)
Blanco Puro #FFFFFF (texto, fondos de secciones)
Gris Carbono #1F1F1F (fondos secundarios, bordes)
Accent Color (Extraído del Isotipo):
Naranja Ámbar #F99D1C (High Visibility, CTAs, puntos de foco, highlights)
Verde Oliva Profundo #283329 (Fondos sofisticados de bajo brillo, acentos sutiles)
Paleta de Estados (para micro-interacciones):
Success: #34A853
Error: #EA4335
Warning: #FBBC04
Focus: #F99D1C (mismo que accent)
Variantes del Naranja Ámbar:
Base: #F99D1C
Hover / Dark: #C47A0A
Light / Background: #FEF3D9
Muted: #F9D98C
2.1.2 Tipografía
Familia Principal (Display / Headings):
Opción A: Inter (Inter Display Black, Inter Bold)
Ventaja: Excelente legibilidad en pantalla, muy extendida
Desventaja: Puede resultar "común"
Opción B: Syne (Syne Bold, Syne ExtraBold)
Ventaja: Personalidad geométrica fuerte, conecta con el brutalismo
Desventaja: Menos conocida, puede ser menos legible en tamaños pequeños
Opción C: Space Grotesk (Space Grotesk Bold)
Ventaja: Moderna, técnica, buena legibilidad
Desventaja: Similar a Inter pero con más carácter
Recomendación: Inter para cuerpo y títulos principales, Syne para títulos de sección y elementos display (mezcla controlada).
Familia Mono (Data Specs, código, métricas):
Opción A: JetBrains Mono
Ventaja: Excelente legibilidad, diseñada para desarrollo
Desventaja: Puede resultar "técnica" en exceso
Opción B: SF Mono
Ventaja: Muy limpia, integración nativa en Apple
Desventaja: Menos personalidad
Opción C: IBM Plex Mono
Ventaja: Neutra, muy legible
Desventaja: Menos distintiva
Recomendación: JetBrains Mono para datos y métricas, SF Mono para textos técnicos largos.
Jerarquía Tipográfica:
Nivel
Fuente
Tamaño
Tracking
Uso
H1
Inter Black / Syne ExtraBold
64px
-1%
Títulos principales, hero
H2
Inter Bold / Syne Bold
40px
-0.5%
Secciones principales
H3
Inter SemiBold
24px
0%
Subtítulos de sección
Body
Inter Regular
16px
0%
Texto general, line-height 1.6
Small
Inter Regular
14px
0%
Notas, metadata
Mono
JetBrains Mono
14px
0%
Datos, código, métricas
CTA
Inter Bold
16px
2%
Botones, uppercase

2.1.3 Tratamiento Fotográfico
Monocromático en blanco y negro: Alto contraste (sombras profundas, claroscuro)
Grano cinematográfico fino: Aporta textura y personalidad sin distraer (<5%)
Acentos en Naranja Ámbar: Vectoriales, tipográficos o de encuadre
Estilo: Urbano, arquitectónico, minimalista, con elementos de tecnología
2.1.4 Espaciado y Grid
Grid base: 12 columnas, gutter de 24px
Espaciado: Sistema base en múltiplos de 8px (8, 16, 24, 32, 48, 64, 96)
Breakpoints: Móvil (<640px), Tablet (640-1024px), Desktop (>1024px)
Contenido máximo: 1280px centrado

3. UX Writing & Narrativa (Scrollytelling)
Diseñado bajo el flujo narrativo del método STAR, orientado a la generación de leads de alto ticket con terminología técnica sofisticada.
3.1 Estructura de 5 Estaciones (1 segundo por scroll)
Estación (seg.)
Fase STAR
Copy Principal
Concepto Destacado
Variante (más técnica)
0.0 - 1.0s
Situation
"Auditamos la fricción operativa de tu negocio."
FRICCIÓN OPERATIVA
"Identificamos cuellos de botella con OSINT y análisis de datos."
1.0 - 2.0s
Task
"Mapeamos arquitectura con inteligencia OSINT."
INTELIGENCIA OSINT
"Cartografiamos flujos y dependencias con técnicas de fuentes abiertas."
2.0 - 3.0s
Action
"Diseñamos sistemas escalables impulsados por IA."
SISTEMAS ESCALABLES
"Construimos agentes autónomos y arquitecturas serverless."
3.0 - 4.0s
Result
"Desbloqueamos conversión y tracción real."
TRACCIÓN REAL
"+35% leads calificados. Eficiencia operativa probada."
4.0 - 5.0s
CTA
"Áperca. Ingeniería de producto & IA. Agenda tu diagnóstico."
DIAGNÓSTICO
"Áperca. Ingeniería, IA y seguridad. Agenda tu diagnóstico estratégico."

Conceptos destacados (tags visuales):
FRICCIÓN OPERATIVA
INTELIGENCIA OSINT
SISTEMAS ESCALABLES
TRACCIÓN REAL
DIAGNÓSTICO
Variante para reclutadores (se puede activar según audiencia):
"Full Stack + DevSecOps + Agentes IA"
"Arquitectura end-to-end documentada"
"Velocidad de startup con calidad enterprise"

4. Direcciones de Arte (3 Opciones)
4.1 Opción 1: Architectural Tech (Precision & Hard Data)
Concepto Visual: Minimalismo arquitectónico de alta tecnología. Apela a la rigurosidad, la ingeniería limpia y la toma de decisiones basada en datos.
Dirección Fotográfica:
Fotografía urbana y de producto en blanco y negro muy contrastado, con sombras duras e iluminación lateral.
Primeros planos de estructuras, cables de fibra óptica, reflejos de vidrio y pantallas oscuras.
Referencias: arquitectura brutalista, estudios de arquitectura, fotografía industrial.
Uso del Color:
Fondo dominado por gris muy oscuro (#0D0D0D).
El Naranja Ámbar aparece exclusivamente en indicadores vectoriales (marcas de encuadre, líneas de grilla, datos OSINT sobrepuestos) para dirigir la mirada del cliente.
Blanco puro para texto y elementos de información.
Animación / Transición:
Movimientos secos, cortes rápidos tipo cut-frame.
Tipografía estática que se revela mediante máscaras rectas de 0 a 100%.
Líneas y grillas que se dibujan al pasar el scroll.
Público objetivo principal: CTOs, reclutadores técnicos, clientes de software empresarial.
Fortalezas: Transmite precisión, rigor, calidad de código y capacidad de manejar sistemas complejos.

4.2 Opción 2: Constructivist Editorial (La Guardia & La Estrategia)
Concepto Visual: Inspirado en la geometría y peso del isotipo de Áperca. Combina la fuerza del diseño editorial contemporáneo con la agresividad de un estudio estratégico.
Dirección Fotográfica:
Retratos cinematográficos en B/N de alta resolución (estilo portrait session de líderes y entornos de trabajo minimalistas).
Iluminación puntual (efecto foco de luz), texturas táctiles y grano cinematográfico fino.
Referencias: editoriales de moda de alto valor, fotografía de líderes empresariales.
Uso del Color:
Fondo dividido en bloques de alto contraste (50% blanco, 50% negro).
El verde oliva oscuro actúa como masa de fondo en momentos clave.
El Naranja Ámbar rellena la tipografía display o resalta los conceptos clave con un bloque sólido (highlight).
Animación / Transición:
Tipografía display de gran escala que ocupa casi todo el canvas.
El scroll mueve el video en un zoom continuo hacia adelante (dolly-in suave).
Los conceptos destacados sobresalen de la pantalla con efecto de "revelación".
Público objetivo principal: CEOs, fundadores, decision makers, clientes high-ticket.
Fortalezas: Transmite liderazgo, estrategia, visión de alto nivel y capacidad de resolver problemas complejos.

4.3 Opción 3: Dark Cyber & Spec-Driven (Vibecoding & DevSecOps)
Concepto Visual: Estética tech-native moderna. Muestra la velocidad del desarrollo asistido por IA (vibecoding), la ciberseguridad y la precisión del código.
Dirección Fotográfica:
Capturas macro B/N de circuitos, terminales de comandos, reflejos de luz en pantallas oscuras y detalles mecánicos.
Referencias: cine cyberpunk, visualización de datos, interfaces de terminal.
Uso del Color:
Totalmente oscuro (#0A0A0A).
El Naranja Ámbar brilla como una señal luminosa de terminal (código highlighted, cursores parpadeantes, esquemas de arquitectura de información proyectados sobre las imágenes B/N).
Verde oliva como acento secundario en elementos de "seguridad" o "datos".
Animación / Transición:
Micro-glitches controlados.
Líneas de escaneo (scanlines) muy sutiles.
Overlays de especificaciones técnicas que se dibujan en tiempo real al pasar cada segundo.
Efecto "terminal" con texto que se escribe a sí mismo.
Público objetivo principal: Founders de startups, CTOs, desarrolladores, clientes de productos digitales ágiles.
Fortalezas: Transmite velocidad, modernidad, agilidad, seguridad y capacidad de innovar con IA.

4.4 Comparativa y Recomendación
Criterio
Opción 1 (Architectural Tech)
Opción 2 (Constructivist Editorial)
Opción 3 (Dark Cyber)
Conexión con isotipo
Media (precisión)
Alta (estrategia y fuerza)
Media (tecnología)
Atractivo high-ticket
Alta
Muy Alta
Media-Alta
Diferenciación en mercado
Media
Alta (única)
Baja (común en tech)
Versatilidad
Alta
Media-Alta
Media
Facilidad de implementación
Alta
Media
Alta
Tiempo de producción
Moderado
Alto
Moderado

Recomendación Principal: Opción 2 (Constructivist Editorial)
Razones:
Mejor conexión con el isotipo del púgil (estrategia, disciplina, fuerza).
Mayor diferenciación en el mercado (pocos portfolios usan este enfoque).
Atractivo universal para decision makers y reclutadores.
Permite integrar elementos de las otras opciones como variantes.
Estrategia de Combinación:
Sección del Sitio
Estilo
Justificación
Hero / Scrollytelling
Opción 2 (Editorial)
Impacto inicial, liderazgo
Proyectos / Casos de Éxito
Opción 1 (Architectural)
Datos, precisión, resultados
Sección Técnica / Stack
Opción 3 (Dark Cyber)
Modernidad, seguridad, código
CTA Final / Contacto
Opción 2 (Editorial)
Cierre estratégico


5. Arquitectura de Software (Resumen Ejecutivo)
5.1 Capa de Presentación (Frontend)
Tecnología: Astro + React + Tailwind
Scrollytelling Narrativo:
Animación sincronizada con scroll (scroll-driven video/canvas frame rendering).
Flujo STAR (Situation, Task, Action, Result) con copy dinámico.
Fotografía B/N de alto contraste con acentos en Naranja Ámbar.
Motor Interactivo Dual:
Formulario de Cualificación (Qualifying Funnel): 4 pasos (Perfil → Desafío → Presupuesto → Lead Capture).
Agente IA Conversacional: Mismo árbol de decisión en lenguaje natural.
5.2 Capa de Backend
Opción A (Actual): Convex (Serverless)
Módulos: funnel.ts, agent.ts, memory.ts
Integración nativa con Gemini API
Escalabilidad automática
Opción B (Alternativa): Node.js + Express.js + SQLite
Arquitectura en capas (Controllers → Services → Repositories)
Base de datos SQLite con Turso (edge replication)
Rate limiting, idempotencia, validación Zod
Mayor control y portabilidad
5.3 Agente IA con Context Layering
Estrategia: Context Layering (capas de contexto) en lugar de RAG vectorial.
Estructura de capas:
00_core_identity.ts: Visión, tono, límites (SIEMPRE ACTIVO)
01_qualifying_rules.ts: Lógica del funnel (SIEMPRE ACTIVO)
layers/high_ticket.ts: Tarifas, metodologías, casos de éxito
layers/recruiter.ts: CV, experiencia técnica, disponibilidad
layers/general_faq.ts: Preguntas frecuentes
Memoria conversacional: Integración con Zep para persistencia a largo plazo. local_override.json para edición en caliente de contexto.
Ahorro de tokens: Se envía solo la capa necesaria + últimos 3 mensajes.
5.4 Seguridad y DevSecOps
Capa
Medida
Herramienta
Entrada
Sanitización
Zod, DOMPurify
Almacenamiento
Cifrado
bcrypt, AES-256
Comunicación
TLS 1.3
SSL
Autenticación
JWT en cookies httpOnly
JWT
Desarrollo
SAST
ESLint security, SonarQube
Pre-commit
Secret scanning
truffleHog
Pre-deploy
Dependency scanning
Snyk, npm audit
Producción
DAST
OWASP ZAP
Monitoreo
Logging y alertas
Winston, Sentry

5.5 Business Intelligence & Analytics
Dashboard de conversión (Power BI / Streamlit):
Tasa de conversión Funnel (objetivo: >15%)
Leads calificados / mes (objetivo: >20)
CPA (Costo por Adquisición)
CTR promedio de campañas Meta Ads
Tasa de agendamiento de diagnóstico (objetivo: >40%)
OSINT & Análisis de datos: Identificación de brechas de mercado, ineficiencias operativas y oportunidades de automatización.

6. Implementación Técnica
6.1 Video de 5 Segundos (Hero)
Aspecto Técnico
Recomendación
Formato
MP4 H.265, dos versiones: vertical 1080x1920 (móvil) y horizontal 1920x1080 (desktop)
Peso
< 2MB para carga rápida
Lazy Load
Implementar con Intersection Observer
Autoplay
Con muted y loop (si es corto)
Fallback
Imagen estática para navegadores sin soporte
Performance
Defer loading, preconnect para dominios de video

6.2 Design Tokens en Código (CSS Variables)
css
:root {
  /* Colores Core */
  --color-black: #0A0A0A;
  --color-white: #FFFFFF;
  --color-carbon: #1F1F1F;
  --color-amber: #F99D1C;
  --color-amber-dark: #C47A0A;
  --color-amber-light: #FEF3D9;
  --color-olive: #283329;
  --color-success: #34A853;
  --color-error: #EA4335;
  --color-warning: #FBBC04;
  
  /* Tipografía */
  --font-display: 'Inter', 'Syne', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  
  /* Espaciado (múltiplos de 8) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;
  --space-2xl: 96px;
  
  /* Grid */
  --container-max: 1280px;
  --grid-gutter: 24px;
  --grid-columns: 12;
}
6.3 Estructura de Directorios (Frontend)
text
src/
├── components/
│   ├── scrollytelling/
│   │   ├── HeroVideo.astro
│   │   ├── ScrollySection.astro
│   │   └── STARFlow.astro
│   ├── funnel/
│   │   ├── FunnelForm.tsx
│   │   ├── Step1.tsx
│   │   ├── Step2.tsx
│   │   ├── Step3.tsx
│   │   └── Step4.tsx
│   ├── agent/
│   │   ├── AgentWidget.tsx
│   │   ├── ChatInterface.tsx
│   │   └── MessageBubble.tsx
│   └── shared/
│       ├── CTAButton.astro
│       ├── SectionHeader.astro
│       └── MetricDisplay.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── projects/
│   └── contact.astro
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   └── animations.css
└── utils/
    ├── designTokens.ts
    └── animations.ts

7. Roadmap de Implementación
Fase 1: Fundación (Semana 1-2)
☑ Definir Design System y dirección de arte (actual)
□ Seleccionar dirección de arte final (pendiente decisión)
□ Seleccionar stack tecnológico definitivo (Convex vs Backend propio)
□ Configurar repositorio y CI/CD
□ Diseñar fotografía y assets de video
Fase 2: Desarrollo Core (Semana 3-6)
□ Implementar scrollytelling STAR (5 estaciones)
□ Desarrollar formulario interactivo de cualificación (4 pasos)
□ Implementar agente IA conversacional con Context Layering
□ Configurar endpoints API (funnel, agent, analytics)
□ Integrar con calendario para agendamiento automático
Fase 3: Integración y Datos (Semana 7-8)
□ Configurar base de datos (SQLite / Convex)
□ Implementar dashboard de conversión (Power BI / Streamlit)
□ Integrar OSINT y análisis de datos
□ Configurar monitoreo y logging
Fase 4: Seguridad y Optimización (Semana 9-10)
□ Implementar DevSecOps pipeline (SAST, DAST, secret scanning)
□ Realizar auditoría de seguridad
□ Optimizar performance (Lighthouse > 95)
□ Pruebas de carga y escalabilidad
Fase 5: Lanzamiento y Marketing (Semana 11-12)
□ Despliegue en producción
□ Campaña Meta Ads dirigida
□ Monitoreo de métricas de conversión
□ Feedback y ajustes continuos

8. Conclusión y Próximos Pasos
Síntesis de Decisiones Pendientes (a tomar antes de iniciar desarrollo)
Decisión
Opciones
Recomendación
Dirección de Arte
Opción 1, 2 o 3 (o combinación)
Opción 2 con elementos de 1 y 3
Backend
Convex (actual) vs Express.js + SQLite
Mantener Convex para lanzamiento rápido, migrar después si se requiere control total
Tipografía Display
Inter vs Syne vs Space Grotesk
Syne para títulos, Inter para cuerpo
Paleta de Estados
Definida en documento
Aprobada
Fotografía
Producción propia vs stock
Ideal: producción propia con las pautas definidas

Valor Agregado para Decision Makers
Diagnóstico basado en datos (OSINT): No vendemos humo, mostramos evidencia.
Ciclo completo del producto: Un solo socio para todo el lifecycle digital.
Agilidad con IA (vibecoding): Velocidad de startup con calidad de enterprise.
Seguridad desde el diseño (DevSecOps): Productos robustos desde la raíz.
Business Intelligence integrado: Decisiones basadas en datos, no en corazonadas.
Próximos Pasos Inmediatos
Confirmar dirección de arte (seleccionar entre Opción 1, 2 o 3)
Producir fotografía y video (siguiendo las pautas definidas)
Definir stack definitivo (Convex o Backend propio)
Iniciar desarrollo (Fase 1 del roadmap)

¿Listo para tomar decisiones y comenzar la implementación?
Jorge Cabrera L.
Santiago, Chile | +56 9 78661970 | jcabreralabbe@gmail.com
www.jorge-cabrera.cl

