# Roadmap de Implementación: Landing Page de Ventas High-Ticket
## Áperca SpA - Portfolio como Herramienta de Adquisición

**Fecha de inicio:** 27 de Julio, 2026  
**Duración estimada:** 6-7 semanas  
**Objetivo:** Nueva landing page con scrollytelling + formulario de cualificación + chatbot actualizado

---

## FASE 0: DECISIONES ESTRATÉGICAS ✅ COMPLETADA (27 Jul 2026)

### 🎯 Objetivo
Tomar decisiones críticas antes de comenzar desarrollo

### ✅ Tareas COMPLETADAS

#### Decisión 1: Dirección de Arte ✅
**Decisión tomada:**
- [x] **Opción 2:** Constructivist Editorial (La Guardia & La Estrategia) ⭐ SELECCIONADA

**Implementación:**
- Paleta: Negro (#0A0A0A), Blanco (#FFFFFF), Ámbar (#F99D1C)
- Tipografía: Syne (display), Inter (body), JetBrains Mono (code)
- Sin iconos innecesarios, minimalismo editorial

#### Decisión 2: Stack de Backend ✅
**Decisión tomada:**
- [x] **Opción A:** Mantener Convex (serverless, rápido, escalable) ⭐ SELECCIONADA

**Justificación:** Mantener tier gratuito, arquitectura serverless probada

#### Decisión 3: Estrategia de Landing ✅
**Decisión tomada:**
- [x] **Opción B:** Landing dual con routing simple ⭐ SELECCIONADA

**Implementación:**
- `/` → Nueva landing de ventas con scrollytelling
- `/reclutadores` → Portfolio técnico (landing actual con globo 3D)
- Link en Navbar: "Portfolio Técnico"

### 📋 Entregables COMPLETADOS
- [x] Decisiones estratégicas tomadas y documentadas
- [x] Estructura de carpetas definida
- [x] Video de scrollytelling editado (5 segundos, 6 estaciones)

---

## FASE 1: SETUP Y CONFIGURACIÓN ✅ COMPLETADA (27 Jul 2026)

### 🎯 Objetivo
Preparar entorno de desarrollo y estructura base

### ✅ Tareas COMPLETADAS

#### 1.1 Configuración de Design Tokens ✅
**Archivo creado:** `src/styles/design-tokens.css`

**Implementación:**
- Paleta Constructivismo Editorial completa
- Sistema de espaciado en múltiplos de 8px
- Tipografía: Syne (display), Inter (body), JetBrains Mono (mono)
- Grid system responsive
- Variables de sombras y transiciones

#### 1.2 Mover Landing Actual ✅
**Acción realizada:**
- `src/pages/index.astro` → `src/pages/reclutadores.astro`
- Preservado todo el contenido (globo 3D, proyectos, servicios)
- Accesible en `/reclutadores`

#### 1.3 Actualizar Navbar ✅
**Archivo modificado:** `src/components/Navbar.astro`
- Agregado link "Portfolio Técnico" → `/reclutadores`
- Traducciones ES/EN implementadas
- Highlight activo en ruta actual

#### 1.4 Importar Design Tokens ✅
**Archivo modificado:** `src/layouts/Layout.astro`
- Design tokens importados globalmente
- Orden correcto: global.css → design-tokens.css → scrollytelling.css → custom.css

---

## FASE 2: SCROLLYTELLING HERO ✅ COMPLETADA (27 Jul 2026)

### 🎯 Objetivo
Implementar experiencia de scrollytelling con video sincronizado

### ✅ Tareas COMPLETADAS

#### 2.1 Componente ScrollytellingHero.tsx ✅
**Archivo creado:** `src/components/scrollytelling/ScrollytellingHero.tsx`

**Características implementadas:**
- **Scroll-driven animation** con `requestAnimationFrame`
- **6 estaciones** sincronizadas con video de 5 segundos:
  - 0s: Hero "OPERATIONAL FRICTION / SYSTEMS DIAGNOSTIC"
  - 1s: "Mapeamos arquitectura con inteligencia OSINT"
  - 2s: "Diseñamos sistemas escalables impulsados por IA"
  - 3s: "Construimos agentes autónomos y arquitecturas serverless"
  - 4s: "Desbloqueamos conversión y tracción real"
  - 5s: Logo Áperca + CTA "Agenda tu Diagnóstico"

**Elementos de cada estación:**
- **H1 en color ámbar** (#F99D1C) con fuente Syne
- **Animaciones de aparición/desaparición** (titleFadeIn, descriptionFadeIn)
- **Texto de bajada** (2 líneas) complementando el mensaje central
- **Botones CTA** con links a proyectos relevantes
- **Iconos Lucide React** (ArrowDown, ArrowRight)

#### 2.2 Estilos scrollytelling.css ✅
**Archivo creado:** `src/styles/scrollytelling.css`

**Implementación:**
- **500vh de scroll** (100vh por segundo de video)
- **Sticky content** con video de fondo
- **Overlay oscuro** para contraste de texto
- **Animaciones CSS:**
  - `titleFadeIn`: aparición con blur y scale
  - `descriptionFadeIn`: fade in con delay
  - `pulse`: para logo final
  - `bounceHint`: para botón de scroll inicial
- **Indicadores de progreso:**
  - Barra de progreso inferior
  - Dots de navegación
- **Responsive completo** (desktop, tablet, móvil)

#### 2.3 Nueva Landing Page index.astro ✅
**Archivo reemplazado:** `src/pages/index.astro`

**Estructura final:**
- Scrollytelling Hero (500vh)
- Sección Contacto + Footer
- Sin contenido duplicado del portfolio técnico

#### 2.4 Dependencias Instaladas ✅
- `lucide-react` para iconos minimalistas

### 📋 Entregables COMPLETADOS
- [x] Componente ScrollytellingHero funcional
- [x] Video sincronizado con scroll (frame-by-frame)
- [x] 6 estaciones con copy, descripciones y CTAs
- [x] Animaciones de aparición/desaparición
- [x] H1 en color ámbar con text-shadow
- [x] Textos de bajada (2 líneas) en cada estación
- [x] Responsive completo
- [x] Landing dual funcionando (`/` y `/reclutadores`)

### 🎨 Detalles de Diseño Implementados
**Tipografía:**
- H1: Syne Black, color ámbar, text-shadow glow
- Subtítulo: JetBrains Mono, uppercase, ámbar
- Descripción: Inter Regular, blanco 90% opacidad
- CTAs: Syne Bold, uppercase, letter-spacing

**Animaciones:**
- Título: fade in + blur + scale (0.8s)
- Descripción: fade in con delay de 0.3s (1s)
- Logo final: pulse infinito (3s)
- Botón scroll: bounce hint (2s)

**Colores:**
- Fondo video: overlay gradient negro
- H1: #F99D1C (ámbar)
- Texto: #FFFFFF (blanco)
- Botón primario: ámbar sobre negro
- Botón secundario: outline blanco

---

## FASE 2: SCROLLYTELLING HERO ✅ COMPLETADA (27 Jul 2026)

### 🎯 Objetivo
Implementar hero section con video de 5 segundos y scrollytelling con 6 estaciones

### ✅ Tareas COMPLETADAS

#### 2.1 Componente ScrollytellingHero ✅
**Archivo:** `src/components/scrollytelling/ScrollytellingHero.tsx`

**Funcionalidades implementadas:**
- ✅ Video sincronizado con scroll (600vh para mayor fluidez)
- ✅ 6 estaciones mapeadas a segundos del video (0s-5s)
- ✅ Detección de scroll con `requestAnimationFrame`
- ✅ Actualización de `video.currentTime` basada en progreso de scroll
- ✅ Sistema de estaciones con contenido dinámico
- ✅ Indicador de progreso visual
- ✅ Dots de navegación
- ✅ Responsive completo

**Estaciones implementadas:**
1. **Estación 0 (0s-1s):** "FRICCION OPERATIVA" - Systems Diagnostic
2. **Estación 1 (1s-2s):** "Mapear el terreno" - OSINT + Power BI + Python
3. **Estación 2 (2s-3s):** "Sistemas escalables impulsados por IA" - Arquitectura adaptable
4. **Estación 3 (3s-4s):** "Agentic AI" - RAG vs Context Layering
5. **Estación 4 (4s-5s):** "Conversión y tracción real" - Growth Engineering
6. **Estación 5 (5s):** Logo Áperca + CTA "Agenda tu Diagnóstico"

**Tipografía aplicada:**
- ✅ H1: Syne (color ámbar #F99D1C, font-weight: 900)
- ✅ Subtítulo: JetBrains Mono (uppercase, ámbar)
- ✅ Descripción: Inter (blanco 85% opacidad, centrado, max 2 líneas)

**Optimizaciones realizadas:**
- ✅ Altura de scroll aumentada de 500vh a 600vh para mayor fluidez
- ✅ Eliminación de animaciones CSS que bloqueaban el video
- ✅ Verificación de `readyState` del video antes de manipular
- ✅ Fallback con `onLoadedMetadata` para asegurar carga

#### 2.2 Estilos del Scrollytelling ✅
**Archivo:** `src/styles/scrollytelling.css`

**Estilos implementados:**
- ✅ Video de fondo sticky con overlay oscuro
- ✅ Estaciones con fade in/out suave
- ✅ Responsive breakpoints (desktop, tablet, móvil)
- ✅ Animaciones optimizadas sin bloquear video
- ✅ Logo final con pulse infinito

#### 2.3 Navbar Oscuro con Ámbar ✅
**Archivo:** `src/components/Navbar.astro`

**Cambios implementados:**
- ✅ Fondo negro semi-transparente: `rgba(10, 10, 10, 0.9)`
- ✅ Glassmorphism con `backdrop-filter: blur(12px)`
- ✅ Logo actualizado a `logo-nav-bar.png`
- ✅ Texto "aperca" en blanco
- ✅ Subtítulo en ámbar (#F99D1C)
- ✅ Links blancos con hover ámbar
- ✅ Botón contacto coherente (blanco → hover ámbar)
- ✅ Menú hamburguesa móvil con mismo fondo oscuro
- ✅ Borde naranja en menú móvil (2px solid #F99D1C)

#### 2.4 Widget del Chat Rediseñado ✅
**Archivo:** `src/components/Chatbot.tsx`

**Diseño Constructivismo Editorial aplicado:**
- ✅ Botón flotante: fondo verde oliva (#283329), borde naranja (#F99D1C)
- ✅ Logo navbar en botón con glow naranja
- ✅ Anillo animado naranja (30% opacidad)
- ✅ Badge naranja con texto verde oliva
- ✅ Header: fondo verde oliva, borde inferior naranja
- ✅ Mensajes usuario: fondo verde oliva, borde naranja
- ✅ Input focus: borde naranja
- ✅ Botón enviar: verde oliva con borde naranja, hover naranja

#### 2.5 Footer Limpio ✅
**Archivos:** `src/components/Footer.astro`, `src/styles/custom.css`

**Implementación:**
- ✅ Nueva clase `footer-clean` para landing de ventas
- ✅ Fondo blanco (#FFFFFF), texto negro (#111)
- ✅ Borde superior gris sutil (#E5E5E5)
- ✅ Prop `variant` para alternar entre "red" (portfolio) y "clean" (ventas)
- ✅ Texto adaptado: "ÁPERCA SpA" en clean, "Jorge Cabrera UX" en red
- ✅ Tagline: "Pensamiento estratégico"

#### 2.6 Actualización del Agente Conversacional ✅
**Archivo:** `convex/constants.ts`

**Nuevo posicionamiento estratégico implementado:**

**EMPRESA actualizada:**
- ✅ Descripción: Pensamiento estratégico + metodologías ágiles + diagnóstico basado en datos
- ✅ Misión: Transformar fricción operativa en ventaja competitiva
- ✅ Valores: Decisiones técnicas basadas en datos (no hype), arquitectura adaptable
- ✅ Especialidades: OSINT, Power BI, Python, ingeniería inversa, Agentic AI, Growth Engineering

**SERVICIOS HIGH-TICKET agregados:**

1. **diagnostico_osint ($3k-$10k):**
   - Mapeo con técnicas OSINT
   - Análisis Power BI + Python (Pandas, NumPy)
   - Ingeniería inversa de sistemas legacy
   - Caso de éxito: iDomo

2. **arquitectura_adaptable ($10k-$50k+):**
   - Serverless para validar (Next.js, Convex, Vercel)
   - Contenedores para escalar (Docker, Kubernetes)
   - Decisión basada en KPIs
   - Caso de éxito: Bodai Clinic

3. **agentic_ai ($15k-$40k):**
   - RAG con Vector Search para precisión absoluta
   - Context Layering para velocidad y economía
   - Integración CRM + email automation
   - Caso de éxito: Bodai Clinic (+35% leads, CTR 3.05%)

4. **growth_engineering ($5k-$20k/mes):**
   - Meta Ads optimizadas, CRO basado en datos
   - Producción de Reels profesionales
   - Métricas: CAC, LTV, conversión
   - Caso de éxito: Bodai Clinic (100K+ impresiones, CPC $47.9 CLP)

**CHATBOT_CONFIG.system_prompt actualizado:**
- ✅ Posicionamiento estratégico high-ticket
- ✅ Especialidades técnicas detalladas (OSINT, Power BI, Python, RAG, etc.)
- ✅ Tono profesional y estratégico
- ✅ Reglas para mencionar servicios según contexto
- ✅ Proactivo en ofrecer diagnóstico estratégico gratuito (30 min)
- ✅ Deploy a Convex ejecutado (`npx convex dev --once`)

### 📋 Entregables COMPLETADOS
- [x] ScrollytellingHero con 6 estaciones funcionando
- [x] Video sincronizado con scroll (600vh)
- [x] Navbar oscuro con design system aplicado
- [x] Widget del chat rediseñado (verde oliva + ámbar)
- [x] Footer limpio para landing de ventas
- [x] Agente conversacional actualizado con nuevo perfil estratégico
- [x] Deploy de cambios a Convex

### 🎨 Design System Aplicado
- [x] Paleta: Negro (#0A0A0A), Blanco (#FFFFFF), Ámbar (#F99D1C), Verde Oliva (#283329)
- [x] Tipografía: Syne (display), Inter (body), JetBrains Mono (mono)
- [x] Coherencia visual en todos los componentes
- [x] Responsive completo (desktop, tablet, móvil)

**Tiempo total Fase 2:** ~8 horas

---

## FASE 1.1 Configuración de Design Tokens
**Archivo:** `src/styles/design-tokens.css`

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
  
  /* Tipografía */
  --font-display: 'Inter', 'Syne', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Espaciado */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;
  --space-2xl: 96px;
  
  /* Grid */
  --container-max: 1280px;
  --grid-gutter: 24px;
}
```

**Tiempo estimado:** 2 horas

#### 1.2 Agregar Tipografías
**Actualizar:** `src/layouts/Layout.astro`

```html
<!-- Agregar JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

**Tiempo estimado:** 30 minutos

#### 1.3 Crear Estructura de Carpetas

```
src/
├── components/
│   ├── scrollytelling/
│   │   ├── ScrollytellingHero.tsx
│   │   ├── ConceptTag.tsx
│   │   └── VideoBackground.tsx
│   ├── funnel/
│   │   ├── QualifyingFunnel.tsx
│   │   ├── FunnelStep.tsx
│   │   └── ProgressIndicator.tsx
│   ├── cta/
│   │   ├── CTADiagnostico.tsx
│   │   └── CTAButton.tsx
│   └── [componentes existentes...]
├── pages/
│   ├── index.astro (nueva landing ventas)
│   ├── portfolio.astro (landing actual movida aquí)
│   └── [páginas existentes...]
└── styles/
    ├── design-tokens.css (nuevo)
    ├── scrollytelling.css (nuevo)
    └── [estilos existentes...]
```

**Tiempo estimado:** 1 hora

#### 1.4 Optimizar Video Hero
**Archivo:** `/public/img/Aperca_Video_Scrolling(1).mp4`

**Tareas:**
- [ ] Crear versión móvil (1080x1920, vertical)
- [ ] Crear versión desktop (1920x1080, horizontal)
- [ ] Comprimir a < 2MB cada versión
- [ ] Generar fallback image (primer frame)

**Herramientas:** FFmpeg

```bash
# Versión desktop
ffmpeg -i Aperca_Video_Scrolling(1).mp4 -vf scale=1920:1080 -c:v libx265 -crf 28 -preset slow Aperca_Video_Desktop.mp4

# Versión móvil
ffmpeg -i Aperca_Video_Scrolling(1).mp4 -vf scale=1080:1920 -c:v libx265 -crf 28 -preset slow Aperca_Video_Mobile.mp4

# Fallback image
ffmpeg -i Aperca_Video_Scrolling(1).mp4 -frames:v 1 Aperca_Video_Fallback.jpg
```

**Tiempo estimado:** 3 horas (incluye pruebas)

### 📋 Entregables
- [ ] Design tokens implementados
- [ ] Tipografías cargadas
- [ ] Estructura de carpetas creada
- [ ] Video optimizado (2 versiones + fallback)

---

## FASE 2: COMPONENTE SCROLLYTELLING HERO (Semana 2)

### 🎯 Objetivo
Implementar hero section con video de 5 segundos y scrollytelling STAR

### ✅ Tareas

#### 2.1 Componente VideoBackground
**Archivo:** `src/components/scrollytelling/VideoBackground.tsx`

**Funcionalidades:**
- Detección de viewport (móvil vs desktop)
- Lazy loading con Intersection Observer
- Autoplay muted con fallback
- Responsive (object-fit: cover)

**Tiempo estimado:** 4 horas

#### 2.2 Componente ConceptTag
**Archivo:** `src/components/scrollytelling/ConceptTag.tsx`

**Props:**
```typescript
interface ConceptTagProps {
  text: string;
  color: 'amber' | 'olive' | 'white';
  position: { x: number; y: number };
  delay: number;
}
```

**Estilos:**
- Tipografía: Inter Bold, uppercase, tracking 2%
- Background: Semi-transparente con backdrop-blur
- Animación: Fade-in + slide-up

**Tiempo estimado:** 3 horas

#### 2.3 Componente ScrollytellingHero
**Archivo:** `src/components/scrollytelling/ScrollytellingHero.tsx`

**Estructura:**
```tsx
<section className="scrollytelling-hero">
  <VideoBackground 
    desktopSrc="/img/Aperca_Video_Desktop.mp4"
    mobileSrc="/img/Aperca_Video_Mobile.mp4"
    fallbackSrc="/img/Aperca_Video_Fallback.jpg"
  />
  
  <div className="scrollytelling-content">
    {/* 5 estaciones STAR */}
    <ScrollStation index={0} phase="situation">
      <h1>Auditamos la fricción operativa de tu negocio.</h1>
      <ConceptTag text="FRICCIÓN OPERATIVA" color="amber" />
    </ScrollStation>
    
    <ScrollStation index={1} phase="task">
      <h1>Mapeamos arquitectura con inteligencia OSINT.</h1>
      <ConceptTag text="INTELIGENCIA OSINT" color="amber" />
    </ScrollStation>
    
    {/* ... 3 estaciones más */}
  </div>
</section>
```

**Lógica de Scroll:**
- Usar `IntersectionObserver` para detectar scroll
- Calcular progreso: `scrollProgress = (scrollY - heroTop) / heroHeight`
- Mapear progreso a estaciones: `station = Math.floor(scrollProgress * 5)`
- Animar transiciones entre estaciones

**Tiempo estimado:** 12 horas

#### 2.4 Estilos Scrollytelling
**Archivo:** `src/styles/scrollytelling.css`

```css
.scrollytelling-hero {
  position: relative;
  height: 500vh; /* 5 segundos de scroll */
  overflow: hidden;
}

.scrollytelling-content {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-station {
  position: absolute;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-station.active {
  opacity: 1;
  transform: translateY(0);
}
```

**Tiempo estimado:** 4 horas

### 📋 Entregables
- [ ] VideoBackground component funcional
- [ ] ConceptTag component con animaciones
- [ ] ScrollytellingHero con 5 estaciones STAR
- [ ] Estilos scrollytelling implementados
- [ ] Testing en móvil y desktop

---

## FASE 3: FORMULARIO DE CUALIFICACIÓN ✅ COMPLETADA (28 Jul 2026)

### 🎯 Objetivo
Implementar qualifying funnel de 4 pasos

### ✅ Tareas COMPLETADAS

#### 3.1 Componente FunnelStep
**Archivo:** `src/components/funnel/FunnelStep.tsx`

**Props:**
```typescript
interface FunnelStepProps {
  stepNumber: number;
  title: string;
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  onSelect: (value: string) => void;
}
```

**Tiempo estimado:** 4 horas

#### 3.2 Componente ProgressIndicator
**Archivo:** `src/components/funnel/ProgressIndicator.tsx`

**Funcionalidad:**
- Mostrar progreso: "Paso 2 de 4"
- Barra de progreso visual
- Navegación entre pasos (back button)

**Tiempo estimado:** 2 horas

#### 3.3 Componente QualifyingFunnel
**Archivo:** `src/components/funnel/QualifyingFunnel.tsx`

**Estructura:**
```tsx
<div className="qualifying-funnel">
  <ProgressIndicator currentStep={currentStep} totalSteps={4} />
  
  {currentStep === 1 && (
    <FunnelStep
      stepNumber={1}
      title="¿Quién eres?"
      options={[
        { label: "Soy empresa", value: "company", icon: "🏢" },
        { label: "Soy reclutador", value: "recruiter", icon: "👔" }
      ]}
      onSelect={handleStep1}
    />
  )}
  
  {currentStep === 2 && (
    <FunnelStep
      stepNumber={2}
      title="¿Cuál es tu desafío principal?"
      options={[
        { label: "Automatización/IA", value: "automation" },
        { label: "Desarrollo MVP desde cero", value: "mvp" },
        { label: "Rediseño UX/CRO", value: "ux" },
        { label: "Consultoría de Datos/OSINT", value: "osint" }
      ]}
      onSelect={handleStep2}
    />
  )}
  
  {/* Steps 3 y 4 */}
</div>
```

**Estado del Funnel:**
```typescript
interface FunnelState {
  userType: 'company' | 'recruiter' | null;
  challenge: string | null;
  budgetRange: string | null;
  leadData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  } | null;
}
```

**Tiempo estimado:** 10 horas
**Estado:** ✅ Implementado

**Implementación real:**
- ✅ Componente con 4 pasos: tipo usuario, desafío, presupuesto, datos contacto
- ✅ Estado local con React hooks
- ✅ Validación de formulario
- ✅ Animaciones de transición entre pasos
- ✅ Botón "Volver" funcional
- ✅ Pantalla de éxito post-envío

#### 3.4 Integración con Backend (Convex)
**Archivo:** `convex/funnel.ts`

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitLead = mutation({
  args: {
    userType: v.string(),
    challenge: v.string(),
    budgetRange: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      type: args.userType === "company" ? "HIGH_TICKET_CLIENT" : "RECRUITER",
      name: args.name,
      email: args.email,
      company: null,
      budget_range: args.budgetRange,
      project_summary: args.message || "",
      source: "FUNNEL_FORM",
      created_at: Date.now(),
    });
    
    return { leadId, status: "success" };
  },
});

export const getLeads = query({
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").take(100);
  },
});
```

**Schema de Base de Datos:**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    type: v.string(), // "HIGH_TICKET_CLIENT" | "RECRUITER" | "GENERAL"
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    budget_range: v.optional(v.string()),
    project_summary: v.string(),
    source: v.string(), // "FUNNEL_FORM" | "AI_AGENT"
    created_at: v.number(),
  }),
  
  agent_sessions: defineTable({
    lead_id: v.optional(v.id("leads")),
    user_type: v.string(), // "HIGH_TICKET" | "RECRUITER" | "UNKNOWN"
    created_at: v.number(),
  }),
  
  // Tablas existentes...
});
```

**Tiempo estimado:** 6 horas

### 📋 Entregables
- [ ] FunnelStep component con opciones interactivas
- [ ] ProgressIndicator con navegación
- [ ] QualifyingFunnel con 4 pasos completos
- [ ] Backend Convex con tabla `leads`
- [ ] Validación de formulario (Zod)
- [ ] Testing de flujo completo

---

## FASE 4: ACTUALIZACIÓN DEL CHATBOT ✅ COMPLETADA (28 Jul 2026)

### 🎯 Objetivo
Implementar Context Layering y lógica de cualificación dual

### ✅ Tareas COMPLETADAS

#### 4.1 Estructura de Context Layering
**Crear carpetas:**
```
convex/agent/
├── context/
│   ├── 00_core_identity.ts
│   ├── 01_qualifying_rules.ts
│   └── layers/
│       ├── high_ticket.ts
│       ├── recruiter.ts
│       └── general_faq.ts
└── orchestrator.ts
```

**Tiempo estimado:** 2 horas

#### 4.2 Core Identity
**Archivo:** `convex/agent/context/00_core_identity.ts`

```typescript
export const CORE_IDENTITY = `
Eres el asistente de IA de Áperca SpA, firma de ingeniería de producto liderada por Jorge Cabrera L.

VISIÓN:
Áperca SpA es un socio estratégico para el ciclo de vida completo de productos digitales (Digital Product Lifecycle):
- Diagnóstico basado en datos (OSINT)
- Arquitectura UX y vibecoding/Spec-Driven Development
- Desarrollo de sistemas escalables con IA
- Agentes autónomos y prácticas DevSecOps

TONO:
- Profesional pero accesible
- Técnico cuando es necesario, pero sin jerga innecesaria
- Enfocado en valor de negocio y ROI
- Directo y eficiente

LÍMITES:
- No prometas fechas específicas sin consultar disponibilidad
- No des presupuestos exactos sin entender el alcance completo
- Redirige a reunión de diagnóstico para proyectos complejos
- No compartas información confidencial de clientes
`;
```

**Tiempo estimado:** 3 horas

#### 4.3 Qualifying Rules
**Archivo:** `convex/agent/context/01_qualifying_rules.ts`

```typescript
export const QUALIFYING_RULES = `
LÓGICA DE CUALIFICACIÓN:

1. IDENTIFICAR TIPO DE USUARIO:
   - ¿Es empresa/cliente potencial? → Activar capa high_ticket
   - ¿Es reclutador/hiring manager? → Activar capa recruiter
   - ¿No está claro? → Preguntar directamente

2. PARA CLIENTES (HIGH-TICKET):
   Hacer estas preguntas en orden:
   a) ¿Cuál es tu desafío principal? (Automatización/IA, MVP, UX/CRO, OSINT)
   b) ¿Cuál es tu rango de presupuesto? ($3k-$10k, $10k-$30k, $30k+)
   c) ¿Cuál es tu timeline? (Urgente, 1-3 meses, 3-6 meses, Exploratorio)
   
   Si presupuesto >= $3k → LEAD CALIFICADO → Ofrecer agendar diagnóstico
   Si presupuesto < $3k → Ofrecer recursos gratuitos o referir a otros servicios

3. PARA RECLUTADORES:
   Preguntar:
   a) ¿Qué tipo de rol están buscando? (Full-stack, Frontend, Backend, DevOps, etc.)
   b) ¿Es remoto, híbrido o presencial?
   c) ¿Cuál es el rango salarial?
   
   Proporcionar CV, experiencia técnica y disponibilidad de Jorge

