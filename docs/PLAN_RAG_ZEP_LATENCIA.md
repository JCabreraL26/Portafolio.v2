# 🚀 PLAN: RAG + Zep para Reducir Latencia y Memoria del Bot

**Objetivo:** Implementar sistema de memoria inteligente con RAG y Zep para reducir latencia en 90% y evitar alucinaciones.

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que ya tenemos:
- **Backend**: Convex (database reactiva con TypeScript)
- **IA**: Google Gemini (`@google/genai`)
- **2 Bots funcionando**:
  - Bot Telegram (agente personal - Node.js)
  - Chatbot Web (público - React + TypeScript)
- **Contexto manual**: Prompt largo con información hardcodeada
- **Historial básico**: Query a tabla `mensajes_chatbot_web` (últimos 5 mensajes)

### ❌ Problemas actuales:
1. **Latencia alta**: ~3-5s por respuesta (llamada completa a Gemini cada vez)
2. **Prompt estático**: 3000+ tokens enviados en cada request
3. **Sin memoria semántica**: No recuerda conversaciones pasadas más allá de 5 mensajes
4. **Alucinaciones**: Gemini inventa detalles de proyectos no documentados
5. **Redundancia**: Re-explica MenuClick aunque el usuario ya lo leyó
6. **Costo alto**: Cada mensaje consume tokens del prompt completo

---

## 🎯 ARQUITECTURA PROPUESTA

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO (Telegram/Web)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX ACTION (Entry Point)               │
│  • procesarMensajeTelegram()                                 │
│  • procesarMensajeWeb()                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐           ┌──────────────────────┐
│   ZEP MEMORY     │           │   RAG RETRIEVAL      │
│   (Memoria)      │           │   (Conocimiento)     │
├──────────────────┤           ├──────────────────────┤
│ • Conversación   │           │ • Vector Search      │
│ • Preferencias   │           │ • Top-K docs (3-5)   │
│ • Contexto       │           │ • Proyectos          │
│ • Facts          │◄──────────┤ • FAQs               │
└────────┬─────────┘           │ • Precios            │
         │                     └──────────┬───────────┘
         │                                │
         │         ┌──────────────────────┘
         │         │
         ▼         ▼
┌─────────────────────────────────────────────────────────────┐
│                 GEMINI (Generación Final)                    │
│  Prompt optimizado: 300 tokens vs 3000                       │
│  • Contexto relevante (desde RAG)                            │
│  • Memoria usuario (desde Zep)                               │
│  • Pregunta actual                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESPUESTA AL USUARIO                       │
│  + Actualizar Zep con nueva interacción                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 COMPONENTES A IMPLEMENTAR

### 1️⃣ **RAG (Retrieval-Augmented Generation)**

#### ¿Qué es?
Sistema que busca información relevante en una base de datos de vectores antes de generar respuesta.

#### Beneficios:
- ✅ **Reduce tokens**: Solo envía info relevante (300 vs 3000 tokens)
- ✅ **Evita alucinaciones**: Gemini responde basado en docs reales
- ✅ **Actualizable**: Cambias doc, se actualiza el embedding automáticamente
- ✅ **Escalable**: Puedes tener 100+ proyectos sin saturar el prompt

#### Tech Stack:
```typescript
// Embeddings: Google Gemini text-embedding-004 (768 dims)
// Vector DB: Convex con custom vector search
// Alternativa: Pinecone, Weaviate, Qdrant (si Convex no soporta)
```

#### Implementación:
```typescript
// 1. Generar embeddings de proyectos
async function generarEmbeddingProyecto(proyecto: Proyecto) {
  const text = `
    Proyecto: ${proyecto.nombre}
    Descripción: ${proyecto.descripcion}
    Stack: ${proyecto.stack_tecnico}
    Problema: ${proyecto.problema}
    Solución: ${proyecto.solucion}
    Resultados: ${proyecto.resultados_clave}
  `;
  
  const embedding = await gemini.embeddings.create({
    model: "text-embedding-004",
    content: text,
  });
  
  return embedding.values; // Array[768]
}

// 2. Almacenar en Convex
await ctx.db.insert("embeddings_proyectos", {
  proyecto_id: proyecto._id,
  embedding: embedding.values,
  texto_original: text,
  metadata: {
    categoria: proyecto.categoria,
    estado: proyecto.estado,
  },
  timestamp: Date.now(),
});

// 3. Buscar proyectos relevantes (cosine similarity)
async function buscarProyectosRelevantes(query: string, topK = 3) {
  const queryEmbedding = await generarEmbedding(query);
  
  // Convex no tiene vector search nativo, necesitamos:
  // Opción A: Implementar cosine similarity manual (lento)
  // Opción B: Usar Pinecone/Qdrant como vector DB externo
  // Opción C: Esperar a que Convex agregue vector search
  
  const todosEmbeddings = await ctx.db.query("embeddings_proyectos").collect();
  
  const scored = todosEmbeddings.map(doc => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
```

