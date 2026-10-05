import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';

interface AllocationItem {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

interface AssetAllocationDonutProps {
  data: AllocationItem[];
  totalValue: number;
}

export const AssetAllocationDonut: React.FC<AssetAllocationDonutProps> = ({
  data,
  totalValue,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-[180px] h-[180px] shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {data.map((item, index) => {
            const strokeDashoffset =
              circumference - (item.percentage / 100) * circumference;
            const rotation = (accumulatedPercent / 100) * 360;
            accumulatedPercent += item.percentage;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={item.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.6,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {activeItem ? activeItem.category : 'Total Portfolio'}
          </span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">
            {activeItem ? formatINR(activeItem.value, { compact: true }) : formatINR(totalValue, { compact: true })}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {activeItem ? `${activeItem.percentage.toFixed(1)}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex-1 w-full space-y-2">
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={item.category}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                isHovered ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-slate-800">
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">
                  {formatINR(item.value)}
                </span>
                <span className="text-[11px] text-slate-500">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