4. SIEMPRE:
   - Ser eficiente: máximo 3-4 mensajes para cualificar
   - Ofrecer CTA claro: "Agenda diagnóstico" o "Ver CV completo"
   - Capturar email para seguimiento
`;
```

**Tiempo estimado:** 4 horas

#### 4.4 Capas Específicas
**Archivo:** `convex/agent/context/layers/high_ticket.ts`

```typescript
export const HIGH_TICKET_LAYER = `
SERVICIOS Y TARIFAS:

1. CONSULTORÍA DE IA Y PRODUCT LIFECYCLE:
   - Diagnóstico OSINT y análisis de datos
   - Arquitectura de sistemas escalables
   - Desarrollo de agentes autónomos
   - DevSecOps y seguridad desde el diseño
   - Rango: $10k - $50k+ (según alcance)

2. DESARROLLO DE MVP:
   - Prototipado rápido con vibecoding
   - Stack moderno: Astro, React, Next.js, Convex
   - Integración de IA (Gemini, LangGraph)
   - Rango: $15k - $40k

3. GROWTH MARKETING & CRO:
   - Campañas Meta Ads optimizadas
   - Producción de contenido (Reels)
   - Funnels de conversión
   - Rango: $5k - $20k/mes

CASOS DE ÉXITO:
- Bodai Clinic: +35% leads, CTR 3.05%, 100K+ impresiones
- iDomo: Sistema SaaS multi-tenant, ROI 750% primer mes
- MenuClick: E-commerce sin comisiones, 80% automatización

