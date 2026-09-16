import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface Station {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  showLogo?: boolean;
}

const stations: Station[] = [
  {
    id: 0,
    startTime: 0,
    endTime: 1,
    title: '¿Cumples\ncon la \nnueva ley de datos?',
    subtitle: 'CUMPLIMIENTO · SEGURIDAD · GOBERNANZA',
    description: 'Ley 21.663 y 21.719 ya están vigentes. Las multas por incumplimiento pueden paralizarte. Descubre tu exposición real ahora',
    ctaText: 'Evaluar mi Cumplimiento',
    ctaLink: '/diagnostico-grc',
  },
  {
    id: 1,
    startTime: 1,
    endTime: 2,
    title: 'Datos reales\nBrchas visibles. Ruta clara',
    subtitle: 'DIAGNÓSTICO ESTRATÉGICO',
    description: 'Construimos desde cero con seguridad integrada. Cero brechas de datos, cero caídas por arquitectura frágil.',
    ctaText: 'Ver Ciberseguridad',
    ctaLink: '/proyectos/ciberseguridad-empresarial',
  },
  {
    id: 2,
    startTime: 2,
    endTime: 3,
    title: 'Amenazas\nmodeladas\nCódigo seguro',
    subtitle: 'ARQUITECTURA BLINDADA',
    description: 'Definimos la estructura, clasificamos los datos y blindamos el flujo antes de escribir código. Tu sistema resiste auditorías desde el commit inicial.',
    ctaText: 'Evalúa tu Cumplimiento GRC',
    ctaLink: '/diagnostico-grc',
  },
  {
    id: 3,
    startTime: 3,
    endTime: 4,
    title: 'Velocidad startup\nCalidad enterprise. Gobernanza total',
    subtitle: 'INGENIERÍA ACELERADA',
    description: 'IA para acelerar el desarrollo, con revisiones arquitectónicas y gates de seguridad en cada sprint. Nada llega a producción sin validación humana.',
    ctaText: 'Ver Bodai Clinic',
    ctaLink: '/proyectos/bodai-clinic',
  },
  {
    id: 4,
    startTime: 4,
    endTime: 5,
    title: 'Más conversión\nMenos fugas\nCero deuda técnica',
    subtitle: 'IMPACTO MEDIABLE',
    description: 'Agentes de IA que cualifican leads. Embudos sin fricción. Dashboards que muestran dónde creces y dónde sangras.',
    ctaText: 'Agenda tu Diagnóstico',
    ctaLink: '#contacto',
  },
  {
    id: 5,
    startTime: 5,
    endTime: 6,
    title: '',
    showLogo: true,
    ctaText: 'Conoce tu Exposición Legal',
    ctaLink: '/diagnostico-grc',
  },
];

