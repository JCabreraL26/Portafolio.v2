# 📋 Plan de Acción: Mejoras Telegram Bot con Gemini Multimodal

## 🎯 Objetivo General
Transformar el bot de Telegram en un asistente multimodal inteligente capaz de:
- Procesar mensajes de voz
- Analizar contenido de audio con Gemini
- Clasificar automáticamente entre registros contables y design thinking
- Mantener memoria contextual de conversaciones recientes

---

## 📦 Fase 1: Actualización del Schema (Tabla de Mensajes)

### 1.1 Crear tabla `mensajes_telegram`
**Archivo:** `convex/schema.ts`

**Acción:**
```typescript
mensajes_telegram: defineTable({
  message_id: v.number(),
  chat_id: v.string(),
  username: v.string(),
  tipo_mensaje: v.union(
    v.literal("texto"),
    v.literal("voz"),
    v.literal("foto"),
    v.literal("documento")
  ),
  contenido_texto: v.optional(v.string()),
  contenido_transcrito: v.optional(v.string()), // Para audio
  archivo_url: v.optional(v.string()),
  duracion_audio: v.optional(v.number()), // segundos
  respuesta_bot: v.string(),
  accion_realizada: v.string(), // "transaccion", "proyecto_dt", "consulta", etc.
  datos_extraidos: v.optional(v.any()), // JSON con datos relevantes
  timestamp: v.number(),
})
  .index("por_chat_id", ["chat_id"])
  .index("por_timestamp", ["timestamp"])
  .index("por_tipo_mensaje", ["tipo_mensaje"])
```

**Propósito:**
- Almacenar historial completo de mensajes
- Habilitar memoria contextual (últimos 2 minutos)
- Rastrear transcripciones de voz
- Análisis de patrones de uso

---

## 📡 Fase 2: Detección de Mensajes de Voz en HTTP Router

### 2.1 Modificar `convex/http.ts`
**Archivo:** `convex/http.ts`

**Cambios requeridos:**

#### 2.1.1 Ampliar validación de mensajes
```typescript
// ANTES:
if (!update.message || !update.message.text) {
  console.log("⚠️ No hay mensaje de texto, ignorando");
  return new Response("OK");
}

// DESPUÉS:
const hasText = update.message?.text;
const hasVoice = update.message?.voice;

if (!hasText && !hasVoice) {
  console.log("⚠️ No hay mensaje de texto ni voz, ignorando");
  return new Response("OK");
}
```

#### 2.1.2 Detectar y procesar voz
```typescript
let messageContent = "";
let audioBuffer = null;
let audioUrl = null;
let messageType = "texto";

if (hasVoice) {
  messageType = "voz";
  const fileId = update.message.voice.file_id;
  const duration = update.message.voice.duration;
  
  // Obtener archivo de voz de Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const fileResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
  );
  const fileData = await fileResponse.json();
  
  if (fileData.ok) {
    audioUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
    
    // Descargar audio
    const audioResponse = await fetch(audioUrl);
    audioBuffer = await audioResponse.arrayBuffer();
    
    console.log(`🎤 Audio descargado: ${duration}s, ${audioBuffer.byteLength} bytes`);
  }
} else {
  messageContent = update.message.text;
}
```

#### 2.1.3 Pasar audio a Gemini Action
```typescript
const resultado = await ctx.runAction(api.functions.ai.gemini.procesarMensajeTelegram, {
  mensaje: messageContent,
  chat_id: chatId.toString(),
  username: userName,
  message_id: messageId,
  tipo_mensaje: messageType,
  audio_url: audioUrl || undefined,
  audio_buffer: audioBuffer ? Array.from(new Uint8Array(audioBuffer)) : undefined,
});
```

---

## 🤖 Fase 3: Actualización de Gemini.ts para Audio Multimodal

### 3.1 Modificar firma de `procesarMensajeTelegram`
**Archivo:** `convex/functions/ai/gemini.ts`

```typescript
export const procesarMensajeTelegram = action({
  args: {
    mensaje: v.string(),
    chat_id: v.string(),
    username: v.string(),
    message_id: v.number(),
    tipo_mensaje: v.optional(v.union(v.literal("texto"), v.literal("voz"))),
    audio_url: v.optional(v.string()),
    audio_buffer: v.optional(v.array(v.number())), // Uint8Array serializado
  },
  handler: async (ctx, args) => {
    // ...implementación
  }
});
```

