import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

type Step = 'welcome' | 'sector' | 'tamano' | 'questions' | 'contact' | 'result';

// Opciones del cuestionario
const SECTOR_OPTIONS = [
  { label: 'Salud', value: 'salud' },
  { label: 'Servicios financieros / Seguros', value: 'servicios_financieros' },
  { label: 'Comercio', value: 'comercio' },
  { label: 'Otro', value: 'otro' },
];

const TAMANO_OPTIONS = [
  { label: '1-10 personas', value: '1-10' },
  { label: '11-50 personas', value: '11-50' },
  { label: '51-200 personas', value: '51-200' },
  { label: '200+ personas', value: '200+' },
];

const GRC_QUESTIONS = [
  { id: 'q_trata_datos_personales', pregunta: '¿Tu empresa recolecta o trata datos personales de clientes, usuarios o pacientes (nombre, email, RUT, historial, etc.)?' },
  { id: 'q_trata_datos_sensibles', pregunta: '¿Tratas datos sensibles (salud, biométricos, situación socioeconómica u otros de la misma categoría)?' },
  { id: 'q_encargado_tratamiento', pregunta: '¿Procesas datos personales por encargo de otras empresas (eres proveedor/encargado de tratamiento)?' },
  { id: 'q_servicio_esencial', pregunta: '¿Tu empresa opera infraestructura o presta servicios considerados esenciales (energía, telecomunicaciones, salud, financiero, agua, transporte)?' },
  { id: 'q_oiv_designado', pregunta: '¿Has sido notificado por la ANCI como Operador de Importancia Vital (OIV)?' },
  { id: 'q_incidentes_previos', pregunta: '¿Has sufrido incidentes de ciberseguridad (phishing, ransomware, filtración de datos) en los últimos 2 años?' },
  { id: 'q_politica_seguridad', pregunta: '¿Cuentas con una política formal de seguridad de la información?' },
  { id: 'q_plan_continuidad', pregunta: '¿Tienes un plan de continuidad operativa o respuesta a incidentes documentado?' },
  { id: 'q_capacitacion', pregunta: '¿El personal recibe capacitación periódica en ciberseguridad y protección de datos?' },
  { id: 'q_terceros_criticos', pregunta: '¿Dependes de proveedores externos críticos (cloud, pagos, CRM) para operar?' },
];

interface GrcResult {
  score: number;
  sector: string;
  aplicabilidad: {
    ley21663: boolean;
    ley21719: boolean;
    rol21719: string;
    justificacion: string[];
  };
  exposicion: {
    p10: number;
    p50: number;
    p90: number;
  };
}

// Estilos inline para animación
const fadeInStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;

