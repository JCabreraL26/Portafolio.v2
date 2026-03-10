import { action } from "../../_generated/server";
import { v } from "convex/values";

/**
 * ZEP Memory System - Sistema de memoria de largo plazo para el chatbot
 * 
 * Capacidades:
 * - Memoria de conversación persistente (threads)
 * - Extracción automática de hechos (facts) desde el grafo de usuario
 * - Resúmenes de conversaciones largas
 * - Contexto relevante desde todas las conversaciones pasadas
 * 
 * Integración: Telegram Bot + Chatbot Web
 * API: Zep Cloud v3.x (nueva arquitectura con threads)
 */

// Lazy import de Zep para evitar problemas en build de Convex
async function getZepClient() {
  const { ZepClient } = await import("@getzep/zep-cloud");
  
  const apiKey = process.env.ZEP_API_KEY;
  if (!apiKey) {
    throw new Error("❌ ZEP_API_KEY no configurada en variables de entorno");
  }
  
  return new ZepClient({ apiKey });
}

// ==================== ACTIONS ====================

/**
 * Inicializar thread de usuario en Zep (crear si no existe)
 * En Zep Cloud v3, usamos threads en lugar de sessions
 */
export const inicializarSesion = action({
  args: {
    userId: v.string(),
    metadata: v.optional(v.object({
      nombre: v.optional(v.string()),
      username: v.optional(v.string()),
      plataforma: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    try {
      const zep = await getZepClient();
      
      // En Zep Cloud v3, usamos threadId como identificador de la conversación
      // y userId para asociar el thread a un usuario
      const threadId = `thread_${args.userId}`;
      
      // Paso 1: Verificar/crear usuario
      try {
        await zep.user.get(args.userId);
        console.log(`✅ Zep: Usuario existente ${args.userId}`);
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.log(`🆕 Zep: Creando nuevo usuario ${args.userId}`);
          await zep.user.add({
            userId: args.userId,
            metadata: args.metadata || {},
          });
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          throw error;
        }
      }
      
      // Paso 2: Verificar/crear thread
      try {
        await zep.thread.get(threadId);
        console.log(`✅ Zep: Thread existente para ${args.userId}`);
        return { 
          success: true, 
          sessionId: threadId,
          exists: true 
        };
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.log(`🆕 Zep: Creando nuevo thread para ${args.userId}`);
          
          await zep.thread.create({
            threadId: threadId,
            userId: args.userId,
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log(`✅ Zep: Thread creado exitosamente para ${args.userId}`);
          
          return { 
            success: true, 
            sessionId: threadId,
            exists: false
          };
        }
        throw error;
      }
    } catch (error) {
      console.error("❌ Error en Zep.inicializarSesion:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  },
});

/**
 * Agregar mensaje a la memoria de Zep (thread)
 */
export const agregarMensaje = action({
  args: {
    userId: v.string(),
    rol: v.union(v.literal("user"), v.literal("assistant")),
    contenido: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const zep = await getZepClient();
      const threadId = `thread_${args.userId}`;
      
      // Paso 1: Verificar/crear usuario primero
      try {
        await zep.user.get(args.userId);
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.log(`🆕 Zep: Creando usuario ${args.userId}`);
          await zep.user.add({
            userId: args.userId,
          });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Paso 2: Asegurar que el thread existe
      let threadExists = false;
      let retries = 3;
      
      while (!threadExists && retries > 0) {
        try {
          await zep.thread.get(threadId);
          threadExists = true;
        } catch (error: any) {
          if (error.statusCode === 404) {
            // Thread no existe, crear
            console.log(`🆕 Zep: Creando thread para ${args.userId} (intentos restantes: ${retries})`);
            try {
              await zep.thread.create({
                threadId: threadId,
                userId: args.userId,
              });
              // Esperar más tiempo para que se propague
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Verificar que se creó
              try {
                await zep.thread.get(threadId);
                threadExists = true;
                console.log(`✅ Zep: Thread verificado y listo`);
              } catch (verifyError: any) {
                if (verifyError.statusCode === 404) {
                  console.warn(`⚠️ Thread aún no disponible, reintentando...`);
                  retries--;
                  await new Promise(resolve => setTimeout(resolve, 500));
                }
              }
            } catch (createError: any) {
              // Si el error es "already exists", está bien, continuar
              if (createError.statusCode === 409 || createError.body?.message?.includes('already exists')) {
                console.log(`ℹ️ Thread ya existe (creado por otra petición concurrente)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                threadExists = true;
              } else {
                throw createError;
              }
            }
          } else {
            throw error;
          }
        }
      }
      
      if (!threadExists) {
        throw new Error("No se pudo verificar/crear el thread después de varios intentos");
      }
      
      // Ahora agregar el mensaje con retry
      let messageAdded = false;
      let messageRetries = 2;
      
      while (!messageAdded && messageRetries > 0) {
        try {
          await zep.thread.addMessages(threadId, {
            messages: [
              {
                role: args.rol,
                content: args.contenido,
              }
            ]
          });
          messageAdded = true;
          console.log(`💾 Zep: Mensaje guardado para ${args.userId} (${args.rol})`);
        } catch (addError: any) {
          if (addError.statusCode === 404 && messageRetries > 0) {
            console.warn(`⚠️ Thread no disponible al agregar mensaje, esperando...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            messageRetries--;
          } else {
            throw addError;
          }
        }
      }
      
      if (!messageAdded) {
        throw new Error("No se pudo agregar el mensaje después de varios intentos");
      }
      
      return { success: true };
    } catch (error) {
      console.error("❌ Error en Zep.agregarMensaje:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  },
});

/**
 * Obtener memoria completa del usuario (últimos N mensajes)
 */
export const obtenerMemoria = action({
  args: {
    userId: v.string(),
    ultimosMensajes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const zep = await getZepClient();
      const threadId = `thread_${args.userId}`;
      const limite = args.ultimosMensajes || 10;
      
      let mensajes: any[] = [];
      
      // Obtener mensajes del thread (puede no existir todavía)
      try {
        const messagesResponse = await zep.thread.get(threadId, {
          lastn: limite,
        });
        
        // Extraer información relevante
        mensajes = messagesResponse.messages?.map((msg: any) => ({
          rol: msg.role,
          contenido: msg.content,
          timestamp: msg.created_at,
        })) || [];
      } catch (threadError: any) {
        if (threadError.statusCode === 404) {
          console.log(`ℹ️ Zep: Thread aún no existe para ${args.userId} (primera conversación)`);
        } else {
          console.warn(`⚠️ Error obteniendo mensajes:`, threadError);
        }
      }
      
      // Obtener contexto del usuario del grafo
      let hechos: any[] = [];
      let resumen: string | null = null;
      
      try {
        const contextResponse = await zep.thread.getUserContext(threadId);
        resumen = contextResponse.context || null;
        // Los hechos están dentro del contexto como texto
        hechos = [];
      } catch (contextError: any) {
        if (contextError.statusCode !== 404) {
          console.warn(`⚠️ No se pudo obtener contexto de usuario:`, contextError);
        }
      }
      
      console.log(`📖 Zep: Memoria recuperada para ${args.userId} (${mensajes.length} mensajes, ${hechos.length} hechos)`);
      
      return {
        success: true,
        mensajes,
        hechos,
        resumen,
        contexto: resumen,
      };
    } catch (error) {
      console.error("❌ Error en Zep.obtenerMemoria:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        mensajes: [],
        hechos: [],
        resumen: null,
      };
    }
  },
});

/**
 * Obtener hechos (facts) extraídos automáticamente por Zep desde el grafo de usuario
 */
export const obtenerHechos = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const zep = await getZepClient();
      const threadId = `thread_${args.userId}`;
      
      try {
        const contextResponse = await zep.thread.getUserContext(threadId);
        const contexto = contextResponse.context || "";
        
        // El contexto contiene los hechos como texto, no como array estructurado
        // Retornar el contexto completo
        console.log(`📌 Zep: Contexto para ${args.userId} (${contexto.length} caracteres)`);
        
        return {
          success: true,
          hechos: [],
          contexto: contexto,
        };
      } catch (threadError: any) {
        if (threadError.statusCode === 404) {
          console.log(`ℹ️ Zep: Thread aún no existe para ${args.userId}`);
          return {
            success: true,
            hechos: [],
            contexto: "",
          };
        }
        throw threadError;
      }
    } catch (error) {
      console.error("❌ Error en Zep.obtenerHechos:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        hechos: [],
        contexto: "",
      };
    }
  },
});

/**
 * Formatear memoria de Zep para incluir en prompt de Gemini
 */
export const formatearMemoriaParaPrompt = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Obtener memoria directamente (no podemos llamar a una action desde otra action)
      const zep = await getZepClient();
      const threadId = `thread_${args.userId}`;
      
      let mensajes: any[] = [];
      
      // Obtener mensajes (puede no existir todavía)
      try {
        const messagesResponse = await zep.thread.get(threadId, { lastn: 8 });
        mensajes = messagesResponse.messages?.map((msg: any) => ({
          rol: msg.role,
          contenido: msg.content,
          timestamp: msg.created_at,
        })) || [];
      } catch (threadError: any) {
        if (threadError.statusCode === 404) {
          console.log(`ℹ️ Zep: Thread aún no existe (primera conversación)`);
          // Primera conversación, devolver contexto vacío
          return {
            success: true,
            contexto: "",
          };
        } else {
          throw threadError;
        }
      }
      
      // Obtener contexto del grafo
      let resumen: string | null = null;
      let hechos: any[] = [];
      try {
        const contextResponse = await zep.thread.getUserContext(threadId);
        resumen = contextResponse.context || null;
      } catch (contextError: any) {
        if (contextError.statusCode !== 404) {
          console.warn(`⚠️ No se pudo obtener contexto:`, contextError);
        }
      }
      
      const memoria = {
        success: true,
        mensajes,
        hechos,
        resumen,
      };
      
      let contexto = "";
      
      // Agregar resumen/contexto si existe
      if (memoria.resumen) {
        contexto += `📝 CONTEXTO DEL USUARIO:\n${memoria.resumen}\n\n`;
      }
      
      // Agregar hechos importantes
      if (memoria.hechos && memoria.hechos.length > 0) {
        contexto += `🧠 HECHOS CONOCIDOS:\n`;
        memoria.hechos.forEach((hecho: any) => {
          const contenidoHecho = hecho.fact || hecho.content || hecho.contenido || hecho;
          contexto += `  • ${contenidoHecho}\n`;
        });
        contexto += `\n`;
      }
      
      // Agregar últimos mensajes (contexto inmediato)
      if (memoria.mensajes && memoria.mensajes.length > 0) {
        contexto += `💬 HISTORIAL RECIENTE:\n`;
        memoria.mensajes.forEach((msg: any) => {
          const emoji = msg.rol === "user" ? "👤" : "🤖";
          contexto += `${emoji} ${msg.contenido}\n`;
        });
      }
      
      return {
        success: true,
        contexto: contexto.trim(),
      };
    } catch (error) {
      console.error("❌ Error en Zep.formatearMemoriaParaPrompt:", error);
      return { 
        success: false, 
        contexto: "",
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  },
});

/**
 * Limpiar/resetear memoria de un usuario
 */
export const limpiarMemoria = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const zep = await getZepClient();
      const threadId = `thread_${args.userId}`;
      
      await zep.thread.delete(threadId);
      console.log(`🗑️ Zep: Memoria eliminada para ${args.userId}`);
      
      return { success: true };
    } catch (error) {
      console.error("❌ Error en Zep.limpiarMemoria:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  },
});
