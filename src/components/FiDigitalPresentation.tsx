"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FiDigitalPresentationProps {
  liveCount?: number;
}

export function FiDigitalPresentation({ liveCount = 4 }: FiDigitalPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 8;

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

  // Keyboard navigation
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

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Slides Container */}
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
          {currentSlide === 1 && <Slide2 />}
          {currentSlide === 2 && <Slide3 />}
          {currentSlide === 3 && <Slide4 />}
          {currentSlide === 4 && <Slide5 />}
          {currentSlide === 5 && <Slide6 />}
          {currentSlide === 6 && <Slide7 />}
          {currentSlide === 7 && <Slide8 />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-3 transition-all hover:scale-110"
          style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}
        >
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-3 transition-all hover:scale-110"
          style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}
        >
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Slide Indicators (Dots) */}
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
                  ? "bg-primary scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            )}
          </button>
        ))}
      </div>

      {/* Slide Number */}
      <div className="absolute top-8 left-8 z-50 text-white/50 font-mono text-sm">
        {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
      </div>
    </div>
  );
}

// SLIDE 1: Hero
function Slide1({ liveCount }: { liveCount: number }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-br from-black via-black to-orange-950/20">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-4 sm:mb-6"
        >
          Fi<span className="text-primary">Digital</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-serif text-white/90 mb-3 sm:mb-4"
        >
          La fila virtual que tus clientes van a
        </motion.p>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gradient text-gradient-animated mb-8 sm:mb-12"
        >
          AGRADECER
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-8 sm:mb-12 max-w-3xl mx-auto px-4"
        >
          Sistema de gestión de filas en tiempo real. Sin apps, sin instalaciones.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-2 sm:gap-3 text-white/60 text-sm sm:text-base px-4"
        >
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </div>
          <span className="font-mono font-semibold text-white">{liveCount}</span>
          <span className="hidden sm:inline">personas usando el sistema ahora</span>
          <span className="sm:hidden">usando ahora</span>
        </motion.div>
      </div>
    </div>
  );
}

