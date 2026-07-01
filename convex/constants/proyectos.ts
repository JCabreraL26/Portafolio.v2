// Información detallada de proyectos para el chatbot de ventas

export const PROYECTO_IDOMO = {
  nombre: "iDomo",
  tagline: "Sistema de Gestión de Conserjería Digital",
  
  problema: {
    titulo: "El Costo Oculto de la Gestión Manual",
    puntos: [
      "Tiempo perdido: 45 min/día en escritura manual = $225.000/mes",
      "Registro de visitas: 3-5 min manual vs 30 seg con QR (85% menos tiempo)",
      "Recepción encomiendas: 2-3 min manual vs 45 seg digital (75% menos tiempo)",
      "Reportes diarios: 30-60 min manual vs automático en tiempo real",
      "Errores humanos: Letra ilegible, papeles perdidos, información incompleta"
    ],
    impacto_economico: "$2.700.000/año perdidos por edificio en tiempo manual"
  },

  solucion: {
    descripcion: "Sistema SaaS multi-tenant que digitaliza 100% la gestión de conserjería",
    caracteristicas_clave: [
      {
        titulo: "QR Digital para Visitas",
        descripcion: "Residente genera QR desde celular, conserje escanea en 30 seg",
        beneficio: "Elimina 100% escritura manual, 0 errores de registro"
      },
      {
        titulo: "Gestión de Encomiendas",
        descripcion: "Registro digital con foto, notificaciones automáticas a residentes",
        beneficio: "75% menos tiempo, 0 paquetes perdidos"
      },
      {
        titulo: "Dashboard Administrativo",
        descripcion: "Métricas en tiempo real, reportes con 1 click, alertas automáticas",
        beneficio: "100% menos tiempo en reportes, decisiones basadas en datos"
      },
      {
        titulo: "PWA Instalable",
        descripcion: "App móvil nativa sin necesidad de App Store/Play Store",
        beneficio: "Funciona offline, actualizaciones automáticas, 0 instalación compleja"
      },
      {
        titulo: "Multi-Tenant Seguro",
        descripcion: "Cada edificio aislado, encriptación nivel bancario, backups automáticos",
        beneficio: "Cumplimiento normativo, auditoría completa, 0 preocupaciones de seguridad"
      }
    ]
  },

  tecnologia: {
    frontend: "React 19 + Vite + PWA",
    backend: "Supabase (PostgreSQL + Auth + Edge Functions)",
    seguridad: "Row Level Security (RLS), HMAC-SHA256 para QR, AES-256 encriptación",
    offline: "IndexedDB + cola de sincronización",
    especial: "Tokens QR criptográficos con timestamp y firma digital"
  },

  roi: {
    ahorro_mensual: "$375.000 por edificio",
    desglose: [
      { concepto: "Tiempo conserje", ahorro: "$225.000" },
      { concepto: "Papelería y útiles", ahorro: "$25.000" },
      { concepto: "Errores y reclamos", ahorro: "$45.000" },
      { concepto: "Reportes administrativos", ahorro: "$80.000" }
    ],
    roi_porcentaje: "750% primer mes",
    payback: "4 días"
  },

  precios: {
    implementacion: "$0 (Prueba 30 días gratuita)",
    mensual: "$49.990/mes por edificio",
    incluye: [
      "Hosting profesional + SSL",
      "Actualizaciones de seguridad",
      "Monitoreo 24/7",
      "Backup automático semanal",
      "Soporte técnico vía WhatsApp",
      "Capacitación inicial",
      "Reportes ilimitados"
    ]
  },

  implementacion: {
    tiempo: "48 horas",
    pasos: [
      "Día 1: Configuración inicial + carga de residentes (importación Excel)",
      "Día 2: Capacitación conserjes (30 min) + tutorial residentes (video 5 min) + Go-live"
    ],
    requisitos: [
      "Tablet Android/iOS ($50.000 una vez)",
      "Conexión Internet básica (ya existente)",
      "Sin servidores propios (100% nube)",
      "Sin mantención técnica (actualizaciones automáticas)"
    ]
  },

  casos_exito: [
    {
      nombre: "Edificio Las Terrazas (120 unidades)",
      antes: "3 horas/día escritura manual, 5 reclamos/mes por pérdida de info",
      despues: "22.5 min/día total, 0 reclamos, reportes automáticos",
      resultado: "$420.000 ahorrados/mes, satisfacción 95%"
    },
    {
      nombre: "Condominio Vista Verde (80 unidades)",
      problema: "Letra ilegible, visitantes esperando 5-10 min",
      solucion: "QR digital, notificaciones automáticas, dashboard remoto",
      resultado: "Tiempo espera reducido 90%, imagen edificio mejorada"
    }
  ],

  roles_usuario: [
    { rol: "Conserje", acceso: "Escanea QR, registra visitas y paquetes, dashboard operativo" },
    { rol: "Residente", acceso: "Genera QR para visitas, ve paquetes pendientes, historial" },
    { rol: "Admin", acceso: "Gestión completa, métricas, reportes, configuración edificio" }
  ],

  diferenciadores: [
    "QR criptográfico con firma digital (imposible falsificar)",
    "Offline-first: funciona sin internet, sincroniza después",
    "PWA instalable: experiencia nativa sin App Store",
    "Multi-tenant: cada edificio 100% aislado",
    "ROI inmediato: payback en 4 días",
    "Implementación express: operando en 48 horas"
  ]
};

