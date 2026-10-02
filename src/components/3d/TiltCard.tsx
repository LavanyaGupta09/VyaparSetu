import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  maxTilt?: number;
  glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '', 
  depth = 20,
  maxTilt = 12,
  glowColor,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', h);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return () => mq.removeEventListener('change', h);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);

  // Shadow shifts opposite to tilt
  const shadowX = useTransform(springX, [-0.5, 0.5], [12, -12]);
  const shadowY = useTransform(springY, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || isTouchDevice || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [reduceMotion, isTouchDevice, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0); y.set(0); setIsHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const glowStyle = glowColor && isHovered ? {
    boxShadow: `0 0 30px 0 ${glowColor}20, 0 0 60px 0 ${glowColor}10`
  } : {};

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          ...glowStyle,
        }}
        whileTap={isTouchDevice ? { scale: 0.98, translateY: 2 } : undefined}
        className="relative h-full w-full"
      >
        {/* Layered shadow system: contact + ambient + brand glow */}
        <motion.div
          style={{
            boxShadow: useTransform(
              [shadowX, shadowY],
              ([sx, sy]: number[]) => isTouchDevice
                ? '0 4px 6px -1px rgba(15,23,42,0.08), 0 10px 15px -3px rgba(15,23,42,0.05)'
                : `0 2px 4px rgba(15,23,42,0.06), 0 8px 16px rgba(15,23,42,0.06), ${sx}px ${sy}px 24px -4px rgba(15,23,42,0.08)`
            ),
            borderRadius: 'inherit',
          }}
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
        />
        <div
          style={{ transform: isTouchDevice ? 'none' : `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}
          className="h-full w-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
