
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: 'cyan' | 'violet' | 'base';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true,
  variant = 'base'
}) => {
  const borderColors = {
    base: 'border-white/5',
    cyan: 'border-[#00FFD1]/20',
    violet: 'border-[#7000FF]/20'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-black/40 backdrop-blur-[40px] border ${borderColors[variant]} p-8 transition-all duration-700
        ${hover ? 'hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${className}
      `}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
    >
      {children}
    </div>
  );
};
