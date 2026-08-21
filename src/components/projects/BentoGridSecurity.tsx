import { useState, useEffect } from 'react';

interface BentoCard {
  id: number;
  size: 'small' | 'medium' | 'large';
  title: string;
  subtitle?: string;
  description: string;
  bgColor: string;
  textColor: string;
  hasImage?: boolean;
  imagePlaceholder?: string;
  icon?: string;
}

const cards: BentoCard[] = [
  {
    id: 1,
    size: 'large',
    title: 'Una brecha de datos puede destruir tu empresa en 48 horas',
    subtitle: 'PROBLEMA REAL',
    description: 'El 60% de las PYMES cierran en 6 meses tras una brecha de seguridad. Una filtración de datos de clientes destruye tu reputación, genera multas millonarias y pérdida total de confianza.',
    bgColor: 'bg-[#0A0A0A]',
    textColor: 'text-white',
    hasImage: true,
    imagePlaceholder: 'surface-attack',
  },
  {
    id: 2,
    size: 'medium',
    title: 'Protección de Datos de Pacientes: Cumplimiento Legal Total',
    subtitle: 'CASO BODAI CLINIC',
    description: 'Implementamos estándares OSSTMM y NIST nivel empresarial para proteger datos sensibles de 1,200+ pacientes. Cero brechas, cero multas, cero riesgo legal.',
    bgColor: 'bg-white',
    textColor: 'text-[#0A0A0A]',
    icon: 'shield',
  },
  {
    id: 3,
    size: 'medium',
    title: 'Sabemos exactamente dónde eres vulnerable',
    subtitle: 'ANÁLISIS DE SUPERFICIE DE ATAQUE',
    description: 'Identificación científica de riesgos: puertos expuestos, APIs sin sanitizar, bases de datos accesibles. Conoces tus puntos débiles antes que los hackers.',
    bgColor: 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C42]',
    textColor: 'text-white',
    hasImage: true,
    imagePlaceholder: 'kali-analysis',
  },
  {
    id: 4,
    size: 'small',
    title: 'Atacamos tu sistema antes que los criminales',
    subtitle: 'PENTESTING ÉTICO',
    description: 'Ethical hacking con metodología certificada. Cisco Network Basics certified, en formación continua con Kali Linux.',
    bgColor: 'bg-[#0A0A0A]',
    textColor: 'text-white',
    icon: 'bug',
  },
  {
    id: 5,
    size: 'small',
    title: 'Ley de Protección de Datos: Cumplimiento Garantizado',
    subtitle: 'CUMPLIMIENTO NORMATIVO',
    description: 'Conocimiento profundo de normativas chilenas e internacionales. Evitas multas y sanciones legales.',
    bgColor: 'bg-white',
    textColor: 'text-[#0A0A0A]',
    icon: 'scale',
  },
  {
    id: 6,
    size: 'medium',
    title: 'Documentación que Auditores Aprueban',
    subtitle: 'ESTÁNDARES ENTERPRISE',
    description: 'Estándares OSSTMM + NIST: superficie de ataque documentada, riesgos cuantificados científicamente. Pasas auditorías sin estrés.',
    bgColor: 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C42]',
    textColor: 'text-white',
    icon: 'document',
  },
  {
    id: 7,
    size: 'small',
    title: 'Vigilancia 24/7 de Amenazas',
    subtitle: 'MONITOREO CONTINUO',
    description: 'Hardening de APIs, cifrado AES-256, sanitización de inputs. Duermes tranquilo sabiendo que estás protegido.',
    bgColor: 'bg-[#0A0A0A]',
    textColor: 'text-white',
    icon: 'eye',
  },
  {
    id: 8,
    size: 'large',
    title: '¿Cuánto te costaría una brecha de datos?',
    subtitle: 'DIAGNÓSTICO GRATUITO',
    description: 'Identificamos tus 3 vulnerabilidades críticas en 72 horas. Sin compromiso, solo claridad sobre tu nivel de riesgo real.',
    bgColor: 'bg-gradient-to-br from-[#b80000] to-[#8B0000]',
    textColor: 'text-white',
    icon: 'alert',
  },
];

const icons = {
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  bug: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  scale: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  eye: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  alert: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export function BentoGridSecurity() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'medium':
        return 'md:col-span-1 md:row-span-2';
      case 'small':
        return 'md:col-span-1 md:row-span-1';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`
            ${getSizeClasses(card.size)}
            ${card.bgColor}
            ${card.textColor}
            rounded-2xl p-6 md:p-8
            transition-all duration-300 ease-out
            hover:scale-[1.02] hover:shadow-2xl
            cursor-pointer
            overflow-hidden
            relative
            group
          `}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Icon */}
          {card.icon && (
            <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {icons[card.icon as keyof typeof icons]}
            </div>
          )}

          {/* Image Placeholder */}
          {card.hasImage && (
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">
            {card.subtitle && (
              <p className="text-xs font-bold tracking-wider mb-2 opacity-70">
                {card.subtitle}
              </p>
            )}
            <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
              {card.title}
            </h3>
            <p className="text-sm md:text-base opacity-80 leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* CTA for card 8 */}
          {card.id === 8 && (
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openChat', { 
                  detail: { type: 'general' } 
                }));
              }}
              className="mt-6 px-6 py-3 bg-white text-[#b80000] font-bold rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Solicitar Auditoría
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
