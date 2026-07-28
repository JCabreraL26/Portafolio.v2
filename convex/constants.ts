/**
 * CONSTANTES DEL SISTEMA - ÁPERCA SpA
 * 
 * Información corporativa, servicios y contexto de negocio
 * para el sistema de IA (Telegram Bot + Web Chatbot)
 */

// Importar proyectos detallados
export { PROYECTO_IDOMO, PROYECTO_FIDIGITAL } from './constants/proyectos';

// ===================================
// IDENTIDAD CORPORATIVA
// ===================================

export const EMPRESA = {
  razon_social: "ÁPERCA SpA",
  rut: "78.318.808-2",
  giro: "Desarrollo de Software y Consultoría Digital",
  direccion: "Santiago, Chile",
  sitio_web: "https://jorge-cabrera.cl",
  
  // Propietario
  propietario: {
    nombre: "Jorge Cabrera",
    email: "jcabreralabbe@gmail.com",
    email_contacto: "contacto@aperca.cl", // Email principal para consultas de clientes
    linkedin: "https://www.linkedin.com/in/jorge-cabrera-labbe/",
    especialidad: "Fullstack Developer & UX Consultant",
  },
  
  // Descripción del negocio
  descripcion: "ÁPERCA SpA aplica pensamiento estratégico y metodologías ágiles para crear productos digitales que resuelven problemas reales. Combinamos diagnóstico basado en datos (OSINT, Power BI, Python) con arquitectura de sistemas adaptable a la etapa del negocio y desarrollo de agentes IA conversacionales.",
  
  // Misión
  mision: "Transformar fricción operativa en ventaja competitiva mediante soluciones tecnológicas estratégicas. Mapeamos el terreno con análisis de datos, diseñamos sistemas escalables impulsados por IA, construimos flujos agénticos que aprenden y convierten, y desbloqueamos conversión real con growth engineering.",
  
  // Valores
  valores: [
    "Decisiones técnicas basadas en datos, no en hype",
    "Arquitectura adaptable a etapa de negocio (serverless para validar, contenedores para escalar)",
    "RAG para precisión absoluta, Context Layering para velocidad y economía",
    "Métricas que importan: CAC, LTV, conversión",
    "Pensamiento estratégico aplicado a producto"
  ],
  
  // Especialidades técnicas
  especialidades: [
    "OSINT y análisis de datos (Power BI, Python, Pandas, NumPy)",
    "Ingeniería inversa de sistemas legacy",
    "Arquitectura serverless y contenedores (decisión basada en KPIs)",
    "Agentic AI: RAG con Vector Search o Context Layering",
    "Growth Engineering: Meta Ads, CRO, funnels de conversión",
    "DevSecOps y seguridad desde el diseño"
  ],
};

// ===================================
// SERVICIOS OFRECIDOS
// ===================================

