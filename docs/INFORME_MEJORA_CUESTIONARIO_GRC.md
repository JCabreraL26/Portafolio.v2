# Informe: Mejora del Cuestionario GRC - Diagnóstico de Cumplimiento

**Fecha:** 16 de Septiembre, 2026  
**Proyecto:** Áperca SpA - Diagnóstico GRC (Ley 21.663 / Ley 21.719)  
**Estado actual:** MVP funcional en chatbot (Fase 4 completada)

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que está implementado y funciona bien

1. **Flujo conversacional en chatbot** (`src/components/Chatbot.tsx`)
   - Integración completa del diagnóstico GRC dentro del chat existente
   - Chips seleccionables para respuestas Sí/No
   - Tarjeta de resultado con score, aplicabilidad y exposición CLP
   - Transición fluida a agendamiento de reunión

2. **Lógica de negocio robusta** (`convex/lib/compliance.ts`)
   - 10 preguntas estructuradas en 3 capítulos (datos, criticidad, preparación)
   - Árbol de aplicabilidad para Ley 21.663 y 21.719
   - Score de madurez (0-100) con penalización por incidentes previos
   - Motor FAIR para estimación de exposición económica

3. **Backend completo** (`convex/grcAssessment.ts`)
   - Mutation que guarda en `leads` y `grc_assessments`
   - Notificación automática por Telegram
   - Integración con sistema de agenda existente

4. **Punto de entrada MVP**
   - Botón principal en `ScrollytellingHero.tsx` (estación final)
   - Dispara evento `openChat` con `type: 'grc_diagnostic'`

### ⚠️ Oportunidades de mejora identificadas

1. **CTA en homepage poco claro**
   - Actualmente: "Agenda tu Diagnóstico" (genérico)
   - Problema: No comunica el valor específico del diagnóstico GRC
   - Oportunidad: CTA más marketero y directo sobre cumplimiento legal

2. **Sin entrada desde página de ciberseguridad**
   - `src/pages/proyectos/ciberseguridad-empresarial.astro` tiene CTA de "Solicitar Auditoría de Seguridad"
   - Actualmente abre chat genérico, no el diagnóstico GRC
   - Oportunidad: Conectar el servicio de ciberseguridad con el diagnóstico regulatorio

3. **Falta contexto inicial en el chat**
   - El aviso de privacidad es correcto pero muy técnico
   - Oportunidad: Mensaje de bienvenida más persuasivo que explique el beneficio

4. **Sin página dedicada `/diagnostico-grc`**
   - Marcada como "opcional/pospuesta" en Fase 6
   - Oportunidad: URL propia para SEO, ads y compartir

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Prioridad 1: Mejorar CTAs y puntos de entrada (2-3 horas)

#### Acción 1.1: Actualizar CTA principal en homepage
**Archivo:** `src/components/scrollytelling/ScrollytellingHero.tsx`

**Cambio propuesto:**
```typescript
// Estación 5 (actual)
ctaText: 'Agenda tu Diagnóstico',

// Propuesta mejorada (opción A - directo)
ctaText: '¿Cumples con la nueva Ley de Datos? Averígualo en 2 min',

// Propuesta mejorada (opción B - urgencia)
ctaText: 'Evalúa tu Cumplimiento Legal (Gratis)',

// Propuesta mejorada (opción C - beneficio)
ctaText: '¿Estás al día con la legislación chilena?',
```

**Justificación:**
- Menciona explícitamente "Ley de Datos" (gatillo de interés para PyMEs)
- Comunica tiempo ("2 min") para reducir fricción
- Genera curiosidad sin ser alarmista

#### Acción 1.2: Agregar CTA secundario en estación 2 (Arquitectura Blindada)
**Archivo:** `src/components/scrollytelling/ScrollytellingHero.tsx`

**Cambio propuesto:**
```typescript
{
  id: 2,
  startTime: 2,
  endTime: 3,
  title: 'Amenazas modeladas.\nCódigo seguro',
  subtitle: 'ARQUITECTURA BLINDADA',
  description: 'No pintamos sobre ruinas. Definimos la estructura, clasificamos los datos y blindamos el flujo antes de escribir la primera línea de código. Tu sistema resiste auditorías desde el commit inicial',
  ctaText: 'Evalúa tu Cumplimiento GRC', // NUEVO
  ctaLink: '#', // Dispara grc_diagnostic
},
```

**Justificación:**
- La estación habla de "clasificar datos" y "auditorías" → contexto perfecto para GRC
- Ofrece segunda oportunidad de conversión sin esperar al final

