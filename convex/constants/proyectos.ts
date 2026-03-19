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
