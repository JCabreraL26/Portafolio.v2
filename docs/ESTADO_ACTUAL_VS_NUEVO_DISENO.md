# Análisis Arquitectónico: Estado Actual vs Nuevo Diseño
## Portfolio Áperca SpA - Transformación a Plataforma de Ventas High-Ticket

**Fecha:** 27 de Julio, 2026  
**Objetivo:** Transformar portfolio de reclutamiento a herramienta de adquisición de clientes high-ticket  
**Alcance:** Nueva landing page con scrollytelling + mantener páginas existentes y chatbot

---

## 1. ESTADO ACTUAL DEL SISTEMA

### 1.1 Arquitectura Frontend Existente

**Estructura de Páginas:**
```
src/pages/
├── index.astro              # Landing actual (orientada a reclutadores)
├── mi-perfil.astro          # Página de perfil profesional
├── 404.astro                # Página de error
└── proyectos/
    ├── bodai-clinic.astro   # Caso de estudio Bodai Clinic
    ├── menuclick.astro      # Caso de estudio MenuClick
    ├── idomo.astro          # Caso de estudio iDomo
    └── fidigital.astro      # Caso de estudio FiDigital
```

**Componentes Principales:**
```
src/components/
├── Navbar.astro             # Navegación principal
├── NavbarGlassy.astro       # Navegación alternativa
├── Footer.astro             # Footer del sitio
├── InteractiveGlobe.tsx     # Esfera 3D hero actual
├── Chatbot.tsx              # Widget conversacional (Convex + Gemini)
├── ChatbotWidget.tsx        # Wrapper del chatbot
├── iDomoPresentation.tsx    # Presentación interactiva iDomo
├── FiDigitalPresentation.tsx # Presentación interactiva FiDigital
└── ui/                      # Componentes UI reutilizables
```

**Layout Actual:**
```
src/layouts/
└── Layout.astro             # Layout base con SEO, fonts, ChatbotWidget
```

**Estilos:**
```
src/styles/
├── global.css               # Estilos globales base
└── custom.css               # Estilos personalizados (bento grid, service cards, etc.)
```

### 1.2 Flujo de Usuario Actual

**Landing Page Actual (`index.astro`):**

1. **Slide 1:** Hero con InteractiveGlobe (esfera 3D) + cita
2. **Slide 2:** "Soluciones digitales para un mundo dinámico"
3. **Slide 3:** Expertise (4 service cards en bento 2x2)
   - E-commerce & Tiendas Online
   - Sitios Web & Presencia Digital
   - Growth Marketing & Meta Ads
   - Consultoría UX & Transformación Digital
4. **Slide 4:** Proyectos Desplegados (case studies con bento grid asimétrico)
   - Bodai Clinic (video + métricas)
   - MenuClick / Más Pizza
   - FiDigital
   - iDomo
5. **Secciones adicionales:** Timeline, ventajas competitivas, contacto

**Orientación:** Reclutadores y hiring managers  
**CTA Principal:** Ver proyectos completos, demostración técnica  
**Tono:** Profesional, técnico, portfolio tradicional

### 1.3 Sistema de Chatbot Actual

**Tecnología:**
- Convex (Backend serverless)
- Google Gemini 1.5 Flash (IA conversacional)
- Zep (memoria conversacional - opcional)
- React + TypeScript

**Funcionalidad Actual:**
- Responde preguntas sobre proyectos
- Información técnica de stack
- Memoria de proyectos: iDomo, FiDigital, Bodai Clinic (en `convex/constants/proyectos.ts`)
- Orientado a responder preguntas de reclutadores

**Ubicación:** Widget flotante en todas las páginas (`ChatbotWidget` en `Layout.astro`)

### 1.4 Design System Actual

**Paleta de Colores:**
- Background: `#FAF9F6` (beige claro)
- Negro: `#111111`
- Blanco: `#FFFFFF`
- Acentos: Colores específicos por proyecto (Bodai: `#C9A96E`, MenuClick: `#DC2626`, FiDigital: `#b80000`)

