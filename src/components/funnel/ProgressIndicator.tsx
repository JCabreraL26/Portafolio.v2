import { ArrowLeft } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export function ProgressIndicator({ currentStep, totalSteps, onBack }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-indicator">
      <div className="progress-indicator-header">
        {currentStep > 1 && onBack && (
          <button 
            className="progress-back-button" 
            onClick={onBack}
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <span className="progress-text">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
