import React, { useState, useEffect, useRef } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// 🛡️ Helper: Sanitizar HTML del bot para prevenir XSS
function sanitizarHtmlBot(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gi, "")
    .replace(/<embed\b[^>]*>([\s\S]*?)<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

interface Message {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: number;
}

interface ChatContext {
  type: 'general' | 'schedule_meeting' | 'contact';
  initialMessage?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [context, setContext] = useState<ChatContext>({ type: 'general' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Action de Convex para enviar mensajes
  const procesarMensaje = useAction(api.functions.ai.googleChatbot.procesarMensajeWeb);
  
  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Escuchar eventos globales para abrir chat
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<ChatContext>;
      const { type, initialMessage } = customEvent.detail || { type: 'general' };
      
      setContext({ type, initialMessage });
      setIsOpen(true);
      
      // Si es agendamiento, pre-llenar con hora sugerida para acción rápida
      if (type === 'schedule_meeting') {
        const mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        const horaSugerida = "Mañana 14:00";
        
        setTimeout(() => {
          setInputText(horaSugerida);
        }, 500);
      } else if (initialMessage) {
        // Para otros contextos, usar mensaje inicial si existe
        setTimeout(() => {
          setInputText(initialMessage);
        }, 500);
      }
    };
    
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);
  
  // Mensaje de bienvenida al abrir por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let welcomeText = "";
      
      if (context.type === 'schedule_meeting') {
        welcomeText = "📅 **¡Perfecto! Agendemos tu reunión**\n\nPara agendar tu reunión con Jorge Cabrera, necesito algunos datos:\n\n**Opciones de horario disponibles:**\n• Lunes a Viernes: 9:00 - 18:00\n• Duración: 30 minutos\n\n¿Qué día y hora prefieres? (Ej: 'Mañana 15:00' o 'Viernes 10:30')";
      } else if (context.type === 'contact') {
        welcomeText = "💬 **¿En qué puedo ayudarte?**\n\nPuedo asistirte con:\n• 📅 Agendar diagnóstico estratégico (30 min, gratuito)\n• � Análisis de tu desafío técnico o de negocio\n• 📊 Casos de éxito y ROI de proyectos similares\n• � Oportunidades laborales (si eres reclutador)\n\n📧 **contacto@aperca.cl**";
      } else {
        welcomeText = "👋 **Áperca SpA** — Secure Digital Product Studio\n\n¿Tienes un desafío de negocio sin resolver?\n\n**Resolvemos:**\n• 🔥 Fricción operativa que frena tu crecimiento\n• 🔒 Sistemas legacy sin seguridad ni documentación\n• 📉 Funnels de conversión que no convierten\n• ⚡ Necesitas velocidad startup con calidad enterprise\n\n¿Eres empresa con un desafío técnico o reclutador buscando talento?\n\nCuéntame tu situación.";
      }
      
      setMessages([{
        id: "welcome",
        texto: welcomeText,
        esUsuario: false,
        timestamp: Date.now(),
      }]);
    }
  }, [isOpen, context]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      texto: inputText,
      esUsuario: true,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    
    try {
      const response = await procesarMensaje({
        mensaje: inputText,
        session_id: sessionId,
        ip_usuario: undefined,
        user_agent: navigator.userAgent,
        context: context.type,
      });
      
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        texto: response.respuesta,
        esUsuario: false,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        texto: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo o contacta directamente a **contacto@aperca.cl**",
        esUsuario: false,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Anillo animado de fondo */}
          <div className="absolute inset-0 rounded-full bg-[#F99D1C]/30 animate-ping" />
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 bg-[#283329] rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(249,157,28,0.8)] hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-[#F99D1C]"
            aria-label="Abrir chat"
          >
            <img 
              src="/img/logo-nav-bar.png" 
              alt="Áperca Chat" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(249,157,28,0.6)]"
            />
            
            {/* Badge de notificación */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F99D1C] rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse text-[#283329]">
              1
            </span>
          </button>
        </div>
      )}
      
      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border-2 border-[#F99D1C] sm:w-96 sm:h-[600px]">
          {/* Header */}
          <div className="bg-[#283329] text-white p-4 flex items-center justify-between border-b-2 border-[#F99D1C]">
            <div className="flex items-center gap-3">
              <img 
                src="/img/logo-nav-bar.png" 
                alt="Áperca" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="font-['Syne'] font-bold text-lg">ÁPERCA SpA</h3>
                <p className="text-xs text-[#F99D1C]">Asistente Virtual</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Cerrar chat"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.esUsuario ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.esUsuario
                      ? "bg-[#283329] text-white rounded-br-none border-2 border-[#F99D1C]"
                      : "bg-white text-neutral-900 rounded-bl-none shadow-md border border-neutral-200"
                  }`}
                >
                  <p 
                    className="text-sm leading-relaxed font-['Poppins'] whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: sanitizarHtmlBot(
                        msg.texto
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />')
                      )
                    }}
                  />
                  <span className={`text-xs mt-1 block ${msg.esUsuario ? 'text-white/50' : 'text-neutral-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-neutral-900 p-3 rounded-2xl rounded-bl-none shadow-md border border-neutral-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 bg-white border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                maxLength={1000}
                className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-[#F99D1C] transition-colors font-['Poppins'] text-sm"
                disabled={isTyping}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-[#283329] text-white p-3 rounded-full hover:bg-[#F99D1C] hover:text-[#283329] disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 border-2 border-[#F99D1C]"
                aria-label="Enviar mensaje"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </button>
            </div>
            
            {/* Footer */}
            <p className="text-xs text-neutral-400 text-center mt-2 font-['Poppins']">
              Powered by <span className="font-semibold text-[#283329]">Google Gemini AI</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