### 3.2 Implementar memoria contextual
```typescript
// Consultar últimos 5 mensajes de los últimos 2 minutos
const dosMinutosAtras = Date.now() - (2 * 60 * 1000);

const mensajesRecientes = await ctx.runQuery(
  api.functions.ai.gemini.obtenerMensajesRecientes,
  {
    chat_id: args.chat_id,
    desde: dosMinutosAtras,
    limite: 5
  }
);

const contextoMemoria = mensajesRecientes.length > 0
  ? `\n\n📜 CONTEXTO DE CONVERSACIÓN RECIENTE (últimos 2 minutos):\n${
      mensajesRecientes.map((m: any) => 
        `- Usuario: "${m.contenido_texto || m.contenido_transcrito}"\n  Bot: "${m.respuesta_bot}"`
      ).join('\n')
    }\n`
  : '';
```

### 3.3 Crear query para memoria
```typescript
export const obtenerMensajesRecientes = query({
  args: {
    chat_id: v.string(),
    desde: v.number(),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const mensajes = await ctx.db
      .query("mensajes_telegram")
      .filter(q => 
        q.and(
          q.eq(q.field("chat_id"), args.chat_id),
          q.gte(q.field("timestamp"), args.desde)
        )
      )
      .order("desc")
      .take(args.limite || 5);
    
    return mensajes;
  },
});
```

### 3.4 Prompt multimodal para Gemini
```typescript
const promptBase = `Eres FinBot Pro, asistente personal especializado en DISEÑO Y FINANZAS de Jorge Cabrera.

🎯 TU ROL DUAL:
1️⃣ GESTOR FINANCIERO: Registra gastos, ingresos y transacciones
2️⃣ CONSULTOR DE DISEÑO: Captura insights, ideas y proyectos de Design Thinking

📊 CLASIFICACIÓN AUTOMÁTICA:
Cuando recibas un mensaje (texto o audio), determina:
- ¿Es un GASTO/INGRESO? → Guardar en "contabilidad"
- ¿Es una IDEA/INSIGHT de diseño? → Guardar en "design_thinking"
- ¿Es una CONSULTA general? → Responder sin guardar

🎤 PROCESAMIENTO DE AUDIO:
Si recibo audio:
1. Transcribe y analiza el contenido
2. Identifica la intención (finanzas vs diseño)
3. Extrae datos relevantes automáticamente
4. Confirma qué acción realizaste

💡 EJEMPLOS DE AUDIO:
Audio: "Gasté 35 dólares en Uber esta mañana"
→ Acción: Registrar gasto $35, categoría: transporte

Audio: "Idea para el proyecto: usar colores pasteles en el prototipo"
→ Acción: Registrar en design_thinking, fase: idear

Audio: "¿Cuánto he gastado esta semana?"
→ Acción: Consultar y responder, sin guardar

📝 FORMATO DE RESPUESTA:
- Confirmación clara de la acción
- Emojis para visualización rápida
- Markdown para legibilidad móvil

${contextoMemoria}

📱 MENSAJE DEL USUARIO:`;
```

### 3.5 Lógica de procesamiento de audio
```typescript
if (args.tipo_mensaje === "voz" && args.audio_buffer) {
  console.log("🎤 Procesando mensaje de voz...");
  
  // Convertir buffer a formato compatible
  const audioData = new Uint8Array(args.audio_buffer);
  
  // Llamar a Gemini con audio
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [
      {
        role: "user",
        parts: [
          { text: promptBase },
          {
            inlineData: {
              mimeType: "audio/ogg", // Telegram usa OGG/OPUS
              data: Buffer.from(audioData).toString("base64")
            }
          }
        ]
      }
    ]
  });
  
  const respuesta = result.text;
  console.log("🤖 Gemini respondió:", respuesta);
  
  // Analizar respuesta para extraer acción
  const accionMatch = respuesta.match(/Acción:\s*(.+)/i);
  // ... lógica de clasificación
}
```