export const SERVICIOS = {
  landing_simple: {
    titulo: "Landing Page Simple",
    descripcion: "Una página profesional y responsive. Ideal para empezar tu presencia digital. Incluye formulario de contacto, integración WhatsApp, SEO básico y Meta Tags.",
    tecnologias: ["Astro", "React", "Tailwind CSS"],
    precio_setup: 150000, // CLP
    precio_mantenimiento: 15000, // CLP/mes
    duracion_estimada: "24hrs-3 días",
    entregables: [
      "Diseño responsive (móvil/desktop)",
      "Formulario de contacto",
      "Botón WhatsApp flotante",
      "SEO básico + Meta Tags",
      "Hosting + Dominio primer año"
    ],
  },
  
  sitio_completo: {
    titulo: "Sitio Web Completo (Multi-página)",
    descripcion: "Hasta 5 páginas con navegación. Perfecto para negocios establecidos. Incluye diseño personalizado, panel admin básico, blog opcional y SEO avanzado.",
    tecnologias: ["Astro", "React", "TypeScript", "Tailwind CSS"],
    precio_setup: 300000, // CLP
    precio_mantenimiento: 25000, // CLP/mes
    duracion_estimada: "3-5 días",
    entregables: [
      "Hasta 5 páginas (Inicio, Servicios, Portafolio, etc)",
      "Diseño 100% personalizado",
      "Blog/noticias (opcional)",
      "Formularios múltiples",
      "Panel admin básico",
      "SEO avanzado + Google Analytics",
      "Hosting + Dominio primer año"
    ],
  },
  
  ecommerce: {
    titulo: "E-commerce con Panel Admin",
    descripcion: "Vende online sin comisiones. Catálogo ilimitado con sistema de personalización avanzado. Panel admin en tiempo real para gestionar todo tu negocio.",
    casos_exito: ["MenuClick - Más Pizza Ñuñoa ahorra $500.000/mes vs plataformas con comisión"],
    tecnologias: ["Astro", "React", "Convex", "WhatsApp Business", "Tailwind CSS"],
    precio_setup: 500000, // CLP
    precio_mantenimiento: 50000, // CLP/mes
    duracion_estimada: "3-7 días",
    entregables: [
      "Catálogo de productos ilimitado",
      "Sistema de personalización (ingredientes/opciones)",
      "Carrito de compras inteligente",
      "Integración WhatsApp Business",
      "Panel admin realtime",
      "PWA (funciona como app móvil)",
      "Hosting + Dominio primer año"
    ],
  },
  
  erp_personalizado: {
    titulo: "ERP Personalizado",
    descripcion: "Sistema a medida para tu operación. Análisis profundo de procesos, diseño de flujos personalizados, panel realtime y capacitación completa del equipo.",
    casos_exito: ["Importadora D&R - Eliminó 100% descuadres de inventario"],
    tecnologias: ["React", "TypeScript", "Supabase", "PostgreSQL", "PWA"],
    precio_setup: 1800000, // CLP
    precio_mantenimiento: 80000, // CLP/mes
    duracion_estimada: "5-7 días",
    entregables: [
      "Análisis profundo de procesos",
      "Diseño de flujos personalizados",
      "Panel de control realtime",
      "Roles y permisos",
      "PWA (funciona offline)",
      "Integración con sistemas existentes",
      "Capacitación del equipo",
      "Hosting + Dominio primer año"
    ],
  },
  
  consultoria_ux: {
    titulo: "Consultoría UX & Transformación Digital",
    descripcion: "Diagnóstico de procesos y oportunidades. Diseño de experiencia centrado en el usuario. Digitalización de flujos de trabajo a ecosistemas digitales.",
    metodologia: "Design Thinking",
    fases: ["Empatizar", "Definir", "Idear", "Prototipar", "Testear"],
    precio_base: 500, // USD por sesión
    duracion_estimada: "2-4 sesiones",
    entregables: [
      "Mapa de procesos actuales",
      "Identificación de pain points",
      "Propuesta de solución",
      "Wireframes de baja fidelidad",
      "Roadmap de implementación"
    ],
  },
  
  automatizacion: {
    titulo: "Automatización de Procesos",
    descripcion: "Integración de sistemas, automatización de tareas repetitivas, webhooks, APIs y bots. Ahorra tiempo y reduce errores humanos.",
    tecnologias: ["Node.js", "Python", "Convex", "Telegram Bot API", "Zapier/Make"],
    precio_base: 600, // USD
    duracion_estimada: "1-2 semanas",
    entregables: [
      "Scripts de automatización",
      "Integración entre sistemas",
      "Documentación técnica",
      "Monitoreo de errores"
    ],
  },
  
  // ===================================
  // SERVICIOS HIGH-TICKET (Nuevo Posicionamiento Estratégico)
  // ===================================
  
  diagnostico_osint: {
    titulo: "Diagnóstico OSINT y Análisis de Datos",
    descripcion: "Mapeamos el terreno con técnicas OSINT e ingeniería inversa de sistemas legacy. Transformamos información en decisiones mediante análisis de datos con Power BI y Python. Documentamos flujos críticos sin acceso a código fuente.",
    tecnologias: ["Python", "Pandas", "NumPy", "Power BI", "SQL", "OSINT Tools"],
    metodologia: "Análisis basado en datos públicos, ingeniería inversa, visualización de insights",
    precio_base: 3000, // USD
    rango_precio: "$3k - $10k (según alcance)",
    duracion_estimada: "1-3 semanas",
    casos_exito: ["iDomo - Mapeo completo de arquitectura legacy sin documentación"],
    entregables: [
      "Mapeo de arquitectura de sistemas existentes",
      "Análisis de datos con Power BI + Python",
      "Documentación de flujos críticos",
      "Identificación de cuellos de botella operacionales",
      "Roadmap de oportunidades de automatización",
      "Dashboard de métricas clave"
    ],
  },
  
  arquitectura_adaptable: {
    titulo: "Arquitectura de Sistemas Escalables con IA",
    descripcion: "Decisión técnica basada en datos, no en hype. Serverless para validar rápido (Next.js, Convex, Vercel), contenedores para escalar con control (Docker, Kubernetes). Arquitectura adaptable a la etapa de tu negocio.",
    tecnologias: ["Next.js 14", "Convex", "Docker", "Kubernetes", "Google Gemini", "Vercel"],
    metodologia: "Arquitectura adaptable según KPIs: serverless para MVP, contenedores para escala",
    precio_base: 10000, // USD
    rango_precio: "$10k - $50k+ (según alcance)",
    duracion_estimada: "3-8 semanas",
    casos_exito: ["Bodai Clinic - Sistema SaaS serverless, de 0 a producción en 3 semanas"],
    entregables: [
      "Arquitectura serverless o contenedores (decisión basada en KPIs)",
      "Stack moderno: Next.js, React, TypeScript, Convex",
      "Integración de IA conversacional (Google Gemini)",
      "DevSecOps desde el diseño",
      "CI/CD automatizado",
      "Documentación técnica completa",
      "Capacitación del equipo técnico"
    ],
  },
  
  agentic_ai: {
    titulo: "Agentic AI: Agentes Conversacionales Inteligentes",
    descripcion: "Construimos agentes IA que aprenden, responden y convierten. RAG con Vector Search para precisión absoluta, o Context Layering para respuestas rápidas y económicas. Decisión técnica basada en KPIs específicos de tu negocio.",
    tecnologias: ["Google Gemini", "LangGraph", "RAG", "Vector Search", "Convex", "Embeddings"],
    metodologia: "RAG para precisión absoluta, Context Layering para velocidad y economía",
    precio_base: 15000, // USD
    rango_precio: "$15k - $40k (según complejidad)",
    duracion_estimada: "4-10 semanas",
    casos_exito: [
      "Bodai Clinic - Agente conversacional con RAG, +35% leads calificados",
      "Sistema de agendamiento automatizado con IA"
    ],
    entregables: [
      "Agente conversacional con Google Gemini",
      "RAG con Vector Search o Context Layering (según KPIs)",
      "Integración con CRM y email automation",
      "Sistema de cualificación de leads automático",
      "Analytics y métricas de conversión",
      "A/B testing de prompts",
      "Documentación de arquitectura de IA"
    ],
  },
  
  growth_engineering: {
    titulo: "Growth Engineering: Conversión y Tracción Real",
    descripcion: "Meta Ads optimizadas, CRO basado en datos, funnels de alta conversión. Producción de contenido (Reels profesionales). Métricas que importan: CAC, LTV, conversión. No vanity metrics.",
    tecnologias: ["Meta Ads", "Google Analytics", "Hotjar", "A/B Testing", "Video Editing"],
    metodologia: "Growth hacking basado en datos, CRO, producción de contenido",
    precio_base: 5000, // USD/mes
    rango_precio: "$5k - $20k/mes (según alcance)",
    duracion_estimada: "Retainer mensual",
    casos_exito: [
      "Bodai Clinic - CTR 3.05%, 100K+ impresiones, CPC $47.9 CLP",
      "Producción de 3 Reels profesionales con alto engagement"
    ],
    entregables: [
      "Campañas Meta Ads optimizadas",
      "Producción de Reels profesionales",
      "Funnels de conversión CRO",
      "A/B testing de creatividades",
      "Dashboard de métricas (CAC, LTV, conversión)",
      "Optimización continua basada en datos",
      "Reportes mensuales de performance"
    ],
  },
};

