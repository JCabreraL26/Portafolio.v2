"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface BackgroundCirclesProps {
  className?: string;
}

const AnimatedGrid = () => (
  <motion.div
    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 40,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    }}
  >
    <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
  </motion.div>
);

export function BackgroundCircles({ className }: BackgroundCirclesProps) {
  // Variante roja para coincidir con el diseño
  const variantStyles = {
    border: [
      "border-red-500/60",
      "border-rose-400/50",
      "border-neutral-600/30",
    ],
    gradient: "from-red-500/30",
  };

  return (
    <div
      className={clsx(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <AnimatedGrid />
      <motion.div className="absolute h-[480px] w-[480px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              "absolute inset-0 rounded-full",
              "border-2 bg-gradient-to-br to-transparent",
              variantStyles.border[i],
              variantStyles.gradient
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div
              className={clsx(
                "absolute inset-0 rounded-full mix-blend-screen",
                "bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1),transparent_70%)]"
              )}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#DC2626/30%,transparent_70%)] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#EF4444/15%,transparent)] blur-[80px]" />
      </div>
    </div>
  );
}