### 3.6 Clasificación inteligente y guardado
```typescript
// Detectar tipo de acción en la respuesta de Gemini
const esGasto = respuesta.toLowerCase().includes("gasto") || 
                respuesta.toLowerCase().includes("registrar gasto");
const esIngreso = respuesta.toLowerCase().includes("ingreso");
const esIdea = respuesta.toLowerCase().includes("idea") || 
               respuesta.toLowerCase().includes("design thinking") ||
               respuesta.toLowerCase().includes("proyecto");

let accionRealizada = "consulta";
let datosGuardados = null;

if (esGasto || esIngreso) {
  // Extraer monto y categoría con regex o parsing de respuesta
  const montoMatch = respuesta.match(/\$?(\d+)/);
  const categoriaMatch = respuesta.match(/categoría:\s*([^,\n]+)/i);
  
  if (montoMatch) {
    datosGuardados = await ctx.runMutation(
      api.functions.ai.gemini.registrarTransaccion,
      {
        tipo: esGasto ? "gasto" : "ingreso",
        monto: parseInt(montoMatch[1]),
        categoria: categoriaMatch?.[1]?.trim() || "Sin categoría",
        descripcion: `Vía audio: ${respuesta.substring(0, 100)}`,
      }
    );
    accionRealizada = "transaccion";
  }
}

if (esIdea) {
  // Extraer datos del proyecto
  datosGuardados = await ctx.runMutation(
    api.functions.ai.gemini.crearProyectoDT,
    {
      proyecto_id: `telegram_${Date.now()}`,
      fase: "idear", // Por defecto
      titulo: `Idea capturada por voz`,
      descripcion: respuesta,
      prioridad: "media",
    }
  );
  accionRealizada = "proyecto_dt";
}
```

### 3.7 Guardar mensaje en historial
```typescript
// Guardar en tabla de mensajes para memoria futura
await ctx.runMutation(api.functions.ai.gemini.guardarMensajeTelegram, {
  message_id: args.message_id,
  chat_id: args.chat_id,
  username: args.username,
  tipo_mensaje: args.tipo_mensaje || "texto",
  contenido_texto: args.tipo_mensaje === "texto" ? args.mensaje : undefined,
  contenido_transcrito: args.tipo_mensaje === "voz" ? respuesta : undefined,
  archivo_url: args.audio_url,
  respuesta_bot: respuesta,
  accion_realizada: accionRealizada,
  datos_extraidos: datosGuardados,
  timestamp: Date.now(),
});
```

### 3.8 Crear mutación para guardar mensajes
```typescript
export const guardarMensajeTelegram = mutation({
  args: {
    message_id: v.number(),
    chat_id: v.string(),
    username: v.string(),
    tipo_mensaje: v.union(v.literal("texto"), v.literal("voz")),
    contenido_texto: v.optional(v.string()),
    contenido_transcrito: v.optional(v.string()),
    archivo_url: v.optional(v.string()),
    respuesta_bot: v.string(),
    accion_realizada: v.string(),
    datos_extraidos: v.optional(v.any()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const mensajeId = await ctx.db.insert("mensajes_telegram", args);
    
    return {
      success: true,
      mensajeId,
    };
  },
});
```

---

## ✅ Fase 4: Testing y Validación

### 4.1 Casos de prueba

#### Test 1: Mensaje de voz financiero
**Input:** Audio "Gasté 50 dólares en comida"
**Esperado:**
- Transcripción correcta
- Detección como "gasto"
- Guardado en tabla `contabilidad`
- Respuesta: "✅ Gasto registrado: $50 en comida"

#### Test 2: Mensaje de voz de diseño
**Input:** Audio "Idea: usar colores cálidos en la landing page"
**Esperado:**
- Detección como "idea"
- Guardado en tabla `design_thinking`
- Fase: "idear"
- Respuesta confirmando guardado

#### Test 3: Memoria contextual
**Input secuencial:**
1. Audio: "Gasté 30 en café"
2. (1 minuto después) Texto: "¿Cuánto llevo gastado hoy?"
**Esperado:**
- Gemini debe recordar el gasto anterior
- Respuesta debe incluir contexto

