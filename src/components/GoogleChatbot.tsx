import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

// Context para Google Chatbot - Modo Cliente con Acceso Limitado
interface GoogleChatbotContextType {
  convex: ConvexReactClient;
  isConnected: boolean;
  enviarMensaje: (mensaje: string, session_id: string) => Promise<any>;
  obtenerServicios: (categoria?: string, destacado?: boolean) => Promise<any>;
  buscarServicios: (termino: string) => Promise<any>;
  obtenerHistorial: (session_id: string, limite?: number) => Promise<any>;
  obtenerFAQs: () => Promise<any>;
  loading: boolean;
  error: string | null;
}

const GoogleChatbotContext = createContext<GoogleChatbotContextType | undefined>(undefined);

interface GoogleChatbotProviderProps {
  children: ReactNode;
  convexUrl: string;
}

export function GoogleChatbotProvider({ children, convexUrl }: GoogleChatbotProviderProps) {
  const [convex] = useState(() => new ConvexReactClient(convexUrl));
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar conexión con Convex
    const checkConnection = async () => {
      try {
        await convex.query(api.ai.googleChatbot.obtenerServiciosActivos);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error("Error conectando a Convex:", err);
        setError("No se pudo conectar al servidor");
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [convex]);

  // Funciones wrapper para las queries de Google Chatbot
  const enviarMensaje = async (mensaje: string, session_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.action(api.ai.googleChatbot.procesarMensajeWeb, {
        mensaje,
        session_id,
        ip_usuario: undefined, // Se obtiene automáticamente en el servidor
        user_agent: navigator.userAgent,
      });
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error enviando mensaje";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerServicios = async (categoria?: string, destacado?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.googleChatbot.obtenerServiciosActivos, {
        categoria: categoria as any,
        destacado,
      });
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error obteniendo servicios";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarServicios = async (termino: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.googleChatbot.buscarServicios, { termino });
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error buscando servicios";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerHistorial = async (session_id: string, limite?: number) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.googleChatbot.obtenerHistorialSesion, {
        session_id,
        limite,
      });
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error obteniendo historial";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.googleChatbot.obtenerFAQsPopulares);
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error obteniendo FAQs";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: GoogleChatbotContextType = {
    convex,
    isConnected,
    enviarMensaje,
    obtenerServicios,
    buscarServicios,
    obtenerHistorial,
    obtenerFAQs,
    loading,
    error,
  };

  return (
    <GoogleChatbotContext.Provider value={value}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </GoogleChatbotContext.Provider>
  );
}

// Hook para usar Google Chatbot en componentes
export function useGoogleChatbot() {
  const context = useContext(GoogleChatbotContext);
  if (context === undefined) {
    throw new Error("useGoogleChatbot debe ser usado dentro de un GoogleChatbotProvider");
  }
  return context;
}

// Componente principal del chatbot para el sitio web
export function GoogleWebChatbot() {
  const { enviarMensaje, loading, error } = useGoogleChatbot();
  const [mensaje, setMensaje] = useState("");
  const [conversacion, setConversacion] = useState<Array<{role: string, message: string}>>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    // Agregar mensaje del usuario a la conversación
    setConversacion(prev => [...prev, { role: "user", message: mensaje }]);
    
    try {
      const respuesta = await enviarMensaje(mensaje, sessionId);
      
      // Agregar respuesta del bot a la conversación
      setConversacion(prev => [...prev, { role: "bot", message: respuesta.respuesta }]);
      
      setMensaje("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">Google Assistant</h3>
        <p className="text-sm opacity-90">¿En qué puedo ayudarte?</p>
      </div>

      {/* Conversación */}
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {conversacion.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>¡Hola! Soy Google, tu asistente virtual.</p>
            <p className="text-sm mt-2">Puedes preguntarme sobre servicios, precios o contacto.</p>
          </div>
        )}
        
        {conversacion.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.role === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !mensaje.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente para mostrar servicios disponibles
export function ServiciosViewer() {
  const { obtenerServicios, loading } = useGoogleChatbot();
  const [servicios, setServicios] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [mostrarDestacados, setMostrarDestacados] = useState(false);

  useEffect(() => {
    cargarServicios();
  }, [categoriaSeleccionada, mostrarDestacados]);

  const cargarServicios = async () => {
    try {
      const resultado = await obtenerServicios(
        categoriaSeleccionada || undefined,
        mostrarDestacados || undefined
      );
      setServicios(resultado);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Servicios Disponibles</h2>
      
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Todas las categorías</option>
          <option value="desarrollo_web">Desarrollo Web</option>
          <option value="ui_ux">UI/UX</option>
          <option value="consultoria">Consultoría</option>
          <option value="automatizacion">Automatización</option>
          <option value="otro">Otro</option>
        </select>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={mostrarDestacados}
            onChange={(e) => setMostrarDestacados(e.target.checked)}
            className="mr-2"
          />
          Solo destacados
        </label>
      </div>

      {/* Lista de servicios */}
      {loading ? (
        <div className="text-center py-8">Cargando servicios...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {servicio.destacado && (
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mb-2">
                  Destacado
                </span>
              )}
              
              <h3 className="font-semibold text-lg mb-2">{servicio.nombre}</h3>
              <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-blue-600">${servicio.precio_base}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {servicio.categoria.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              {servicio.duracion_estimada && (
                <div className="text-sm text-gray-500 mb-2">
                  ⏱️ {servicio.duracion_estimada}
                </div>
              )}
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Consultar
              </button>
            </div>
          ))}
        </div>
      )}
      
      {!loading && servicios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron servicios con los filtros seleccionados.
        </div>
      )}
    </div>
  );
}
