# 📊 Tabla `mensajes_telegram` - Documentación Completa

## 🎯 Propósito Principal

Esta tabla es el **cerebro de memoria** de tu bot de Telegram. Almacena cada interacción para:

1. **Memoria Contextual**: Gemini puede "recordar" de qué hablaron hace minutos
2. **Historial Completo**: Rastrear todas las conversaciones y acciones realizadas
3. **Analytics**: Entender patrones de uso (cuándo usas voz vs texto, qué comandos más)
4. **Debug**: Ver exactamente qué procesó el bot y qué respondió

---

## 📋 Estructura de la Tabla

### Campos de Identificación

```typescript
message_id: v.number()
```
- **Qué es:** ID único que Telegram asigna a cada mensaje
- **Ejemplo:** `12345`
- **Uso:** Identificar mensajes específicos, evitar duplicados

```typescript
chat_id: v.string()
```
- **Qué es:** ID de tu chat personal con el bot
- **Ejemplo:** `"987654321"`
- **Uso:** Filtrar solo TUS mensajes (seguridad + privacidad)

```typescript
username: v.string()
```
- **Qué es:** Tu nombre en Telegram
- **Ejemplo:** `"Jorge Cabrera"`
- **Uso:** Personalización de respuestas, logs legibles

---

### Campos de Contenido

```typescript
tipo_mensaje: v.union(
  v.literal("texto"),
  v.literal("voz"),
  v.literal("foto"),
  v.literal("documento")
)
```
- **Qué es:** Tipo de mensaje que enviaste
- **Valores posibles:**
  - `"texto"` → Mensaje escrito normal
  - `"voz"` → Nota de voz/audio
  - `"foto"` → Imagen (futuro: OCR de recibos)
  - `"documento"` → PDF, Excel, etc.
- **Uso:** El bot decide cómo procesarlo según el tipo

```typescript
contenido_texto: v.optional(v.string())
```
- **Qué es:** El texto que escribiste
- **Ejemplo:** `"/gasto $50 comida"`
- **Cuándo se llena:** Solo si `tipo_mensaje === "texto"`
- **Uso:** Análisis directo del mensaje

```typescript
contenido_transcrito: v.optional(v.string())
```
- **Qué es:** La transcripción del audio por Gemini
- **Ejemplo:** `"Gasté 35 dólares en Uber esta mañana"`
- **Cuándo se llena:** Solo si `tipo_mensaje === "voz"`
- **Uso:** Convertir audio en texto para análisis

```typescript
archivo_url: v.optional(v.string())
```
- **Qué es:** URL donde Telegram almacena el archivo (si aplica)
- **Ejemplo:** `"https://api.telegram.org/file/bot.../voice123.ogg"`
- **Cuándo se llena:** Si hay audio, foto o documento
- **Uso:** Poder re-descargar el archivo si es necesario

```typescript
duracion_audio: v.optional(v.number())
```
- **Qué es:** Duración del audio en segundos
- **Ejemplo:** `15` (15 segundos)
- **Cuándo se llena:** Solo si `tipo_mensaje === "voz"`
- **Uso:** Analytics (promedio de duración de mensajes de voz)

---

### Campos de Respuesta

```typescript
respuesta_bot: v.string()
```
- **Qué es:** Lo que Gemini te respondió
- **Ejemplo:** `"✅ Gasto registrado: $50 en comida"`
- **Siempre se llena:** Sí, en cada mensaje
- **Uso:** Historial completo de la conversación

---

### Campos de Análisis

```typescript
accion_realizada: v.string()
```
- **Qué es:** Qué hizo el bot con tu mensaje
- **Valores comunes:**
  - `"transaccion"` → Guardó un gasto/ingreso
  - `"proyecto_dt"` → Guardó una idea de diseño
  - `"consulta"` → Solo respondió, no guardó nada
  - `"comando"` → Ejecutó un comando (/resumen, /ayuda)
  - `"error"` → Algo salió mal
- **Uso:** Saber qué mensajes fueron productivos vs conversacionales