export const PROYECTO_FIDIGITAL = {
  nombre: "FiDigital",
  tagline: "Sistema de Gestión de Turnos y Colas Virtuales",
  
  problema: {
    titulo: "Pérdida de Clientes por Esperas Indefinidas",
    puntos: [
      "Clientes no saben cuánto esperarán (frustración)",
      "Barberos pierden clientes que se van por espera larga",
      "Gestión manual de turnos: papel, confusión, errores",
      "Sin visibilidad de demanda en tiempo real",
      "Clientes deben estar físicamente en local para hacer fila"
    ],
    impacto_economico: "30% de clientes potenciales se van sin atenderse por espera indefinida"
  },

  solucion: {
    descripcion: "Sistema de turnos virtuales con cálculo de ETA en tiempo real y notificaciones automáticas",
    caracteristicas_clave: [
      {
        titulo: "Cola Virtual Inteligente",
        descripcion: "Cliente reserva turno desde su casa, ve tiempo de espera en vivo",
        beneficio: "Cliente llega justo a tiempo, 0 espera física en local"
      },
      {
        titulo: "Cálculo Dinámico de ETA",
        descripcion: "Sistema calcula tiempo real basado en servicios en curso y cola",
        beneficio: "Predicción precisa, cliente sabe exactamente cuándo llegar"
      },
      {
        titulo: "Panel Barbero Reactivo",
        descripcion: "Dashboard en tiempo real con próximos turnos, sin refresh manual",
        beneficio: "Barbero siempre informado, 0 confusión, flujo optimizado"
      },
      {
        titulo: "Sin Login para Clientes",
        descripcion: "Reserva con solo nombre y teléfono, acceso directo",
        beneficio: "Fricción mínima, conversión máxima, UX simple"
      },
      {
        titulo: "Notificaciones Automáticas",
        descripcion: "WhatsApp/SMS cuando falta 15 min para tu turno",
        beneficio: "Cliente no olvida, llegada puntual, 0 no-shows"
      }
    ]
  },

  tecnologia: {
    frontend: "Next.js 16 + React 19 + Tailwind CSS 4",
    backend: "Convex (Document-Relational DB + Serverless Functions)",
    realtime: "Suscripciones automáticas de Convex (WebSocket)",
    pwa: "Instalable en pantalla de inicio, funciona offline",
    especial: "Cálculo de ETA con lógica serverless, cron jobs para notificaciones"
  },

  arquitectura_convex: {
    ventajas: [
      "Suscripciones automáticas: cambios en DB se reflejan instantáneamente en UI",
      "Funciones serverless integradas: lógica de negocio junto a datos",
      "No necesita Redux/estado global: Convex maneja caché sincronizada",
      "Queries reactivas: getAvailableSlots calcula huecos libres en milisegundos",
      "Mutations idempotentes: verificación de duplicados automática"
    ],
    schema: [
      { tabla: "barbers", campos: "name, status (active/away)" },
      { tabla: "appointments", campos: "name, phone, serviceId, startTime, status (pending/doing/done)" },
      { tabla: "services", campos: "name, durationMinutes" }
    ]
  },

  flujo_cliente: [
    "1. Cliente abre app desde casa",
    "2. Ve servicios disponibles y tiempo de espera actual",
    "3. Reserva con nombre + teléfono (sin login)",
    "4. Recibe confirmación con hora estimada",
    "5. Sistema notifica 15 min antes por WhatsApp",
    "6. Cliente llega justo a tiempo, 0 espera física",
    "7. Barbero marca 'En curso' → Cliente ve actualización en vivo",
    "8. Barbero marca 'Finalizado' → Turno completado"
  ],

  flujo_barbero: [
    "1. Barbero abre panel en tablet/celular",
    "2. Ve cola de turnos en tiempo real (auto-actualizada)",
    "3. Marca turno 'En curso' al comenzar",
    "4. Sistema recalcula ETA para próximos clientes",
    "5. Marca 'Finalizado' al terminar",
    "6. Próximo turno sube automáticamente",
    "7. Dashboard siempre sincronizado sin refresh"
  ],

  precios: {
    setup: "$500.000 (una vez)",
    mensual: "$50.000/mes",
    incluye: [
      "Hosting + SSL + Dominio",
      "Actualizaciones automáticas",
      "Soporte técnico WhatsApp",
      "Notificaciones ilimitadas",
      "Panel barbero + App cliente",
      "Métricas y reportes",
      "Backup automático"
    ]
  },

  implementacion: {
    tiempo: "1 semana (7 días)",
    roadmap: [
      "Semana 1: Configuración de esquema y queries",
      "Semana 2: Flujo del cliente (no-login)",
      "Semana 3: Panel de control reactivo para barbero",
      "Semana 4: Notificaciones y pulido final"
    ],
    requisitos: [
      "Tablet/celular para barbero (ya existente)",
      "Conexión internet básica",
      "Sin servidores propios (100% nube Convex)",
      "Capacitación: 30 min demo"
    ]
  },

  casos_uso: [
    {
      negocio: "Barbería Premium (3 barberos)",
      problema: "Clientes esperando 1-2 horas sin saber cuándo les toca",
      solucion: "Cola virtual con ETA preciso, notificaciones automáticas",
      resultado: "30% más clientes atendidos, 0 quejas por espera, satisfacción 95%"
    },
    {
      negocio: "Peluquería Unisex (2 estilistas)",
      problema: "Clientes se iban si veían mucha gente esperando",
      solucion: "Reserva desde casa, llegada puntual, 0 espera física",
      resultado: "50% más reservas, imagen profesional, clientes felices"
    }
  ],

  diferenciadores: [
    "Convex real-time: actualizaciones instantáneas sin polling",
    "Cálculo dinámico de ETA: predicción precisa basada en servicios en curso",
    "Sin login para clientes: fricción mínima, conversión máxima",
    "Panel barbero reactivo: 0 refresh manual, siempre sincronizado",
    "PWA instalable: experiencia nativa sin App Store",
    "Notificaciones automáticas: WhatsApp/SMS integrado",
    "Implementación rápida: operando en 1 semana"
  ],

  metricas_clave: [
    "Tiempo promedio de espera por cliente",
    "Tasa de no-shows (clientes que no llegan)",
    "Cantidad de turnos por día/semana/mes",
    "Horarios pico de demanda",
    "Servicios más solicitados",
    "Eficiencia por barbero (turnos/hora)"
  ]
};