#### Acción 1.3: Conectar página de ciberseguridad con diagnóstico GRC
**Archivo:** `src/pages/proyectos/ciberseguridad-empresarial.astro`

**Cambio propuesto:**
```javascript
// Línea 207-210 (actual)
ctaButton.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('openChat', { 
    detail: { type: 'general' } 
  }));
});

// Propuesta mejorada
ctaButton.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('openChat', { 
    detail: { type: 'grc_diagnostic' } 
  }));
});
```

**Agregar sección nueva antes del CTA final:**
```astro
<!-- Nueva sección: Cumplimiento Regulatorio -->
<section class="relative z-20 py-20 bg-[#FAF9F6]">
  <div class="container mx-auto px-4 sm:px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl sm:text-4xl font-['Syne'] font-black text-[#0A0A0A] mb-6">
        ¿Tu empresa cumple con la Ley 21.663 y 21.719?
      </h2>
      <p class="text-lg text-neutral-600 mb-8">
        Diagnóstico exprés (2 min): descubre si te aplican las nuevas leyes de ciberseguridad y protección de datos, tu nivel de madurez y exposición económica indicativa.
      </p>
      <button
        id="cta-grc-diagnostic"
        class="px-8 py-4 bg-[#F99D1C] text-[#283329] font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
      >
        <span>Evaluar mi Cumplimiento (Gratis)</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</section>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const grcButton = document.getElementById('cta-grc-diagnostic');
    if (grcButton) {
      grcButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('openChat', { 
          detail: { type: 'grc_diagnostic' } 
        }));
      });
    }
  });
</script>
```

**Justificación:**
- Página de ciberseguridad es el contexto perfecto para hablar de cumplimiento regulatorio
- Genera segunda vía de conversión desde contenido relacionado
- Educa sobre las leyes antes de abrir el chat

### Prioridad 2: Mejorar mensaje de bienvenida del diagnóstico (1 hora)

#### Acción 2.1: Reescribir mensaje inicial más persuasivo
**Archivo:** `src/components/grc/useGrcChatFlow.ts`

**Cambio propuesto:**
```typescript
// Línea 69-72 (actual)
case "consent":
  return {
    texto:
      "🛡️ **Diagnóstico GRC exprés (2 min)**\n\nTe haré preguntas cortas sobre datos personales y ciberseguridad. Al final verás si te aplica la Ley 21.663 y/o la Ley 21.719, un score de madurez y un rango indicativo de exposición económica.\n\nUsaremos tus respuestas y datos de contacto solo para preparar este diagnóstico y la reunión que agendes. Es una estimación, no un informe legal.",
    quickReplies: [{ label: "Entiendo y quiero continuar", value: "ack" }],
  };

// Propuesta mejorada (más beneficios, menos legal)
case "consent":
  return {
    texto:
      "🛡️ **¿Tu empresa cumple con las nuevas leyes chilenas de datos y ciberseguridad?**\n\n**Descúbrelo en 2 minutos:**\n• ¿Te aplica la Ley 21.663 (Ciberseguridad) y/o la Ley 21.719 (Datos Personales)?\n• Tu score de madurez vs. empresas de tu sector\n• Rango de exposición económica indicativa (multas + interrupción)\n\n**Luego:** Agenda una reunión gratuita para recibir tu informe detallado.\n\n_Tus datos se usan solo para este diagnóstico. No es asesoría legal._",
    quickReplies: [{ label: "Comenzar diagnóstico →", value: "ack" }],
  };
```

**Justificación:**
- Formato de lista con bullets (más escaneable)
- Enfatiza beneficios ("descúbrelo", "tu score", "gratis") antes que disclaimers
- CTA más accionable: "Comenzar diagnóstico →" vs. "Entiendo y quiero continuar"

### Prioridad 3: Crear página dedicada `/diagnostico-grc` (4-5 horas)

#### Acción 3.1: Nueva página landing para SEO y compartir
**Archivo nuevo:** `src/pages/diagnostico-grc.astro`

