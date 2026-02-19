import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

// Context para Deep Seek - Modo Admin con Acceso Completo
interface DeepSeekContextType {
  convex: ConvexReactClient;
  isConnected: boolean;
  registrarTransaccion: (datos: TransaccionData) => Promise<any>;
  crearProyectoDT: (datos: ProyectoDTData) => Promise<any>;
  obtenerResumenFinanciero: () => Promise<any>;
  obtenerProyectosDT: (filtros?: ProyectosDTFiltros) => Promise<any>;
  actualizarConfiguracion: (datos: ConfigData) => Promise<any>;
  loading: boolean;
  error: string | null;
}

interface TransaccionData {
  tipo: "ingreso" | "gasto" | "transferencia";
  categoria: string;
  monto: number;
  descripcion: string;
  cuenta_origen?: string;
  cuenta_destino?: string;
  etiquetas?: string[];
  comprobante_url?: string;
}

interface ProyectoDTData {
  proyecto_id: string;
  fase: "empatizar" | "definir" | "idear" | "prototipar" | "testear";
  titulo: string;
  descripcion: string;
  insights?: string[];
  stakeholders?: string[];
  prioridad: "baja" | "media" | "alta";
}

interface ProyectosDTFiltros {
  proyecto_id?: string;
  fase?: "empatizar" | "definir" | "idear" | "prototipar" | "testear";
}

interface ConfigData {
  clave: string;
  valor: string | number | boolean;
  tipo: "string" | "number" | "boolean";
  descripcion?: string;
  categoria: "ia" | "whatsapp" | "web" | "contabilidad";
}

const DeepSeekContext = createContext<DeepSeekContextType | undefined>(undefined);

interface DeepSeekProviderProps {
  children: ReactNode;
  convexUrl: string;
}

export function DeepSeekProvider({ children, convexUrl }: DeepSeekProviderProps) {
  const [convex] = useState(() => new ConvexReactClient(convexUrl));
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar conexión con Convex
    const checkConnection = async () => {
      try {
        await convex.query(api.ai.deepSeek.obtenerResumenFinanciero);
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

  // Funciones wrapper para las mutaciones y queries de Deep Seek
  const registrarTransaccion = async (datos: TransaccionData) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.mutation(api.ai.deepSeek.registrarTransaccion, datos);
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error registrando transacción";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearProyectoDT = async (datos: ProyectoDTData) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.mutation(api.ai.deepSeek.crearProyectoDT, datos);
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error creando proyecto";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerResumenFinanciero = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.deepSeek.obtenerResumenFinanciero);
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error obteniendo resumen financiero";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerProyectosDT = async (filtros?: ProyectosDTFiltros) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.query(api.ai.deepSeek.obtenerProyectosDT, filtros || {});
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error obteniendo proyectos";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarConfiguracion = async (datos: ConfigData) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await convex.mutation(api.ai.deepSeek.actualizarConfiguracion, datos);
      return resultado;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error actualizando configuración";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: DeepSeekContextType = {
    convex,
    isConnected,
    registrarTransaccion,
    crearProyectoDT,
    obtenerResumenFinanciero,
    obtenerProyectosDT,
    actualizarConfiguracion,
    loading,
    error,
  };

  return (
    <DeepSeekContext.Provider value={value}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </DeepSeekContext.Provider>
  );
}

// Hook para usar Deep Seek en componentes
export function useDeepSeek() {
  const context = useContext(DeepSeekContext);
  if (context === undefined) {
    throw new Error("useDeepSeek debe ser usado dentro de un DeepSeekProvider");
  }
  return context;
}

// Componente de utilidad para verificar conexión
export function DeepSeekStatus() {
  const { isConnected, loading, error } = useDeepSeek();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span>Conectando con Deep Seek...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-500">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-500">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span>Deep Seek conectado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span>Desconectado</span>
    </div>
  );
}

// Componente de dashboard para Deep Seek
export function DeepSeekDashboard() {
  const { obtenerResumenFinanciero, obtenerProyectosDT, loading } = useDeepSeek();
  const [resumen, setResumen] = useState<any>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resumenData, proyectosData] = await Promise.all([
          obtenerResumenFinanciero(),
          obtenerProyectosDT(),
        ]);
        setResumen(resumenData);
        setProyectos(proyectosData);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };

    cargarDatos();
  }, [obtenerResumenFinanciero, obtenerProyectosDT]);

  if (loading) {
    return <div className="p-4 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Deep Seek</h2>
      
      {/* Resumen Financiero */}
      {resumen && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <div className="text-green-600 text-sm">Ingresos</div>
              <div className="text-2xl font-bold text-green-700">${resumen.total_ingresos}</div>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <div className="text-red-600 text-sm">Gastos</div>
              <div className="text-2xl font-bold text-red-700">${resumen.total_gastos}</div>
            </div>
            <div className={`p-4 rounded ${resumen.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <div className={`text-sm ${resumen.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Balance</div>
              <div className={`text-2xl font-bold ${resumen.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${resumen.balance}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proyectos Design Thinking */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Proyectos Design Thinking</h3>
        <div className="space-y-3">
          {proyectos.map((proyecto) => (
            <div key={proyecto._id} className="border-l-4 border-blue-400 pl-4">
              <div className="font-medium">{proyecto.titulo}</div>
              <div className="text-sm text-gray-600">
                Fase: {proyecto.fase} | Prioridad: {proyecto.prioridad}
              </div>
              <div className="text-sm text-gray-500">{proyecto.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