### 2️⃣ **Zep (Memoria de Largo Plazo)**

#### ¿Qué es?
Servicio de memoria para LLMs que mantiene contexto conversacional, preferencias y facts del usuario.

#### Beneficios:
- ✅ **Memoria persistente**: Recuerda conversaciones de hace días/semanas
- ✅ **Extracción automática de facts**: "Usuario prefiere Next.js sobre Vue"
- ✅ **Grafos de conocimiento**: Relaciona conceptos mencionados
- ✅ **Reduce latencia**: Caché inteligente de información ya procesada
- ✅ **Resúmenes automáticos**: Comprime conversaciones largas

#### Tech Stack:
```bash
# Zep Cloud (hosted) - Más fácil
npm install @getzep/zep-cloud

# Zep Self-hosted (Docker) - Más control
docker run -d -p 8000:8000 ghcr.io/getzep/zep:latest
```

#### Implementación:
```typescript
import { ZepClient } from "@getzep/zep-cloud";

const zep = new ZepClient({
  apiKey: process.env.ZEP_API_KEY,
});

// 1. Crear/obtener sesión de usuario
async function getOrCreateSession(userId: string) {
  let session = await zep.memory.getSession(userId);
  
  if (!session) {
    session = await zep.memory.addSession({
      sessionId: userId,
      metadata: {
        tipo: "telegram", // o "web"
        created_at: Date.now(),
      },
    });
  }
  
  return session;
}

// 2. Agregar mensaje a memoria
async function addToMemory(userId: string, role: "user" | "assistant", content: string) {
  await zep.memory.addMemory(userId, {
    messages: [{
      role,
      content,
      metadata: { timestamp: Date.now() },
    }],
  });
}

// 3. Recuperar contexto relevante
async function getRelevantMemory(userId: string, query: string) {
  const memory = await zep.memory.searchMemory(userId, {
    text: query,
    limit: 5,
  });
  
  return {
    facts: memory.facts, // ["Usuario preguntó por MenuClick el 2026-03-01"]
    summary: memory.summary, // Resumen de últimas 50 interacciones
    relevant_messages: memory.messages, // Mensajes similares a query
  };
}

// 4. Obtener facts del usuario
async function getUserFacts(userId: string) {
  const facts = await zep.memory.getFacts(userId);
  
  return facts; 
  // Ejemplo: [
  //   { fact: "Usuario tiene negocio de delivery", confidence: 0.9 },
  //   { fact: "Interesado en e-commerce sin comisiones", confidence: 0.85 },
  //   { fact: "Ya vio demo de MenuClick", confidence: 1.0 }
  // ]
}
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### FASE 1: Setup Infraestructura (2-3 días)

#### 1.1 Instalar dependencias
```bash
npm install @getzep/zep-cloud
npm install @pinecone-database/pinecone  # Para vector DB
# O usar Convex si agrega vector search
```

#### 1.2 Configurar variables de entorno
```bash
# .env.local
ZEP_API_KEY=zep_xxxxxxxxxx
PINECONE_API_KEY=pcsk_xxxxxxx
PINECONE_INDEX=portafolio-rag
```

#### 1.3 Extender schema de Convex
```typescript
// convex/schema.ts

// Nueva tabla para embeddings
embeddings_proyectos: defineTable({
  proyecto_id: v.id("proyectos"),
  embedding: v.array(v.float64()), // 768 dimensiones
  texto_original: v.string(),
  tokens: v.number(),
  modelo: v.string(), // "text-embedding-004"
  metadata: v.object({
    categoria: v.string(),
    estado: v.string(),
    ultima_actualizacion: v.number(),
  }),
  timestamp: v.number(),
})
  .index("por_proyecto", ["proyecto_id"])
  .index("por_timestamp", ["timestamp"]),

