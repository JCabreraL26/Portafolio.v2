import { useState, useEffect } from "react";
import RotatingEarth from "./ui/wireframe-dotted-globe";

export function InteractiveGlobe() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-globe-wrapper">
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="globe-skeleton w-full max-w-[min(90vw,400px)] aspect-square mx-auto">
          <div className="skeleton-circle">
            <div className="skeleton-pulse"></div>
            <div className="skeleton-orbit skeleton-orbit-1"></div>
            <div className="skeleton-orbit skeleton-orbit-2"></div>
            <div className="skeleton-orbit skeleton-orbit-3"></div>
          </div>
        </div>
      )}

      {/* Actual Globe */}
      <div className={`globe-container ${isLoaded ? 'loaded' : 'loading'}`}>
        <RotatingEarth 
          width={400} 
          height={400}
          showControls={false}
          className="w-full max-w-[min(90vw,400px)] aspect-square mx-auto"
        />
      </div>

      {/* Floating Tech Tags */}
      <div className="tech-tags">
        <div className="tech-tag tag-top-left">Web Apps</div>
        <div className="tech-tag tag-top-right">Sitios Web</div>
        <div className="tech-tag tag-bottom-left">IA Agentica</div>
        <div className="tech-tag tag-bottom-right">E-commerce</div>
        <div className="tech-tag tag-middle-left">Pensamiento Crítico</div>
        <div className="tech-tag tag-middle-right">Design Thinking</div>
      </div>

      <style>{`
        .hero-globe-wrapper {
          position: relative;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
          overflow: visible;
        }

        .globe-skeleton {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skeleton-circle {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .skeleton-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 70%);
          animation: pulse 2s ease-in-out infinite;
        }

        .skeleton-orbit {
          position: absolute;
          inset: 10%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          animation: rotate 3s linear infinite;
        }

        .skeleton-orbit-1 {
          animation-duration: 4s;
          border-color: rgba(184, 0, 0, 0.2);
        }

        .skeleton-orbit-2 {
          inset: 20%;
          animation-duration: 5s;
          animation-direction: reverse;
        }

        .skeleton-orbit-3 {
          inset: 30%;
          animation-duration: 6s;
          border-color: rgba(255, 255, 255, 0.1);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .globe-container {
          transition: opacity 0.6s ease-in;
        }

        .globe-container.loading {
          opacity: 0;
          position: absolute;
          pointer-events: none;
        }

        .globe-container.loaded {
          opacity: 1;
          position: relative;
        }

        /* Tech Tags Styling */
        .tech-tags {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        .tech-tag {
          position: absolute;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: #e0e0e0;
          text-shadow: 
            0 0 6px rgba(255, 255, 255, 0.7),
            0 0 12px rgba(255, 255, 255, 0.5);
          opacity: 0;
          animation: fadeInTag 0.8s ease-out forwards;
        }

        .tag-top-left {
          top: 8%;
          left: 12%;
          animation-delay: 0.3s;
        }

        .tag-top-right {
          top: 15%;
          right: 8%;
          animation-delay: 0.6s;
        }

        .tag-bottom-left {
          bottom: 18%;
          left: 6%;
          animation-delay: 0.9s;
        }

        .tag-bottom-right {
          bottom: 10%;
          right: 15%;
          animation-delay: 1.2s;
        }

        .tag-middle-left {
          top: 45%;
          left: 2%;
          animation-delay: 1.5s;
        }

        .tag-middle-right {
          top: 45%;
          right: 2%;
          animation-delay: 1.8s;
        }

        @keyframes fadeInTag {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .tech-tags {
            position: static;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 0.75rem;
            margin-top: 2rem;
            padding: 0 1rem;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }

          .tech-tag {
            position: static;
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
            text-align: center;
            animation: fadeInTag 0.8s ease-out forwards;
          }

          /* Mobile animation delays for sequential appearance */
          .tech-tag:nth-child(1) { animation-delay: 0.3s; }
          .tech-tag:nth-child(2) { animation-delay: 0.6s; }
          .tech-tag:nth-child(3) { animation-delay: 0.9s; }
          .tech-tag:nth-child(4) { animation-delay: 1.2s; }
          .tech-tag:nth-child(5) { animation-delay: 1.5s; }
          .tech-tag:nth-child(6) { animation-delay: 1.8s; }
        }
      `}</style>
    </div>
  );
}
