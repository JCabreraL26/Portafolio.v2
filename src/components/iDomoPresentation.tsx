"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IDomoPresentationProps {
  liveCount?: number;
}

export function IDomoPresentation({ liveCount = 12 }: IDomoPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 9;

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, nextSlide, prevSlide]);

  // Touch/Swipe gestures para mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
      }
      if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, nextSlide, prevSlide]);

  return (
    <div className="relative h-screen w-full bg-[#0A0E27] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentSlide === 0 && <Slide1 liveCount={liveCount} />}
          {currentSlide === 1 && <VideoSlide />}
          {currentSlide === 2 && <Slide2 />}
          {currentSlide === 3 && <Slide3 />}
          {currentSlide === 4 && <Slide4 />}
          {currentSlide === 5 && <Slide5 />}
          {currentSlide === 6 && <Slide6 />}
          {currentSlide === 7 && <Slide7 />}
          {currentSlide === 8 && <Slide8 goToSlide={goToSlide} />}
        </motion.div>
      </AnimatePresence>

      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2 sm:p-3 transition-all hover:scale-110"
          style={{ background: "rgba(0, 217, 255, 0.1)", backdropFilter: "blur(10px)" }}
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#00D9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2 sm:p-3 transition-all hover:scale-110"
          style={{ background: "rgba(0, 217, 255, 0.1)", backdropFilter: "blur(10px)" }}
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#00D9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
          >
            <div
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#00D9FF] scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-[#00D9FF] animate-ping opacity-75" />
            )}
          </button>
        ))}
      </div>

      <div className="absolute top-8 left-8 z-50 text-white/50 font-mono text-sm">
        {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
      </div>
    </div>
  );
}

// SLIDE 1: Hero - Bienvenidos a iDomo
function Slide1({ liveCount }: { liveCount: number }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/img/iDomo hero 1.jpg"
          alt="iDomo Smart Building"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Gradient Overlay - Menos opaco */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A0E27]/70 via-[#0D1117]/60 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-6"
        >
          <img 
            src="/img/idomo-logo-celeste.png" 
            alt="iDomo Logo" 
            className="h-16 sm:h-24 md:h-28 mx-auto mb-3 sm:mb-4"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3"
        >
          Bienvenidos a <span className="text-[#00D9FF]">iDomo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#00D9FF] mb-2 sm:mb-3"
        >
          El futuro es más simple
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm sm:text-base md:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
        >
          Modernizamos la gestión de conserjería con tecnología QR, eliminando papeles, reduciendo tiempos y mejorando la experiencia de todos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6 px-4"
        >
          <a
            href="https://idomo.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-[#0A0E27] shadow-2xl transition-all hover:scale-105 hover:shadow-[#00D9FF]/50 w-full sm:w-auto justify-center"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Ver Demo en Vivo</span>
          </a>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openChat', {
                detail: { type: 'schedule_meeting' }
              }));
            }}
            className="group inline-flex items-center gap-2 rounded-lg px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-white transition-all hover:scale-105 w-full sm:w-auto justify-center cursor-pointer"
            style={{ background: "rgba(0, 217, 255, 0.1)", backdropFilter: "blur(10px)", border: "2px solid rgba(0, 217, 255, 0.3)" }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Agendar Reunión</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-3 text-white/60 text-sm"
        >
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D9FF] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00D9FF]"></span>
          </div>
          <span className="font-mono font-semibold text-white">{liveCount}</span>
          <span className="hidden sm:inline">edificios usando el sistema</span>
          <span className="sm:hidden">edificios activos</span>
        </motion.div>
      </div>
    </div>
  );
}