// Nueva tabla para FAQs embeddings
embeddings_faqs: defineTable({
  pregunta: v.string(),
  respuesta: v.string(),
  embedding: v.array(v.float64()),
  categoria: v.string(),
  timestamp: v.number(),
})
  .index("por_categoria", ["categoria"]),

// Nueva tabla para tracking de Zep
zep_sessions: defineTable({
  user_id: v.string(), // chat_id de Telegram o session_id web
  zep_session_id: v.string(),
  tipo: v.union(v.literal("telegram"), v.literal("web")),
  ultima_interaccion: v.number(),
  total_mensajes: v.number(),
  metadata: v.optional(v.any()),
})
  .index("por_user", ["user_id"])
  .index("por_tipo", ["tipo"]),
```

### FASE 2: Generar Embeddings (1 día)

#### 2.1 Script de generación masiva
```typescript
// convex/scripts/generateEmbeddings.ts

export async function generateAllEmbeddings(ctx: ActionCtx) {
  const proyectos = await ctx.runQuery(api.proyectos.listarTodos);
  
  for (const proyecto of proyectos) {
    // Generar texto rico del proyecto
    const texto = construirTextoProyecto(proyecto);
    
    // Generar embedding con Gemini
    const embedding = await generarEmbedding(texto);
    
    // Guardar en Convex
    await ctx.runMutation(api.embeddings.guardarEmbeddingProyecto, {
      proyecto_id: proyecto._id,
      embedding: embedding.values,
      texto_original: texto,
      tokens: contarTokens(texto),
    });
    
    console.log(`✅ Embedding generado: ${proyecto.nombre}`);
  }
}

function construirTextoProyecto(proyecto: any): string {
  return `
PROYECTO: ${proyecto.nombre}

DESCRIPCIÓN:
${proyecto.descripcion}

PROBLEMA QUE RESUELVE:
${proyecto.problema || "N/A"}

SOLUCIÓN IMPLEMENTADA:
${proyecto.solucion || "N/A"}

STACK TÉCNICO:
${proyecto.stack_tecnico || "N/A"}

RESULTADOS CLAVE:
${proyecto.resultados_clave || "N/A"}

CATEGORÍA: ${proyecto.categoria}
ESTADO: ${proyecto.estado}
CLIENTE: ${proyecto.cliente_nombre || "Proyecto personal"}

${proyecto.url_demo ? `DEMO: ${proyecto.url_demo}` : ""}
${proyecto.url_repo ? `REPO: ${proyecto.url_repo}` : ""}
  `.trim();
}
```

#### 2.2 Ejecutar script
```bash
# Desde Convex dashboard o CLI
npx convex run scripts:generateAllEmbeddings
```

### FASE 3: Implementar RAG en Bots (2-3 días)

#### 3.1 Crear módulo RAG
```typescript
// convex/functions/ai/rag.ts

export async function buscarContextoRelevante(
  ctx: ActionCtx,
  query: string,
  topK: number = 3
): Promise<{ proyectos: string[], faqs: string[] }> {
  
  // 1. Generar embedding de la query
  const queryEmbedding = await generarEmbedding(query);
  
  // 2. Buscar proyectos similares (usando Pinecone o Convex)
  const proyectosRelevantes = await buscarVectores(
    queryEmbedding,
    "proyectos",
    topK
  );
  
  // 3. Buscar FAQs similares
  const faqsRelevantes = await buscarVectores(
    queryEmbedding,
    "faqs",
    2
  );
  
  return {
    proyectos: proyectosRelevantes.map(p => p.texto_original),
    faqs: faqsRelevantes.map(f => f.respuesta),
  };
}

// Implementación con Pinecone
async function buscarVectores(
  embedding: number[],
  namespace: string,
  topK: number
) {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: "us-west1-gcp",
  });
  
  const index = pinecone.Index("portafolio-rag");
  
  const results = await index.query({
    queryRequest: {
      namespace,
      topK,
      vector: embedding,
      includeMetadata: true,
    },
  });
  
  return results.matches;
}
```

#### 3.2 Integrar en chatbot web
```typescript
// convex/functions/ai/googleChatbot.ts