// ===================================
// METODOLOGÍA DESIGN THINKING
// ===================================

export const DESIGN_THINKING = {
  descripcion: "Proceso iterativo de 5 fases para resolver problemas complejos con enfoque centrado en el usuario.",
  
  fases: {
    empatizar: {
      nombre: "Empatizar",
      objetivo: "Entender profundamente las necesidades del usuario",
      actividades: [
        "Entrevistas con stakeholders",
        "Observación de procesos reales",
        "Mapeo de pain points",
        "User journey mapping"
      ],
      duracion: "1-2 semanas",
    },
    
    definir: {
      nombre: "Definir",
      objetivo: "Sintetizar insights y definir el problema real",
      actividades: [
        "Análisis de datos cualitativos",
        "Creación de personas",
        "Definición de problem statement",
        "Priorización de oportunidades"
      ],
      duracion: "3-5 días",
    },
    
    idear: {
      nombre: "Idear",
      objetivo: "Generar múltiples soluciones creativas",
      actividades: [
        "Brainstorming sessions",
        "Crazy 8s",
        "Benchmarking competencia",
        "Evaluación de viabilidad técnica"
      ],
      duracion: "1 semana",
    },
    
    prototipar: {
      nombre: "Prototipar",
      objetivo: "Crear versiones tangibles de las soluciones",
      actividades: [
        "Wireframes de baja fidelidad",
        "Prototipos interactivos en Figma",
        "MVP funcional",
        "Documentación técnica"
      ],
      duracion: "2-4 semanas",
    },
    
    testear: {
      nombre: "Testear",
      objetivo: "Validar soluciones con usuarios reales",
      actividades: [
        "Pruebas de usabilidad",
        "A/B testing",
        "Recolección de feedback",
        "Iteración rápida"
      ],
      duracion: "1-2 semanas",
    },
  },
  
  principios: [
    "Centrado en el usuario, no en la tecnología",
    "Prototipo rápido antes de código final",
    "Iteración constante basada en feedback real",
    "Colaboración multidisciplinaria",
    "Bias hacia la acción: Ship early, iterate always"
  ],
};

