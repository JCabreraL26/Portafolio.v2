import { useEffect, useState } from 'react';

export const PizzaSpinner = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Definir toppings aleatorios en la pizza
  const pepperonis = [
    { cx: 45, cy: 35, r: 8 },
    { cx: 55, cy: 50, r: 7 },
    { cx: 35, cy: 55, r: 8 },
    { cx: 60, cy: 65, r: 7 },
    { cx: 40, cy: 70, r: 8 },
    { cx: 65, cy: 45, r: 8 },
    { cx: 50, cy: 30, r: 7 },
    { cx: 70, cy: 60, r: 7 },
  ];

  const olives = [
    { cx: 48, cy: 42, r: 4 },
    { cx: 58, cy: 58, r: 4 },
    { cx: 42, cy: 62, r: 4 },
    { cx: 68, cy: 52, r: 4 },
  ];

  const mushrooms = [
    { cx: 52, cy: 38, r: 6 },
    { cx: 38, cy: 48, r: 6 },
    { cx: 62, cy: 58, r: 6 },
    { cx: 45, cy: 65, r: 6 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-25">
      {/* Pizza central giratoria */}
      <div 
        className="absolute top-1/2 left-1/2"
        style={{
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(0.7)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <svg
          width="450"
          height="450"
          viewBox="0 0 100 100"
          className="drop-shadow-2xl"
        >
          {/* Sombra de la pizza */}
          <ellipse
            cx="52"
            cy="52"
            rx="40"
            ry="40"
            fill="rgba(0,0,0,0.2)"
            filter="blur(8px)"
          />

          {/* Base de la pizza (masa) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#pizzaBase)"
          />

          {/* Líneas divisorias de porciones (8 slices) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 50 + 40 * Math.cos(rad);
            const y2 = 50 + 40 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="rgba(200, 140, 70, 0.3)"
                strokeWidth="0.3"
              />
            );
          })}

          {/* Capa de queso */}
          <circle
            cx="50"
            cy="50"
            r="37"
            fill="url(#cheese)"
            opacity="0.9"
          />

          {/* Pepperonis */}
          {pepperonis.map((p, i) => (
            <g key={`pepperoni-${i}`}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="url(#pepperoni)"
              />
              {/* Detalles del pepperoni */}
              <circle
                cx={p.cx - 1}
                cy={p.cy - 1}
                r={p.r * 0.5}
                fill="rgba(150, 30, 30, 0.4)"
              />
              <circle
                cx={p.cx + 1.5}
                cy={p.cy + 1}
                r={p.r * 0.3}
                fill="rgba(150, 30, 30, 0.4)"
              />
            </g>
          ))}

          {/* Aceitunas */}
          {olives.map((o, i) => (
            <g key={`olive-${i}`}>
              <circle
                cx={o.cx}
                cy={o.cy}
                r={o.r}
                fill="#2d3436"
              />
              <circle
                cx={o.cx}
                cy={o.cy}
                r={o.r * 0.6}
                fill="rgba(255, 255, 255, 0.2)"
              />
            </g>
          ))}

          {/* Champiñones */}
          {mushrooms.map((m, i) => (
            <g key={`mushroom-${i}`}>
              <ellipse
                cx={m.cx}
                cy={m.cy}
                rx={m.r * 0.8}
                ry={m.r * 0.6}
                fill="#e8d4b0"
              />
              <ellipse
                cx={m.cx}
                cy={m.cy}
                rx={m.r * 0.5}
                ry={m.r * 0.4}
                fill="rgba(200, 180, 150, 0.5)"
              />
            </g>
          ))}

          {/* Borde de corteza */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#crust)"
            strokeWidth="3"
          />

          {/* Brillo especular en la pizza */}
          <ellipse
            cx="38"
            cy="38"
            rx="15"
            ry="10"
            fill="rgba(255, 255, 255, 0.15)"
            filter="blur(4px)"
          />

          {/* Definiciones de gradientes */}
          <defs>
            {/* Gradiente de la base */}
            <radialGradient id="pizzaBase">
              <stop offset="0%" stopColor="#f4a261" />
              <stop offset="70%" stopColor="#e76f51" />
              <stop offset="100%" stopColor="#d35d3f" />
            </radialGradient>

            {/* Gradiente del queso */}
            <radialGradient id="cheese">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="50%" stopColor="#ffe66d" />
              <stop offset="100%" stopColor="#ffd43b" />
            </radialGradient>

            {/* Gradiente del pepperoni */}
            <radialGradient id="pepperoni">
              <stop offset="0%" stopColor="#d63031" />
              <stop offset="60%" stopColor="#b71c1c" />
              <stop offset="100%" stopColor="#8b1818" />
            </radialGradient>

            {/* Gradiente de la corteza */}
            <radialGradient id="crust">
              <stop offset="0%" stopColor="#c68642" />
              <stop offset="100%" stopColor="#8b6122" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Ingredientes flotantes decorativos */}
      <div className="absolute top-20 left-[15%] animate-float text-6xl opacity-40">
        🧀
      </div>
      <div className="absolute top-[60%] right-[15%] animate-float-delayed text-6xl opacity-40">
        🍅
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float-slow text-5xl opacity-40">
        🌿
      </div>
      <div className="absolute top-[30%] right-[25%] animate-float text-5xl opacity-40">
        🫒
      </div>
      <div className="absolute bottom-[35%] right-[10%] animate-float-delayed text-6xl opacity-40">
        🍄
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}} />
    </div>
  );
};
