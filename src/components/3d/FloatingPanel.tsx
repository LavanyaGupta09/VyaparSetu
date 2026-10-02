import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger index — offsets the animation phase so multiple panels don't float in sync */
  index?: number;
  /** Amplitude in px (default 5) */
  amplitude?: number;
  /** Full cycle duration in seconds (default 5) */
  duration?: number;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  children,
  className = '',
  index = 0,
  amplitude = 5,
  duration = 5,
}) => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.7,        // stagger per card
      }}
    >
      {children}
    </motion.div>
  );
};
