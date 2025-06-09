
import React from 'react';

interface SparklineChartProps {
  data: number[];
  color: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) {
    return <div className="w-20 h-8 bg-gray-100 rounded"></div>;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 80; // Scale to 80px width
    const y = 32 - ((value - min) / range) * 24; // Scale to 24px height, inverted
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-20 h-8">
      <svg width="80" height="32" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 80;
          const y = 32 - ((value - min) / range) * 24;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              className="opacity-60"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default SparklineChart;
