# Plan de Implementación: Página de Diagnóstico GRC (Ley 21.663 / Ley 21.719)
## Áperca SpA — nuevo canal de captación vía autoevaluación regulatoria

**Versión:** 1.2 (Fase 0 — decisiones de alcance cerradas el 15-09-2026)
**Repositorio:** `portafolio-astro` (sitio en producción)
**Repositorio fuente del motor:** fork `CyberQRM` (`c:\Users\dell\CyberQRM`), ver `PLAN_IMPLEMENTACION_CyberGRM_Chile.md` v3.0
**Duración estimada:** 5–6 sesiones (menor que el plan original porque la infraestructura de leads/agenda/notificación ya existe en este repo)

---

## 0. Visión del proyecto

**Qué se construye:** una nueva página pública (`/diagnostico-grc`, ruta a confirmar en Fase 0) donde una PyME chilena responde un cuestionario corto sobre ciberseguridad y datos personales, y obtiene de inmediato:

1. Si le aplica la Ley 21.663 (ciberseguridad) y/o la Ley 21.719 (protección de datos), y en qué rol.
2. Un puntaje de madurez (0–100).
3. Un rango indicativo de exposición económica en CLP, calculado con el motor Monte Carlo FAIR portado del fork CyberQRM.
4. Un CTA inmediato para **agendar una reunión de diagnóstico GRC** (el servicio que efectivamente se vende) usando el sistema de agenda que Áperca SpA ya tiene en producción.

**Objetivo de negocio:** no es una herramienta de autoservicio ni un informe gratuito completo. Es un **embudo de calificación y conversión**: el cuestionario entrega valor suficiente para generar interés real, y el cierre ocurre en la reunión agendada, no en la pantalla de resultado.

**Por qué en `portafolio-astro` y no como proyecto nuevo:** este repositorio ya tiene en producción exactamente las piezas que el plan original (`PLAN_IMPLEMENTACION_CyberGRM_Chile.md`) proponía construir desde cero: backend Convex desplegado, tabla `leads`, un funnel multi-paso (`QualifyingFunnel.tsx`), y un sistema de agenda con notificación automática por Telegram. El trabajo real es **extender esa infraestructura**, no levantar una nueva.

---

## 1. Estado real del repo (verificado)

| Pieza necesaria | Estado en `portafolio-astro` |
|---|---|
| Backend Convex desplegado | ✅ Existe y está en producción |
| Tabla `leads` (`convex/schema.ts`) | ✅ Existe: `type`, `name`, `email`, `company?`, `budget_range?`, `challenge?`, `project_summary`, `source`, `created_at`, indexada por email/type/source/created_at |
| Mutation de captura de lead | ✅ `submitLead` en `convex/funnel.ts` |
| Formulario multi-paso | ✅ `QualifyingFunnel.tsx` + `FunnelStep.tsx` + `ProgressIndicator.tsx` en `src/components/funnel/` |
| Sistema de agenda | ✅ `convex/functions/agenda.ts`: queries `getDisponibilidad`, `listarCitas`, `buscarCitasPorEmail`, `getConfiguracion`; mutations `agendarCita`, `cancelarCita` |
| Notificación automática al agendar | ✅ `agendarCita` ya envía mensaje a Telegram vía `TELEGRAM_BOT_TOKEN` / `TELEGRAM_AUTHORIZED_USER` (`process.env`) |
| Motor FAIR (Monte Carlo) | ✅ Portado el 15-09-2026 a `convex/lib/fairEngine.ts` + `convex/lib/fairTypes.ts` (uuid reemplazado por `crypto.randomUUID()`, sin errores de tipos) |
| Catálogo normativo (`compliance-core`) | ❌ No existe — se crea de cero, como datos, siguiendo el diseño de `PLAN_IMPLEMENTACION_CyberGRM_Chile.md` §3.2 |
| Tabla de resultados del diagnóstico | ❌ No existe — se agrega `grc_assessments` sin modificar `leads` |
| Widget de calendario en frontend | ❌ El backend de agenda existe, pero no hay componente de UI que lo consuma todavía |
| Página `/diagnostico-grc` | ❌ No existe — páginas actuales: `index.astro`, `reclutadores.astro`, `mi-perfil.astro`, `proyectos/` |

---

## 2. Arquitectura de la nueva funcionalidad