export function GrcWizard() {
  const [step, setStep] = useState<Step>('welcome');
  const [sector, setSector] = useState('');
  const [tamano, setTamano] = useState('');
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<GrcResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitGrcAssessment = useMutation(api.grcAssessment.submitGrcAssessment);

  const handleSectorSelect = (value: string) => {
    setSector(value);
    setStep('tamano');
  };

  const handleTamanoSelect = (value: string) => {
    setTamano(value);
    setStep('questions');
  };

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < GRC_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('contact');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!nombre.trim() || !email.trim()) {
      alert('Por favor completa tu nombre y email');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Convertir respuestas boolean[] a formato esperado por Convex con IDs reales
      const respuestasFormateadas = answers.map((answer, idx) => ({
        questionId: GRC_QUESTIONS[idx].id,
        value: answer,
      }));

      console.log('📤 Enviando diagnóstico:', {
        sector,
        tamano,
        nombre,
        email,
        respuestas: respuestasFormateadas.length
      });

      const resultado = await submitGrcAssessment({
        sector: sector as any,
        tamano_empresa: tamano as any,
        respuestas: respuestasFormateadas,
        name: nombre,
        email: email,
      });
      
      console.log('✅ Resultado recibido:', resultado);

      // Adaptar resultado al formato esperado por el componente
      setResult({
        score: resultado.score,
        sector: sector,
        aplicabilidad: resultado.aplicabilidad,
        exposicion: resultado.exposicion,
      });
      setStep('result');
    } catch (error) {
      console.error('Error al enviar diagnóstico:', error);
      alert('Hubo un error al procesar tu diagnóstico. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const progress = step === 'welcome' ? 0 : step === 'sector' ? 10 : step === 'tamano' ? 20 : step === 'questions' ? 20 + ((currentQuestion + 1) / GRC_QUESTIONS.length) * 60 : step === 'contact' ? 90 : 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fadeInStyle }} />
      <div className="max-w-3xl mx-auto">
      {/* Barra de progreso - oculta en welcome */}
      {step !== 'welcome' && (
        <div className="mb-8">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F99D1C] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-neutral-500 mt-2 text-center font-['JetBrains_Mono']">
            {Math.round(progress)}% completado
          </p>
        </div>
      )}

      {/* Pantalla de bienvenida */}
      {step === 'welcome' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
          <h3 className="text-3xl font-['Syne'] font-black mb-6 text-center">Diagnóstico GRC</h3>
          <p className="text-neutral-600 mb-8 text-center leading-relaxed">
            Evaluaremos el nivel de cumplimiento de tu empresa con las leyes chilenas de ciberseguridad y protección de datos.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 bg-[#FAF9F6] rounded-xl">
              <div className="text-3xl font-black text-[#F99D1C] mb-1">10</div>
              <div className="text-sm text-neutral-600">Preguntas</div>
            </div>
            <div className="text-center p-4 bg-[#FAF9F6] rounded-xl">
              <div className="text-3xl font-black text-[#F99D1C] mb-1">Sí/No</div>
              <div className="text-sm text-neutral-600">Respuestas simples</div>
            </div>
            <div className="text-center p-4 bg-[#FAF9F6] rounded-xl">
              <div className="text-3xl font-black text-[#F99D1C] mb-1">5 min</div>
              <div className="text-sm text-neutral-600">Tiempo estimado</div>
            </div>
            <div className="text-center p-4 bg-[#FAF9F6] rounded-xl">
              <div className="text-3xl font-black text-[#F99D1C] mb-1">100%</div>
              <div className="text-sm text-neutral-600">Gratis</div>
            </div>
          </div>

          <button
            onClick={() => setStep('sector')}
            className="w-full py-4 bg-[#F99D1C] text-[#283329] font-['Syne'] font-black text-lg rounded-xl hover:scale-105 transition-transform"
          >
            Comenzar Evaluación →
          </button>
        </div>
      )}

      {/* Sector */}
      {step === 'sector' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
          <h3 className="text-2xl font-['Syne'] font-black mb-6">¿A qué sector pertenece tu empresa?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSectorSelect(option.value)}
                className="p-4 border-2 border-neutral-300 rounded-xl hover:border-[#F99D1C] hover:bg-[#F99D1C]/5 transition-all text-left font-['Poppins'] font-semibold"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tamaño */}
      {step === 'tamano' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
          <h3 className="text-2xl font-['Syne'] font-black mb-6">¿Cuántas personas trabajan en tu empresa?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TAMANO_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTamanoSelect(option.value)}
                className="p-4 border-2 border-neutral-300 rounded-xl hover:border-[#F99D1C] hover:bg-[#F99D1C]/5 transition-all text-left font-['Poppins'] font-semibold"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preguntas */}
      {step === 'questions' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
          <p className="text-sm text-[#F99D1C] font-['JetBrains_Mono'] uppercase tracking-wide mb-2">
            Pregunta {currentQuestion + 1} de {GRC_QUESTIONS.length}
          </p>
          <h3 className="text-2xl font-['Syne'] font-black mb-6">
            {GRC_QUESTIONS[currentQuestion].pregunta}
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 border-2 border-neutral-300 font-['Syne'] font-bold rounded-xl hover:border-[#F99D1C] hover:bg-[#F99D1C]/5 transition-all"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Contacto */}
      {step === 'contact' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
          <h3 className="text-2xl font-['Syne'] font-black mb-6">Último paso: tus datos</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:border-[#F99D1C] focus:outline-none"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:border-[#F99D1C] focus:outline-none"
                placeholder="juan@empresa.cl"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#F99D1C] text-[#283329] font-['Syne'] font-black text-lg rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Ver mi Resultado →'}
            </button>
          </form>
        </div>
      )}

      {/* Resultado */}
      {step === 'result' && result && (
        <div className="bg-[#283329] text-white rounded-2xl p-8 shadow-lg border-2 border-[#F99D1C] animate-fadeIn">
          {/* Banner de éxito */}
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-lg font-bold text-green-400">¡Diagnóstico completado!</p>
            <p className="text-sm text-white/70 mt-1">Hemos enviado una copia a tu email</p>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#F99D1C] flex items-center justify-center">
              <span className="text-3xl font-['Syne'] font-black">{result.score}</span>
            </div>
            <div>
              <p className="text-lg font-bold">Score de madurez</p>
              <p className="text-sm text-white/70">sobre 100 puntos</p>
            </div>
          </div>

          {/* Aplicabilidad */}
          <div className="mb-6">
            <p className="text-sm font-bold mb-2">Aplicabilidad legal:</p>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${result.aplicabilidad.ley21663 ? 'bg-[#F99D1C] text-[#283329] border-[#F99D1C]' : 'bg-transparent border-white/30 text-white/70'}`}>
                Ley 21.663 {result.aplicabilidad.ley21663 ? 'Aplica' : 'No aplica'}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${result.aplicabilidad.ley21719 ? 'bg-[#F99D1C] text-[#283329] border-[#F99D1C]' : 'bg-transparent border-white/30 text-white/70'}`}>
                Ley 21.719 {result.aplicabilidad.ley21719 ? 'Aplica' : 'No aplica'}
              </span>
            </div>
          </div>

          {/* Exposición */}
          <div className="mb-6">
            <p className="text-sm font-bold mb-2">Exposición indicativa (P10–P90):</p>
            <p className="text-2xl font-['Syne'] font-black text-[#F99D1C]">
              {formatCLP(result.exposicion.p10)} — {formatCLP(result.exposicion.p90)}
            </p>
            <p className="text-xs text-white/60 mt-2">
              Estimación indicativa, no un informe pericial. Se afina con datos reales en la reunión.
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => {
                // Ocultar el panel
                const panel = document.getElementById('grc-panel');
                if (panel) {
                  panel.classList.add('hidden');
                }
                // Abrir chat para agendar
                window.dispatchEvent(new CustomEvent('openChat', { 
                  detail: { type: 'schedule_meeting' } 
                }));
                // Scroll al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 bg-[#F99D1C] text-[#283329] font-['Syne'] font-bold text-lg rounded-full hover:bg-white transition-colors"
            >
              📅 Agendar diagnóstico detallado →
            </button>
            
            <button
              onClick={() => {
                // Cerrar el panel
                const panel = document.getElementById('grc-panel');
                if (panel) {
                  panel.classList.add('hidden');
                }
                // Scroll al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 border-2 border-white/30 text-white font-['Poppins'] font-semibold rounded-full hover:border-white/50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