export const procesarMensajeWeb = action({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    const userId = args.session_id;
    
    // PASO 1: Recuperar memoria de Zep
    const memoria = await zep.memory.searchMemory(userId, {
      text: args.mensaje,
      limit: 3,
    });
    
    // PASO 2: Buscar contexto relevante con RAG
    const contextoRAG = await ctx.runAction(
      api.functions.ai.rag.buscarContextoRelevante,
      { query: args.mensaje, topK: 3 }
    );
    
    // PASO 3: Construir prompt optimizado (300 tokens vs 3000)
    const promptOptimizado = `
Eres el asistente de Jorge Cabrera (Áperca Spa).

CONTEXTO DEL USUARIO (desde Zep):
${memoria.summary || "Primera interacción"}

FACTS DEL USUARIO:
${memoria.facts.map(f => `• ${f.fact}`).join('\n')}

PROYECTOS RELEVANTES (desde RAG):
${contextoRAG.proyectos.join('\n\n')}

FAQs RELACIONADAS:
${contextoRAG.faqs.join('\n\n')}

PREGUNTA USUARIO: ${args.mensaje}

Responde de forma concisa usando SOLO la información proporcionada.
Si el usuario ya vio MenuClick (en facts), no lo expliques de nuevo.
    `.trim();
    
    // PASO 4: Llamar a Gemini con prompt corto
    const response = await gemini.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: promptOptimizado,
    });
    
    // PASO 5: Actualizar memoria en Zep
    await zep.memory.addMemory(userId, {
      messages: [
        { role: "user", content: args.mensaje },
        { role: "assistant", content: response.text },
      ],
    });
    
    return { respuesta: response.text };
  },
});
```

### FASE 4: Optimizaciones de Latencia (1-2 días)

#### 4.1 Caché de embeddings frecuentes
```typescript
// Guardar en Convex
embeddings_cache: defineTable({
  query_hash: v.string(), // MD5 de la query
  embedding: v.array(v.float64()),
  hits: v.number(),
  ultima_consulta: v.number(),
})
  .index("por_hash", ["query_hash"])
  .index("por_hits", ["hits"]),
```

#### 4.2 Streaming de respuestas
```typescript
// Usar streaming API de Gemini para respuesta incremental
const stream = await gemini.generateContentStream({
  model: "gemini-2.0-flash-exp",
  contents: prompt,
});