```
src/pages/diagnostico-grc.astro
        │
        ▼
GrcAssessmentFunnel.tsx (isla React, mismo patrón que QualifyingFunnel.tsx)
  cuestionario (sector, tamaño, ingresos, preguntas 21.663/21.719)
        │ useMutation(api.grcAssessment.submitGrcAssessment)
        ▼
convex/grcAssessment.ts — mutation
  1. corre convex/lib/fairEngine.ts (Monte Carlo, in-process)
  2. inserta en "leads" (type: "GRC_ASSESSMENT", source: "GRC_FUNNEL")
  3. inserta en "grc_assessments" (respuestas, aplicabilidad, score, percentiles)
        │
        ▼
Resultado inmediato en pantalla (teaser: aplicabilidad + score + rango CLP amplio)
        │
        ▼
Widget de agenda (nuevo) → getDisponibilidad / agendarCita (ya existentes)
        │
        ▼
Notificación Telegram (ya existente, sin cambios)
```

`convex/lib/fairEngine.ts` y `convex/lib/compliance.ts` son los únicos módulos nuevos de lógica pura; todo lo demás reutiliza mutations, queries y el canal de notificación que ya están en producción.

---

## 3. Roadmap por fases

### Fase 0 — Decisiones de alcance ✅ COMPLETADA (15-09-2026)
- [x] **Ruta definitiva:** página independiente `src/pages/diagnostico-grc.astro` (no se embebe en `/`, para no competir con el scrollytelling y poder trackear/promocionar por separado).
- [x] **3 plantillas sectoriales de lanzamiento confirmadas:** Salud, Servicios financieros/seguros, Comercio (mismas que `PLAN_IMPLEMENTACION_CyberGRM_Chile.md` §3.4).
- [x] **Valores confirmados:** `leads.type = "GRC_ASSESSMENT"`, `leads.source = "GRC_FUNNEL"` — no chocan con los valores existentes (`HIGH_TICKET_CLIENT`, `RECRUITER`, `FUNNEL_FORM`, `AI_AGENT`, `DIRECT`).
- [ ] **Aviso de privacidad y consentimiento (Ley 21.719):** decisión tomada de **posponerlo a la Fase 4** (UI del cuestionario) en vez de redactarlo en esta fase — se implementa como parte del primer paso del formulario, no al final.
- **Punto de entrada confirmado:** opción "DevSecOps/Seguridad" (`value: "security"`) ya existente en el paso 2 de `QualifyingFunnel.tsx` — al seleccionarla se puede redirigir/enlazar a `/diagnostico-grc` en la Fase 6.

**Entregable:** decisiones documentadas, cero riesgo técnico. Lista para iniciar Fase 2 (esquema de datos).

### Fase 1 — Motor y catálogo normativo portados (≈ 1 sesión)
- [x] **Motor FAIR portado (15-09-2026):** `convex/lib/fairEngine.ts` — copia fiel de `simulationEngine.ts` del fork CyberQRM, con `uuid` reemplazado por `crypto.randomUUID()`. Tipos en `convex/lib/fairTypes.ts` (subconjunto de `shared/types/fair.ts` que el motor consume). Verificado sin errores de compilación.
- [ ] **Pendiente:** test de regresión (misma semilla → mismos resultados que el fork original) — no se agregó infraestructura de testing en esta pasada.
- [x] **`convex/lib/compliance.ts` (15-09-2026):** árbol de aplicabilidad (`evaluarAplicabilidad`), score de madurez (`calcularScoreMadurez`), techos sancionatorios indicativos (`TECHOS_SANCIONATORIOS`, marcados como placeholder pendiente de verificación legal) y las 3 plantillas FAIR de lanzamiento (`construirEscenarioFAIR` para salud/servicios_financieros/comercio), todo como datos versionables. Incluye el catálogo de 10 preguntas (`GRC_QUESTIONS`) que usará la Fase 4.

### Fase 2 — Esquema de datos ✅ COMPLETADA (15-09-2026)
- [x] Extendido `convex/schema.ts` con la tabla `grc_assessments`: `leadId: v.id("leads")`, `sector`, `tamano_empresa`, `respuestas` (array tipado `{questionId, value}`), `aplicabilidad` (`ley21663`, `ley21719`, `rol21719`), `score`, `exposicionP10/P50/P90`, `moneda`, `seedUsada`, `created_at`.
- [x] Índices: `por_leadId`, `por_sector`, `por_created_at`.
- [x] No se modificó la tabla `leads` existente — solo se agregaron los valores `"GRC_ASSESSMENT"`/`"GRC_FUNNEL"` como comentario de referencia en `type`/`source` (siguen siendo `v.string()` libre).
- [x] Desplegado con `npx convex dev --once` — sin errores de tipos, índices creados correctamente.

