
import React from 'react';

interface SignalGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalGauge: React.FC<SignalGaugeProps> = ({ score, size = 'md' }) => {
  const radius = size === 'lg' ? 44 : size === 'md' ? 28 : 18;
  const stroke = size === 'lg' ? 3 : size === 'md' ? 2 : 1.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-36 h-36'
  };

  const textClasses = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-3xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Pulse background */}
      <div className={`absolute inset-0 bg-[#00FFD1]/10 rounded-full animate-pulse blur-xl ${score > 70 ? 'opacity-30' : 'opacity-0'}`}></div>
      
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 relative z-10">
        <circle
          stroke="rgba(255,255,255,0.03)"
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
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.19, 1, 0.22, 1)' }}
          r={normalizedRadius}
          cx={radius} cy={radius}
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className={`font-bold tabular-nums syne ${textClasses[size]}`}>{score}</span>
        {size === 'lg' && <span className="text-[8px] uppercase tracking-[0.4em] opacity-30 font-bold mt-2">SGNL_INT</span>}
      </div>
    </div>
  );
};