// SLIDE 2: El Problema
function Slide2() {
  const problems = [
    { emoji: '😤', text: 'Clientes preguntando "¿cuánto falta?" cada 5 min' },
    { emoji: '🧍', text: 'Personas esperando de pie, incómodas' },
    { emoji: '💸', text: 'Pierdes clientes por tiempos de espera' },
    { emoji: '😰', text: 'Caos total en horas punta' }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-red-950/40 to-black">
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            El Problema
          </h2>
          <div className="h-1 w-20 bg-red-500 mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                <span className="text-5xl font-black text-red-500/30 group-hover:text-red-500/50 transition-colors">
                  {index + 1}
                </span>
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl sm:text-3xl">{problem.emoji}</span>
                </div>
                <p className="text-white text-sm sm:text-base font-medium leading-tight">
                  {problem.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 3: La Solución
function Slide3() {
  const solutions = [
    { icon: '📱', title: 'Tiempo Real', text: 'Ve tu turno desde el celular' },
    { icon: '☕', title: 'Espera Libre', text: 'Café, auto o casa' },
    { icon: '🔔', title: 'Alertas Smart', text: 'Te avisa cuando faltan 2 turnos' },
    { icon: '😊', title: 'Más Clientes', text: 'Clientes felices regresan' }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-orange-950/30 to-black">
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            La Solución
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className="group"
            >
              <div className="relative h-full min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/50 hover:from-primary/20 hover:to-primary/10 transition-all cursor-pointer">
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {solution.icon}
                </div>
                
                <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                  {solution.title}
                </h3>
                
                <p className="text-white/70 text-xs sm:text-sm leading-tight">
                  {solution.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 4: Características
function Slide4() {
  const features = [
    { emoji: '⚡', title: "Tiempo Real", color: "text-primary" },
    { emoji: '📲', title: "Zero Apps", color: "text-blue-400" },
    { emoji: '📸', title: "QR Rápido", color: "text-amber-400" },
    { emoji: '📊', title: "Analytics", color: "text-green-400" }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-black/90">
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-white text-center mb-12"
        >
          ¿Por qué FiDigital?
        </motion.h2>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 max-w-md mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.2 + index * 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="flex flex-col items-center group"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 group-hover:border-primary/50 transition-colors" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform">
                    {feature.emoji}
                  </span>
                </div>
              </div>
              
              <h3 className={`text-lg sm:text-xl font-bold ${feature.color} text-center`}>
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/50 text-sm mt-12"
        >
          Todo lo que necesitas en una plataforma
        </motion.p>
      </div>
    </div>
  );
}

// SLIDE 5: Investigación UX
function Slide5() {
  const research = [
    { icon: '🎯', title: 'Observación Directa', items: ['5 barberías visitadas', 'Flujos de trabajo mapeados', 'Puntos de fricción identificados'] },
    { icon: '💬', title: 'Entrevistas', items: ['8 barberos profesionales', '15 clientes frecuentes', '3 dueños de barberías'] },
    { icon: '📊', title: 'Hallazgos Clave', items: ['12 llamadas/día por turnos', '30% abandona sin servicio', '45min perdidos en gestión'] }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Investigación UX
          </h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {research.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="text-4xl mb-4 text-center">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-4 text-center">{item.title}</h3>
              <ul className="space-y-2">
                {item.items.map((point, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-purple-400 mt-1">→</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 6: Usuarios
function Slide6() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-blue-950/20 to-black">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Dos Usuarios, Un Objetivo
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="text-6xl mb-4 text-center">👨‍💼</div>
            <h3 className="text-white font-bold text-2xl mb-2 text-center">El Cliente</h3>
            <p className="text-white/60 text-sm mb-4 text-center">Profesional ocupado, 25-45 años</p>
            <div className="space-y-2">
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Saber cuánto tiempo esperará</span>
              </p>
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Poder salir y volver a tiempo</span>
              </p>
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Experiencia simple, sin apps</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="text-6xl mb-4 text-center">✂️</div>
            <h3 className="text-white font-bold text-2xl mb-2 text-center">El Barbero</h3>
            <p className="text-white/60 text-sm mb-4 text-center">Profesional, 28-50 años</p>
            <div className="space-y-2">
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Concentrarse en su trabajo</span>
              </p>
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Ver quién sigue en la cola</span>
              </p>
              <p className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Herramienta profesional y rápida</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// SLIDE 7: Tecnología
function Slide7() {
  const tech = [
    { icon: '⚛️', title: 'Next.js 16', desc: 'Framework React con Server Components' },
    { icon: '🔄', title: 'Convex', desc: 'Backend serverless con sincronización real' },
    { icon: '🎨', title: 'Tailwind CSS', desc: 'Estilos utility-first responsive' },
    { icon: '✨', title: 'Framer Motion', desc: 'Animaciones fluidas y profesionales' }
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-green-950/20 to-black">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Stack Moderno
          </h2>
          <div className="h-1 w-20 bg-green-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tech.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLIDE 8: CTA Final
function Slide8() {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-orange-600">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8"
        >
          ¿Listo para transformar tu barbería?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 sm:mb-12"
        >
          Cero instalaciones. Cero formularios. Cero riesgo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
        >
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">2 min</div>
            <div className="text-xs sm:text-sm lg:text-base text-white/70">Para empezar</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">$0</div>
            <div className="text-xs sm:text-sm lg:text-base text-white/70">Para probar</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">100%</div>
            <div className="text-xs sm:text-sm lg:text-base text-white/70">Satisfacción</div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <a
            href="https://fidigital.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-lg bg-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl lg:text-2xl font-bold text-primary shadow-2xl transition-all hover:scale-105 hover:shadow-white/20"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Ver Sitio en Vivo</span>
            <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm sm:text-base text-white/80"
        >
          ✨ Sin tarjeta de crédito • 🚀 Listo en minutos • 💯 Proyecto de portafolio
        </motion.p>
      </div>
    </div>
  );
}