### Fase 3 — Backend Convex ✅ COMPLETADA (15-09-2026)
- [x] `convex/grcAssessment.ts`: mutation `submitGrcAssessment` — recibe `sector`, `tamano_empresa`, `respuestas` + datos del lead; corre `evaluarAplicabilidad` + `calcularScoreMadurez` + `construirEscenarioFAIR` + `runMonteCarloSimulation`, e inserta en `leads` (`type: "GRC_ASSESSMENT"`, `source: "GRC_FUNNEL"`) y `grc_assessments`.
- [x] Notificación Telegram reutilizando el mismo patrón de `agendarCita` (`TELEGRAM_BOT_TOKEN`/`TELEGRAM_AUTHORIZED_USER`, envuelta en try/catch para no bloquear el guardado si falla) — sin proveedor de email nuevo.
- [x] Desplegado con `npx convex dev --once` — sin errores de compilación.

### Fase 4 — Diagnóstico conversacional dentro del Chatbot (≈ 2 sesiones, replanteada 15-09-2026)

**Decisión de diseño (15-09-2026):** se descarta el formulario multi-paso tradicional
(`GrcAssessmentFunnel.tsx` como página/isla separada). En su lugar, el cuestionario vive
**dentro de `Chatbot.tsx`**, como una conversación con chips seleccionables — coherente
con el lenguaje visual del sitio (layers, scroll, carruseles) y con mejor conversión que
un formulario denso.

**Arquitectura del flujo:**
1. **Punto de entrada:** un CTA en el sitio (Navbar y/o estación final del scrollytelling)
   dispara `window.dispatchEvent(new CustomEvent('openChat', { detail: { type: 'grc_diagnostic' } }))`
   — reutiliza el mismo mecanismo que ya usan `schedule_meeting`/`contact`.
2. **Nuevo `ChatContext.type = 'grc_diagnostic'`** en `Chatbot.tsx`, con mensaje de bienvenida
   propio (qué es el diagnóstico, cuánto dura, qué obtiene el usuario) + aviso de privacidad
   corto con botón "Acepto y continúo" antes de la primera pregunta (cumple la decisión de
   Fase 0 de mostrar el aviso al inicio, sin modal bloqueante).
3. **Preguntas como chips, no inputs:** cada pregunta de `GRC_QUESTIONS` (`convex/lib/compliance.ts`)
   se renderiza como burbuja del bot + fila de opciones tocables (visual heredado de
   `.funnel-option`, en carrusel horizontal si no caben). Se extiende la interfaz `Message`
   con `quickReplies?: { label: string; value: string; icon?: string }[]`.
4. **Interrupciones con preguntas libres (pedido explícito):** si el usuario escribe texto en
   vez de tocar un chip, el mensaje se enruta al agente (`procesarMensajeWeb`) junto con un
   `grcContext` liviano (pregunta pendiente + respuestas ya dadas) para que conteste dudas
   tipo "¿qué es la Ley 21.663?" sin perder el progreso; al terminar de responder, el bot
   vuelve a mostrar la pregunta pendiente. Requiere:
   - Estado de máquina en cliente (`useGrcChatFlow` hook nuevo, no infla `Chatbot.tsx`).
   - Parámetro opcional `grcContext` en `procesarMensajeWeb` (`convex/functions/ai/googleChatbot.ts`).
   - Bloque de conocimiento base de ambas leyes agregado a `CHATBOT_CONFIG.system_prompt`
     (`convex/constants.ts`), dejando explícito que no es asesoría legal.
5. **Captura de contacto conversacional:** al cerrar el cuestionario, 2 burbujas sucesivas
   pidiendo nombre y luego email (no un formulario de 4 campos junto).
6. **Resultado como tarjeta, no informe:** burbuja ancha con score (barra/gauge), badges de
   aplicabilidad (Ley 21.663 / 21.719) y rango de exposición CLP marcado como indicativo,
   seguida del CTA "Agendar diagnóstico" que reutiliza el contexto `schedule_meeting` ya
   existente (cero código nuevo de agenda).
7. **Reutiliza sin cambios:** `submitGrcAssessment` (Fase 3) tal cual — el chat solo cambia
   cómo se recolectan las respuestas, no el backend.

**Pendiente de confirmar antes de codear:** ubicación exacta del botón de entrada (Navbar
vs. estación final del scrollytelling vs. ambos) y el alcance real del punto 4 (interrupciones
libres) para la primera iteración — ver preguntas de esta sesión.

#### MVP implementado (15-09-2026) — solo flujo de chips, sin interrupciones libres

Decisión tomada en sesión: arrancar con el punto 4 (interrupciones con preguntas libres al
agente) **fuera de alcance**, para no bloquear el lanzamiento del flujo base. Lo demás del
diseño de Fase 4 quedó implementado tal cual:

- [x] `ChatContext.type = 'grc_diagnostic'` en `src/components/Chatbot.tsx`, con render de
  `quickReplies` (chips) y `resultCard` (tarjeta de resultado) como casos nuevos del mensaje.
- [x] `src/components/grc/useGrcChatFlow.ts` (hook nuevo): máquina de estados
  `consent → sector → tamaño → preguntas (GRC_QUESTIONS, chips Sí/No) → nombre → email → submit`.
  Nombre y email son los únicos pasos de texto libre; el resto son chips.
