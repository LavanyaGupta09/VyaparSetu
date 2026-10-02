import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Whether the panel is open (for modal/overlay use) */
  isOpen?: boolean;
  onClose?: () => void;
  /** If true, render as fixed overlay with backdrop */
  overlay?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  isOpen = true,
  onClose,
  overlay = false,
}) => {
  const shouldReduce = useReducedMotion();

  const panelVariants = shouldReduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.92, rotateX: 12, y: 40 },
        animate: { opacity: 1, scale: 1, rotateX: 0, y: 0 },
        exit: { opacity: 0, scale: 0.95, rotateX: -8, y: 20 },
      };

  if (!isOpen) return null;

  const panel = (
    <motion.div
      {...panelVariants}
      transition={{ duration: 0.28, type: 'spring', stiffness: 300, damping: 28 }}
      style={{ transformPerspective: 1200 }}
      className={`
        bg-white/80 backdrop-blur-xl 
        border border-white/30 
        shadow-[0_8px_32px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.5)]
        rounded-2xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-lg">
          {panel}
        </div>
      </div>
    );
  }

  return panel;
};