**Estructura propuesta:**
```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
---

<Layout 
  title="Diagnóstico GRC Gratuito - ¿Cumples con la Ley 21.663 y 21.719? | Áperca SpA"
  description="Evalúa en 2 minutos si tu empresa cumple con las nuevas leyes chilenas de ciberseguridad y protección de datos. Score de madurez + exposición económica indicativa."
>
  <Navbar />
  
  <!-- Hero Section -->
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#283329] to-[#0A0A0A] relative overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 relative z-10 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#F99D1C]/30 border border-[#F99D1C]/50 rounded-full mb-8 backdrop-blur-sm">
          <span class="text-[#F99D1C] text-sm font-semibold">Diagnóstico Gratuito</span>
        </div>

        <!-- Título Principal -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-['Syne'] font-black leading-tight mb-6 text-white">
          ¿Tu empresa cumple con las<br/>
          <span class="text-[#F99D1C]">nuevas leyes chilenas</span><br/>
          de datos y ciberseguridad?
        </h1>
        
        <!-- Subtítulo -->
        <p class="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Descúbrelo en 2 minutos. Sin costo, sin compromiso.
        </p>

        <!-- CTA Principal -->
        <button
          id="cta-start-diagnostic"
          class="px-10 py-5 bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold text-xl rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,157,28,0.6)] inline-flex items-center gap-3"
        >
          <span>Comenzar Diagnóstico →</span>
        </button>

        <!-- Trust indicators -->
        <div class="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
          <div class="text-center">
            <div class="text-3xl font-black text-[#F99D1C] mb-2">2 min</div>
            <div class="text-sm text-white/70">Tiempo promedio</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-[#F99D1C] mb-2">10</div>
            <div class="text-sm text-white/70">Preguntas simples</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-black text-[#F99D1C] mb-2">100%</div>
            <div class="text-sm text-white/70">Gratis</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Qué obtienes -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-['Syne'] font-black text-center mb-12">
          Qué obtienes en tu diagnóstico
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#F99D1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">⚖️</span>
            </div>
            <h3 class="font-bold text-lg mb-2">Aplicabilidad Legal</h3>
            <p class="text-neutral-600 text-sm">
              ¿Te aplica la Ley 21.663 (Ciberseguridad) y/o la Ley 21.719 (Protección de Datos)? En qué rol.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#F99D1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">📊</span>
            </div>
            <h3 class="font-bold text-lg mb-2">Score de Madurez</h3>
            <p class="text-neutral-600 text-sm">
              Puntaje 0-100 de tu nivel de preparación vs. empresas de tu sector.
            </p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#F99D1C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">💰</span>
            </div>
            <h3 class="font-bold text-lg mb-2">Exposición Económica</h3>
            <p class="text-neutral-600 text-sm">
              Rango indicativo en CLP (multas + interrupción + reputación).
            </p>
          </div>
        </div>

        <div class="text-center mt-12">
          <button
            id="cta-start-diagnostic-2"
            class="px-8 py-4 bg-[#283329] text-white font-bold rounded-full hover:bg-[#F99D1C] hover:text-[#283329] transition-all"
          >
            Comenzar ahora →
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Cómo funciona -->
  <section class="py-20 bg-[#FAF9F6]">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-['Syne'] font-black text-center mb-12">
          Cómo funciona
        </h2>
        
        <div class="space-y-6">
          <div class="flex gap-4 items-start">
            <div class="w-10 h-10 bg-[#F99D1C] text-[#283329] rounded-full flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h3 class="font-bold mb-1">Respondes 10 preguntas simples</h3>
              <p class="text-neutral-600 text-sm">Sobre datos que manejas, criticidad de tu operación y nivel de preparación.</p>
            </div>
          </div>
          
          <div class="flex gap-4 items-start">
            <div class="w-10 h-10 bg-[#F99D1C] text-[#283329] rounded-full flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h3 class="font-bold mb-1">Obtienes tu resultado inmediato</h3>
              <p class="text-neutral-600 text-sm">Aplicabilidad legal, score de madurez y rango de exposición económica.</p>
            </div>
          </div>
          
          <div class="flex gap-4 items-start">
            <div class="w-10 h-10 bg-[#F99D1C] text-[#283329] rounded-full flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h3 class="font-bold mb-1">Agendas reunión gratuita (opcional)</h3>
              <p class="text-neutral-600 text-sm">30 minutos con Jorge Cabrera para recibir tu informe detallado y plan de acción.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-['Syne'] font-black text-center mb-12">
          Preguntas frecuentes
        </h2>
        
        <div class="space-y-6">
          <details class="border-b border-neutral-200 pb-4">
            <summary class="font-bold cursor-pointer">¿Es realmente gratis?</summary>
            <p class="text-neutral-600 text-sm mt-2">Sí. El diagnóstico exprés y el resultado son 100% gratuitos. La reunión de 30 minutos también es sin costo ni compromiso.</p>
          </details>
          
          <details class="border-b border-neutral-200 pb-4">
            <summary class="font-bold cursor-pointer">¿Qué tan preciso es el resultado?</summary>
            <p class="text-neutral-600 text-sm mt-2">Es una estimación indicativa basada en tus respuestas. En la reunión gratuita afinamos con datos reales de tu empresa para un informe detallado.</p>
          </details>
          
          <details class="border-b border-neutral-200 pb-4">
            <summary class="font-bold cursor-pointer">¿Qué pasa con mis datos?</summary>
            <p class="text-neutral-600 text-sm mt-2">Se usan solo para calcular tu diagnóstico y preparar la reunión si la agendas. No compartimos ni vendemos tu información.</p>
          </details>
          
          <details class="border-b border-neutral-200 pb-4">
            <summary class="font-bold cursor-pointer">¿Esto es asesoría legal?</summary>
            <p class="text-neutral-600 text-sm mt-2">No. Es un diagnóstico técnico de ciberseguridad y gobernanza de datos. Para asesoría legal, recomendamos consultar con un abogado especializado.</p>
          </details>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Final -->
  <section class="py-20 bg-gradient-to-br from-[#283329] to-[#0A0A0A]">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-['Syne'] font-black text-white mb-6">
          ¿Listo para conocer tu nivel de cumplimiento?
        </h2>
        <p class="text-xl text-white/80 mb-8">
          2 minutos que pueden ahorrarte multas millonarias.
        </p>
        <button
          id="cta-start-diagnostic-3"
          class="px-10 py-5 bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold text-xl rounded-full transition-all duration-300 hover:scale-105"
        >
          Comenzar Diagnóstico →
        </button>
      </div>
    </div>
  </section>

  <Footer variant="clean" />

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const buttons = [
        'cta-start-diagnostic',
        'cta-start-diagnostic-2',
        'cta-start-diagnostic-3'
      ];
      
      buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('openChat', { 
              detail: { type: 'grc_diagnostic' } 
            }));
          });
        }
      });
    });
  </script>
</Layout>
```