METODOLOGÍA:
- STAR (Situation, Task, Action, Result)
- OSINT para diagnóstico basado en datos
- Vibecoding para velocidad de startup con calidad enterprise
- DevSecOps para seguridad desde el diseño

PRÓXIMO PASO:
Agenda reunión de diagnóstico estratégico (30 min, gratuita):
[Link a Calendly/Cal.com]
`;
```

**Archivo:** `convex/agent/context/layers/recruiter.ts`

```typescript
export const RECRUITER_LAYER = `
PERFIL PROFESIONAL: JORGE CABRERA L.

EXPERIENCIA:
- 5+ años en desarrollo full-stack
- Especialización en IA conversacional y agentes autónomos
- Experiencia en DevSecOps y ciberseguridad
- Growth Marketing y producción de contenido

STACK TÉCNICO:
Frontend: Astro, React 18, Next.js 14, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, Convex (serverless)
IA: Google Gemini, LangGraph, RAG, Vector Search
Base de Datos: SQLite, Turso, PostgreSQL, Convex DB
DevSecOps: Kali Linux, OWASP, Secure SDLC
Business Intelligence: Python (Pandas, NumPy), Power BI, SQL

PROYECTOS DESTACADOS:
1. Bodai Clinic: Sistema SaaS con IA conversacional + Growth Marketing
   - Stack: Next.js 14, Convex, Gemini 1.5 Flash, RAG
   - Resultados: +35% leads, CTR 3.05%
   
