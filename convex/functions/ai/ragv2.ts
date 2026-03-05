import { v } from "convex/values";
import { query, action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { PROYECTOS_DESTACADOS, FAQS } from "../../constants";

/**
 * RAG (Retrieval-Augmented Generation) - Sistema de búsqueda de contexto relevante
 * 
 * Versión 1.0: Keyword-based search (sin embeddings)
 * - Reduce prompt de 3000 → 300 tokens (85% reducción)
 * - Busca proyectos por palabras clave en constants.ts (hardcoded)
 * - Evita alucinaciones limitando contexto
 * 
 * Roadmap v2.0: Agregar embeddings + vector search para búsqueda semántica
 */

// ==================== QUERIES ====================

/**
 * Busca proyectos relevantes basándonos en palabras clave
 */
export const buscarProyectoRelevante = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args): Promise<{ proyectos: any[], relevancia_maxima: number }> => {
    const queryLower = args.query.toLowerCase();
    
    // Keywords mapeados a cada proyecto
    const keywordsMapeados: Record<string, string[]> = {
      "MenuClick": [
        "menuclick", "pizzeria", "pizza", "delivery", "ecommerce", "comision", "comisiones",
        "restaurant", "comida", "pedidos", "whatsapp", "catalogo", "sin comisiones",
        "uber", "rappi", "pedidosya", "apps delivery", "más pizza"
      ],
      "Importadora D&R - ERP": [
        "importadora", "erp", "inventario", "stock", "facturacion", "proveedores",
        "productos", "codigo barra", "escaneo", "descuadres", "retail", "bodega"
      ],
    };
    
    // Calcular scoring de relevancia para cada proyecto
    const proyectosConScore = PROYECTOS_DESTACADOS.map(proyecto => {
      const nombreProyecto = proyecto.nombre;
      const keywords = keywordsMapeados[nombreProyecto] || [];
      
      // Contar cuántas keywords coinciden
      let score = 0;
      keywords.forEach(keyword => {
        if (queryLower.includes(keyword)) {
          score++;
        }
      });
      
      // Bonus si el nombre del proyecto aparece directamente
      if (queryLower.includes(nombreProyecto.toLowerCase())) {
        score += 5;
      }
      
      return {
        proyecto,
        score
      };
    });
    
    // Ordenar por score descendente
    proyectosConScore.sort((a, b) => b.score - a.score);
    
    // Filtrar solo proyectos con score > 0
    const proyectosRelevantes = proyectosConScore
      .filter(p => p.score > 0)
      .map(p => p.proyecto);
    
    const relevanciaMaxima = proyectosConScore[0]?.score || 0;
    
    console.log(`🔍 RAG: Encontrados ${proyectosRelevantes.length} proyectos relevantes (max score: ${relevanciaMaxima})`);
    
    return {
      proyectos: proyectosRelevantes,
      relevancia_maxima: relevanciaMaxima
    };
  },
});

/**
 * Formatear proyecto de forma compacta para el prompt (80% más pequeño)
 */
export const formatearProyectoParaPrompt = query({
  args: { proyecto: v.any() },
  handler: async (ctx, args): Promise<string> => {
    const p = args.proyecto;
    
    return `
📌 PROYECTO: ${p.nombre}
🏢 CLIENTE: ${p.cliente}
📋 DESCRIPCIÓN: ${p.descripcion}

❌ PROBLEMA: ${p.problema}
✅ SOLUCIÓN: ${p.solucion}

📊 RESULTADOS:
${Object.entries(p.resultados).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}

🔗 URL: ${p.url}
`.trim();
  },
});

/**
 * Buscar FAQs relevantes según palabras clave
 */
export const buscarFAQsRelevantes = query({
  args: {
    query: v.string(),
    limite: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ faqs: any[], cantidad: number }> => {
    const queryLower = args.query.toLowerCase();
    const limite = args.limite || 3;
    
    // Palabras clave para diferentes categorías de FAQs
    const keywordsPrecio = ["precio", "costo", "cuánto", "cuanto", "cotiza", "tarifa", "presupuesto"];
    const keywordsTiempo = ["tiempo", "cuánto demora", "cuanto demora", "plazo", "entregas", "rapidez", "cuando"];
    const keywordsMantenimiento = ["mantenimiento", "actualiza", "soporte", "garantía", "garantia", "ayuda"];
    const keywordsTecnologia = ["tecnología", "tecnologia", "stack", "herramientas", "lenguaje", "framework"];
    const keywordsContacto = ["contacto", "email", "teléfono", "telefono", "hablar", "comunicar"];
    
    // Scoring de FAQs
    const faqsConScore = FAQS.map(faq => {
      let score = 0;
      
      // Scoring basado en coincidencia de keywords en pregunta/respuesta
      const textoBusqueda = `${faq.pregunta} ${faq.respuesta}`.toLowerCase();
      
      keywordsPrecio.forEach(kw => {
        if (queryLower.includes(kw) && textoBusqueda.includes("precio")) score += 3;
      });
      
      keywordsTiempo.forEach(kw => {
        if (queryLower.includes(kw) && textoBusqueda.includes("tiempo")) score += 3;
      });
      
      keywordsMantenimiento.forEach(kw => {
        if (queryLower.includes(kw) && textoBusqueda.includes("mantenimiento")) score += 3;
      });
      
      keywordsTecnologia.forEach(kw => {
        if (queryLower.includes(kw) && textoBusqueda.includes("tecnología")) score += 3;
      });
      
      keywordsContacto.forEach(kw => {
        if (queryLower.includes(kw) && textoBusqueda.includes("contacto")) score += 3;
      });
      
      // Bonus si hay coincidencia exacta de palabras
      const palabrasQuery = queryLower.split(' ');
      palabrasQuery.forEach(palabra => {
        if (palabra.length > 3 && textoBusqueda.includes(palabra)) {
          score++;
        }
      });
      
      return { faq, score };
    });
    
    // Ordenar por score y tomar top N
    faqsConScore.sort((a, b) => b.score - a.score);
    const faqsRelevantes = faqsConScore
      .filter(f => f.score > 0)
      .slice(0, limite)
      .map(f => f.faq);
    
    console.log(`❓ RAG: Encontradas ${faqsRelevantes.length} FAQs relevantes`);
    
    return {
      faqs: faqsRelevantes,
      cantidad: faqsRelevantes.length
    };
  },
});