**Tipografía:**
- Display: Syne (ExtraBold, Black)
- Body: Inter (Regular, SemiBold, Bold)
- Especial: Space Grotesk, Playfair Display, Special Elite

**Estilo Visual:**
- Bento grids asimétricos
- Cards con sombras suaves
- Animaciones sutiles
- Estética limpia y profesional

### 1.5 Assets Existentes

**Videos:**
- `/public/img/Portada_Bodai_ar4_3.mp4` (hero Bodai Clinic)
- `/public/img/2_Auraline_asífunciona.mp4` (reel Bodai)
- `/public/img/3_adios_flacidez_javi_editado.mp4` (reel Bodai)
- `/public/img/Reel 9 Bodai (Testimonios final).mp4` (reel Bodai)
- `/public/img/Logo_brillo_aureo.mp4` (logo animado)
- **`/public/img/Aperca_Video_Scrolling(1).mp4`** ✅ (video de 5 seg para nuevo hero)

**Imágenes:**
- Logos de proyectos
- Screenshots de casos de estudio
- Open Graph images

---

## 2. NUEVO DISEÑO OBJETIVO

### 2.1 Concepto y Posicionamiento

**Transformación Estratégica:**
- **De:** Portfolio para reclutadores → **A:** Plataforma de adquisición de clientes high-ticket
- **Propuesta de Valor:** Áperca SpA como socio estratégico para Digital Product Lifecycle completo
- **Diferenciadores:** OSINT, vibecoding, DevSecOps, IA conversacional, Business Intelligence

**Audiencias Duales:**

| Audiencia | Necesidad | Propuesta de Valor |
|-----------|-----------|-------------------|
| **Decision Makers & Clientes High-Ticket** | Diagnóstico, consultoría de datos, desarrollo de productos de alto impacto | Diagnóstico basado en datos (OSINT), metodología STAR, agilidad con IA (vibecoding), seguridad desde el diseño |
| **Hiring Managers / Reclutadores Tech** | Evaluación de capacidad arquitectónica, calidad de código, visión end-to-end | Demostración técnica en vivo, arquitectura documentada, stack moderno, DevSecOps |

**Meta de Conversión:** 20%+ de tasa de conversión de leads calificados a reuniones de diagnóstico en los primeros 3 meses.

### 2.2 Nuevo Design System

#### 2.2.1 Paleta Cromática Core

**Base Neutral Absoluto:**
- Negro: `#0A0A0A` (fondo principal, texto sobre fondo claro)
- Blanco Puro: `#FFFFFF` (texto, fondos de secciones)
- Gris Carbono: `#1F1F1F` (fondos secundarios, bordes)

**Accent Color (Extraído del Isotipo Áperca):**
- **Naranja Ámbar: `#F99D1C`** (High Visibility, CTAs, puntos de foco, highlights)
  - Hover/Dark: `#C47A0A`
  - Light/Background: `#FEF3D9`
  - Muted: `#F9D98C`
- Verde Oliva Profundo: `#283329` (Fondos sofisticados de bajo brillo, acentos sutiles)

**Paleta de Estados:**
- Success: `#34A853`
- Error: `#EA4335`
- Warning: `#FBBC04`
- Focus: `#F99D1C`

#### 2.2.2 Tipografía

**Familia Principal (Display / Headings):**
- **Recomendación:** Inter para cuerpo y títulos principales, Syne para títulos de sección y elementos display

**Familia Mono (Data Specs, código, métricas):**
- **Recomendación:** JetBrains Mono para datos y métricas, SF Mono para textos técnicos largos

**Jerarquía Tipográfica:**

| Nivel | Fuente | Tamaño | Tracking | Uso |
|-------|--------|--------|----------|-----|
| H1 | Inter Black / Syne ExtraBold | 64px | -1% | Títulos principales, hero |
| H2 | Inter Bold / Syne Bold | 40px | -0.5% | Secciones principales |
| H3 | Inter SemiBold | 24px | 0% | Subtítulos de sección |
| Body | Inter Regular | 16px | 0% | Texto general, line-height 1.6 |
| Small | Inter Regular | 14px | 0% | Notas, metadata |
| Mono | JetBrains Mono | 14px | 0% | Datos, código, métricas |
| CTA | Inter Bold | 16px | 2% | Botones, uppercase |