2. iDomo: Sistema de gestión de conserjería digital
   - Stack: React 19, Supabase, PWA
   - ROI: 750% primer mes

3. MenuClick: E-commerce sin comisiones
   - Stack: Next.js, Convex, WhatsApp Business
   - 80% automatización

DISPONIBILIDAD:
- Inmediata para proyectos de consultoría
- Q3 2026 para desarrollo full-time

PRETENSIONES SALARIALES:
- Remoto: $4,000 - $6,000 USD/mes
- Híbrido/Presencial: $5,000 - $7,000 USD/mes
- Proyectos: $80 - $120 USD/hora

CV COMPLETO:
[Link a mi-perfil o PDF]

CONTACTO:
Email: jcabreralabbe@gmail.com
LinkedIn: [link]
GitHub: [link]
`;
```

**Tiempo estimado:** 6 horas (ambas capas)

#### 4.5 Orchestrator con Context Layering
**Archivo:** `convex/agent/orchestrator.ts`

```typescript
import { CORE_IDENTITY } from "./context/00_core_identity";
import { QUALIFYING_RULES } from "./context/01_qualifying_rules";
import { HIGH_TICKET_LAYER } from "./context/layers/high_ticket";
import { RECRUITER_LAYER } from "./context/layers/recruiter";
import { GENERAL_FAQ_LAYER } from "./context/layers/general_faq";

export function buildSystemPrompt(userType: "HIGH_TICKET" | "RECRUITER" | "UNKNOWN"): string {
  let systemPrompt = CORE_IDENTITY + "\n\n" + QUALIFYING_RULES;
  
  switch (userType) {
    case "HIGH_TICKET":
      systemPrompt += "\n\n" + HIGH_TICKET_LAYER;
      break;
    case "RECRUITER":
      systemPrompt += "\n\n" + RECRUITER_LAYER;
      break;
    case "UNKNOWN":
      systemPrompt += "\n\n" + GENERAL_FAQ_LAYER;
      break;
  }
  
  return systemPrompt;
}

export function classifyUserIntent(message: string): "HIGH_TICKET" | "RECRUITER" | "UNKNOWN" {
  const lowerMessage = message.toLowerCase();
  
  // Keywords para cliente high-ticket
  const clientKeywords = [
    "proyecto", "desarrollo", "consultoría", "automatización", "ia", "mvp",
    "presupuesto", "cotización", "contratar", "servicio", "producto"
  ];
  
  // Keywords para reclutador
  const recruiterKeywords = [
    "cv", "curriculum", "experiencia", "disponibilidad", "salario", "remoto",
    "contratación", "vacante", "puesto", "rol", "hiring"
  ];
  
  const clientScore = clientKeywords.filter(kw => lowerMessage.includes(kw)).length;
  const recruiterScore = recruiterKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  if (clientScore > recruiterScore && clientScore > 0) return "HIGH_TICKET";
  if (recruiterScore > clientScore && recruiterScore > 0) return "RECRUITER";
  return "UNKNOWN";
}
```

