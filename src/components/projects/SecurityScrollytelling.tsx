import { useEffect, useRef, useState } from 'react';

interface SecurityCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

const securityStories: SecurityCard[] = [
  {
    id: 1,
    title: 'Una brecha es una multa cuantiosa',
    subtitle: 'EL PROBLEMA',
    description: 'El 60% de las PYMES cierran en 6 meses tras una brecha de seguridad. Filtración de datos = reputación destruida + multas millonarias + pérdida total de confianza.',
  },
  {
    id: 2,
    title: 'Sabemos exactamente dónde eres vulnerable',
    subtitle: 'ANÁLISIS',
    description: 'Identificación científica de riesgos: puertos expuestos, APIs sin sanitizar, bases de datos accesibles. Conoces tus puntos débiles antes que los hackers.',
  },
  {
    id: 3,
    title: 'Atacamos tu sistema antes que los criminales',
    subtitle: 'PENTESTING',
    description: 'Ethical hacking con metodología certificada. Cisco Network Basics certified, en formación continua con Kali Linux y herramientas enterprise.',
  },
  {
    id: 4,
    title: 'Cumplimiento legal garantizado',
    subtitle: 'NORMATIVAS',
    description: 'Ley 21.663 y 21.719. Conocimiento profundo de normativas chilenas. Evitas multas y sanciones legales. Documentación lista para auditorías.',
  },
  {
    id: 5,
    title: 'Protección real: Bodai Clinic',
    subtitle: 'CASO REAL',
    description: 'Estándares OSSTMM y NIST para proteger datos de 1,200+ pacientes. Cero brechas, cero multas, cero riesgo legal. Servidor local 24/7.',
  },
  {
    id: 6,
    title: '¿Cuánto te costaría una brecha?',
    subtitle: 'TU TURNO',
    description: 'Diagnóstico GRC en 5 minutos: descubre tu exposición real en UTM. Sin compromiso, solo claridad sobre tu nivel de riesgo.',
  },
];

export function SecurityScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const containerHeight = container.offsetHeight;
          const viewportHeight = window.innerHeight;
          
          // Calcular progreso del scroll (0 a 1)
          const scrollStart = -rect.top;
          const scrollRange = containerHeight - viewportHeight;
          const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));
          
          setScrollProgress(progress);

          // Determinar card actual
          const totalCards = securityStories.length;
          const cardIndex = Math.min(
            totalCards - 1,
            Math.floor(progress * totalCards)
          );
          setCurrentCard(cardIndex);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStory = securityStories[currentCard];

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${securityStories.length * 100}vh` }}
    >
      {/* Contenedor sticky - Sin fondo propio, usa el fixed del hero */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Contenido del card - CENTRADO */}
        <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-16">
          <div 
            className="max-w-4xl"
            style={{
              transform: `translateX(${(1 - scrollProgress * securityStories.length + currentCard) * 30}px)`,
              opacity: Math.min(1, (scrollProgress * securityStories.length - currentCard) * 2),
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
          >
            {/* Card con blur ligero - Fondo más opaco para legibilidad */}
            <div className="bg-[#0A0A0A]/85 backdrop-blur-md rounded-2xl p-10 sm:p-12 border border-white/20">
              <p 
                className="text-xs font-['JetBrains_Mono'] font-bold uppercase text-white mb-4 tracking-wider"
              >
                {currentStory.subtitle}
              </p>
              
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-['Syne'] font-black text-white mb-6 leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {currentStory.title}
              </h2>
              
              <p className="text-lg sm:text-xl text-white leading-relaxed font-['Space_Grotesk'] font-medium">
                {currentStory.description}
              </p>

              {/* CTA en última card */}
              {currentCard === securityStories.length - 1 && (
                <a
                  href="/diagnostico-grc"
                  className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-[#F99D1C] text-black font-['Syne'] font-bold text-lg rounded-full hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <span>Comenzar Diagnóstico</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {securityStories.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentCard 
                  ? 'w-12 bg-[#F99D1C]' 
                  : 'w-8 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