#### 2.2.3 Tratamiento Fotográfico

- **Monocromático en blanco y negro:** Alto contraste (sombras profundas, claroscuro)
- **Grano cinematográfico fino:** Aporta textura y personalidad sin distraer (<5%)
- **Acentos en Naranja Ámbar:** Vectoriales, tipográficos o de encuadre
- **Estilo:** Urbano, arquitectónico, minimalista, con elementos de tecnología

#### 2.2.4 Espaciado y Grid

- **Grid base:** 12 columnas, gutter de 24px
- **Espaciado:** Sistema base en múltiplos de 8px (8, 16, 24, 32, 48, 64, 96)
- **Breakpoints:** Móvil (<640px), Tablet (640-1024px), Desktop (>1024px)
- **Contenido máximo:** 1280px centrado

### 2.3 Nueva Landing Page: Scrollytelling STAR (5 Segundos)

**Concepto:** Video de fondo de 5 segundos con scrollytelling narrativo siguiendo metodología STAR

#### Estructura de 5 Estaciones (1 segundo por scroll)

| Estación (seg.) | Fase STAR | Copy Principal | Concepto Destacado | Variante (más técnica) |
|-----------------|-----------|----------------|-------------------|------------------------|
| 0.0 - 1.0s | **Situation** | "Auditamos la fricción operativa de tu negocio." | **FRICCIÓN OPERATIVA** | "Identificamos cuellos de botella con OSINT y análisis de datos." |
| 1.0 - 2.0s | **Task** | "Mapeamos arquitectura con inteligencia OSINT." | **INTELIGENCIA OSINT** | "Cartografiamos flujos y dependencias con técnicas de fuentes abiertas." |
| 2.0 - 3.0s | **Action** | "Diseñamos sistemas escalables impulsados por IA." | **SISTEMAS ESCALABLES** | "Construimos agentes autónomos y arquitecturas serverless." |
| 3.0 - 4.0s | **Result** | "Desbloqueamos conversión y tracción real." | **TRACCIÓN REAL** | "+35% leads calificados. Eficiencia operativa probada." |
| 4.0 - 5.0s | **CTA** | "Áperca. Ingeniería de producto & IA. Agenda tu diagnóstico." | **DIAGNÓSTICO** | "Áperca. Ingeniería, IA y seguridad. Agenda tu diagnóstico estratégico." |

**Conceptos destacados (tags visuales):**
- FRICCIÓN OPERATIVA
- INTELIGENCIA OSINT
- SISTEMAS ESCALABLES
- TRACCIÓN REAL
- DIAGNÓSTICO

**Variante para reclutadores (se puede activar según audiencia):**
- "Full Stack + DevSecOps + Agentes IA"
- "Arquitectura end-to-end documentada"
- "Velocidad de startup con calidad enterprise"

### 2.4 Direcciones de Arte (3 Opciones)

