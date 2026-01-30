"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function HeroCircle() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowOverlay(true);
    
    setTimeout(() => {
      const storySection = document.getElementById('story');
      if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth' });
      }
      
      setTimeout(() => {
        setShowOverlay(false);
      }, 500);
    }, 2500);
  };

  return (
    <>
      <a
        href="#story"
        id="circle-dark"
        onClick={handleClick}
        aria-label="Ir a la historia"
        className="hero-circle relative overflow-hidden"
      >
        {/* Destello de reflexión dinámica */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Rayo de luz principal */}
          <div
            className="absolute top-0 left-1/2 w-[120%] h-[2px] origin-top"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
              transform: 'translateX(-50%) rotate(45deg)',
              filter: 'blur(1px)',
            }}
          />
          
          {/* Destello secundario */}
          <motion.div
            className="absolute top-[20%] left-[20%] w-[40px] h-[40px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          
          {/* Brillo especular superior */}
          <div
            className="absolute top-[15%] left-[30%] w-[50px] h-[30px] rounded-full opacity-60"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 60%)',
              filter: 'blur(8px)',
            }}
          />
        </motion.div>

        {/* Pulso de energía al hover */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(circle, rgba(184,0,0,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </a>

      {showOverlay && (
        <div className="overlay-dark active">
          <p className="overlay-quote">
            "El hombre es un dios cuando sueña y un mendigo cuando reflexiona"
            <span>— Friedrich Hölderlin</span>
          </p>
        </div>
      )}
    </>
  );
}