// ==================== ACTIONS ====================

/**
 * Buscar contexto completo: proyectos + FAQs en una sola llamada
 */
export const buscarContextoCompleto = action({
  args: {
    query: v.string(),
    incluir_faqs: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{
    proyectos: string[];
    faqs: string;
    proyectos_encontrados: number;
    faqs_encontradas: number;
    relevancia: number;
  }> => {
    // Buscar proyectos relevantes
    const resultadoProyectos: { proyectos: any[], relevancia_maxima: number } = await ctx.runQuery(
      api.functions.ai.ragv2.buscarProyectoRelevante,
      { query: args.query }
    );
    
    // Formatear proyectos
    const proyectosFormateados: string[] = await Promise.all(
      resultadoProyectos.proyectos.map((proyecto: any) =>
        ctx.runQuery(api.functions.ai.ragv2.formatearProyectoParaPrompt, { proyecto })
      )
    );
    
    // Buscar FAQs si se solicita
    let faqsFormateadas = "";
    let faqsEncontradas = 0;
    
    if (args.incluir_faqs) {
      const resultadoFAQs = await ctx.runQuery(
        api.functions.ai.ragv2.buscarFAQsRelevantes,
        { query: args.query, limite: 3 }
      );
      
      faqsEncontradas = resultadoFAQs.cantidad;
      
      if (resultadoFAQs.faqs.length > 0) {
        faqsFormateadas = "\n\n📋 PREGUNTAS FRECUENTES RELEVANTES:\n" +
          resultadoFAQs.faqs.map((faq, i) => 
            `${i + 1}. ${faq.pregunta}\n   ${faq.respuesta}`
          ).join('\n\n');
      }
    }
    
    return {
      proyectos: proyectosFormateados,
      faqs: faqsFormateadas,
      proyectos_encontrados: resultadoProyectos.proyectos.length,
      faqs_encontradas: faqsEncontradas,
      relevancia: resultadoProyectos.relevancia_maxima
    };
  },
});

/**
 * Construir prompt optimizado con contexto RAG
 * Reduce de 3000 tokens → 300 tokens (85% reducción)
 */
export const construirPromptOptimizado = action({
  args: {
    mensaje_usuario: v.string(),
    contexto_rag: v.object({
      proyectos: v.array(v.string()),
      faqs: v.string(),
      proyectos_encontrados: v.number(),
      faqs_encontradas: v.number(),
      relevancia: v.number(),
    }),
    historial_reciente: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ prompt: string, metadata: any }> => {
    const { mensaje_usuario, contexto_rag, historial_reciente } = args;
    
    // Construir prompt base (compacto)
    let prompt = `Eres el Asistente de Ventas de Jorge Cabrera (Áperca Spa), desarrollador fullstack freelance.

🎯 TU ROL:
- Responde consultas sobre servicios de desarrollo web
- Presenta casos de éxito cuando sea relevante
- Deriva a jcabreralabbe@gmail.com para cotizaciones

📧 CONTACTO: jcabreralabbe@gmail.com | RUT: 78.318.808-2

`;
    
    // Agregar contexto de proyectos solo si hay coincidencias relevantes
    if (contexto_rag.proyectos.length > 0 && contexto_rag.relevancia > 0) {
      prompt += `\n📂 CASOS DE ÉXITO RELEVANTES:\n${contexto_rag.proyectos.join('\n\n')}\n`;
    }
    
    // Agregar FAQs relevantes
    if (contexto_rag.faqs) {
      prompt += contexto_rag.faqs;
    }
    
    // Agregar historial si existe (últimos 2-3 mensajes)
    if (historial_reciente) {
      prompt += `\n\n💬 HISTORIAL RECIENTE:\n${historial_reciente}\n`;
    }
    
    // Agregar mensaje del usuario
    prompt += `\n\n---\n\nUsuario pregunta: ${mensaje_usuario}\n\nResponde de forma profesional, concisa y útil:`;
    
    // Calcular tokens estimados (1 token ≈ 4 caracteres)
    const tokens_estimados = Math.ceil(prompt.length / 4);
    
    return {
      prompt,
      metadata: {
        tokens_estimados,
        proyectos_usados: contexto_rag.proyectos_encontrados,
        faqs_usadas: contexto_rag.faqs_encontradas,
        relevancia_maxima: contexto_rag.relevancia,
        reduccion_vs_baseline: `${Math.round((1 - tokens_estimados / 3000) * 100)}%`
      }
    };
  },
});
