import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollSlideProps {
  children: ReactNode;
  className?: string;
}

export function ScrollSlide({ children, className = '' }: ScrollSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className={`min-h-screen flex items-center justify-center w-full ${className}`}
    >
      {children}
    </motion.section>
  );
}
