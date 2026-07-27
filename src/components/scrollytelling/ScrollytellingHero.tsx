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
    title: 'OPERATIONAL FRICTION',
    subtitle: 'SYSTEMS DIAGNOSTIC',
    description: 'Identificamos cuellos de botella operacionales con metodología basada en datos. Diagnóstico técnico que revela oportunidades de automatización y escalabilidad.',
    ctaText: 'Scroll para continuar',
    ctaLink: '#',
  },
  {
    id: 1,
    startTime: 1,
    endTime: 2,
    title: 'Mapeamos arquitectura con inteligencia OSINT',
    description: 'Ingeniería inversa de sistemas legacy. Documentamos flujos críticos sin acceso a código fuente mediante técnicas de reconocimiento técnico.',
    ctaText: 'Ver iDomo',
    ctaLink: '/proyectos/idomo',
  },
  {
    id: 2,
    startTime: 2,
    endTime: 3,
    title: 'Diseñamos sistemas escalables impulsados por IA',
    description: 'Arquitecturas serverless con agentes conversacionales. Stack moderno: Next.js, Convex, Google Gemini. De 0 a producción en semanas, no meses.',
    ctaText: 'Ver MenuClick',
    ctaLink: '/proyectos/menuclick',
  },
  {
    id: 3,
    startTime: 3,
    endTime: 4,
    title: 'Construimos agentes autónomos y arquitecturas serverless',
    description: 'RAG, Vector Search, LLMs en producción. Sistemas que aprenden, responden y convierten. Integración completa con CRM y email automation.',
    ctaText: 'Ver Bodai Clinic',
    ctaLink: '/proyectos/bodai-clinic',
  },
  {
    id: 4,
    startTime: 4,
    endTime: 5,
    title: 'Desbloqueamos conversión y tracción real',
    description: 'Growth engineering: Meta Ads optimizadas, CRO basado en datos, funnels de alta conversión. Métricas que importan: CAC, LTV, conversión.',
    ctaText: 'Ver Casos de Éxito',
    ctaLink: '#casos-exito',
  },
  {
    id: 5,
    startTime: 5,
    endTime: 6,
    title: '',
    showLogo: true,
    ctaText: 'Agenda tu Diagnóstico',
    ctaLink: '#contacto',
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
                  <a
                    href={currentStationData.ctaLink}
                    className="cta-button cta-primary"
                  >
                    {currentStationData.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
              </div>
            ) : (
              // Estaciones 0-4: Título + Descripción + CTA
              <div className="station-content">
                <div className="station-text">
                  {currentStationData.subtitle && (
                    <h2 className="station-subtitle">{currentStationData.subtitle}</h2>
                  )}
                  <h1 className="station-title">{currentStationData.title}</h1>
                  {currentStationData.description && (
                    <p className="station-description">{currentStationData.description}</p>
                  )}
                </div>

                {currentStationData.ctaText && (
                  <a
                    href={currentStationData.ctaLink}
                    className={`cta-button ${
                      currentStation === 0 ? 'cta-scroll' : 'cta-secondary'
                    }`}
                  >
                    {currentStationData.ctaText}
                    {currentStation === 0 ? (
                      <ArrowDown className="w-5 h-5 animate-bounce" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </a>
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