- [x] Aviso de privacidad corto como primer mensaje del bot, con chip "Entiendo y quiero continuar"
  (cumple la decisión de Fase 0 de mostrarlo al inicio, sin modal bloqueante).
- [x] Al enviar, llama a `submitGrcAssessment` (Fase 3, sin cambios) y renderiza la `resultCard`
  con score, badges de aplicabilidad (Ley 21.663/21.719) y rango de exposición CLP (P10–P90),
  con el disclaimer de "estimación indicativa".
- [x] Botón "Agendar mi diagnóstico →" en la tarjeta despacha `openChat` con
  `{ type: 'schedule_meeting', ... }`, reutilizando el flujo de agenda existente sin cambios (Fase 5).
- [x] Punto de entrada MVP: el botón principal del CTA de home (estación final del
  scrollytelling, `ScrollytellingHero.tsx`) despacha `openChat` con `{ type: 'grc_diagnostic' }`.
- [x] Desplegado y verificado sin errores de compilación (frontend + `npx convex dev --once`).

**Explícitamente fuera de este MVP (queda para una siguiente iteración, no bloquea uso real):**
- Punto 4 del diseño original: si el usuario escribe texto libre en vez de tocar un chip
  durante el cuestionario, hoy no se enruta al agente — se ignora hasta Fase 4b.
- Entradas adicionales: botón en Navbar y redirección automática desde la opción
  "DevSecOps/Seguridad" de `QualifyingFunnel.tsx` (siguen apuntando al flujo genérico).
- Página dedicada `/diagnostico-grc` (ver Fase 6, ya marcada como opcional/pospuesta).

### Fase 5 — Puente resultado → agenda (≈ 0,5 sesión, reducida 15-09-2026)
- **Ya no se construye un widget de calendario nuevo.** `getDisponibilidad`/`agendarCita` (`convex/functions/agenda.ts`) ya están completamente conectados al flujo de chat `schedule_meeting` (extracción con Gemini + notificación Telegram, ver `convex/functions/ai/googleChatbot.ts` líneas ~700-880).
- Al mostrar la tarjeta de resultado, el botón "Agendar diagnóstico" simplemente despacha `openChat` con `{ type: 'schedule_meeting', initialMessage: ... }`, reutilizando ese flujo tal cual, con un mensaje inicial que referencia el score/sector ya calculado para no repetir preguntas.

### Fase 6 — Integración y despliegue (≈ 0,5 sesión, reducida 15-09-2026)
- CTA de entrada (botón) en Navbar y/o estación final del scrollytelling, y como respuesta automática cuando el usuario elige "DevSecOps/Seguridad" en `QualifyingFunnel.tsx` — todos disparan el mismo evento `openChat` con `{ type: 'grc_diagnostic' }`.
- **Página dedicada `/diagnostico-grc` queda opcional/pospuesta:** ya no es necesaria para el flujo (todo ocurre en el chat); se evalúa solo si se quiere una URL propia para SEO/ads.
- Aviso de privacidad visible en el primer paso del chat, no al final (ya definido en Fase 4).
- Deploy con el pipeline ya existente: Netlify para el sitio (`netlify.toml`), `npx convex deploy` para el backend — sin infraestructura nueva.

### Fase 7 — Validación de conversión (post-lanzamiento, sin fecha fija)
- Medir tasa de conversión formulario → agenda con las 3 plantillas de lanzamiento.
- Agregar plantillas sectoriales adicionales (servicios profesionales, TI, educación) solo si el embudo convierte — es un cambio de datos en `compliance.ts`, no de arquitectura.

**Total estimado Fases 4–6 (replanteadas 15-09-2026): ≈ 3 sesiones** (antes ≈ 3,5–4,5).

---

## 4. Riesgos y decisiones pendientes

1. **Obligación propia bajo la 21.719.** Igual que en el plan del fork: recolectar datos de contacto exige aviso de privacidad, finalidad y consentimiento explícitos.
2. **Responsabilidad por el número mostrado.** El rango de exposición en CLP debe presentarse con limitación de alcance visible; es indicativo, no un informe pericial.
3. **Sin proveedor de email en el v1.** Se decide usar el canal Telegram ya operativo en vez de contratar Resend/Postmark — más simple, cero costo adicional, pero significa que el lead no recibe confirmación por correo automáticamente (solo se le confirma en pantalla). Revisar si esto es aceptable o si se agrega email en una iteración posterior.
4. **Ruta y nombre de la página** (Fase 0).
5. **Verificación legal** de cifras y plazos citados en `compliance.ts` contra el texto oficial de ambas leyes antes de publicar — no soy fuente legal.
