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

  const formatUTM = (amountCLP: number) => {
    const UTM_VALUE = 67000; // Valor aproximado UTM dic 2024
    const utm = Math.round(amountCLP / UTM_VALUE);
    return new Intl.NumberFormat('es-CL').format(utm);
  };

  // Calcular progreso y número de pregunta total
  const totalPreguntas = 2 + GRC_QUESTIONS.length + 1; // sector + tamaño + 10 preguntas + contacto = 13
  let preguntaActual = 0;
  if (step === 'sector') preguntaActual = 1;
  else if (step === 'tamano') preguntaActual = 2;
  else if (step === 'questions') preguntaActual = 3 + currentQuestion;
  else if (step === 'contact') preguntaActual = 3 + GRC_QUESTIONS.length;
  
  const progress = step === 'welcome' ? 0 : (preguntaActual / totalPreguntas) * 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fadeInStyle }} />
      <div className="max-w-3xl mx-auto">
      {/* Barra de progreso - oculta en welcome */}
      {step !== 'welcome' && (
        <div className="mb-8">
          <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
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

      {/* Pantalla de bienvenida - Estilo minimalista */}
      {step === 'welcome' && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] rounded-2xl p-12 shadow-2xl backdrop-blur-lg border border-white/10">
          {/* Título */}
          <h3 className="text-3xl font-['Syne'] font-bold mb-3 text-center text-white">Diagnóstico GRC</h3>
          
          {/* Descripción del motor */}
          <p className="text-gray-400 mb-10 text-center leading-relaxed text-sm max-w-lg mx-auto font-['Space_Grotesk']">
            Motor que evalúa tu madurez GRC y calcula tu exposición económica real basándose en techos sancionatorios chilenos.
          </p>
          
          {/* Stats minimalistas - solo texto */}
          <div className="flex justify-center items-center gap-12 mb-10 py-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">13</div>
              <div className="text-xs text-gray-500 font-['Space_Grotesk']">Preguntas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Sí/No</div>
              <div className="text-xs text-gray-500 font-['Space_Grotesk']">Respuestas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">5 min</div>
              <div className="text-xs text-gray-500 font-['Space_Grotesk']">Duración</div>
            </div>
          </div>

          {/* Qué recibirás - Minimalista con strokes blancos */}
          <div className="mb-10 pl-6 py-2">
            <h4 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider font-['JetBrains_Mono']">Al finalizar recibirás</h4>
            <div className="space-y-4">
              {/* Score de madurez */}
              <div className="p-4 border border-white/20 rounded-lg">
                <p className="text-sm font-bold text-white mb-1 font-['Space_Grotesk']">Score de madurez GRC (0-100)</p>
                <p className="text-xs text-gray-400 font-['Space_Grotesk']">Qué tan preparada está tu empresa para prevenir incidentes de seguridad</p>
              </div>

              {/* Aplicabilidad */}
              <div className="p-4 border border-white/20 rounded-lg">
                <p className="text-sm font-bold text-white mb-1 font-['Space_Grotesk']">Aplicabilidad de Ley 21.663 y 21.719</p>
                <p className="text-xs text-gray-400 font-['Space_Grotesk']">Si tu empresa debe cumplir con las nuevas leyes chilenas de ciberseguridad y datos</p>
              </div>

              {/* Exposición económica */}
              <div className="p-4 border border-white/20 rounded-lg">
                <p className="text-sm font-bold text-white mb-1 font-['Space_Grotesk']">Exposición económica (P10-P90)</p>
                <p className="text-xs text-gray-400 font-['Space_Grotesk']">Rango de multas potenciales en UTM si no cumples con las normativas</p>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="relative flex py-6 items-center mb-8">
            <div className="grow border-t border-white/10"></div>
            <span className="shrink mx-6 text-gray-500 text-xs font-['JetBrains_Mono'] tracking-wider">COMENZAR</span>
            <div className="grow border-t border-white/10"></div>
          </div>

          {/* Botón minimalista destacado */}
          <button
            onClick={() => setStep('sector')}
            className="w-full py-4 bg-[#F99D1C] text-black font-['Syne'] font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(249,157,28,0.6)] flex items-center justify-center group"
          >
            Iniciar Evaluación
            <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Sector */}
      {step === 'sector' && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] rounded-2xl p-10 shadow-2xl border border-white/10">
          <p className="text-xs text-[#F99D1C] font-['JetBrains_Mono'] uppercase tracking-wider mb-4">
            Pregunta {preguntaActual} de {totalPreguntas}
          </p>
          <h3 className="text-xl font-['Space_Grotesk'] font-medium mb-8 text-white">¿A qué sector pertenece tu empresa?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSectorSelect(option.value)}
                className="p-5 bg-white/5 border border-white/10 rounded-full hover:bg-[#F99D1C] hover:border-[#F99D1C] hover:text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(249,157,28,0.5)] transition-all duration-300 text-center font-['Space_Grotesk'] font-medium text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tamaño */}
      {step === 'tamano' && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] rounded-2xl p-10 shadow-2xl border border-white/10">
          <p className="text-xs text-[#F99D1C] font-['JetBrains_Mono'] uppercase tracking-wider mb-4">
            Pregunta {preguntaActual} de {totalPreguntas}
          </p>
          <h3 className="text-xl font-['Space_Grotesk'] font-medium mb-8 text-white">¿Cuántas personas trabajan en tu empresa?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TAMANO_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTamanoSelect(option.value)}
                className="p-5 bg-white/5 border border-white/10 rounded-full hover:bg-[#F99D1C] hover:border-[#F99D1C] hover:text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(249,157,28,0.5)] transition-all duration-300 text-center font-['Space_Grotesk'] font-medium text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preguntas */}
      {step === 'questions' && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] rounded-2xl p-10 shadow-2xl border border-white/10">
          <p className="text-xs text-[#F99D1C] font-['JetBrains_Mono'] uppercase tracking-wider mb-4">
            Pregunta {preguntaActual} de {totalPreguntas}
          </p>
          <h3 className="text-xl font-['Space_Grotesk'] font-medium mb-10 leading-relaxed text-white">
            {GRC_QUESTIONS[currentQuestion].pregunta}
          </h3>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-[#F99D1C] text-black font-['Syne'] font-bold rounded-full hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(249,157,28,0.5)] transition-all duration-300"
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 bg-white/5 border border-white/20 text-white font-['Syne'] font-bold rounded-full hover:bg-[#F99D1C] hover:border-[#F99D1C] hover:text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(249,157,28,0.5)] transition-all duration-300"
            >
              No
            </button>
          </div>
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              }
            }}
            className="w-full py-2 text-gray-500 text-sm font-['Space_Grotesk'] hover:text-gray-300 transition-colors"
          >
            ← Retroceder
          </button>
        </div>
      )}

      {/* Contacto - Estilo minimalista con inputs de borde inferior */}
      {step === 'contact' && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] rounded-2xl p-10 shadow-2xl border border-white/10">
          <p className="text-xs text-[#F99D1C] font-['JetBrains_Mono'] uppercase tracking-wider mb-4">
            Pregunta {preguntaActual} de {totalPreguntas}
          </p>
          <h3 className="text-2xl font-['Syne'] font-bold mb-2 text-white">Último paso</h3>
          <p className="text-sm text-gray-400 mb-10 font-['Space_Grotesk']">Ingresa tus datos para recibir el resultado</p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Input Nombre - estilo minimalista */}
            <div className="relative">
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="peer block w-full py-3 px-0 text-white bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#F99D1C] transition-colors font-['Space_Grotesk']"
                placeholder=" "
              />
              <label
                htmlFor="nombre"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F99D1C] font-['Space_Grotesk']"
              >
                Nombre completo
              </label>
            </div>

            {/* Input Email - estilo minimalista */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer block w-full py-3 px-0 text-white bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#F99D1C] transition-colors font-['Space_Grotesk']"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F99D1C] font-['Space_Grotesk']"
              >
                Email corporativo
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#F99D1C] text-black font-['Syne'] font-bold text-lg rounded-full hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(249,157,28,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-10"
            >
              {isSubmitting ? 'Procesando...' : 'Ver mi Resultado'}
            </button>
          </form>
        </div>
      )}

      {/* Resultado */}
      {step === 'result' && result && (
        <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#283329] text-white rounded-2xl p-10 shadow-2xl border border-white/10 animate-fadeIn">
          {/* Banner de éxito minimalista */}
          <div className="bg-[#F99D1C]/10 border-l-4 border-[#F99D1C] rounded-r-xl p-5 mb-8">
            <p className="text-lg font-bold text-[#F99D1C] font-['Syne']">✓ Diagnóstico completado</p>
            <p className="text-sm text-gray-400 mt-1 font-['Space_Grotesk']">Hemos enviado una copia a tu email</p>
          </div>

          {/* Score minimalista */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-full border-2 border-[#F99D1C] flex items-center justify-center bg-[#F99D1C]/5">
              <span className="text-4xl font-['Syne'] font-black text-[#F99D1C]">{result.score}</span>
            </div>
            <div>
              <p className="text-xl font-bold font-['Syne']">Score de madurez</p>
              <p className="text-sm text-gray-400 font-['Space_Grotesk']">sobre 100 puntos</p>
            </div>
          </div>

          {/* Aplicabilidad minimalista */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <p className="text-xs font-bold mb-4 uppercase tracking-wider text-gray-400 font-['JetBrains_Mono']">Aplicabilidad legal</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-['Space_Grotesk']">Ley 21.663 (Ciberseguridad)</span>
                <span className={`text-xs px-3 py-1 rounded-full ${result.aplicabilidad.ley21663 ? 'bg-[#F99D1C] text-black' : 'bg-white/5 text-gray-500'} font-['Space_Grotesk'] font-medium`}>
                  {result.aplicabilidad.ley21663 ? 'Aplica' : 'No aplica'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-['Space_Grotesk']">Ley 21.719 (Datos Personales)</span>
                <span className={`text-xs px-3 py-1 rounded-full ${result.aplicabilidad.ley21719 ? 'bg-[#F99D1C] text-black' : 'bg-white/5 text-gray-500'} font-['Space_Grotesk'] font-medium`}>
                  {result.aplicabilidad.ley21719 ? 'Aplica' : 'No aplica'}
                </span>
              </div>
            </div>
          </div>

          {/* Exposición minimalista - UTM + CLP */}
          <div className="mb-10">
            <p className="text-xs font-bold mb-3 uppercase tracking-wider text-gray-400 font-['JetBrains_Mono']">Exposición indicativa (P10–P90)</p>
            
            {/* Mostrar en UTM (unidad legal) */}
            <p className="text-3xl font-['Syne'] font-black text-[#F99D1C] mb-1">
              {formatUTM(result.exposicion.p10)} — {formatUTM(result.exposicion.p90)} UTM
            </p>
            
            {/* Equivalente en CLP */}
            <p className="text-sm text-gray-400 font-['Space_Grotesk'] mb-3">
              Equivalente: {formatCLP(result.exposicion.p10)} — {formatCLP(result.exposicion.p90)}
            </p>
            
            <p className="text-xs text-gray-500 font-['Space_Grotesk']">
              Estimación indicativa basada en techos sancionatorios legales y tu score de madurez. No es un informe pericial. Se afina con datos reales en la reunión.
            </p>
          </div>

          {/* CTAs minimalistas */}
          <div className="space-y-4">
            <button
              onClick={() => {
                // Abrir chat con mensaje automático
                const mensaje = `Acabo de completar el diagnóstico GRC. Mi score es ${result.score}/100 y mi sector es ${result.sector}. Me gustaría discutir los resultados con más detalle.`;
                
                window.dispatchEvent(new CustomEvent('openChat', { 
                  detail: { 
                    type: 'grc_followup',
                    initialMessage: mensaje,
                    autoSend: true // Flag para enviar automáticamente
                  } 
                }));
              }}
              className="w-full py-4 bg-[#F99D1C] text-black font-['Syne'] font-bold text-lg rounded-full hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(249,157,28,0.6)] transition-all duration-300"
            >
              ¿Qué significa mi score?
            </button>

            <button
              onClick={() => {
                // Abrir chat para agendar reunión
                window.dispatchEvent(new CustomEvent('openChat', { 
                  detail: { 
                    type: 'schedule_meeting'
                  } 
                }));
              }}
              className="w-full py-4 bg-white/5 border border-white/20 text-white font-['Space_Grotesk'] font-bold text-lg rounded-full hover:bg-[#F99D1C] hover:border-[#F99D1C] hover:text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(249,157,28,0.5)] transition-all duration-300"
            >
              Agendar reunión
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
              className="w-full py-3 bg-white/5 border border-white/20 text-white font-['Space_Grotesk'] font-medium rounded-full hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
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