for await (const chunk of stream) {
  // Enviar chunk al cliente en tiempo real
  await sendStreamChunk(chunk.text);
}
```

#### 4.3 Parallel processing
```typescript
// Ejecutar RAG + Zep en paralelo
const [memoria, contextoRAG] = await Promise.all([
  zep.memory.searchMemory(userId, { text: query }),
  ctx.runAction(api.functions.ai.rag.buscarContextoRelevante, { query }),
]);
```

---

## 📈 MÉTRICAS DE ÉXITO

### Antes (Estado Actual):
- ⏱️ **Latencia promedio**: 3-5 segundos
- 💰 **Costo por mensaje**: ~0.002 USD (3000 tokens input)
- 🧠 **Memoria**: Solo últimos 5 mensajes (sin contexto semántico)
- ❌ **Alucinaciones**: 20-30% de respuestas con detalles inventados
- 📊 **Contexto enviado**: 3000 tokens por request

### Después (Con RAG + Zep):
- ⏱️ **Latencia target**: 0.3-0.8 segundos (reducción 90%)
- 💰 **Costo por mensaje**: ~0.0003 USD (300 tokens input)
- 🧠 **Memoria**: Persistente (días/semanas) + facts automáticos
- ✅ **Alucinaciones**: <5% (respuestas basadas en docs reales)
- 📊 **Contexto enviado**: 300 tokens (solo lo relevante)

### ROI:
```
Reducción de costos: 85% menos gasto en tokens
Reducción de latencia: 90% más rápido
Mejora en precisión: 95% respuestas verificables
Experiencia usuario: Respuestas personalizadas + memoria
```

---

## 💰 COSTOS ESTIMADOS

### Infraestructura:
- **Zep Cloud**: $0 (plan Free hasta 1000 sessions/mes) → $29/mes (Pro)
- **Pinecone**: $0 (plan Free 1M vectores) → $70/mes (Starter)
- **Convex**: Ya incluido (plan actual)
- **Gemini API**: Reducción de 85% en costos por menos tokens

### Tiempo de desarrollo:
- **Fase 1 (Setup)**: 2-3 días
- **Fase 2 (Embeddings)**: 1 día
- **Fase 3 (RAG)**: 2-3 días
- **Fase 4 (Optimización)**: 1-2 días
- **TOTAL**: 6-9 días de trabajo

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### 🔴 ALTA PRIORIDAD (Semana 1):
1. Setup Zep para memoria persistente
2. Generar embeddings de MenuClick e Importadora D&R
3. Implementar RAG básico con búsqueda manual (sin vector DB aún)

### 🟡 MEDIA PRIORIDAD (Semana 2):
4. Integrar Pinecone para vector search eficiente
5. Migrar embeddings de Convex a Pinecone
6. Optimizar latencia con streaming y caché

### 🟢 BAJA PRIORIDAD (Semana 3):
7. Dashboard de métricas (latencia, hits, costos)
8. Auto-actualización de embeddings cuando cambia proyecto
9. Exportar memoria de Zep para análisis

---

## 🚀 PRÓXIMOS PASOS

### Validación antes de implementar:
1. ¿Convex soporta vector search nativo? (revisar docs)
2. ¿Zep Cloud o Self-hosted? (Cloud más fácil para POC)
3. ¿Qué proyectos priorizar para embeddings? (MenuClick + D&R primero)

### Quick Win (1 día):
- Implementar solo Zep para memoria (sin RAG)
- Ver mejora en personalización y contexto
- Medir latencia antes/después

### Full Implementation (1 semana):
- RAG + Zep completo
- Benchmarks de latencia
- Dashboard de monitoreo

---

## 📚 RECURSOS DE REFERENCIA

### Documentación:
- [Zep Docs](https://docs.getzep.com/)
- [Pinecone Quickstart](https://docs.pinecone.io/docs/quickstart)
- [Google Gemini Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- [Convex Vector Search (si existe)](https://docs.convex.dev/)

### Ejemplos:
- [RAG with Gemini + Pinecone](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/rag)
- [Zep TypeScript Examples](https://github.com/getzep/zep-js)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

```markdown
### Infraestructura
- [ ] Crear cuenta Zep Cloud
- [ ] Crear cuenta Pinecone (o verificar Convex vector search)
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias npm
- [ ] Extender schema de Convex

### RAG
- [ ] Script de generación de embeddings
- [ ] Generar embeddings de proyectos existentes
- [ ] Generar embeddings de FAQs
- [ ] Implementar función de búsqueda semántica
- [ ] Testear precisión de búsqueda (top-3, top-5)

### Zep
- [ ] Configurar cliente Zep
- [ ] Implementar creación de sesiones
- [ ] Implementar addMemory en cada interacción
- [ ] Implementar searchMemory antes de responder
- [ ] Testear extracción automática de facts

### Integración
- [ ] Refactorizar googleChatbot.ts con RAG
- [ ] Refactorizar gemini.ts (Telegram) con RAG
- [ ] Implementar prompt optimizado (300 tokens)
- [ ] Agregar fallback si RAG/Zep fallan

### Optimización
- [ ] Implementar caché de embeddings frecuentes
- [ ] Implementar streaming de respuestas
- [ ] Parallel processing (RAG + Zep)
- [ ] Medir latencia antes/después

### Monitoreo
- [ ] Dashboard de métricas (Convex dashboard)
- [ ] Logs de latencia por mensaje
- [ ] Alertas si latencia > 2s
- [ ] Tracking de costos (tokens consumidos)

### Testing
- [ ] Test: Usuario pregunta por MenuClick 2 veces (no debe repetir)
- [ ] Test: Usuario pregunta algo no documentado (debe decir que no sabe)
- [ ] Test: Búsqueda semántica encuentra proyecto correcto
- [ ] Test: Zep recuerda preferencias de sesión anterior
- [ ] Benchmark: Medir latencia 10 mensajes consecutivos
```

---

**STATUS**: 📋 Plan completo listo para revisión  
**NEXT STEP**: Validar con Jorge y comenzar Fase 1 (Setup Infraestructura)  
**ETA**: 1 semana para MVP funcional con RAG + Zep