```typescript
datos_extraidos: v.optional(v.any())
```
- **Qué es:** JSON con datos estructurados que Gemini extrajo
- **Ejemplos:**
  ```json
  // Para una transacción
  {
    "tipo": "gasto",
    "monto": 50,
    "categoria": "comida",
    "transaccionId": "xyz123"
  }
  
  // Para una idea
  {
    "fase": "idear",
    "titulo": "Usar colores pasteles",
    "proyectoId": "abc456"
  }
  ```
- **Uso:** Ver exactamente qué datos se guardaron en otras tablas

---

### Campos de Metadata

```typescript
timestamp: v.number()
```
- **Qué es:** Fecha y hora exacta del mensaje (Unix timestamp)
- **Ejemplo:** `1708387200000` (19 Feb 2026, 10:00 AM)
- **Uso:** 
  - Ordenar mensajes cronológicamente
  - Memoria contextual (últimos 2 minutos)
  - Reportes por fecha

---

## 🔍 Índices (Para Búsquedas Rápidas)

### 1. `por_chat_id`
```typescript
.index("por_chat_id", ["chat_id"])
```
**Para qué:** Encontrar todos TUS mensajes rápidamente
**Ejemplo de uso:**
```typescript
const misMensajes = await ctx.db
  .query("mensajes_telegram")
  .withIndex("por_chat_id", q => q.eq("chat_id", "987654321"))
  .collect();
```

### 2. `por_timestamp`
```typescript
.index("por_timestamp", ["timestamp"])
```
**Para qué:** Buscar mensajes por fecha/hora
**Ejemplo de uso:**
```typescript
// Mensajes de hoy
const hoy = await ctx.db
  .query("mensajes_telegram")
  .withIndex("por_timestamp", q => 
    q.gte("timestamp", inicioDelDia)
  )
  .collect();
```

### 3. `por_tipo_mensaje`
```typescript
.index("por_tipo_mensaje", ["tipo_mensaje"])
```
**Para qué:** Filtrar solo voz, solo texto, etc.
**Ejemplo de uso:**
```typescript
// Solo mensajes de voz
const vozMensajes = await ctx.db
  .query("mensajes_telegram")
  .withIndex("por_tipo_mensaje", q => q.eq("tipo_mensaje", "voz"))
  .collect();
```

### 4. `por_chat_timestamp` (Compuesto - **Clave para Memoria**)
```typescript
.index("por_chat_timestamp", ["chat_id", "timestamp"])
```
**Para qué:** **Memoria contextual optimizada**
**Ejemplo de uso:**
```typescript
// Últimos 5 mensajes de los últimos 2 minutos
const dosMinutosAtras = Date.now() - (2 * 60 * 1000);

const contexto = await ctx.db
  .query("mensajes_telegram")
  .withIndex("por_chat_timestamp", q => 
    q.eq("chat_id", miChatId)
     .gte("timestamp", dosMinutosAtras)
  )
  .order("desc")
  .take(5);
```

---

## 💡 Casos de Uso Reales

### Caso 1: Memoria Contextual
**Escenario:**
1. 10:00 AM → Envías: Audio "Gasté 30 en café"
2. 10:01 AM → Envías: "¿Cuánto llevo gastado hoy?"

**Cómo funciona:**
```typescript
// Gemini consulta los últimos mensajes
const mensajesRecientes = await obtenerMensajesRecientes({
  chat_id: "987654321",
  desde: Date.now() - 120000, // 2 min atrás
  limite: 5
});

// Resultado:
[
  {
    contenido_transcrito: "Gasté 30 en café",
    accion_realizada: "transaccion",
    datos_extraidos: { monto: 30, categoria: "cafe" }
  }
]

// Gemini usa esto para responder:
// "Hoy has gastado $30 en café"
```

### Caso 2: Analytics de Uso
**Pregunta:** ¿Cuántos mensajes de voz envío vs texto?

