"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface InventoryScannerProps {
  className?: string;
}

export function InventoryScanner({ className = "" }: InventoryScannerProps) {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generar partículas flotantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Grid animado de fondo */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #b80000 0%, #b80000 1px, transparent 1px, transparent 4%), repeating-linear-gradient(0deg, #b80000 0%, #b80000 1px, transparent 1px, transparent 4%)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Partículas flotantes */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#b80000] rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Contenedor de círculos centrado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[90vw] max-h-[600px]">
        {/* Círculo 1 - Exterior con borde punteado */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#b80000]/40"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          {/* Puntos de scanner en el borde */}
          {[0, 90, 180, 270].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-3 h-3 bg-[#b80000] rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${angle}deg) translateY(-50%) translateX(-50%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: angle / 360,
              }}
            />
          ))}
        </motion.div>

        {/* Círculo 2 - Medio con gradiente */}
        <motion.div
          className="absolute inset-[10%] rounded-full border-2 border-[#8a0000]/50 bg-gradient-to-br from-[#b80000]/20 to-transparent"
          animate={{
            rotate: -360,
            scale: [1, 1.08, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
            opacity: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />

        {/* Círculo 3 - Interior con líneas de escaneo */}
        <motion.div
          className="absolute inset-[20%] rounded-full border border-[#b80000]/60 overflow-hidden"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          {/* Línea de escaneo horizontal */}
          <motion.div
            className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#b80000] to-transparent"
            animate={{
              y: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Gradiente radial central */}
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(ellipse_at_center,#b80000/25%,transparent_70%)] blur-2xl" />
      </div>

      {/* Overlay de vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#FAF9F6_100%)] pointer-events-none" />
    </div>
  );
}