// SLIDE 2: Video de Promoción
function VideoSlide() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0D1117] to-[#0A0E27]">
        {/* Video Container con Thumbnail */}
        <div className="relative w-full h-full">
          {/* Thumbnail de Vimeo */}
          <div className="absolute inset-0">
            <img 
              src="https://vumbnail.com/1175745019.jpg" 
              alt="iDomo - Video de Promoción" 
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Contenido centrado con ajuste para flechas */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center max-w-4xl mx-auto px-8 sm:px-12">
              {/* Título */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 sm:mb-8"
              >
                Gestión smart de comunidades
              </motion.h2>
              
              {/* Botón Play centrado */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-[#00D9FF] rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-[#00BCD4] transition-all duration-300 relative mx-auto"
              >
                {/* Efecto de pulse */}
                <div className="absolute inset-0 rounded-full border-4 border-[#00D9FF]/30 animate-ping"></div>
                {/* Icono play */}
                <svg className="w-8 h-8 sm:w-10 sm:h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </motion.button>
              
              {/* Bajada */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl text-white/80 mt-8 sm:mt-12 max-w-2xl mx-auto"
              >
                Dale play y mira cómo funciona. Del caos del papel al orden digital.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Fullscreen para el video */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Contenido del modal */}
          <div className="relative w-[90%] max-w-5xl aspect-video">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute -top-14 right-0 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video Container */}
            <div className="w-full h-full bg-black rounded-lg overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/1175745019?autoplay=1&quality=1080p&controls=1&title=0&byline=0&portrait=0&h=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// SLIDE 3: El Problema del Papel (antes Slide 2)
function Slide2() {
  const problems = [
    {
      title: "El problema del papel",
      text: "Los libros de visitas físicos son vulnerables, inseguros y difíciles de auditar. En caso de incidentes, la información resulta inútil."
    }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0D1117] to-[#0A0E27]">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
            El futuro es más simple
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Cuadro 1: El problema del papel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-red-500/30 transition-all"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              El problema del papel
            </h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Los libros de visitas físicos son vulnerables, inseguros y difíciles de auditar. En caso de incidentes, la información resulta inútil.
            </p>
          </motion.div>

          {/* Cuadro 2: La solución digital */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#00D9FF]/30 transition-all"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              La solución digital
            </h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Registros electrónicos seguros, legibles y accesibles desde cualquier dispositivo. Toda la información organizada y protegida.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 3: El Poder del QR Seguro
function Slide3() {
  const qrFeatures = [
    {
      icon: '🔐',
      title: 'Firma electrónica',
      subtitle: 'HM/AC-SHA256',
      description: 'Cada código es único e inviolable'
    },
    {
      icon: '⏱️',
      title: 'Espiración',
      subtitle: 'automática',
      description: 'Valida por tiempo limitado'
    },
    {
      icon: '🏦',
      title: 'Seguridad de',
      subtitle: 'nivel bancario',
      description: 'Para la tranquilidad de tu hogar'
    }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0D1117] to-[#0A0E27]">
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            El poder del QR seguro
          </h2>
          <p className="text-white/60 text-xs sm:text-sm">
            Validación criptográfica en 2 segundos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {qrFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-linear-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 sm:p-5 hover:border-green-500/40 hover:from-green-500/20 hover:to-green-600/10 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 flex items-center justify-center rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-all">
                  <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-sm sm:text-base mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-green-400 font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2">
                  {feature.subtitle}
                </p>
                <p className="text-white/60 text-xs leading-snug">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 4: Visual Break - App Showcase (Solo Imágenes)
function Slide4() {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0D1117] to-[#0A0E27] overflow-hidden">
      {/* Contenedor principal - Grid horizontal con superposición */}
      <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-6 py-8">
        
        {/* Contenedor de las 3 imágenes con posicionamiento relativo */}
        <div className="relative flex items-center justify-center w-full max-w-6xl">
          
          {/* Imagen secundaria izquierda - Dashboard Conserje (atrás) */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute left-0 sm:left-8 md:left-12 lg:left-16 z-10 w-32 sm:w-40 md:w-48 lg:w-56"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 transition-all hover:scale-105 opacity-80 hover:opacity-100">
              <img
                src="/img/iDomo dashboard conserje 2.jpeg"
                alt="Dashboard Conserje"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Imagen principal central - Auth (sobrepuesta/adelante) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative z-30 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-[#00D9FF]/50 hover:border-[#00D9FF]/80 transition-all hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-t from-[#00D9FF]/20 to-transparent pointer-events-none" />
              <img
                src="/img/iDomo Auth.jpeg"
                alt="iDomo Authentication"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Imagen secundaria derecha - Dashboard Residente (atrás) */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute right-0 sm:right-8 md:right-12 lg:right-16 z-10 w-32 sm:w-40 md:w-48 lg:w-56"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 transition-all hover:scale-105 opacity-80 hover:opacity-100">
              <img
                src="/img/iDomo dashboard residente 1.jpeg"
                alt="Dashboard Residente"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Efecto de brillo sutil en el fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00D9FF08_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
}

// SLIDE 5: Para Administradores - Control Total
function Slide5() {
  const adminFeatures = [
    {
      title: 'Auditoría completa de accesos',
      description: 'Política RBAC permite control total y gestión eficaz de procesos cotidianos de comunidad'
    },
    {
      title: 'Métricas avanzadas de flujo',
      description: 'Analiza patrones de visitantes, horarios pico y comportamiento para optimizar recursos y seguridad'
    }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      {/* Background Image - Administrador */}
      <div className="absolute inset-0">
        <img
          src="/img/iDomo administrador.jpg"
          alt="Administrador iDomo"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A0E27]/85 via-[#1A0E32]/75 to-[#0A0E27]/90" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-5 sm:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            Para administradores
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            Control total de tu comunidad desde cualquier lugar
          </p>
        </motion.div>

        {/* Layout vertical: 2 cards */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {adminFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              className="bg-white/5 backdrop-blur-sm border border-[#00D9FF]/20 rounded-2xl p-4 sm:p-5 hover:border-[#00D9FF]/40 hover:bg-white/10 transition-all"
            >
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 6: Para Conserjes - Trabajo Simplificado
function Slide6() {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0A2317] to-[#0A0E27] overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            Para Conserjes
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Trabajo simplificado, resultados profesionales
          </p>
        </motion.div>

        {/* Layout vertical: Imagen arriba, Card abajo */}
        <div className="flex flex-col items-center gap-5 sm:gap-6">
          
          {/* Imagen del conserje */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-48 sm:w-56 md:w-64"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:scale-105">
              <img
                src="/img/iDomo conserje-moderno.jpg"
                alt="Conserje iDomo"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Card de beneficios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-5 sm:p-6 hover:border-green-500/40 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl sm:text-5xl">⚡</div>
              <h3 className="text-white font-bold text-lg sm:text-xl">Trabajo Ultra Rápido</h3>
            </div>
            <p className="text-white/60 text-sm sm:text-base mb-4">
              85% menos tiempo en registros diarios
            </p>
            <div className="space-y-2.5 sm:space-y-3">
              <p className="text-white/80 text-sm sm:text-base flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Escaneo QR en 30 segundos</span>
              </p>
              <p className="text-white/80 text-sm sm:text-base flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Búsqueda instantánea de residentes</span>
              </p>
              <p className="text-white/80 text-sm sm:text-base flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <span>Registro automático de paquetes</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 7: Para Residentes - Comodidad Total
function Slide7() {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-linear-to-br from-[#0A0E27] via-[#0A1732] to-[#0A0E27]">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            Para Residentes
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-2">
            Comodidad y control desde tu móvil
          </p>
        </motion.div>

        {/* Layout horizontal: 2 cards lado a lado */}
        <div className="flex flex-row items-stretch justify-center gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 max-w-sm bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5 sm:p-6 hover:border-blue-500/40 hover:bg-white/10 transition-all"
          >
            <div className="text-5xl sm:text-6xl mb-4">🔲</div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-3">Preregistro mediante QR</h3>
            <p className="text-white/70 text-sm sm:text-base mb-4">
              Genera códigos QR para tus visitas desde tu móvil
            </p>
            <div className="space-y-2">
              <p className="text-white/60 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>QR único y seguro por visita</span>
              </p>
              <p className="text-white/60 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Acceso instantáneo sin papeles</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 max-w-sm bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5 sm:p-6 hover:border-blue-500/40 hover:bg-white/10 transition-all"
          >
            <div className="text-5xl sm:text-6xl mb-4">📅</div>
            <h3 className="text-white font-bold text-lg sm:text-xl mb-3">Reserva de Espacios Comunes</h3>
            <p className="text-white/70 text-sm sm:text-base mb-4">
              Agenda quincho, salón de eventos y áreas comunes
            </p>
            <div className="space-y-2">
              <p className="text-white/60 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Disponibilidad en tiempo real</span>
              </p>
              <p className="text-white/60 text-xs sm:text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Confirmación instantánea</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 8: CTA Final - Transforma la Seguridad
function Slide8({ goToSlide }: { goToSlide: (index: number) => void }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      {/* Background Image - Mujer Digital */}
      <div className="absolute inset-0">
        <img
          src="/img/iDomo mujer digital.jpg"
          alt="Digital Woman Technology"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Gradient Overlay - Menos opaco */}
      <div className="absolute inset-0 bg-linear-to-br from-[#00D9FF]/60 via-[#00BCD4]/50 to-[#0097A7]/60" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6"
        >
          Transforma la seguridad de tu edificio
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10"
        >
          Cero papeles. Cero errores. Cero complicaciones.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 px-4"
        >
          <a
            href="https://idomo.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-[#00D9FF] shadow-2xl transition-all hover:scale-105"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Ver Demo en Vivo</span>
          </a>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openChat', {
                detail: { type: 'schedule_meeting' }
              }));
            }}
            className="group inline-flex items-center justify-center gap-2 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white transition-all hover:scale-105 cursor-pointer"
            style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", border: "2px solid rgba(255, 255, 255, 0.3)" }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Agendar Reunión</span>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs sm:text-sm text-white/80 mb-6"
        >
          ✨ Prueba 30 días gratis • 🚀 Implementación en 48 horas • 💯 Soporte dedicado
        </motion.p>

        {/* Botón para regresar al inicio */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={() => goToSlide(0)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-all hover:text-white hover:scale-105"
          style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Volver al inicio</span>
        </motion.button>
      </div>
    </div>
  );
}
