import React, { useState, useEffect, useRef } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGrcChatFlow, type QuickReply, type GrcResult } from "./grc/useGrcChatFlow";

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
  quickReplies?: QuickReply[];
  resultCard?: GrcResult;
}

interface ChatContext {
  type: 'general' | 'schedule_meeting' | 'contact' | 'grc_diagnostic' | 'grc_followup';
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

  // Debug: verificar que el componente se montó
  useEffect(() => {
    console.log('✅ Chatbot montado correctamente');
  }, []);
  
  // Action de Convex para enviar mensajes
  const procesarMensaje = useAction(api.functions.ai.googleChatbot.procesarMensajeWeb);

  // Flujo conversacional del Diagnóstico GRC (chips) — ver src/components/grc/useGrcChatFlow.ts
  const appendGrcBotMessage = (msg: { texto: string; quickReplies?: QuickReply[]; resultCard?: GrcResult }) => {
    setMessages(prev => [...prev, {
      id: `grc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      texto: msg.texto,
      esUsuario: false,
      timestamp: Date.now(),
      quickReplies: msg.quickReplies,
      resultCard: msg.resultCard,
    }]);
  };
  const grcFlow = useGrcChatFlow(appendGrcBotMessage);
  
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
      const customEvent = e as CustomEvent<ChatContext & { autoSend?: boolean }>;
      const { type, initialMessage, autoSend } = customEvent.detail || { type: 'general' };
      
      setContext({ type, initialMessage });
      setIsOpen(true);
      
      // Si hay mensaje inicial, usarlo
      if (initialMessage) {
        // Para otros contextos, usar mensaje inicial
        setTimeout(() => {
          setInputText(initialMessage);
          
          // Si autoSend es true, enviar automáticamente
          if (autoSend) {
            setTimeout(() => {
              // Simular envío del mensaje
              const userMessage: Message = {
                id: `user_${Date.now()}`,
                texto: initialMessage,
                esUsuario: true,
                timestamp: Date.now(),
              };
              
              setMessages(prev => [...prev, userMessage]);
              setInputText("");
              setIsTyping(true);
              
              // Procesar mensaje con IA
              // Convertir tipo de contexto si es necesario (grc_diagnostic no es válido para la API)
              const apiContext: 'general' | 'schedule_meeting' | 'contact' | 'grc_followup' = 
                type === 'grc_diagnostic' ? 'general' : type;
              
              procesarMensaje({
                mensaje: initialMessage,
                session_id: sessionId,
                ip_usuario: undefined,
                user_agent: navigator.userAgent,
                context: apiContext,
              }).then(response => {
                const botMessage: Message = {
                  id: `bot_${Date.now()}`,
                  texto: response.respuesta,
                  esUsuario: false,
                  timestamp: Date.now(),
                };
                setMessages(prev => [...prev, botMessage]);
              }).catch(error => {
                console.error("Error enviando mensaje automático:", error);
                const errorMessage: Message = {
                  id: `error_${Date.now()}`,
                  texto: "Lo siento, hubo un error. Por favor intenta de nuevo.",
                  esUsuario: false,
                  timestamp: Date.now(),
                };
                setMessages(prev => [...prev, errorMessage]);
              }).finally(() => {
                setIsTyping(false);
              });
            }, 800); // Esperar un poco para que el usuario vea el mensaje
          }
        }, 500);
      }
    };
    
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, [sessionId]);
  
  // Mensaje de bienvenida al abrir por primera vez
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (context.type === 'grc_diagnostic') {
        grcFlow.start();
        return;
      }

      let welcomeText = "";
      
      if (context.type === 'schedule_meeting') {
        welcomeText = "📅 **Agendar reunión**\n\nPara coordinar una reunión, usa el botón \"Enviar email\" de abajo. Te responderé con opciones de horario dentro de 24 horas.\n\n**Horarios disponibles:**\n• Lunes a Viernes: 9:00 - 18:00 CLT\n• Duración: 30-60 minutos";
      } else if (context.type === 'contact') {
        welcomeText = "💬 **¿En qué puedo ayudarte?**\n\nPuedo asistirte con:\n• 📅 Diagnóstico estratégico\n• 🔍 Análisis técnico o de negocio\n• 📊 Casos de éxito y ROI\n• 💼 Oportunidades laborales\n\n**Usa el botón \"Enviar email\" de abajo** para contactarme directamente.";
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
    const textoEnviado = inputText;
    setInputText("");

    // Diagnóstico GRC: los pasos de texto libre (nombre/email) los maneja el hook,
    // no el agente de IA general.
    if (context.type === 'grc_diagnostic') {
      setIsTyping(true);
      await grcFlow.handleTextReply(textoEnviado);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    try {
      // Convertir tipo de contexto si es necesario (grc_diagnostic no es válido para la API)
      const apiContext: 'general' | 'schedule_meeting' | 'contact' | 'grc_followup' = 
        context.type === 'grc_diagnostic' ? 'general' : context.type;
      
      const response = await procesarMensaje({
        mensaje: textoEnviado,
        session_id: sessionId,
        ip_usuario: undefined,
        user_agent: navigator.userAgent,
        context: apiContext,
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

  const handleGrcQuickReply = (qr: QuickReply) => {
    // Si es el botón de redirección, ir a la página dedicada
    if (qr.value === 'redirect') {
      window.location.href = '/diagnostico-grc';
      return;
    }

    const label = grcFlow.handleQuickReply(qr.value);
    
    if (!label) {
      return;
    }

    const nuevoMensaje = {
      id: `user_${Date.now()}_${Math.random()}`,
      texto: label,
      esUsuario: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, nuevoMensaje]);
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleAgendarDesdeGrc = (result: GrcResult) => {
    setContext({ type: 'schedule_meeting' });
    
    const nuevoMensaje = {
      id: `bot_${Date.now()}`,
      texto: `📅 **¡Perfecto! Agendemos tu reunión de diagnóstico GRC**\n\nVimos tu score de madurez (${result.score}/100) para el sector ${result.sector}. Para agendar con Jorge Cabrera, dime qué día y hora prefieres (Ej: "Mañana 15:00" o "Viernes 10:30").`,
      esUsuario: false,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, nuevoMensaje]);
    
    // Forzar scroll después de agregar el mensaje
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')} CLP`;
  
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
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.esUsuario ? "justify-end" : "justify-start"}`}
              >
                {msg.resultCard ? (
                  <div className="max-w-[90%] w-full bg-[#283329] text-white rounded-2xl rounded-bl-none shadow-md border-2 border-[#F99D1C] p-4 space-y-3">
                    <p className="font-['Syne'] font-bold text-sm uppercase tracking-wide text-[#F99D1C]">
                      Resultado de tu diagnóstico GRC
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-full border-4 border-[#F99D1C] flex items-center justify-center font-['Syne'] font-bold text-lg">
                        {msg.resultCard.score}
                      </div>
                      <p className="text-sm font-['Poppins']">Score de madurez sobre 100</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs font-['Poppins'] px-3 py-1 rounded-full border ${msg.resultCard.aplicabilidad.ley21663 ? 'bg-[#F99D1C] text-[#283329] border-[#F99D1C]' : 'bg-transparent border-white/30 text-white/70'}`}>
                        Ley 21.663 {msg.resultCard.aplicabilidad.ley21663 ? 'Aplica' : 'No aplica'}
                      </span>
                      <span className={`text-xs font-['Poppins'] px-3 py-1 rounded-full border ${msg.resultCard.aplicabilidad.ley21719 ? 'bg-[#F99D1C] text-[#283329] border-[#F99D1C]' : 'bg-transparent border-white/30 text-white/70'}`}>
                        Ley 21.719 {msg.resultCard.aplicabilidad.ley21719 ? 'Aplica' : 'No aplica'}
                      </span>
                    </div>

                    <p className="text-sm font-['Poppins']">
                      Exposición indicativa (P10–P90):
                      <br />
                      <strong className="text-[#F99D1C]">
                        {formatCLP(msg.resultCard.exposicion.p10)} — {formatCLP(msg.resultCard.exposicion.p90)}
                      </strong>
                    </p>
                    <p className="text-xs text-white/60 font-['Poppins']">
                      Estimación indicativa, no un informe pericial. Se afina con datos reales en la reunión.
                    </p>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔵 Click detectado en botón');
                        handleAgendarDesdeGrc(msg.resultCard!);
                      }}
                      className="w-full bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold py-2 rounded-full hover:bg-white transition-colors cursor-pointer relative z-10"
                    >
                      Agendar mi diagnóstico →
                    </button>
                  </div>
                ) : (
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

                    {/* Chips del diagnóstico GRC — solo tocables en el último mensaje del bot */}
                    {msg.quickReplies && idx === messages.length - 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.quickReplies.map((qr) => (
                          <button
                            key={qr.value}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🟢 Click detectado en quick reply button');
                              handleGrcQuickReply(qr);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF9F6] border-2 border-[#283329] rounded-full text-xs font-['Poppins'] font-semibold hover:bg-[#F99D1C] hover:border-[#F99D1C] transition-colors cursor-pointer relative z-10"
                          >
                            {qr.icon && <span>{qr.icon}</span>}
                            {qr.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
          {context.type === 'grc_diagnostic' && (grcFlow.inputMode === 'chips' || grcFlow.inputMode === 'none') ? (
            <div className="p-3 bg-white border-t border-neutral-200 text-center">
              <p className="text-xs text-neutral-400 font-['Poppins']">
                {grcFlow.inputMode === 'none' ? 'Un momento...' : 'Toca una opción arriba para continuar 👆'}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white border-t border-neutral-200 space-y-3">
              {/* Botón de email para schedule_meeting, grc_followup y contact */}
              {(context.type === 'schedule_meeting' || context.type === 'grc_followup' || context.type === 'contact') && (
                <button
                  onClick={() => {
                    let subject = 'Contacto desde sitio web - Áperca SpA';
                    let body = 'Hola Jorge,\n\nMe gustaría contactarte.\n\nNombre:\nEmpresa:\nMotivo:\n\nSaludos';
                    
                    if (context.type === 'schedule_meeting') {
                      subject = 'Solicitud de reunión - Áperca SpA';
                      body = 'Hola Jorge,\n\nMe gustaría agendar una reunión contigo.\n\nNombre:\nEmpresa:\nMotivo:\nHorarios disponibles:\n\nSaludos';
                    } else if (context.type === 'grc_followup') {
                      subject = 'Consulta sobre resultado GRC - Áperca SpA';
                      body = 'Hola Jorge,\n\nCompletí el diagnóstico GRC y me gustaría discutir los resultados.\n\nNombre:\nEmpresa:\nSector:\n\nSaludos';
                    }
                    
                    // Abrir Gmail web en nueva pestaña (más confiable que mailto:)
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@aperca.cl&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailUrl, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold rounded-full hover:bg-[#283329] hover:text-white transition-all duration-300 border-2 border-[#F99D1C]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar email
                </button>
              )}
              
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type={context.type === 'grc_diagnostic' && grcFlow.inputMode === 'email' ? 'email' : 'text'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    context.type === 'grc_diagnostic'
                      ? grcFlow.inputMode === 'email' ? 'tu@email.com' : 'Tu nombre'
                      : 'Escribe tu mensaje...'
                  }
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
          )}
        </div>
      )}
    </>
  );
}
