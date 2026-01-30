"use client";

import { useState, useEffect } from 'react';

export function LanguageSwitch() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [isClient, setIsClient] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Obtener idioma del localStorage o usar español por defecto
    const savedLocale = (localStorage.getItem('locale') as 'es' | 'en') || 'es';
    setLocale(savedLocale);
    
    // Disparar evento personalizado para que la página sepa el idioma actual
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: savedLocale }));
  }, []);

  const toggleLocale = () => {
    setIsChanging(true);
    const newLocale = locale === 'es' ? 'en' : 'es';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Disparar evento para actualizar contenido
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: newLocale }));
    
    // Recargar la página para aplicar el nuevo idioma
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  if (!isClient) {
    return null;
  }

  return (
    <button
      onClick={toggleLocale}
      disabled={isChanging}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-['Poppins'] text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={`Switch to ${locale === 'es' ? 'English' : 'Español'}`}
    >
      {isChanging && (
        <div className="absolute inset-0 bg-[#b80000] animate-pulse flex items-center justify-center">
          <span className="text-white text-xs font-bold">Changing...</span>
        </div>
      )}
      <span className={`text-lg transition-transform duration-300 ${isChanging ? 'scale-110' : 'scale-100'}`}>
        {locale === 'es' ? '🇬🇧' : '🇪🇸'}
      </span>
      <span className="font-bold">{locale === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
