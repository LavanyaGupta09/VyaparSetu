import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PressableButton3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const PressableButton3D: React.FC<PressableButton3DProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const shouldReduce = useReducedMotion();

  if (shouldReduce || disabled) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        ${className}
      `}
      style={{
        boxShadow: '0 4px 0 rgba(15,23,42,0.15), 0 6px 12px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.25)',
        transform: 'translateY(0)',
      }}
      whileHover={{
        y: -1,
        boxShadow: '0 6px 0 rgba(15,23,42,0.15), 0 10px 20px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
      whileTap={{
        y: 3,
        boxShadow: '0 1px 0 rgba(15,23,42,0.15), 0 2px 4px rgba(15,23,42,0.05), inset 0 1px 2px rgba(15,23,42,0.1)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.button>
  );
};
