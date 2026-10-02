import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', depth = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Check for touch device to disable hover tilt
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const shadowX = useTransform(springX, [-0.5, 0.5], ["10px", "-10px"]);
  const shadowY = useTransform(springY, [-0.5, 0.5], ["10px", "-10px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || isTouchDevice || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (reduceMotion || isTouchDevice) return;
    x.set(0);
    y.set(0);
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isTouchDevice ? 0 : rotateX,
        rotateY: isTouchDevice ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`perspective-1000 ${className} relative`}
    >
      <motion.div
        style={{
          boxShadow: useTransform(
            [shadowX, shadowY],
            ([sx, sy]) => isTouchDevice 
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), ${sx} ${sy} 15px -3px rgba(0,0,0,0.05)`
          ),
          borderRadius: 'inherit'
        }}
        className="absolute inset-0 pointer-events-none transition-shadow duration-300"
      />
      <div 
        style={{ transform: isTouchDevice ? "none" : `translateZ(${depth}px)` }}
        className="h-full w-full preserve-3d"
      >
        {children}
      </div>
    </motion.div>
  );
};
