import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before starting animation */
  delay?: number;
}

export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotateX: 15, translateZ: -40, y: 30 }}
      whileInView={{ opacity: 1, rotateX: 0, translateZ: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      style={{ transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
};