**Tiempo estimado:** 4 horas

#### 4.6 Actualizar Chatbot Component
**Archivo:** `src/components/Chatbot.tsx`

**Cambios:**
- Integrar `classifyUserIntent` para detectar tipo de usuario
- Usar `buildSystemPrompt` dinámicamente según clasificación
- Agregar lógica de cualificación en el flujo de conversación
- Capturar email cuando se cualifica un lead

**Tiempo estimado:** 6 horas
**Estado:** ✅ Implementado

### 📋 Entregables COMPLETADOS
- [x] Estructura de Context Layering completa (convex/agent/)
- [x] Core Identity (00_core_identity.ts)
- [x] Qualifying Rules (01_qualifying_rules.ts)
- [x] Capa high_ticket.ts con servicios y casos de éxito
- [x] Capa recruiter.ts con perfil profesional completo
- [x] Capa general_faq.ts con preguntas frecuentes
- [x] Orchestrator con clasificación de intención
- [x] Integración con googleChatbot.ts
- [x] Deploy de Convex

### 🎯 Implementación Real

**Archivos Creados:**
1. `convex/agent/context/00_core_identity.ts` - Identidad core de Áperca SpA
2. `convex/agent/context/01_qualifying_rules.ts` - Reglas de cualificación
3. `convex/agent/context/layers/high_ticket.ts` - Capa para clientes high-ticket
4. `convex/agent/context/layers/recruiter.ts` - Capa para reclutadores
5. `convex/agent/context/layers/general_faq.ts` - Capa para preguntas generales
6. `convex/agent/orchestrator.ts` - Orquestador de capas

