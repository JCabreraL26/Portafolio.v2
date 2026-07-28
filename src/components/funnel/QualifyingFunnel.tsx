import { useState } from 'react';
import { FunnelStep } from './FunnelStep';
import { ProgressIndicator } from './ProgressIndicator';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface FunnelState {
  userType: 'company' | 'recruiter' | null;
  challenge: string | null;
  budgetRange: string | null;
  leadData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  } | null;
}

export function QualifyingFunnel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<FunnelState>({
    userType: null,
    challenge: null,
    budgetRange: null,
    leadData: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitLead = useMutation(api.funnel.submitLead);

  const handleStep1 = (value: string) => {
    setState({ ...state, userType: value as 'company' | 'recruiter' });
    setCurrentStep(2);
  };

  const handleStep2 = (value: string) => {
    setState({ ...state, challenge: value });
    setCurrentStep(3);
  };

  const handleStep3 = (value: string) => {
    setState({ ...state, budgetRange: value });
    setCurrentStep(4);
  };

  const handleStep4 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const leadData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    setState({ ...state, leadData });
    setIsSubmitting(true);

    try {
      await submitLead({
        userType: state.userType!,
        challenge: state.challenge!,
        budgetRange: state.budgetRange!,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSuccess) {
    return (
      <div className="funnel-success">
        <div className="funnel-success-icon">✓</div>
        <h2 className="funnel-success-title">¡Gracias por tu interés!</h2>
        <p className="funnel-success-message">
          Hemos recibido tu solicitud. Te contactaremos pronto para agendar tu diagnóstico estratégico.
        </p>
        <p className="funnel-success-email">
          Revisa tu email: <strong>{state.leadData?.email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="qualifying-funnel">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={4} 
        onBack={currentStep > 1 ? handleBack : undefined}
      />

      {currentStep === 1 && (
        <FunnelStep
          stepNumber={1}
          title="¿Quién eres?"
          options={[
            { label: "Soy empresa, busco soluciones", value: "company", icon: "🏢" },
            { label: "Soy reclutador, busco talento", value: "recruiter", icon: "👔" }
          ]}
          onSelect={handleStep1}
        />
      )}

      {currentStep === 2 && (
        <FunnelStep
          stepNumber={2}
          title="¿Cuál es tu desafío principal?"
          options={[
            { label: "Automatización/IA", value: "automation", icon: "🤖" },
            { label: "Desarrollo MVP desde cero", value: "mvp", icon: "🚀" },
            { label: "Rediseño UX/CRO", value: "ux", icon: "🎨" },
            { label: "Consultoría OSINT/Datos", value: "osint", icon: "🔍" },
            { label: "DevSecOps/Seguridad", value: "security", icon: "🔒" }
          ]}
          onSelect={handleStep2}
        />
      )}

      {currentStep === 3 && (
        <FunnelStep
          stepNumber={3}
          title="¿Cuál es tu rango de presupuesto?"
          options={[
            { label: "$3k - $10k USD", value: "3k-10k", icon: "💰" },
            { label: "$10k - $30k USD", value: "10k-30k", icon: "💎" },
            { label: "$30k+ USD", value: "30k+", icon: "🏆" },
            { label: "Aún no lo sé", value: "unknown", icon: "🤔" }
          ]}
          onSelect={handleStep3}
        />
      )}

      {currentStep === 4 && (
        <div className="funnel-step">
          <div className="funnel-step-header">
            <span className="funnel-step-number">Paso 4</span>
            <h2 className="funnel-step-title">Cuéntanos más sobre tu proyecto</h2>
          </div>

          <form className="funnel-form" onSubmit={handleStep4}>
            <div className="funnel-form-group">
              <label htmlFor="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Tu nombre"
              />
            </div>

            <div className="funnel-form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="funnel-form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="funnel-form-group">
              <label htmlFor="message">Cuéntanos sobre tu proyecto *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Describe brevemente tu desafío o proyecto..."
              />
            </div>

            <button 
              type="submit" 
              className="funnel-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Agendar Diagnóstico Estratégico'}
            </button>

            <p className="funnel-form-note">
              * Al enviar, aceptas que te contactemos para agendar una reunión de diagnóstico de 30 minutos.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