**Justificación:**
- **SEO:** URL propia `/diagnostico-grc` para posicionar en búsquedas de "Ley 21.663", "Ley 21.719", "cumplimiento datos Chile"
- **Compartible:** Link directo para enviar por email, LinkedIn, ads
- **Educativa:** Explica qué son las leyes y por qué importan antes de abrir el chat
- **Conversión:** Múltiples CTAs a lo largo de la página (hero, beneficios, cómo funciona, final)
- **Trust building:** FAQ para resolver objeciones comunes

#### Acción 3.2: Agregar link en Navbar
**Archivo:** `src/components/Navbar.astro`

**Cambio propuesto:**
```astro
<!-- Agregar después de "Portfolio Técnico" -->
<a 
  href="/diagnostico-grc" 
  class="nav-link"
>
  Diagnóstico GRC
</a>
```

### Prioridad 4 (Opcional): Mejoras UX del flujo conversacional (2-3 horas)

#### Acción 4.1: Agregar mensajes de transición entre capítulos
**Archivo:** `src/components/grc/useGrcChatFlow.ts`

**Cambio propuesto:**
```typescript
// Detectar cambio de capítulo y mostrar mensaje contextual
case "question": {
  const q = GRC_QUESTIONS[questionIndex];
  const prevQ = questionIndex > 0 ? GRC_QUESTIONS[questionIndex - 1] : null;
  
  // Si cambiamos de capítulo, mostrar mensaje de transición
  if (prevQ && prevQ.capitulo !== q.capitulo) {
    const capitulo = GRC_CAPITULOS.find(c => c.numero === q.capitulo);
    return {
      texto: `**${capitulo?.titulo}**\n${capitulo?.subtitulo}\n\n${q.texto}`,
      quickReplies: YES_NO
    };
  }
  
  return { texto: q.texto, quickReplies: YES_NO };
}
```

**Justificación:**
- Da contexto al usuario sobre qué está evaluando en cada sección
- Reduce sensación de "interrogatorio" y aumenta engagement

#### Acción 4.2: Mostrar progreso visual en el chat
**Archivo:** `src/components/Chatbot.tsx`