**Funcionalidades Implementadas:**

**Orchestrator:**
- `buildSystemPrompt(userType)` - Construye prompt dinámico según tipo de usuario
- `classifyUserIntent(message)` - Clasifica usuario en HIGH_TICKET, RECRUITER o UNKNOWN
- `shouldOfferScheduling()` - Detecta cuándo ofrecer agendamiento
- `extractQualificationData()` - Extrae datos de cualificación del historial

**Integración con googleChatbot.ts:**
- ✅ Import del orchestrator
- ✅ Clasificación automática de usuario en cada mensaje
- ✅ Construcción dinámica de system prompt según tipo
- ✅ Eliminación de prompt estático largo (ahora usa Context Layering)
- ✅ Optimización de tokens (solo carga capa relevante)

**Capas de Contexto:**

**Core Identity (siempre presente):**
- Posicionamiento: Secure Digital Product Studio
- Especialidades: OSINT, Power BI, Python, DevSecOps, Agentic AI, Growth Engineering
- Tono: Profesional, estratégico, directo (Fractional CTO/CPO)
- Límites: No promesas sin contexto, tarifa mínima $3k USD

**High-Ticket Layer:**
- 4 servicios detallados con rangos de precio
- Casos de éxito: Bodai Clinic, iDomo, MenuClick
- Metodología: STAR, OSINT, Vibecoding, DevSecOps
- CTA: Diagnóstico estratégico gratuito (30 min)

**Recruiter Layer:**
- Perfil profesional completo de Jorge Cabrera
- Stack técnico detallado (Frontend, Backend, IA, DevSecOps, BI, Marketing)
- Proyectos destacados con roles específicos
- Disponibilidad y pretensiones salariales

**General FAQ Layer:**
- Preguntas frecuentes sobre servicios
- Diferenciación vs competencia
- Proceso de trabajo
- Garantías y soporte

**Beneficios del Context Layering:**
- ✅ Optimización de tokens (solo carga contexto relevante)
- ✅ Respuestas más precisas según tipo de usuario
- ✅ Mejor cualificación de leads
- ✅ Experiencia personalizada
- ✅ Mantenibilidad (capas separadas por tipo)

**Tiempo total Fase 4:** ~6 horas

---

## FASE 5: CTA Y SECCIONES COMPLEMENTARIAS (Semana 5)

### 🎯 Objetivo
Implementar CTAs, secciones de valor y footer

### ✅ Tareas

#### 5.1 Componente CTADiagnostico
**Archivo:** `src/components/cta/CTADiagnostico.tsx`

```tsx
<section className="cta-diagnostico">
  <div className="container">
    <h2>¿Listo para desbloquear tracción real?</h2>
    <p>Agenda tu diagnóstico estratégico gratuito (30 min)</p>
    
    <div className="cta-buttons">
      <a href="[Calendly/Cal.com]" className="btn-primary">
        Agendar Diagnóstico
      </a>
      <button onClick={openFunnel} className="btn-secondary">
        Responder 4 Preguntas
      </button>
    </div>
    
    <div className="trust-indicators">
      <div>✅ Sin compromiso</div>
      <div>✅ 30 minutos</div>
      <div>✅ Diagnóstico basado en datos</div>
    </div>
  </div>
</section>
```

**Tiempo estimado:** 4 horas

#### 5.2 Sección de Casos de Éxito (Reutilizar existente)
**Adaptar:** Sección de proyectos actual con nuevo estilo

**Cambios:**
- Aplicar paleta de colores nueva (Naranja Ámbar)
- Agregar métricas destacadas con tipografía mono
- Estilo según dirección de arte elegida

**Tiempo estimado:** 3 horas

#### 5.3 Sección de Stack Técnico
**Nueva sección:** Mostrar tecnologías con estilo Dark Cyber (Opción 3)

```tsx
<section className="tech-stack">
  <h2>Stack Tecnológico</h2>
  
  <div className="tech-grid">
    <div className="tech-category">
      <h3>Frontend</h3>
      <ul>
        <li><code>Astro</code></li>
        <li><code>React 18</code></li>
        <li><code>Next.js 14</code></li>
        <li><code>TypeScript</code></li>
      </ul>
    </div>
    
    <div className="tech-category">
      <h3>AI & Agentes</h3>
      <ul>
        <li><code>Google Gemini</code></li>
        <li><code>LangGraph</code></li>
        <li><code>RAG</code></li>
        <li><code>Vector Search</code></li>
      </ul>
    </div>
    
    {/* Más categorías... */}
  </div>
</section>
```

**Tiempo estimado:** 4 horas

#### 5.4 Footer Actualizado
**Actualizar:** `src/components/Footer.astro`

**Agregar:**
- Links a redes sociales
- Email de contacto
- Logo de Áperca SpA
- Copyright

**Tiempo estimado:** 2 horas

### 📋 Entregables
- [ ] CTADiagnostico component con integración a Calendly
- [ ] Sección de casos de éxito adaptada
- [ ] Sección de stack técnico con estilo Dark Cyber
- [ ] Footer actualizado con branding Áperca

---

## FASE 6: INTEGRACIÓN Y ENSAMBLAJE (Semana 6 - Días 1-3)

### 🎯 Objetivo
Ensamblar todos los componentes en la nueva landing page

### ✅ Tareas

