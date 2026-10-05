import React from 'react';

interface PerformanceSparklineProps {
  marketMovement: number; // e.g. -8.2
  portfolioMovement: number; // e.g. -6.8
}

export const PerformanceSparkline: React.FC<PerformanceSparklineProps> = ({
  marketMovement,
  portfolioMovement,
}) => {
  // 6 synthetic points over recent 3 weeks demonstrating market vs portfolio trajectory
  // Market drops from 0 to -8.2%
  const marketPoints = [0, -1.8, -3.2, -5.4, -7.1, marketMovement];
  // Portfolio drops less: from 0 to -6.8%
  const portfolioPoints = [0, -1.2, -2.5, -4.1, -5.6, portfolioMovement];

  const width = 320;
  const height = 90;
  const paddingX = 15;
  const paddingY = 12;

  const minVal = -10;
  const maxVal = 2;

  const getY = (val: number) => {
    return paddingY + ((maxVal - val) / (maxVal - minVal)) * (height - 2 * paddingY);
  };

  const getX = (idx: number, total: number) => {
    return paddingX + (idx / (total - 1)) * (width - 2 * paddingX);
  };

  const marketPath = marketPoints
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, marketPoints.length)} ${getY(val)}`)
    .join(' ');

  const portfolioPath = portfolioPoints
    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, portfolioPoints.length)} ${getY(val)}`)
    .join(' ');

  const zeroY = getY(0);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-24 overflow-visible"
        >
          {/* Zero reference line */}
          <line
            x1={paddingX}
            y1={zeroY}
            x2={width - paddingX}
            y2={zeroY}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Market curve (dashed slate/rose) */}
          <path
            d={marketPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Portfolio curve (solid indigo/rose) */}
          <path
            d={portfolioPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
          />

          {/* End points */}
          <circle
            cx={getX(marketPoints.length - 1, marketPoints.length)}
            cy={getY(marketPoints[marketPoints.length - 1])}
            r="4"
            fill="#94a3b8"
          />
          <circle
            cx={getX(portfolioPoints.length - 1, portfolioPoints.length)}
            cy={getY(portfolioPoints[portfolioPoints.length - 1])}
            r="4.5"
            fill="#6366f1"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 inline-block" />
            <span className="font-medium text-slate-700">Portfolio ({portfolioMovement}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block" />
            <span className="text-slate-500">Nifty 50 ({marketMovement}%)</span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
          Last 3 Weeks (Simulated)
        </span>
      </div>
    </div>
  );
};
