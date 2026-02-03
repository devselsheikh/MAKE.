import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'hyper';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black tracking-[0.2em] uppercase transition-all duration-700 active:scale-[0.96] disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#F5F5F7] text-black hover:bg-white border-none",
    secondary: "bg-transparent text-white border border-white/10 hover:border-[#00FFD1] hover:bg-white/5",
    ghost: "bg-transparent text-white/30 hover:text-white border border-white/5 hover:bg-white/5",
    hyper: "bg-[#00FFD1] text-black hover:shadow-[0_0_60px_rgba(0,255,209,0.5)]"
  };

  const sizes = {
    sm: "px-6 py-3 text-step--2",
    md: "px-10 py-5 text-step--1 md:text-step-0",
    lg: "px-16 py-7 text-step-0 md:text-step-1"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center transition-transform duration-700 group-hover:scale-105 group-active:scale-95">{children}</span>
      
      {/* Dynamic Kinetic Shine */}
      <div className="absolute inset-0 bg-white/20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none skew-x-[-25deg]"></div>
      
      {/* Breathe Effect for Hyper */}
      {variant === 'hyper' && (
        <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100 pointer-events-none blur-2xl"></div>
      )}
    </button>
  );
};