export const PROYECTO_BODAI_CLINIC = {
  nombre: "Bodai Clinic",
  tagline: "Sistema SaaS de Agendamiento con IA Conversacional",
  url_produccion: "https://www.clinicabodai.cl",
  
  contexto: {
    cliente: "Clínica dental especializada en ortodoncia invisible Auraline",
    ubicacion: "Chile",
    especialidad: "Ortodoncia invisible con sistema Auraline"
  },

  problema: {
    titulo: "Necesidad de Sistema de Agendamiento Automatizado",
    puntos: [
      "Gestión de múltiples ubicaciones (sede fija + itinerante)",
      "Conversión de visitantes web en leads calificados",
      "Reducción del costo de adquisición por paciente (CPA)",
      "Automatización del proceso de agendamiento",
      "Optimización de campañas de marketing digital"
    ],
    desafio_principal: "Crear un sistema que combine tecnología, diseño UX y marketing para maximizar conversión de leads"
  },

  solucion: {
    descripcion: "Sistema SaaS completo con IA conversacional, gestión multi-ubicación y estrategia de Growth Marketing integrada",
    caracteristicas_clave: [
      {
        titulo: "Chat Conversacional con IA",
        descripcion: "Asistente virtual en 3 pasos que guía al paciente en el agendamiento",
        tecnologia: "Google Gemini 1.5 Flash + Sistema RAG",
        beneficio: "Conversión automatizada de visitantes en leads calificados"
      },
      {
        titulo: "Sistema RAG (Retrieval-Augmented Generation)",
        descripcion: "IA que responde preguntas contextuales sobre Auraline y servicios",
        tecnologia: "Vector Search con embeddings 768D nativos de Convex",
        beneficio: "Respuestas precisas y contextuales sin intervención humana"
      },
      {
        titulo: "Gestión Multi-Ubicación",
        descripcion: "Sistema que maneja sede fija + ubicaciones itinerantes",
        tecnologia: "12 tablas relacionales en Convex",
        beneficio: "Flexibilidad para clínica con múltiples puntos de atención"
      },
      {
        titulo: "Email Automation",
        descripcion: "Notificaciones automáticas post-agendamiento",
        tecnologia: "Resend integrado",
        beneficio: "Comunicación automatizada con pacientes"
      },
      {
        titulo: "Bento Grid Emocional",
        descripcion: "Diseño de 5 secciones que cuentan historia de transformación",
        tecnologia: "Tailwind CSS + Framer Motion",
        beneficio: "UX que conecta emocionalmente y convierte"
      }
    ]
  },

  tecnologia: {
    frontend: "Next.js 14 + React 18 (App Router, TypeScript)",
    backend: "Convex (Backend-as-a-Service)",
    base_datos: "12 tablas relacionales en Convex",
    ia: "Google Gemini 1.5 Flash",
    rag: "Vector Search con embeddings 768D nativos",
    email: "Resend para automation",
    styling: "Tailwind CSS con Design System customizado",
    animaciones: "Framer Motion",
    arquitectura: "Serverless, escalable, multi-tenant"
  },

  arquitectura_tecnica: {
    descripcion: "Arquitectura serverless moderna con IA conversacional",
    componentes: [
      {
        capa: "Frontend",
        stack: "Next.js 14 + React 18 + TypeScript",
        features: "App Router, Server Components, Client Components estratégicos"
      },
      {
        capa: "Backend",
        stack: "Convex (BaaS)",
        features: "12 tablas relacionales, queries reactivas, mutations idempotentes"
      },
      {
        capa: "IA Conversacional",
        stack: "Gemini 1.5 Flash + RAG",
        features: "Vector Search, embeddings 768D, respuestas contextuales"
      },
      {
        capa: "Integraciones",
        stack: "Resend + Meta Ads",
        features: "Email automation, tracking de campañas"
      }
    ],
    ventajas_convex: [
      "Suscripciones automáticas: cambios en DB se reflejan instantáneamente en UI",
      "Funciones serverless integradas: lógica de negocio junto a datos",
      "Vector Search nativo: no necesita Pinecone/Weaviate externo",
      "Queries reactivas: UI siempre sincronizada",
      "Escalabilidad automática: sin configuración de infraestructura"
    ]
  },

  rol_triple_impacto: {
    full_stack_engineer: {
      responsabilidades: [
        "Arquitectura completa del sistema SaaS",
        "Implementación de 12 tablas relacionales en Convex",
        "Integración de Gemini 1.5 Flash para IA conversacional",
        "Desarrollo de Sistema RAG con Vector Search",
        "Integración de Resend para email automation",
        "TypeScript end-to-end para type safety",
        "Deployment y configuración de producción"
      ],
      logros: [
        "Sistema escalable serverless",
        "Latencia optimizada en respuestas de IA",
        "Gestión multi-ubicación funcional",
        "Flujo automatizado de conversión de leads"
      ]
    },
    ux_ui_designer: {
      responsabilidades: [
        "Diseño de Bento Grid de 5 secciones emocionales",
        "Creación de chat conversacional en 3 pasos",
        "Desarrollo de Design System con Tailwind CSS",
        "Implementación de animaciones con Framer Motion",
        "Diseño responsive mobile-first",
        "Optimización de flujo de usuario para conversión"
      ],
      logros: [
        "Reducción de fricción en proceso de agendamiento",
        "Interfaz intuitiva que no requiere capacitación",
        "Experiencia conversacional natural con IA",
        "Alta tasa de completación de formularios"
      ]
    },
    growth_marketer: {
      responsabilidades: [
        "Estrategia y ejecución de campañas Meta Ads",
        "Producción y edición de 3 Reels profesionales",
        "Optimización de funnels de conversión (CRO)",
        "Gestión presupuestaria de pauta digital",
        "A/B testing de creatividades",
        "Análisis de métricas y KPIs"
      ],
      logros: [
        "+35% incremento en leads calificados",
        "CTR 3.05% (muy superior a benchmark de industria dental)",
        "100K+ impresiones totales",
        "CPC optimizado a $47.9 CLP",
        "Reducción significativa de CPA"
      ]
    }
  },

  resultados_marketing: {
    metricas_principales: [
      {
        metrica: "Incremento en Leads Calificados",
        valor: "+35%",
        descripcion: "Logrado mediante sinergia de pauta digital y contenido orgánico (Reels)",
        impacto: "Reducción significativa del CPA"
      },
      {
        metrica: "Impresiones Totales",
        valor: "100K+",
        descripcion: "Alcance masivo con gestión presupuestaria eficiente",
        impacto: "Maximización de visibilidad en mercado objetivo"
      },
      {
        metrica: "CTR Promedio",
        valor: "3.05%",
        descripcion: "Muy superior al benchmark de la industria dental",
        impacto: "Alta relevancia y engagement de campañas"
      },
      {
        metrica: "CPC Optimizado",
        valor: "$47.9 CLP",
        descripcion: "Costo por clic en pesos chilenos",
        impacto: "Eficiencia en inversión publicitaria"
      }
    ],
    estrategias_implementadas: [
      "Campañas Meta Ads con segmentación por interés en ortodoncia invisible",
      "A/B testing continuo de creatividades",
      "Producción de 3 Reels profesionales de alto engagement",
      "Funnels de conversión optimizados (CRO)",
      "Email automation post-contacto",
      "Retargeting estratégico"
    ],
    contenido_producido: [
      {
        titulo: "Auraline - Así funciona",
        tipo: "Reel educativo",
        descripcion: "Explicación del proceso de ortodoncia invisible"
      },
      {
        titulo: "Adiós Flacidez - Javi",
        tipo: "Reel testimonial",
        descripcion: "Transformación y testimonio de paciente real"
      },
      {
        titulo: "Testimonios Finales",
        tipo: "Reel social proof",
        descripcion: "Experiencias reales de pacientes de Bodai"
      }
    ]
  },

  diferenciadores: [
    "Triple rol: Full Stack + UX + Growth Marketing en una sola persona",
    "IA conversacional con RAG: respuestas contextuales precisas",
    "Sistema multi-ubicación: gestión de sede fija + itinerante",
    "Resultados cuantificables: +35% leads, CTR 3.05%, 100K+ impresiones",
    "Arquitectura serverless moderna: escalable sin infraestructura compleja",
    "Design System emocional: Bento Grid que cuenta historia de transformación",
    "Producción de contenido: 3 Reels editados profesionalmente"
  ],

  valor_agregado: {
    para_reclutadores: [
      "Capacidad de ejecutar proyectos end-to-end sin equipos grandes",
      "Dominio de stack moderno: Next.js 14, Convex, Gemini AI, RAG",
      "Resultados medibles en marketing digital: CTR, CPA, conversión",
      "Experiencia en IA conversacional y sistemas RAG",
      "Habilidades de diseño UX que impactan conversión",
      "Producción de contenido de video (Reels)",
      "Reducción de costos: una persona hace trabajo de 3 especialistas"
    ]
  },

  preguntas_frecuentes: [
    {
      pregunta: "¿Cuánto tiempo tomó desarrollar Bodai Clinic?",
      respuesta: "El proyecto se desarrolló en fases: MVP en 3 semanas, iteraciones de UX en 2 semanas, campaña de marketing en 1 mes. Total aproximado: 2.5 meses desde concepto hasta resultados medibles."
    },
    {
      pregunta: "¿Por qué elegiste Convex sobre otras opciones?",
      respuesta: "Convex ofrece Vector Search nativo (ideal para RAG), suscripciones automáticas (UI siempre sincronizada), y serverless functions integradas. Esto elimina la necesidad de Pinecone, Redis, y configuración de infraestructura compleja."
    },
    {
      pregunta: "¿Cómo lograste CTR de 3.05% en Meta Ads?",
      respuesta: "Combinación de: (1) Creatividades de video (Reels) con transformaciones visuales, (2) Segmentación precisa por interés en ortodoncia, (3) A/B testing continuo, (4) Copy emocional enfocado en resultados, no en características."
    },
    {
      pregunta: "¿El sistema RAG realmente funciona bien?",
      respuesta: "Sí. Usa embeddings 768D de Convex para buscar información relevante sobre Auraline, luego Gemini genera respuesta contextual. Latencia <2 segundos, precisión >90% en preguntas frecuentes."
    }
  ]
};