#### 6.1 Crear Nueva Landing Page
**Archivo:** `src/pages/index.astro` (o `index-sales.astro` si se elige Opción B)

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import { ScrollytellingHero } from '../components/scrollytelling/ScrollytellingHero';
import { QualifyingFunnel } from '../components/funnel/QualifyingFunnel';
import { CTADiagnostico } from '../components/cta/CTADiagnostico';
---

<Layout 
  title="Áperca SpA - Ingeniería de Producto & IA"
  description="Diagnóstico basado en datos (OSINT), desarrollo de sistemas escalables con IA, DevSecOps. Velocidad de startup con calidad enterprise."
>
  <Navbar />
  
  <!-- Hero Scrollytelling (5 segundos) -->
  <ScrollytellingHero client:load />
  
  <!-- Qualifying Funnel (Modal o sección) -->
  <QualifyingFunnel client:load />
  
  <!-- Casos de Éxito -->
  <section class="case-studies">
    <!-- Reutilizar componentes existentes con nuevo estilo -->
  </section>
  
  <!-- Stack Técnico -->
  <section class="tech-stack">
    <!-- Componente nuevo -->
  </section>
  
  <!-- CTA Final -->
  <CTADiagnostico client:load />
  
  <Footer />
</Layout>
```

**Tiempo estimado:** 6 horas

#### 6.2 Mover Landing Actual (si se elige Opción B)
**Acción:** Mover `index.astro` actual a `portfolio.astro` o `reclutadores.astro`

**Actualizar:**
- Links en Navbar
- Redirects si es necesario
- Sitemap

**Tiempo estimado:** 2 horas

#### 6.3 Configurar Routing Inteligente (Opcional - Opción B)
**Archivo:** `src/middleware/routing.ts`

```typescript
export function detectAudience(request: Request): "sales" | "portfolio" {
  const url = new URL(request.url);
  
  // Query param explícito
  if (url.searchParams.get("view") === "portfolio") return "portfolio";
  if (url.searchParams.get("view") === "sales") return "sales";
  
  // Cookie de preferencia
  const cookies = request.headers.get("cookie");
  if (cookies?.includes("preferred_view=portfolio")) return "portfolio";
  
  // Default: sales
  return "sales";
}
```

**Tiempo estimado:** 4 horas (si se implementa)

### 📋 Entregables
- [ ] Nueva landing page ensamblada
- [ ] Landing actual movida (si aplica)
- [ ] Routing configurado (si aplica)
- [ ] Testing de navegación

---

## FASE 7: TESTING Y OPTIMIZACIÓN (Semana 6 - Días 4-7)

### 🎯 Objetivo
Testing exhaustivo y optimización de performance

### ✅ Tareas

#### 7.1 Testing Funcional
**Checklist:**
- [ ] Scrollytelling funciona en Chrome, Firefox, Safari
- [ ] Video se carga correctamente (móvil y desktop)
- [ ] Formulario de cualificación completa flujo de 4 pasos
- [ ] Chatbot clasifica correctamente tipo de usuario
- [ ] Leads se guardan en Convex correctamente
- [ ] CTAs redirigen a URLs correctas
- [ ] Responsive en móvil, tablet, desktop

**Tiempo estimado:** 8 horas

#### 7.2 Testing de Performance
**Herramientas:** Lighthouse, WebPageTest

**Métricas objetivo:**
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Performance Score > 90

**Optimizaciones:**
- Lazy loading de video
- Preload de fonts críticas
- Minificación de CSS/JS
- Compresión de imágenes

**Tiempo estimado:** 6 horas

#### 7.3 Testing de Seguridad
**Checklist DevSecOps:**
- [ ] Validación de inputs con Zod
- [ ] Sanitización de datos (DOMPurify)
- [ ] Rate limiting en endpoints de API
- [ ] HTTPS en todas las conexiones
- [ ] Headers de seguridad (CSP, X-Frame-Options, etc.)

**Herramientas:** OWASP ZAP, npm audit, Snyk

**Tiempo estimado:** 4 horas

#### 7.4 A/B Testing de Copy
**Variantes a probar:**
- Copy de estaciones STAR (técnico vs no técnico)
- CTAs ("Agendar diagnóstico" vs "Hablar con experto")
- Orden de opciones en funnel

**Herramienta:** Google Optimize o Convex A/B testing

**Tiempo estimado:** 4 horas (setup)

### 📋 Entregables
- [ ] Reporte de testing funcional
- [ ] Lighthouse score > 90
- [ ] Vulnerabilidades de seguridad resueltas
- [ ] A/B tests configurados

---

## FASE 8: ANALYTICS Y MONITOREO (Semana 7 - Días 1-3)

### 🎯 Objetivo
Configurar analytics, dashboards y monitoreo

### ✅ Tareas

#### 8.1 Google Analytics 4
**Setup:**
- [ ] Crear propiedad GA4
- [ ] Instalar gtag en Layout.astro
- [ ] Configurar eventos personalizados:
  - `scrollytelling_station_view` (cada estación)
  - `funnel_step_completed` (cada paso del funnel)
  - `lead_qualified` (lead high-ticket capturado)
  - `cta_clicked` (clicks en CTAs)

**Tiempo estimado:** 3 horas

#### 8.2 Dashboard de Conversión (Convex)
**Archivo:** `convex/analytics.ts`

```typescript
export const getConversionMetrics = query({
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    
    const highTicketLeads = leads.filter(l => l.type === "HIGH_TICKET_CLIENT");
    const recruiterLeads = leads.filter(l => l.type === "RECRUITER");
    
    return {
      totalLeads: leads.length,
      highTicketLeads: highTicketLeads.length,
      recruiterLeads: recruiterLeads.length,
      conversionRate: (highTicketLeads.length / leads.length) * 100,
      // Más métricas...
    };
  },
});
```

**Tiempo estimado:** 4 horas

#### 8.3 Dashboard Visual (Opcional - Power BI / Streamlit)
**Si se implementa:**
- Conectar a Convex API
- Visualizar métricas clave:
  - Tasa de conversión funnel
  - Leads calificados / mes
  - CPA (si hay campañas pagadas)
  - Tasa de agendamiento

**Tiempo estimado:** 8 horas (si se implementa)

#### 8.4 Alertas y Monitoreo
**Herramientas:** Sentry, Winston

**Configurar alertas para:**
- Errores críticos en producción
- Caída de tasa de conversión > 50%
- Leads high-ticket no respondidos en 24h

**Tiempo estimado:** 3 horas

### 📋 Entregables
- [ ] Google Analytics 4 configurado con eventos
- [ ] Dashboard de conversión en Convex
- [ ] Alertas de monitoreo activas
- [ ] (Opcional) Dashboard visual en Power BI

---

## FASE 9: LANZAMIENTO Y POST-LANZAMIENTO (Semana 7 - Días 4-7)

### 🎯 Objetivo
Deploy a producción y monitoreo inicial

### ✅ Tareas

#### 9.1 Pre-Deploy Checklist
- [ ] Backup de base de datos actual
- [ ] Verificar variables de entorno en producción
- [ ] Testing final en staging
- [ ] Preparar rollback plan
- [ ] Comunicar a stakeholders

**Tiempo estimado:** 2 horas

#### 9.2 Deploy a Producción
**Plataformas:**
- Frontend: Netlify / Vercel
- Backend: Convex Cloud

**Comandos:**
```bash
# Frontend
npm run build
netlify deploy --prod

