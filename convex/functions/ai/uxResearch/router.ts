import { action } from "../../../_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

/**
 * CONVEX ROUTER - Clasificador de Intenciones
 * 
 * Analiza mensajes de Telegram y los clasifica en:
 * - finanzas: Gastos, ingresos, IVA, contabilidad
 * - ux_research: Investigación UX, design thinking, user personas
 * - agenda: Reuniones, calendario, agendamiento
 * - general: Consultas generales, conversación
 */
export const clasificarIntencion = action({
  args: {
    mensaje: v.string(),
    chat_id: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🔍 Router: Clasificando intención del mensaje...");
    console.log(`📝 Mensaje: "${args.mensaje}"`);
    
    // Clasificación rápida por palabras clave (fallback)
    const mensajeLower = args.mensaje.toLowerCase();
    
    // Comandos explícitos
    if (mensajeLower.startsWith("/gasto") || mensajeLower.startsWith("/ingreso") || 
        mensajeLower.startsWith("/iva") || mensajeLower.startsWith("/empresa") ||
        mensajeLower.startsWith("/resumen") || mensajeLower.startsWith("/listar")) {
      console.log("💰 Categoría: finanzas (comando explícito)");
      return {
        categoria: "finanzas",
        confianza: 1.0,
        metodo: "comando_explicito",
      };
    }
    
    if (mensajeLower.startsWith("/reunion") || mensajeLower.startsWith("/agenda")) {
      console.log("📅 Categoría: agenda (comando explícito)");
      return {
        categoria: "agenda",
        confianza: 1.0,
        metodo: "comando_explicito",
      };
    }
    
    if (mensajeLower.startsWith("/proyectos") || mensajeLower.startsWith("/ayuda")) {
      console.log("💬 Categoría: general (comando explícito)");
      return {
        categoria: "general",
        confianza: 1.0,
        metodo: "comando_explicito",
      };
    }
    
    // Palabras clave de finanzas
    const palabrasFinanzas = [
      'gasto', 'ingreso', 'factura', 'boleta', 'iva', 'f29', 
      'contabilidad', 'transacción', 'pago', 'cobro', 'dinero',
      'plata', 'lucas', 'pesos', '$', 'monto', 'precio'
    ];
    
    // Palabras clave de UX Research
    const palabrasUX = [
      'usuario', 'user', 'persona', 'insight', 'investigación',
      'research', 'ux', 'ui', 'diseño', 'prototipo', 'wireframe',
      'testing', 'usabilidad', 'experiencia', 'interfaz', 'design thinking',
      'empatía', 'definir', 'idear', 'prototipar', 'testear'
    ];
    
    // Palabras clave de agenda
    const palabrasAgenda = [
      'reunión', 'reunion', 'meeting', 'agendar', 'agenda',
      'cita', 'calendario', 'horario', 'disponibilidad'
    ];
    
    const tieneFinanzas = palabrasFinanzas.some(p => mensajeLower.includes(p));
    const tieneUX = palabrasUX.some(p => mensajeLower.includes(p));
    const tieneAgenda = palabrasAgenda.some(p => mensajeLower.includes(p));
    
    // Clasificación por palabras clave
    if (tieneFinanzas && !tieneUX && !tieneAgenda) {
      console.log("💰 Categoría: finanzas (palabras clave)");
      return {
        categoria: "finanzas",
        confianza: 0.8,
        metodo: "palabras_clave",
      };
    }
    
    if (tieneUX && !tieneFinanzas && !tieneAgenda) {
      console.log("🎨 Categoría: ux_research (palabras clave)");
      return {
        categoria: "ux_research",
        confianza: 0.8,
        metodo: "palabras_clave",
      };
    }
    
    if (tieneAgenda && !tieneFinanzas && !tieneUX) {
      console.log("📅 Categoría: agenda (palabras clave)");
      return {
        categoria: "agenda",
        confianza: 0.8,
        metodo: "palabras_clave",
      };
    }
    
    // Si hay ambigüedad o no hay palabras clave claras, usar Gemini
    console.log("🤖 Usando Gemini para clasificación semántica...");
    
    try {
      const prompt = `Eres un clasificador de intenciones. Analiza el siguiente mensaje y determina su categoría:

CATEGORÍAS:
1. "finanzas" - Gastos, ingresos, transacciones, facturas, IVA, contabilidad, dinero
2. "ux_research" - Investigación UX, user personas, design thinking, insights, prototipos, testing, usabilidad
3. "agenda" - Reuniones, agendamiento, calendario, citas, horarios
4. "general" - Consultas generales, preguntas, conversación casual

MENSAJE: "${args.mensaje}"

Responde SOLO con UNA palabra: finanzas, ux_research, agenda o general`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const respuesta = (result.text || "general").trim().toLowerCase();
      
      let categoria: "finanzas" | "ux_research" | "agenda" | "general" = "general";
      
      if (respuesta.includes("finanzas")) {
        categoria = "finanzas";
      } else if (respuesta.includes("ux") || respuesta.includes("research")) {
        categoria = "ux_research";
      } else if (respuesta.includes("agenda")) {
        categoria = "agenda";
      } else {
        categoria = "general";
      }
      
      console.log(`🎯 Categoría detectada por Gemini: ${categoria}`);
      
      return {
        categoria,
        confianza: 0.9,
        metodo: "gemini_semantico",
      };
      
    } catch (error) {
      console.error("❌ Error en clasificación con Gemini:", error);
      
      // Fallback a general si falla Gemini
      console.log("💬 Fallback a categoría: general");
      return {
        categoria: "general",
        confianza: 0.5,
        metodo: "fallback",
      };
    }
  },
});
