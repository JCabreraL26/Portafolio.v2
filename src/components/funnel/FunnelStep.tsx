import { useState } from 'react';

interface FunnelStepProps {
  stepNumber: number;
  title: string;
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  onSelect: (value: string) => void;
}

export function FunnelStep({ stepNumber, title, options, onSelect }: FunnelStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    // Pequeño delay para mostrar la selección antes de avanzar
    setTimeout(() => {
      onSelect(value);
    }, 300);
  };

  return (
    <div className="funnel-step">
      <div className="funnel-step-header">
        <span className="funnel-step-number">Paso {stepNumber}</span>
        <h2 className="funnel-step-title">{title}</h2>
      </div>

      <div className="funnel-options">
        {options.map((option) => (
          <button
            key={option.value}
            className={`funnel-option ${selected === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.icon && <span className="funnel-option-icon">{option.icon}</span>}
            <span className="funnel-option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