#### Test 4: Consulta general
**Input:** Audio "¿Qué tiempo hace hoy?"
**Esperado:**
- No guarda en ninguna tabla
- Respuesta conversacional
- Acción: "consulta"

### 4.2 Checklist de validación
- [ ] Audio se descarga correctamente de Telegram
- [ ] Buffer se convierte a base64 para Gemini
- [ ] Gemini transcribe audio en español
- [ ] Clasificación automática funciona (finanzas vs diseño)
- [ ] Tabla `mensajes_telegram` se llena correctamente
- [ ] Query de memoria retorna últimos mensajes
- [ ] Prompt incluye contexto de conversación
- [ ] Respuestas son concisas y claras
- [ ] Errores se manejan gracefully

---

## 🚀 Fase 5: Deployment y Monitoreo

### 5.1 Variables de entorno requeridas
```env
TELEGRAM_BOT_TOKEN=tu_token_aqui
MY_TELEGRAM_ID=tu_chat_id_aqui
GEMINI_API_KEY=tu_api_key_aqui
```

### 5.2 Comandos de deployment
```bash
# Verificar schema
npx convex dev

# Ejecutar migraciones
npx convex run

# Deploy a producción
npx convex deploy
```

### 5.3 Logs a monitorear
- Tamaño de archivos de audio descargados
- Tiempo de respuesta de Gemini con audio
- Tasa de éxito en clasificación
- Errores de transcripción
- Uso de cuota de Gemini API

---

## 📊 Mejoras Futuras (Post-MVP)

### Corto plazo:
- [ ] Soporte para fotos (OCR de recibos)
- [ ] Comandos para exportar reportes
- [ ] Notificaciones proactivas (recordatorios)

### Mediano plazo:
- [ ] Dashboard web para visualizar datos
- [ ] Análisis de sentimientos en audio
- [ ] Integración con Google Calendar

### Largo plazo:
- [ ] Multiusuario (equipo de trabajo)
- [ ] IA predictiva de gastos
- [ ] Asistente de voz bidireccional

---

## 📝 Notas de Implementación

### Limitaciones actuales:
- Telegram API envía audio en formato OGG/OPUS
- Gemini Flash tiene límite de 15MB por archivo
- Plan gratuito tiene cuota de requests/día
- Memoria contextual limitada a 2 minutos

### Decisiones de diseño:
- Usar `gemini-2.0-flash-exp` por soporte multimodal
- Almacenar audio_url en vez de buffer completo (ahorro de espacio)
- Clasificación basada en análisis semántico de Gemini
- Memoria deslizante de 2 minutos (balance entre contexto y velocidad)

---

## ⏱️ Estimación de Tiempos

| Fase | Tiempo Estimado |
|------|----------------|
| Fase 1: Schema | 15 min |
| Fase 2: HTTP Router | 30 min |
| Fase 3: Gemini.ts | 60 min |
| Fase 4: Testing | 45 min |
| Fase 5: Deployment | 20 min |
| **TOTAL** | **~3 horas** |

---

## 🎯 Criterios de Éxito

1. ✅ Bot procesa mensajes de voz sin errores
2. ✅ Transcripción es >90% precisa en español
3. ✅ Clasificación automática tiene >85% de acierto
4. ✅ Memoria contextual funciona en ventana de 2 minutos
5. ✅ Tiempo de respuesta <10 segundos para audio <30s
6. ✅ Logs detallados para debugging
7. ✅ UX móvil optimizada (respuestas concisas)

---

## 👨‍💻 Equipo y Responsabilidades

- **Backend (Convex):** Schema, mutations, queries, actions
- **AI Integration:** Gemini API, prompts, clasificación
- **Testing:** Casos de prueba, validación end-to-end
- **DevOps:** Environment vars, deployment, monitoring

---

## 📚 Referencias

- [Telegram Bot API - Voice Messages](https://core.telegram.org/bots/api#voice)
- [Gemini API - Multimodal Input](https://ai.google.dev/tutorials/audio_quickstart)
- [Convex Actions](https://docs.convex.dev/functions/actions)
- [Convex Schema](https://docs.convex.dev/database/schemas)

---

**Fecha de creación:** 19 de Febrero, 2026
**Versión:** 1.0
**Estado:** ✅ Plan aprobado, listo para implementación
