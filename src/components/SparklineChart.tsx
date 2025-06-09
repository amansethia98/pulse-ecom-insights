
import React from 'react';

interface SparklineChartProps {
  data: number[];
  color: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-20 h-8 bg-white/5 rounded-lg border border-white/10 animate-pulse"></div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 80;
    const y = 32 - ((value - min) / range) * 24;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-20 h-8 relative group">
      <svg width="80" height="32" className="overflow-visible">
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Fill area */}
        <polygon
          points={`0,32 ${points} 80,32`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          className="transition-opacity duration-300 group-hover:opacity-80"
        />
        
        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          className="drop-shadow-sm transition-all duration-300 group-hover:stroke-[3]"
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 80;
          const y = 32 - ((value - min) / range) * 24;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:r-[2.5]"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default SparklineChart;