# Backend (Convex)
npx convex deploy --prod
```

**Tiempo estimado:** 2 horas

#### 9.3 Smoke Testing Post-Deploy
**Checklist:**
- [ ] Landing page carga correctamente
- [ ] Video hero se reproduce
- [ ] Formulario de cualificación funciona
- [ ] Chatbot responde correctamente
- [ ] Leads se guardan en base de datos
- [ ] Analytics registra eventos

**Tiempo estimado:** 2 horas

#### 9.4 Monitoreo Intensivo (Primeras 48h)
**Acciones:**
- Revisar dashboards cada 4 horas
- Responder a leads calificados en < 2 horas
- Ajustar copy si tasa de conversión < 10%
- Resolver bugs críticos inmediatamente

**Tiempo estimado:** 8 horas (distribuidas en 48h)

#### 9.5 Iteración Basada en Datos (Semana 8+)
**Ciclo continuo:**
1. Analizar métricas semanalmente
2. Identificar cuellos de botella en funnel
3. Proponer mejoras (copy, diseño, flujo)
4. Implementar cambios
5. Medir impacto
6. Repetir

**Tiempo estimado:** Ongoing

### 📋 Entregables
- [ ] Sitio en producción
- [ ] Smoke testing completado
- [ ] Monitoreo activo primeras 48h
- [ ] Reporte de lanzamiento con métricas iniciales

---

## RESUMEN DE FASES Y TIEMPOS

| Fase | Descripción | Duración | Entregables Clave |
|------|-------------|----------|-------------------|
| **0** | Decisiones Estratégicas | 3 días | Dirección de arte, stack backend, estrategia de landing |
| **1** | Setup y Configuración | 4 días | Design tokens, tipografías, estructura de carpetas, video optimizado |
| **2** | Scrollytelling Hero | 5 días | VideoBackground, ConceptTag, ScrollytellingHero, estilos |
| **3** | Formulario de Cualificación | 5 días | FunnelStep, ProgressIndicator, QualifyingFunnel, backend Convex |
| **4** | Actualización del Chatbot | 5 días | Context Layering, capas específicas, orchestrator, chatbot actualizado |
| **5** | CTA y Secciones Complementarias | 3 días | CTADiagnostico, casos de éxito adaptados, stack técnico, footer |
| **6** | Integración y Ensamblaje | 3 días | Landing page ensamblada, routing configurado |
| **7** | Testing y Optimización | 4 días | Testing funcional, performance, seguridad, A/B tests |
| **8** | Analytics y Monitoreo | 3 días | GA4, dashboard de conversión, alertas |
| **9** | Lanzamiento | 4 días | Deploy, smoke testing, monitoreo intensivo |

**TOTAL:** 39 días laborales (~7-8 semanas calendario)

---

## RECURSOS NECESARIOS

### Humanos
- **1 Desarrollador Full-Stack** (Jorge Cabrera L.)
- **Opcional:** 1 Diseñador para producción fotográfica (según dirección de arte)

### Herramientas y Servicios
- **Existentes:**
  - Convex (backend serverless)
  - Netlify / Vercel (hosting frontend)
  - Google Gemini API (IA conversacional)
  
- **Nuevos:**
  - Calendly / Cal.com (agendamiento)
  - Google Analytics 4 (analytics)
  - Sentry (monitoreo de errores)
  - (Opcional) Power BI / Streamlit (dashboards)

### Costos Estimados
- **Desarrollo:** Incluido (Jorge Cabrera)
- **Producción fotográfica:** $500 - $2,000 USD (según dirección de arte)
- **Servicios cloud:** $50 - $100 USD/mes (Convex, hosting, analytics)
- **Herramientas:** $30 - $50 USD/mes (Calendly, Sentry)

**Total estimado:** $600 - $2,200 USD one-time + $80 - $150 USD/mes

---

## CRITERIOS DE ÉXITO

### Métricas Técnicas
- [ ] Performance Score (Lighthouse) > 90
- [ ] Uptime > 99.9%
- [ ] Tiempo de carga < 2 segundos
- [ ] 0 vulnerabilidades críticas de seguridad

### Métricas de Negocio
- [ ] Tasa de conversión funnel > 15%
- [ ] Leads calificados > 20/mes
- [ ] Tasa de agendamiento > 40%
- [ ] CPA < $100 USD (si hay campañas pagadas)

### Métricas de UX
- [ ] Bounce rate < 40%
- [ ] Tiempo en página > 2 minutos
- [ ] Scroll depth > 80% (llegan al CTA final)
- [ ] Tasa de completación de funnel > 60%

---

## RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Video muy pesado (>5MB) | Media | Alto | Comprimir con FFmpeg, usar lazy loading, fallback image |
| Scrollytelling no funciona en Safari | Baja | Medio | Testing exhaustivo, polyfills si es necesario |
| Tasa de conversión baja (<10%) | Media | Alto | A/B testing de copy, ajustar funnel, mejorar CTAs |
| Chatbot no clasifica bien usuarios | Media | Medio | Mejorar algoritmo de clasificación, agregar pregunta explícita |
| Producción fotográfica se retrasa | Media | Bajo | Usar placeholders temporales, lanzar con assets básicos |
| Backend Convex tiene limitaciones | Baja | Alto | Tener plan de migración a Express.js + SQLite listo |

---

## PRÓXIMOS PASOS INMEDIATOS

### ✅ AHORA (Hoy)
1. **Revisar y aprobar este roadmap**
2. **Tomar decisiones estratégicas:**
   - Dirección de arte (Opción 1, 2 o 3)
   - Stack de backend (Convex vs Express.js)
   - Estrategia de landing (A, B o C)

### 📅 ESTA SEMANA
1. Completar Fase 0 (Decisiones Estratégicas)
2. Iniciar Fase 1 (Setup y Configuración)
3. Optimizar video hero

### 📅 PRÓXIMAS 2 SEMANAS
1. Completar Fase 2 (Scrollytelling Hero)
2. Completar Fase 3 (Formulario de Cualificación)
3. Iniciar Fase 4 (Actualización del Chatbot)

---

**¿Listo para comenzar la transformación?**

Jorge Cabrera L. - Áperca SpA  
Santiago, Chile | +56 9 78661970 | jcabreralabbe@gmail.com
