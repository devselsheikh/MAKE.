import React from 'react';

interface SignalGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalGauge: React.FC<SignalGaugeProps> = ({ score, size = 'md' }) => {
  // Fluid radius and stroke
  const radius = size === 'lg' ? 64 : size === 'md' ? 40 : 24;
  const stroke = size === 'lg' ? 4 : size === 'md' ? 2.5 : 2;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-48 h-48 md:w-64 md:h-64'
  };

  const textClasses = {
    sm: 'text-step--2',
    md: 'text-step--1',
    lg: 'text-step-4 md:text-step-5'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Dynamic Pulse Glow */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl md:blur-3xl transition-all duration-1000 ${score > 80 ? 'bg-[#00FFD1]/20 scale-125' : score > 50 ? 'bg-[#7000FF]/10' : 'bg-white/5'}`}
      />
      
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 relative z-10 transition-transform duration-1000">
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius} cy={radius}
        />
        <circle
          stroke={score > 80 ? '#00FFD1' : score > 50 ? '#7000FF' : '#ffffff'}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 2s cubic-bezier(0.19, 1, 0.22, 1), stroke 1s ease' 
          }}
          r={normalizedRadius}
          cx={radius} cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className={`font-black tabular-nums syne leading-none ${textClasses[size]}`}>{score}</span>
        {size === 'lg' && (
          <span className="text-step--2 uppercase tracking-[0.6em] opacity-30 font-black mt-4 hidden md:block">SIGNAL</span>
        )}
      </div>
    </div>
  );
};