// ===================================
// PROYECTOS DESTACADOS
// ===================================

export const PROYECTOS_DESTACADOS = [
  {
    nombre: "MenuClick",
    cliente: "Mas Pizza Deliver",
    industria: "Restauración / Delivery",
    descripcion: "E-commerce sin comisiones para pizzería local. Eliminó dependencia de apps de delivery (UberEats, PedidosYa) que cobraban 25-30% de comisión.",
    problema: "Pérdida de $500k CLP mensuales en comisiones a plataformas de delivery",
    solucion: "Catálogo digital profesional con integración WhatsApp Business. Cliente arma su pedido en el sitio y lo envía pre-formateado por WhatsApp.",
    resultados: {
      velocidad: "MVP en producción en menos de 1 semana",
      ahorro: "$500k CLP/mes en comisiones eliminadas",
      automatizacion: "Pedidos pre-formateados vs consultas manuales",
    },
    tecnologias: ["Next.js 14", "Convex Database", "TypeScript", "Tailwind CSS", "Turborepo", "Netlify"],
    url: "https://www.maspizzadelivery.cl",
  },
  
  {
    nombre: "Importadora D&R - ERP",
    cliente: "Importadora D&R",
    industria: "Importación / Retail",
    descripcion: "Sistema ERP a medida para gestión de inventario, proveedores y facturación. Eliminó descuadres de inventario que costaban tiempo y dinero.",
    problema: "Descuadres constantes de inventario, proceso manual de facturación, falta de visibilidad de stock en tiempo real",
    solucion: "ERP con módulos de inventario, proveedores, productos, facturación y reportes. Escaneo de códigos de barra con cámara web.",
    resultados: {
      precision: "99.8% de precisión en inventario (antes: ~70%)",
      eficiencia: "80% menos tiempo en carga de productos",
      visibilidad: "Dashboard en tiempo real de stock y ventas",
    },
    tecnologias: ["React", "Supabase", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    url: "https://importadora-dr.netlify.app",
  },
];

// ===================================
// STACK TECNOLÓGICO PREFERIDO
// ===================================

export const STACK_TECNOLOGICO = {
  frontend: {
    frameworks: ["React", "Next.js", "Astro"],
    lenguajes: ["TypeScript", "JavaScript"],
    estilos: ["Tailwind CSS", "CSS Modules"],
    estado: ["Zustand", "React Query", "Convex"],
  },
  
  backend: {
    frameworks: ["Node.js", "Express"],
    databases: ["PostgreSQL", "Convex", "Supabase"],
    orm: ["Drizzle", "Prisma"],
    apis: ["REST", "GraphQL", "tRPC"],
  },
  
  devops: {
    hosting: ["Netlify", "Vercel", "Railway"],
    ci_cd: ["GitHub Actions", "Netlify Deploy"],
    monitoreo: ["Sentry", "LogRocket"],
  },
  
  herramientas: {
    diseno: ["Figma", "Adobe XD"],
    versionamiento: ["Git", "GitHub"],
    comunicacion: ["Slack", "Notion", "Linear"],
  },
};

// ===================================
// EXPERIENCIA PROFESIONAL
// ===================================

export const EXPERIENCIA = {
  background: "Profesor de Educación Física convertido en desarrollador Full-Stack. Background en gestión de programas deportivos y educación me da una perspectiva única: entiendo procesos humanos antes de digitalizarlos.",
  
  habilidades_blandas: [
    "Design Thinking aplicado",
    "Comunicación clara con stakeholders no-técnicos",
    "Empatía con usuarios finales",
    "Gestión de proyectos ágiles",
    "Mentalidad de product owner"
  ],
  
  habilidades_tecnicas: [
    "Desarrollo Full-Stack (React, Node, TypeScript)",
    "Arquitectura de bases de datos relacionales",
    "UX/UI Design y prototipado",
    "Integración de APIs y automatización",
    "Performance optimization y SEO"
  ],
  
  diferenciadores: [
    "No solo codifico, entiendo el negocio detrás del software",
    "Priorizo MVP funcional sobre features perfectas",
    "Documentación clara y capacitación incluida",
    "Respuesta rápida y comunicación proactiva",
    "Código limpio, mantenible y escalable"
  ],
};

// ===================================
// FAQs COMUNES
// ===================================

export const FAQS = [
  {
    pregunta: "¿Cuál es el RUT de la empresa?",
    respuesta: "El RUT de ÁPERCA SpA es 78.318.808-2",
  },
  {
    pregunta: "¿Qué servicios ofrece ÁPERCA?",
    respuesta: "Ofrecemos desarrollo de E-commerce, sitios web corporativos, sistemas ERP/CRM a medida, consultoría UX con Design Thinking y automatización de procesos.",
  },
  {
    pregunta: "¿Cuánto tiempo toma un proyecto?",
    respuesta: "Depende del alcance. Un sitio web corporativo toma 1-2 semanas, un E-commerce 2-4 semanas, y un ERP a medida puede tomar 1-3 meses. Priorizamos MVP rápido e iteración continua.",
  },
  {
    pregunta: "¿Cuál es el proceso de trabajo?",
    respuesta: "Seguimos metodología Design Thinking: Empatizar (entender el problema), Definir (sintetizar insights), Idear (generar soluciones), Prototipar (MVP funcional), Testear (validar con usuarios reales).",
  },
  {
    pregunta: "¿Qué hace diferente a Jorge Cabrera?",
    respuesta: "Mi background como profesor me da una habilidad única: entiendo procesos humanos antes de digitalizarlos. No solo codifico, resuelvo problemas de negocio con la lógica de un gestor y la empatía de un profesor.",
  },
  {
    pregunta: "¿Incluyen capacitación?",
    respuesta: "Sí, todos los proyectos incluyen capacitación al equipo y documentación clara. Mi objetivo es que puedas administrar tu sistema de forma autónoma.",
  },
  {
    pregunta: "¿Trabajan solo en Chile?",
    respuesta: "No, trabajo con clientes de toda latinoamérica de forma remota. Los proyectos se gestionan mediante Slack/Notion y reuniones por Zoom.",
  },
  {
    pregunta: "¿Cómo es el proceso de cotización?",
    respuesta: "Primera reunión gratuita para entender tu necesidad. Luego envío una propuesta con alcance, timeline y presupuesto detallado. No hay costos ocultos.",
  },
];

// ===================================
// CONFIGURACIÓN DE CHATBOT
// ===================================

export const CHATBOT_CONFIG = {
  // Prompt del sistema para el chatbot web
  system_prompt: `Eres el asistente virtual de ÁPERCA SpA (RUT: 78.318.808-2), consultora que aplica pensamiento estratégico y metodologías ágiles para crear productos digitales que resuelven problemas reales.

POSICIONAMIENTO ESTRATÉGICO:
ÁPERCA combina diagnóstico basado en datos (OSINT, Power BI, Python) con arquitectura de sistemas adaptable a la etapa del negocio y desarrollo de agentes IA conversacionales.

ESPECIALIDADES TÉCNICAS:
• OSINT y análisis de datos (Power BI, Python, Pandas, NumPy)
• Ingeniería inversa de sistemas legacy
• Arquitectura adaptable: serverless para validar, contenedores para escalar (decisión basada en KPIs)
• Agentic AI: RAG con Vector Search para precisión absoluta, o Context Layering para velocidad y economía
• Growth Engineering: Meta Ads, CRO, funnels de conversión
• DevSecOps y seguridad desde el diseño

Tu rol es ayudar a visitantes del sitio web a:
1. Conocer los servicios high-ticket: Diagnóstico OSINT, Arquitectura Adaptable, Agentic AI, Growth Engineering
2. Entender la metodología basada en datos y decisiones técnicas (no hype)
3. Revisar casos de éxito (Bodai Clinic, iDomo, MenuClick)
4. Facilitar el contacto con Jorge
5. Agendar reuniones de diagnóstico estratégico

🗓️ CAPACIDAD DE AGENDAMIENTO:
Ahora puedes AGENDAR REUNIONES automáticamente. Tienes acceso a herramientas (tools) que te permiten:

FLUJO DE AGENDAMIENTO - SIGUE ESTOS PASOS EXACTAMENTE:

PASO 1 - Usuario expresa interés:
"Quiero agendar una reunión" / "Necesito hablar con Jorge" / "Agendar cita"

PASO 2 - Preguntar fecha preferida:
"¿Para qué día te gustaría la reunión? Puedo buscar en cualquier fecha (ejemplo: mañana, este viernes, 25 de febrero)"

PASO 3 - Verificar disponibilidad:
Usa la herramienta ver_disponibilidad con la fecha en formato YYYY-MM-DD
Ejemplo: ver_disponibilidad("2026-02-25")

PASO 4 - Ofrecer opciones (máximo 5 horarios):
"Tengo disponible para el [DÍA]:
• 09:00 hrs
• 11:30 hrs  
• 15:00 hrs
¿Cuál te acomoda mejor?"

PASO 5 - Recopilar datos (si no los tienes):
"Perfecto, necesito confirmar:
- Tu nombre completo
- Email de contacto
- ¿Cuál es el motivo de la reunión?"

PASO 6 - Confirmar con agendar_cita:
Usa la herramienta con todos los datos recopilados

PASO 7 - Mensaje final:
"✅ ¡Listo! Reunión confirmada:
📅 [DÍA] a las [HORA]
📧 Te enviamos la confirmación a [EMAIL]
📝 Motivo: [MOTIVO]

Jorge te estará esperando. Si necesitas cancelar o reprogramar, avísame."

REGLAS IMPORTANTES:
- SIEMPRE verifica disponibilidad antes de confirmar
- NO inventes horarios que no estén libres
- Si no hay slots ese día, ofrece el día siguiente
- Mantén el flujo en máximo 4-5 mensajes
- Sé amable pero eficiente
- Si el usuario cancela, usa la herramienta cancelar_cita

IMPORTANTE - RESTRICCIONES DE SEGURIDAD:
- NUNCA muestres datos financieros privados de la empresa
- NUNCA accedas a información de contabilidad
- SOLO puedes compartir información pública del portafolio
- Si te preguntan sobre finanzas internas, responde: "No tengo acceso a esa información. Para consultas corporativas, contacta directamente a jcabreralabbe@gmail.com"

Tono de comunicación:
- Profesional y estratégico (posicionamiento high-ticket)
- Enfocado en valor de negocio y ROI
- Técnico cuando es necesario, pero sin jerga innecesaria
- Decisiones basadas en datos, no en hype
- Directo y eficiente
- Proactivo en ofrecer diagnóstico estratégico gratuito (30 min)

SERVICIOS HIGH-TICKET (Menciona estos cuando sea relevante):

1. DIAGNÓSTICO OSINT Y ANÁLISIS DE DATOS ($3k-$10k):
   - Mapeo de arquitectura con técnicas OSINT
   - Ingeniería inversa de sistemas legacy
   - Análisis de datos con Power BI + Python
   - Documentación de flujos críticos sin código fuente
   - Caso de éxito: iDomo

2. ARQUITECTURA ADAPTABLE CON IA ($10k-$50k+):
   - Serverless para validar rápido (Next.js, Convex, Vercel)
   - Contenedores para escalar con control (Docker, Kubernetes)
   - Decisión técnica basada en KPIs, no en hype
   - Caso de éxito: Bodai Clinic (de 0 a producción en 3 semanas)

3. AGENTIC AI ($15k-$40k):
   - RAG con Vector Search para precisión absoluta
   - Context Layering para velocidad y economía
   - Integración con CRM y email automation
   - Caso de éxito: Bodai Clinic (+35% leads, CTR 3.05%)

4. GROWTH ENGINEERING ($5k-$20k/mes):
   - Meta Ads optimizadas, CRO basado en datos
   - Producción de Reels profesionales
   - Métricas que importan: CAC, LTV, conversión
   - Caso de éxito: Bodai Clinic (100K+ impresiones, CPC $47.9 CLP)

IMPORTANTE:
- Para proyectos high-ticket, SIEMPRE ofrece agendar diagnóstico estratégico gratuito (30 min)
- Si preguntan por OSINT, Power BI, Python, análisis de datos: menciona servicio de Diagnóstico OSINT
- Si preguntan por IA, agentes, RAG, chatbots: menciona servicio de Agentic AI
- Si preguntan por arquitectura, serverless, contenedores: menciona Arquitectura Adaptable
- Si preguntan por marketing, ads, conversión: menciona Growth Engineering

Datos corporativos que SÍ puedes compartir:
- Razón Social: ÁPERCA SpA
- RUT: 78.318.808-2
- Email: jcabreralabbe@gmail.com
- Sitio: jorge-cabrera.cl
- Servicios, precios base, casos de éxito públicos`,

  // Restricciones de acceso
  acceso_permitido: [
    "servicios_web",
    "proyectos_publicos",
    "faqs",
    "informacion_contacto",
    "agenda" // Nuevo: acceso a sistema de agendamiento
  ],
  
  acceso_denegado: [
    "contabilidad",
    "design_thinking_privado",
    "configuracion_sistema",
    "mensajes_telegram",
    "datos_financieros_empresa"
  ],
  
  // Herramientas disponibles para el chatbot (Function Calling)
  tools: [
    {
      name: "ver_disponibilidad",
      description: "Busca horarios disponibles en la agenda de Jorge Cabrera para una fecha específica. Retorna slots de 30 minutos libres entre 8:00 AM y 10:00 PM.",
      parameters: {
        type: "object",
        properties: {
          fecha: {
            type: "string",
            description: "Fecha en formato ISO YYYY-MM-DD (ejemplo: 2026-02-25)"
          }
        },
        required: ["fecha"]
      }
    },
    {
      name: "agendar_cita",
      description: "Agenda una reunión confirmada con Jorge Cabrera. Valida que el horario esté disponible antes de confirmar.",
      parameters: {
        type: "object",
        properties: {
          fecha_inicio: {
            type: "number",
            description: "Timestamp Unix del inicio de la reunión (en milisegundos)"
          },
          cliente_nombre: {
            type: "string",
            description: "Nombre completo del cliente"
          },
          cliente_email: {
            type: "string",
            description: "Email del cliente para confirmación"
          },
          motivo: {
            type: "string",
            description: "Motivo o tema de la reunión"
          },
          duracion: {
            type: "number",
            description: "Duración en minutos (opcional, default: 30)"
          }
        },
        required: ["fecha_inicio", "cliente_nombre", "cliente_email", "motivo"]
      }
    },
    {
      name: "listar_mis_citas",
      description: "Lista las citas agendadas de un cliente usando su email",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email del cliente"
          }
        },
        required: ["email"]
      }
    },
    {
      name: "cancelar_cita",
      description: "Cancela una cita existente",
      parameters: {
        type: "object",
        properties: {
          citaId: {
            type: "string",
            description: "ID de la cita a cancelar"
          },
          razon: {
            type: "string",
            description: "Razón de la cancelación"
          }
        },
        required: ["citaId", "razon"]
      }
    }
  ],
  
  // Respuestas predefinidas
  respuestas_seguridad: {
    datos_financieros: "Por seguridad, no tengo acceso a información financiera de la empresa. Para consultas corporativas, contáctate directamente con Jorge Cabrera en jcabreralabbe@gmail.com",
    datos_privados: "Esa información es privada. Si necesitas acceso a datos internos, por favor contáctate con el equipo de ÁPERCA SpA.",
  },
};

// ===================================
// EXPORTS
// ===================================

export default {
  EMPRESA,
  SERVICIOS,
  DESIGN_THINKING,
  PROYECTOS_DESTACADOS,
  STACK_TECNOLOGICO,
  EXPERIENCIA,
  FAQS,
  CHATBOT_CONFIG,
};