#### Opción 1: Architectural Tech (Precision & Hard Data)
- **Concepto:** Minimalismo arquitectónico de alta tecnología
- **Fotografía:** Urbana y de producto en B/N muy contrastado, sombras duras
- **Color:** Fondo gris oscuro (#0D0D0D), Naranja Ámbar en indicadores vectoriales
- **Animación:** Movimientos secos, cortes rápidos, tipografía con máscaras
- **Público:** CTOs, reclutadores técnicos, clientes de software empresarial

#### Opción 2: Constructivist Editorial (La Guardia & La Estrategia) ⭐ RECOMENDADA
- **Concepto:** Geometría y peso del isotipo de Áperca, diseño editorial contemporáneo
- **Fotografía:** Retratos cinematográficos en B/N, iluminación puntual, grano fino
- **Color:** Fondo dividido en bloques (50% blanco, 50% negro), verde oliva como masa de fondo
- **Animación:** Tipografía display de gran escala, zoom continuo (dolly-in), revelación de conceptos
- **Público:** CEOs, fundadores, decision makers, clientes high-ticket
- **Fortalezas:** Transmite liderazgo, estrategia, visión de alto nivel

#### Opción 3: Dark Cyber & Spec-Driven (Vibecoding & DevSecOps)
- **Concepto:** Estética tech-native moderna, velocidad de desarrollo con IA
- **Fotografía:** Capturas macro B/N de circuitos, terminales, pantallas oscuras
- **Color:** Totalmente oscuro (#0A0A0A), Naranja Ámbar como señal luminosa de terminal
- **Animación:** Micro-glitches, scanlines sutiles, overlays de especificaciones técnicas
- **Público:** Founders de startups, CTOs, desarrolladores, clientes de productos digitales ágiles

**Estrategia de Combinación Recomendada:**

| Sección del Sitio | Estilo | Justificación |
|-------------------|--------|---------------|
| Hero / Scrollytelling | Opción 2 (Editorial) | Impacto inicial, liderazgo |
| Proyectos / Casos de Éxito | Opción 1 (Architectural) | Datos, precisión, resultados |
| Sección Técnica / Stack | Opción 3 (Dark Cyber) | Modernidad, seguridad, código |
| CTA Final / Contacto | Opción 2 (Editorial) | Cierre estratégico |

### 2.5 Motor Interactivo Dual

#### Componente 1: Formulario de Cualificación (Qualifying Funnel)

**Propósito:** Filtro de clientes High-Ticket y canalización de consultas técnicas

**Flujo de 4 Pasos:**

| Paso | Contenido | Opciones |
|------|-----------|----------|
| **Paso 1 (Perfil/Rol)** | Empresa buscando desarrollo/consultoría vs. Reclutador/Hiring Manager | "Soy empresa" / "Soy reclutador" |
| **Paso 2 (Desafío principal)** | Selección del tipo de necesidad | Automatización/IA, Desarrollo MVP desde cero, Rediseño UX/CRO, Consultoría de Datos/OSINT |
| **Paso 3 (Alcance y Presupuesto)** | Rango de inversión y tiempo esperado | $3k-$10k / $10k-$30k / $30k+ / "No estoy seguro" |
| **Paso 4 (Lead Capture & Hand-off)** | Captura de contacto + disparo de webhook a la agenda o al agente | Email + teléfono + mensaje breve |

**Valor:** Evita reuniones improductivas; solo se contactan leads listos para invertir en soluciones de alto impacto.

#### Componente 2: Agente IA Conversacional (Actualizado)

**Sincronización:** Mantiene el mismo árbol de decisión que el formulario. Si el usuario interactúa con el chat, el agente puede ejecutar el test de cualificación en lenguaje natural.

**Context Layering (Nueva Estrategia):**

```
src/agent/context/
├── 00_core_identity.ts      # Visión de Jorge Cabrera, Áperca SpA, tono y límites (SIEMPRE ACTIVO)
├── 01_qualifying_rules.ts   # Lógica del funnel: preguntas y rangos High-Ticket (SIEMPRE ACTIVO)
├── layers/
│   ├── high_ticket.ts       # Tarifas, metodologías (STAR, OSINT), casos de éxito
│   ├── recruiter.ts         # CV detallado, experiencia técnica, disponibilidad
│   └── general_faq.ts       # FAQ sobre servicios, contacto directo
└── memory/
    ├── zep_client.ts        # Integración con Zep para memoria a largo plazo
    └── local_override.json  # Espacio editable en caliente para contexto dinámico
```

**Ahorro de Tokens:** Se envía solo la capa necesaria + últimos 3 mensajes.

**Valor:** Atención 24/7, respuestas inmediatas, experiencia personalizada sin fricción humana.

---

## 3. COMPARATIVA: ACTUAL VS NUEVO

### 3.1 Arquitectura de Páginas

| Aspecto | Estado Actual | Nuevo Diseño |
|---------|---------------|--------------|
| **Landing Principal** | `index.astro` (orientada a reclutadores) | **NUEVA:** `index-sales.astro` o reemplazo de `index.astro` |
| **Páginas de Proyectos** | Mantener sin cambios | ✅ Mantener sin cambios |
| **Mi Perfil** | Mantener sin cambios | ✅ Mantener sin cambios |
| **Chatbot** | Orientado a reclutadores | ✅ Actualizar con Context Layering dual (high-ticket + recruiter) |

### 3.2 Componentes a Crear

| Componente Nuevo | Propósito | Ubicación |
|------------------|-----------|-----------|
| **`ScrollytellingHero.tsx`** | Video de 5 seg con scroll-driven animation + copy STAR | `src/components/scrollytelling/` |
| **`QualifyingFunnel.tsx`** | Formulario de 4 pasos para cualificación de leads | `src/components/funnel/` |
| **`ConceptTag.tsx`** | Tags visuales para conceptos destacados (FRICCIÓN OPERATIVA, etc.) | `src/components/scrollytelling/` |
| **`CTADiagnostico.tsx`** | CTA principal "Agenda tu diagnóstico" | `src/components/cta/` |

### 3.3 Componentes a Actualizar

| Componente Existente | Cambios Requeridos |
|----------------------|-------------------|
| **`Chatbot.tsx`** | Implementar Context Layering, agregar lógica de cualificación dual |
| **`Layout.astro`** | Agregar nuevas CSS variables del design system |
| **`Navbar.astro`** | Posible ajuste de estilo para coherencia con nuevo diseño |

### 3.4 Estilos y Design Tokens

**Nuevo archivo:** `src/styles/design-tokens.css`

```css
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
```

### 3.5 Backend y APIs

| Aspecto | Estado Actual | Nuevo Diseño |
|---------|---------------|--------------|
| **Backend** | Convex (serverless) | ✅ Mantener Convex (opción de migrar a Express.js + SQLite en futuro) |
| **Endpoints Nuevos** | N/A | `/api/v1/funnel/step`, `/api/v1/funnel/submit`, `/api/v1/agent/chat` (actualizado) |
| **Base de Datos** | Convex DB | ✅ Agregar tablas: `leads`, `agent_sessions`, `agent_memory_store` |
| **Context Layering** | No existe | ✅ Implementar estructura de carpetas `convex/agent/context/` |

---

## 4. ASSETS Y RECURSOS

### 4.1 Video Hero (5 Segundos)

**Archivo Existente:** ✅ `/public/img/Aperca_Video_Scrolling(1).mp4`

**Especificaciones Técnicas:**
- **Formato:** MP4 H.265
- **Versiones:** Vertical 1080x1920 (móvil) y horizontal 1920x1080 (desktop)
- **Peso:** < 2MB para carga rápida
- **Lazy Load:** Implementar con Intersection Observer
- **Autoplay:** Con `muted` y `loop`
- **Fallback:** Imagen estática para navegadores sin soporte

### 4.2 Fotografía y Producción Visual

**Pendiente de Producción:**
- Fotografía B/N de alto contraste según dirección de arte elegida
- Retratos cinematográficos (si se elige Opción 2)
- Capturas macro de circuitos/terminales (si se elige Opción 3)

### 4.3 Tipografías

**Existentes en proyecto:**
- ✅ Inter (Google Fonts)
- ✅ Syne (Google Fonts)
- ✅ Space Grotesk (Google Fonts)

**Por agregar:**
- JetBrains Mono (Google Fonts o local)
- SF Mono (si se requiere, solo disponible en sistemas Apple)

---

## 5. ESTRATEGIA DE IMPLEMENTACIÓN

### 5.1 Enfoque Recomendado

**Opción A: Reemplazo Completo de Landing**
- Reemplazar `index.astro` actual con nueva landing de ventas
- Mover landing actual a `/reclutadores` o `/portfolio`
- **Ventaja:** URL principal optimizada para ventas
- **Desventaja:** Requiere redirección de tráfico existente

**Opción B: Landing Dual con Routing Inteligente** ⭐ RECOMENDADA
- Crear `index-sales.astro` como nueva landing principal
- Mantener `index.astro` actual en `/portfolio` o `/reclutadores`
- Implementar detección de audiencia (query params, cookies, user-agent)
- **Ventaja:** Preserva ambas experiencias, A/B testing posible
- **Desventaja:** Mayor complejidad inicial

**Opción C: Landing Única con Secciones Duales**
- Una sola landing con secciones adaptativas según audiencia detectada
- **Ventaja:** Mantenimiento simplificado
- **Desventaja:** Experiencia menos optimizada para cada audiencia

### 5.2 Preservación de Funcionalidad Existente

**✅ Mantener sin cambios:**
- Todas las páginas de proyectos (`/proyectos/*`)
- Página de perfil (`/mi-perfil`)
- Componentes de presentación interactiva (iDomo, FiDigital)
- Sistema de navegación (Navbar, Footer)
- Chatbot widget (solo actualizar lógica interna)

**🔄 Actualizar:**
- Chatbot: Agregar Context Layering y lógica de cualificación
- Layout: Agregar nuevas CSS variables
- Memoria del agente: Expandir con información de servicios high-ticket

---

## 6. MÉTRICAS Y OBJETIVOS

### 6.1 KPIs de Conversión

| Métrica | Objetivo | Herramienta de Medición |
|---------|----------|------------------------|
| **Tasa de Conversión Funnel** | >15% | Google Analytics + Convex Analytics |
| **Leads Calificados / mes** | >20/mes | Dashboard Power BI / Streamlit |
| **CPA (Costo por Adquisición)** | Optimizar continuamente | Meta Ads Manager |
| **CTR Promedio** | >3% | Meta Ads + Google Ads |
| **Tasa de Agendamiento** | >40% | Calendly / Cal.com integration |

### 6.2 Business Intelligence

**Dashboard de Conversión (Power BI / Streamlit):**
- Tasa de conversión Funnel (objetivo: >15%)
- Leads calificados / mes (objetivo: >20)
- CPA (Costo por Adquisición)
- CTR promedio de campañas Meta Ads
- Tasa de agendamiento de diagnóstico (objetivo: >40%)

**OSINT & Análisis de datos:**
- Identificación de brechas de mercado
- Ineficiencias operativas detectables en datos públicos
- Oportunidades de automatización basadas en patrones de comportamiento

---

## 7. STACK TECNOLÓGICO COMPLETO

### 7.1 Estado Actual

**Frontend:**
- Astro (framework principal)
- React 18 (componentes interactivos)
- TypeScript
- Tailwind CSS

**Backend:**
- Convex (serverless)
- Google Gemini 1.5 Flash (IA)

**Deployment:**
- Netlify (frontend)
- Convex Cloud (backend)

### 7.2 Nuevo Stack (Expansión)

**Frontend (sin cambios mayores):**
- ✅ Astro
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- **Nuevo:** Framer Motion (para animaciones scrollytelling)

**Backend:**
- ✅ Convex (mantener)
- **Nuevo:** Context Layering structure
- **Nuevo:** Qualifying Funnel logic
- **Opcional futuro:** Node.js + Express.js + SQLite (migración)

**AI & Agentes:**
- ✅ Google Gemini 1.5 Flash
- **Nuevo:** LangGraph (opcional para orquestación compleja)
- **Nuevo:** Zep (memoria conversacional a largo plazo)

**Business Intelligence:**
- **Nuevo:** Python (Pandas, NumPy) para análisis
- **Nuevo:** Power BI / Streamlit para dashboards
- **Nuevo:** SQL para queries analíticos

**Ciberseguridad:**
- **Nuevo:** DevSecOps pipeline
- **Nuevo:** Zod para validación de inputs
- **Nuevo:** Rate limiting (express-rate-limit)
- **Nuevo:** JWT en cookies httpOnly

**Infraestructura:**
- ✅ Netlify / Vercel (frontend)
- ✅ Convex Cloud (backend)
- **Opcional:** Railway / Fly.io (si se migra a backend propio)
- **Opcional:** Turso (SQLite edge) para base de datos

---

## 8. DECISIONES PENDIENTES

### 8.1 Dirección de Arte

**Opciones:**
1. Architectural Tech (Precision & Hard Data)
2. **Constructivist Editorial (La Guardia & La Estrategia)** ⭐ RECOMENDADA
3. Dark Cyber & Spec-Driven (Vibecoding & DevSecOps)

**Acción requerida:** Usuario debe confirmar dirección de arte antes de producción fotográfica

### 8.2 Stack de Backend

**Opciones:**
- **Opción A:** Mantener Convex (serverless, rápido, escalable) ⭐ RECOMENDADA PARA MVP
- **Opción B:** Migrar a Node.js + Express.js + SQLite (mayor control, portabilidad)

**Acción requerida:** Definir si se mantiene Convex o se migra en Fase 2

### 8.3 Estrategia de Landing

**Opciones:**
- **Opción A:** Reemplazo completo de `index.astro`
- **Opción B:** Landing dual con routing inteligente ⭐ RECOMENDADA
- **Opción C:** Landing única con secciones adaptativas

**Acción requerida:** Usuario debe confirmar estrategia de implementación

---

## 9. PRÓXIMOS PASOS INMEDIATOS

### Fase 1: Decisiones Estratégicas (Esta Semana)
1. ✅ Confirmar dirección de arte (Opción 1, 2 o 3)
2. ✅ Confirmar stack de backend (Convex vs Backend propio)
3. ✅ Confirmar estrategia de landing (A, B o C)

### Fase 2: Producción de Assets (Semana 2)
1. Producir fotografía según dirección de arte elegida
2. Optimizar video de 5 segundos (versiones móvil/desktop)
3. Crear assets visuales (iconos, ilustraciones, overlays)

### Fase 3: Desarrollo Frontend (Semanas 3-4)
1. Implementar ScrollytellingHero component
2. Implementar QualifyingFunnel component
3. Crear nuevos design tokens y estilos
4. Integrar video hero con scroll-driven animation

### Fase 4: Desarrollo Backend (Semanas 4-5)
1. Implementar Context Layering en agente
2. Crear endpoints de funnel (`/api/v1/funnel/*`)
3. Actualizar lógica de chatbot con cualificación dual
4. Implementar tablas de leads y sesiones

### Fase 5: Testing y Optimización (Semana 6)
1. Testing de conversión y UX
2. Optimización de performance (video, animaciones)
3. Testing de seguridad (DevSecOps)
4. A/B testing de copy y CTAs

### Fase 6: Lanzamiento y Monitoreo (Semana 7)
1. Deploy a producción
2. Configuración de analytics y dashboards
3. Monitoreo de métricas de conversión
4. Iteración basada en datos

---

## 10. RESUMEN EJECUTIVO

### Estado Actual
Portfolio profesional orientado a reclutadores con casos de estudio interactivos, chatbot conversacional y arquitectura moderna (Astro + React + Convex).

### Objetivo
Transformar en plataforma de adquisición de clientes high-ticket manteniendo funcionalidad existente para reclutadores.

### Estrategia
Nueva landing page con scrollytelling STAR (5 segundos), formulario de cualificación de 4 pasos, y agente IA con Context Layering dual (high-ticket + recruiter).

### Diferenciadores Clave
- **OSINT:** Diagnóstico basado en datos
- **Vibecoding:** Agilidad con IA
- **DevSecOps:** Seguridad desde el diseño
- **Business Intelligence:** Decisiones basadas en datos
- **Ciclo completo:** Un solo socio para todo el lifecycle digital

### Inversión Estimada
- **Tiempo:** 6-7 semanas (MVP completo)
- **Recursos:** 1 desarrollador full-stack (Jorge Cabrera)
- **Costo adicional:** Producción fotográfica (según dirección de arte)

### ROI Esperado
- 20%+ tasa de conversión de leads calificados
- 20+ leads high-ticket / mes
- Reducción de tiempo de ventas en 40%
- Posicionamiento como referente en consultoría de IA y product lifecycle

---

**Documento preparado por:** Jorge Cabrera L. - Áperca SpA  
**Fecha:** 27 de Julio, 2026  
**Versión:** 1.0  
**Estado:** Pendiente de aprobación de decisiones estratégicas
