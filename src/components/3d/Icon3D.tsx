import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Icon3DProps {
  icon: LucideIcon;
  className?: string;
  /** Background gradient from color */
  bgFrom?: string;
  /** Background gradient to color */
  bgTo?: string;
  /** Icon color */
  iconColor?: string;
  /** Size of the puck: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { puck: 'w-9 h-9', icon: 'w-4 h-4' },
  md: { puck: 'w-11 h-11', icon: 'w-5 h-5' },
  lg: { puck: 'w-14 h-14', icon: 'w-7 h-7' },
};

export const Icon3D: React.FC<Icon3DProps> = ({
  icon: IconComponent,
  className = '',
  bgFrom = '#e0e7ff',
  bgTo = '#c7d2fe',
  iconColor = '#3b82f6',
  size = 'md',
}) => {
  const s = sizeMap[size];

  return (
    <div
      className={`
        ${s.puck} rounded-xl flex items-center justify-center relative
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`,
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.6),
          inset 0 -1px 2px rgba(0,0,0,0.06),
          0 2px 4px rgba(15,23,42,0.08),
          0 4px 8px rgba(15,23,42,0.04)
        `,
      }}
    >
      {/* Top-left highlight bevel */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
        }}
      />
      <IconComponent className={`${s.icon} relative z-10`} style={{ color: iconColor }} />
    </div>
  );
};
