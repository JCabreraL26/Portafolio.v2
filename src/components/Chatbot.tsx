import React, { useState, useEffect, useRef } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Message {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: number;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
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
  
  // Mensaje de bienvenida al abrir por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        texto: "👋 ¡Hola! Soy el asistente virtual de **ÁPERCA SpA**. Puedo ayudarte con:\n\n• Información sobre servicios\n• Precios y cotizaciones\n• Proyectos realizados\n• Contacto con Jorge Cabrera\n\n¿En qué puedo ayudarte hoy?",
        esUsuario: false,
        timestamp: Date.now(),
      }]);
    }
  }, [isOpen]);
  
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
        ip_usuario: undefined, // El servidor lo detecta automáticamente
        user_agent: navigator.userAgent,
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
        texto: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo o contacta directamente a jcabreralabbe@gmail.com",
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
          <div className="absolute inset-0 rounded-full bg-[#b80000]/20 animate-ping" />
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#b80000] text-white rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(184,0,0,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Abrir chat"
          >
            <svg 
              className="w-8 h-8 drop-shadow-lg" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
            
            {/* Badge de notificación */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#ff0000] to-[#b80000] rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
              1
            </span>
          </button>
        </div>
      )}
      
      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border-2 border-[#111] sm:w-96 sm:h-[600px]">
          {/* Header */}
          <div className="bg-[#111] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl font-bold text-[#111]">
                A
              </div>
              <div>
                <h3 className="font-['Syne'] font-bold text-lg">ÁPERCA SpA</h3>
                <p className="text-xs text-white/70">Asistente Virtual</p>
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
                      ? "bg-[#111] text-white rounded-br-none"
                      : "bg-white text-neutral-900 rounded-bl-none shadow-md border border-neutral-200"
                  }`}
                >
                  <p 
                    className="text-sm leading-relaxed font-['Poppins'] whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: msg.texto
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br />')
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
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-[#111] transition-colors font-['Poppins'] text-sm"
                disabled={isTyping}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-[#111] text-white p-3 rounded-full hover:bg-[#b80000] disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
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
              Powered by <span className="font-semibold text-[#111]">Google Gemini AI</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
