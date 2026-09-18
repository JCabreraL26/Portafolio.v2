import { useEffect, useRef, useState } from 'react';

interface Chapter {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  subtitle?: string;
  body: string;
}

const chapters: Chapter[] = [
  {
    id: 0,
    startTime: 0,
    endTime: 1,
    subtitle: 'EL PROBLEMA',
    title: 'Sin respaldo local',
    body: 'Mis clientes no tenían respaldo de sus datos críticos. Dependencia total de la nube. Sin control sobre su información más importante.',
  },
  {
    id: 1,
    startTime: 1,
    endTime: 2,
    subtitle: 'LA IDEA',
    title: 'Reutilizar hardware',
    body: 'Por curiosidad, convertimos una laptop de RAM limitada en servidor "casero". Utilizamos Debian como Sistema Operativo para experimentar con proyectos de Redes, Backend y Ciberseguridad',
  },
  {
    id: 2,
    startTime: 2,
    endTime: 3,
    subtitle: 'LA CONSTRUCCIÓN',
    title: 'Arquitectura modular',
    body: 'Usamos Docker para aislar servicios, PostgreSQL para persistencia y Nginx como proxy. Todo contenerizado. Replicable para cualquier proyecto.',
  },
  {
    id: 3,
    startTime: 3,
    endTime: 4,
    subtitle: 'EL PROCESO',
    title: 'IA como copiloto',
    body: 'Configuramos servidor mediante conexión remota por SSH. Implementamos Scripts Bash automatizados. Firewall UFW configurado. Testing con curl. IA ayudando en cada paso, acelerando tiempo de configuración.',
  },
  {
    id: 4,
    startTime: 4,
    endTime: 5,
    subtitle: 'EL RESULTADO',
    title: 'Servidor funcionando 24/7',
    body: 'Respaldo continuo de datos. Cumplimiento con normativas. Cero dependencia de la nube. Control total sobre la información crítica.',
  },
];

export function LaboratorioScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
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

          // Determinar capítulo actual
          const totalChapters = chapters.length;
          const chapterIndex = Math.min(
            totalChapters - 1,
            Math.floor(progress * totalChapters)
          );
          setCurrentChapter(chapterIndex);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentChapterData = chapters[currentChapter];

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${chapters.length * 100}vh` }}
    >
      {/* Fondo fijo oscuro */}
      <div className="sticky top-0 h-screen w-full bg-[#0A0A0A] overflow-hidden">
        {/* Contenido del capítulo - CENTRADO */}
        <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-16">
          <div 
            className="max-w-3xl text-center"
            style={{
              transform: `translateX(${(1 - scrollProgress * chapters.length + currentChapter) * 50}px)`,
              opacity: Math.min(1, (scrollProgress * chapters.length - currentChapter) * 2),
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
          >
            {currentChapterData.subtitle && (
              <p 
                className="text-xs font-['JetBrains_Mono'] font-bold uppercase text-[#F99D1C] mb-4"
                style={{ letterSpacing: '0.02em' }}
              >
                {currentChapterData.subtitle}
              </p>
            )}
            
            <h2 
              className="text-3xl sm:text-4xl font-['Syne'] font-black text-white mb-6 leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              {currentChapterData.title}
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, letterSpacing: '0.02em' }}>
              {currentChapterData.body}
            </p>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {chapters.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentChapter 
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