```typescript
const stats = await ctx.db.query("mensajes_telegram").collect();

const voz = stats.filter(m => m.tipo_mensaje === "voz").length;
const texto = stats.filter(m => m.tipo_mensaje === "texto").length;

console.log(`Voz: ${voz}, Texto: ${texto}`);
// Output: "Voz: 45, Texto: 18"
// → Prefieres hablar que escribir!
```

### Caso 3: Debug de Problemas
**Problema:** "El bot no registró mi gasto de $50"

```typescript
// Buscar el mensaje específico
const mensaje = await ctx.db
  .query("mensajes_telegram")
  .filter(q => q.eq(q.field("contenido_texto"), "/gasto $50 comida"))
  .first();

console.log(mensaje);
// Ver:
// - ¿Se guardó en la tabla?
// - ¿Qué respondió el bot?
// - ¿Qué acción realizó? (debería ser "transaccion")
// - ¿Hay datos_extraidos? (debería tener monto: 50)
```

### Caso 4: Buscar Conversación Específica
**Pregunta:** "¿Qué ideas de diseño hablé la semana pasada?"

```typescript
const unaSemanaAtras = Date.now() - (7 * 24 * 60 * 60 * 1000);

const ideasSemana = await ctx.db
  .query("mensajes_telegram")
  .withIndex("por_timestamp", q => q.gte("timestamp", unaSemanaAtras))
  .filter(q => q.eq(q.field("accion_realizada"), "proyecto_dt"))
  .collect();

// Ver todas las ideas guardadas en design_thinking
```

---

## 🔐 Seguridad y Privacidad

### Datos sensibles almacenados:
- ✅ Transcripciones de voz (podrían contener info personal)
- ✅ Montos de transacciones
- ✅ URLs privadas de Telegram (expiran en 1 hora)

### Buenas prácticas:
1. **Solo tu chat_id:** El bot ya valida que solo TU chat_id pueda usarlo
2. **No compartir URLs:** Las URLs de archivos expiran rápido
3. **Backups seguros:** Si exportas datos, cifrar el archivo

---

## 📊 Ejemplo de Registro Completo

```json
{
  "_id": "k1abc123xyz",
  "_creationTime": 1708387200000,
  
  "message_id": 12345,
  "chat_id": "987654321",
  "username": "Jorge Cabrera",
  
  "tipo_mensaje": "voz",
  "contenido_texto": null,
  "contenido_transcrito": "Gasté 35 dólares en Uber esta mañana",
  "archivo_url": "https://api.telegram.org/file/bot.../voice123.ogg",
  "duracion_audio": 4,
  
  "respuesta_bot": "💸 *Gasto Registrado*\n```transporte```\n💰 **$35**\n✅ ¡Listo!",
  
  "accion_realizada": "transaccion",
  "datos_extraidos": {
    "tipo": "gasto",
    "monto": 35,
    "categoria": "transporte",
    "descripcion": "Uber",
    "transaccionId": "k2def456uvw"
  },
  
  "timestamp": 1708387200000
}
```

---

## 🚀 Próximos Pasos

Con esta tabla lista, ahora puedes:
1. ✅ **Fase 2:** Modificar `http.ts` para detectar voz
2. ✅ **Fase 3:** Actualizar Gemini para usar memoria contextual
3. ✅ **Fase 4:** Testing de casos reales
4. ✅ **Analytics:** Dashboard de tus patrones de uso

---

## ❓ FAQ

**P: ¿Cuánto espacio ocupa cada mensaje?**
R: ~1-2 KB por mensaje de texto, ~3-5 KB por mensaje de voz (sin contar el archivo de audio)

**P: ¿Se guardan los archivos de audio?**
R: No, solo la URL. El archivo real está en servidores de Telegram (expira en ~1 hora)

**P: ¿Puedo borrar mensajes viejos?**
R: Sí, puedes crear una función para borrar mensajes >30 días si quieres economizar espacio

**P: ¿Qué pasa si envío una foto?**
R: Se guardará con `tipo_mensaje: "foto"` y `archivo_url`, pero aún no se procesa (futuro: OCR)

---

**Estado:** ✅ Tabla implementada en schema  
**Siguiente:** Implementar Fase 2 (http.ts)