**Cambio propuesto:**
```tsx
{/* Agregar después del header, solo si context.type === 'grc_diagnostic' */}
{context.type === 'grc_diagnostic' && grcFlow.currentStep && (
  <div className="px-4 py-2 bg-[#FAF9F6] border-b border-neutral-200">
    <div className="flex items-center justify-between text-xs text-neutral-600">
      <span>Pregunta {grcFlow.currentQuestionIndex + 1} de {GRC_QUESTIONS.length}</span>
      <span>{Math.round(((grcFlow.currentQuestionIndex + 1) / GRC_QUESTIONS.length) * 100)}%</span>
    </div>
    <div className="w-full bg-neutral-200 rounded-full h-1 mt-1">
      <div 
        className="bg-[#F99D1C] h-1 rounded-full transition-all duration-300"
        style={{ width: `${((grcFlow.currentQuestionIndex + 1) / GRC_QUESTIONS.length) * 100}%` }}
      />
    </div>
  </div>
)}
```

**Justificación:**
- Reduce ansiedad del usuario ("¿cuánto falta?")
- Aumenta tasa de completación al mostrar progreso tangible

---

## 📈 IMPACTO ESPERADO

### Métricas de éxito a trackear

1. **Tasa de inicio del diagnóstico**
   - Actual: Solo desde botón final del scrollytelling
   - Objetivo: +150% con múltiples puntos de entrada

2. **Tasa de completación del cuestionario**
   - Actual: Sin baseline (recién implementado)
   - Objetivo: >70% de quienes empiezan, terminan

3. **Tasa de conversión a reunión agendada**
   - Actual: Sin baseline
   - Objetivo: >40% de quienes completan, agendan

4. **Tráfico orgánico a `/diagnostico-grc`**
   - Actual: 0 (página no existe)
   - Objetivo: 50-100 visitas/mes en 3 meses (SEO)

### ROI estimado

**Inversión:** 8-11 horas de desarrollo  
**Retorno esperado:**
- 1 cliente high-ticket ($10k-$50k) pagado = ROI de 100x-600x
- Posicionamiento como experto en cumplimiento regulatorio chileno
- Asset reutilizable para campañas de ads y contenido

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### Sprint 1 (Prioridad 1 + 2) - 3-4 horas
- [ ] Actualizar CTAs en `ScrollytellingHero.tsx`
- [ ] Agregar sección GRC en página de ciberseguridad
- [ ] Mejorar mensaje de bienvenida en `useGrcChatFlow.ts`
- [ ] Testing en móvil y desktop

### Sprint 2 (Prioridad 3) - 4-5 horas
- [ ] Crear página `/diagnostico-grc.astro`
- [ ] Agregar link en Navbar
- [ ] Optimizar meta tags para SEO
- [ ] Testing de conversión

### Sprint 3 (Prioridad 4 - Opcional) - 2-3 horas
- [ ] Mensajes de transición entre capítulos
- [ ] Barra de progreso visual en chat
- [ ] A/B testing de copy

**Total estimado:** 9-12 horas de desarrollo

---

## 💡 RECOMENDACIONES ADICIONALES

### Marketing y distribución

1. **Contenido LinkedIn:**
   - Post explicando Ley 21.663 y 21.719 con link a `/diagnostico-grc`
   - Caso de uso: "PyME de salud descubrió que le aplicaba la ley y evitó multa de $X millones"

2. **Email a base existente:**
   - Asunto: "¿Tu empresa cumple con las nuevas leyes chilenas de datos? (2 min)"
   - CTA directo a `/diagnostico-grc`

3. **Google Ads:**
   - Keywords: "ley 21.663 chile", "ley 21.719 protección datos", "cumplimiento ciberseguridad chile"
   - Landing: `/diagnostico-grc`

### Mejoras técnicas futuras

1. **Analytics granular:**
   - Trackear en qué pregunta abandonan (Convex analytics)
   - Heatmap de clics en CTAs (Hotjar o similar)

2. **Personalización del resultado:**
   - Si score < 50: enfatizar urgencia
   - Si score > 70: enfatizar optimización y certificación

3. **Follow-up automatizado:**
   - Email 24h después con resumen del diagnóstico
   - Email 7 días después si no agendó reunión

---

## ✅ CONCLUSIÓN

El cuestionario GRC está **técnicamente sólido** pero **suboptimizado para conversión**. Con las mejoras propuestas:

1. **Más puntos de entrada** → Más leads entrando al funnel
2. **CTAs más claros** → Menos fricción en el inicio
3. **Página dedicada** → SEO + compartible + profesional
4. **UX mejorada** → Mayor tasa de completación

**Recomendación:** Implementar Sprint 1 y 2 (7-9 horas) antes de lanzar campaña de marketing. Sprint 3 puede esperar a tener datos de uso real.

---

**Preparado por:** Devin (Cognition AI)  
**Para:** Jorge Cabrera - Áperca SpA  
**Próximos pasos:** Revisar propuestas de copy y priorizar sprints según capacidad de desarrollo.