export function ScrollytellingHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStation, setCurrentStation] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const container = containerRef.current;

    if (!videoElement || !container) return;

    let ticking = false;
    let animationFrameId: number;

    // Esperar a que el video esté listo
    const handleVideoReady = () => {
      setIsVideoReady(true);
    };

    // Verificar si el video ya está cargado
    if (videoElement.readyState >= 1) {
      handleVideoReady();
    } else {
      videoElement.addEventListener('loadedmetadata', handleVideoReady);
    }

    const updateVideoAndStation = () => {
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calcular progreso del scroll (0 a 1)
      const progress = Math.max(
        0,
        Math.min(1, -containerTop / (containerHeight - windowHeight))
      );

      setScrollProgress(progress);

      // Sincronizar video con scroll
      if (videoElement && isVideoReady && videoElement.duration) {
        const videoDuration = videoElement.duration;
        videoElement.currentTime = progress * videoDuration;
      }

      // Determinar estación actual
      const currentTime = progress * 5; // 5 segundos de video
      const stationIndex = stations.findIndex(
        (station) => currentTime >= station.startTime && currentTime < station.endTime
      );

      if (stationIndex !== -1 && stationIndex !== currentStation) {
        setCurrentStation(stationIndex);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(updateVideoAndStation);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar una vez al montar

    return () => {
      window.removeEventListener('scroll', handleScroll);
      videoElement.removeEventListener('loadedmetadata', handleVideoReady);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentStation, isVideoReady]);

  const currentStationData = stations[currentStation];

  return (
    <div ref={containerRef} className="scrollytelling-container">
      <div className="scroll-spacer">
        <div className="sticky-content">
          {/* Video de fondo */}
          <video
            ref={videoRef}
            src="/img/Scrollytelling/Aperca_Video_Scrollytelling.mp4"
            className="fixed-video"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => setIsVideoReady(true)}
          />

          {/* Overlay oscuro para contraste */}
          <div className="video-overlay" />

          {/* Contenido de la estación actual */}
          <div className="stations-content" key={currentStation}>
            {currentStationData.showLogo ? (
              // Estación final: Solo logo y CTA
              <div className="station-final">
                <img
                  src="/img/Logo aperca claro.svg"
                  alt="Áperca SpA"
                  className="logo-aperca"
                />
                {currentStationData.ctaText && (
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('openChat', {
                        detail: { type: 'grc_diagnostic' }
                      }));
                    }}
                    className="cta-button cta-primary"
                  >
                    {currentStationData.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              // Estaciones 0-4: Título + Descripción + CTA (alternando layout)
              <div className="station-content">
                {/* Layout responsive: mobile apilado, desktop vanguardista */}
                <div className="mb-8">
                  {/* Mobile: layout simple apilado */}
                  <div className="block lg:hidden text-center">
                    {currentStationData.subtitle && (
                      <h2 className="text-xs font-['JetBrains_Mono'] font-bold uppercase text-[#F99D1C] mb-4" style={{letterSpacing: '0.02em'}}>
                        {currentStationData.subtitle}
                      </h2>
                    )}
                    <h1 className="text-4xl font-['Syne'] font-black leading-tight text-white mb-2 whitespace-pre-line" style={{letterSpacing: '-0.02em'}}>
                      {currentStationData.title}
                    </h1>
                  </div>

                  {/* Desktop: layout vanguardista alternado */}
                  {(() => {
                    const lines = currentStationData.title.split('\n').filter(l => l.trim());
                    const midPoint = Math.ceil(lines.length / 2);
                    const leftText = lines.slice(0, midPoint).join('\n');
                    const rightText = lines.slice(midPoint).join('\n');
                    
                    return currentStation % 2 === 0 ? (
                      // Estaciones pares: pequeño izquierda, grande derecha
                      <div className="hidden lg:flex items-start gap-6 max-w-6xl mx-auto">
                        <div className="w-1/2 pt-8">
                          {currentStationData.subtitle && (
                            <h2 className="text-xs font-['JetBrains_Mono'] font-bold uppercase text-[#F99D1C] mb-4 text-right pr-4" style={{letterSpacing: '0.02em'}}>
                              {currentStationData.subtitle}
                            </h2>
                          )}
                          <h1 className="text-2xl xl:text-3xl font-['Syne'] font-black leading-tight text-white text-right pr-4 whitespace-pre-line" style={{letterSpacing: '-0.02em'}}>
                            {leftText}
                          </h1>
                        </div>
                        <div className="w-1/2 pt-16">
                          <h1 className="text-5xl xl:text-6xl font-['Syne'] font-black leading-tight text-[#F99D1C] whitespace-pre-line" style={{letterSpacing: '-0.02em'}}>
                            {rightText}
                          </h1>
                        </div>
                      </div>
                    ) : (
                      // Estaciones impares: grande izquierda, pequeño derecha
                      <div className="hidden lg:flex items-start gap-6 max-w-6xl mx-auto">
                        <div className="w-1/2 pt-8">
                          <h1 className="text-5xl xl:text-6xl font-['Syne'] font-black leading-tight text-[#F99D1C] text-right pr-4 whitespace-pre-line" style={{letterSpacing: '-0.02em'}}>
                            {leftText}
                          </h1>
                        </div>
                        <div className="w-1/2 pt-16">
                          {currentStationData.subtitle && (
                            <h2 className="text-xs font-['JetBrains_Mono'] font-bold uppercase text-[#F99D1C] mb-4" style={{letterSpacing: '0.02em'}}>
                              {currentStationData.subtitle}
                            </h2>
                          )}
                          <h1 className="text-2xl xl:text-3xl font-['Syne'] font-black leading-tight text-white whitespace-pre-line" style={{letterSpacing: '-0.02em'}}>
                            {rightText}
                          </h1>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                {/* Descripción centrada */}
                {currentStationData.description && (
                  <p className="station-description">{currentStationData.description}</p>
                )}

                {currentStationData.ctaText && (
                  <>
                    {currentStation === 4 ? (
                      // Estación 4: Abre chat para agendar
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('openChat', { 
                            detail: { type: 'general' } 
                          }));
                        }}
                        className="cta-button cta-secondary"
                      >
                        {currentStationData.ctaText}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      // Todas las demás: link directo
                      <a
                        href={currentStationData.ctaLink}
                        className="cta-button cta-secondary"
                      >
                        {currentStationData.ctaText}
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Indicador de progreso */}
          <div className="progress-indicator">
            <div className="progress-bar" style={{ width: `${scrollProgress * 100}%` }} />
          </div>

          {/* Indicadores de estaciones */}
          <div className="station-dots">
            {stations.map((station, index) => (
              <div
                key={station.id}
                className={`station-dot ${index === currentStation ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
