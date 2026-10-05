import React, { useState } from 'react';
import { CalculatedScenarioResult } from '../../services/scenarioEngine';
import { formatINR } from '../../utils/formatters';
import { Target } from 'lucide-react';

interface ScenarioComparisonChartProps {
  scenarios: Record<'continue' | 'reduce' | 'pause', CalculatedScenarioResult>;
  selectedScenario: 'continue' | 'reduce' | 'pause';
  onSelectScenario: (scenario: 'continue' | 'reduce' | 'pause') => void;
  targetAmount: number;
}

export const ScenarioComparisonChart: React.FC<ScenarioComparisonChartProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  targetAmount,
}) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 760;
  const height = 300;
  const padding = { top: 35, right: 40, bottom: 40, left: 65 };

  const minY = 2000000; // 20 Lakhs
  const maxY = 7500000; // 75 Lakhs (encompassing Continue corpus of ~₹71.5L)
  const minX = 0; // Year 0 (2026)
  const maxX = 6; // Year 6 (2032)

  const getX = (yearIdx: number) => {
    return (
      padding.left +
      ((yearIdx - minX) / (maxX - minX)) * (width - padding.left - padding.right)
    );
  };

  const getY = (val: number) => {
    return (
      height -
      padding.bottom -
      ((val - minY) / (maxY - minY)) * (height - padding.top - padding.bottom)
    );
  };

  // Build SVG path strings for each trajectory
  const buildPath = (scenario: CalculatedScenarioResult) => {
    return scenario.trajectory
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.yearIndex)} ${getY(pt.projectedAmount)}`)
      .join(' ');
  };

  const targetY = getY(targetAmount);

  const scenarioKeys: ('continue' | 'reduce' | 'pause')[] = [
    'continue',
    'reduce',
    'pause',
  ];

  return (
    <div className="space-y-4">
      {/* Top Legend and Graph Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {scenarioKeys.map((key) => {
            const sc = scenarios[key];
            const isSelected = selectedScenario === key;
            return (
              <button
                key={key}
                onClick={() => onSelectScenario(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sc.color }}
                />
                <span>
                  {key === 'continue'
                    ? 'Continue (₹25k)'
                    : key === 'reduce'
                    ? 'Reduce (₹12.5k)'
                    : 'Pause (₹0)'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Goal Target: {formatINR(targetAmount)}</span>
        </div>
      </div>

      {/* SVG Interactive Trajectory Chart */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[580px] select-none"
          >
            {/* Background Grid Lines */}
            {[2000000, 3500000, 5000000, 6500000, 7500000].map((val) => {
              const y = getY(val);
              const isTargetLine = val === 3500000;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke={isTargetLine ? '#6366f1' : '#f1f5f9'}
                    strokeWidth={isTargetLine ? '1.5' : '1'}
                    strokeDasharray={isTargetLine ? '4 4' : undefined}
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className={`text-[10px] font-medium ${
                      isTargetLine ? 'fill-indigo-600 font-bold' : 'fill-slate-400'
                    }`}
                  >
                    ₹{(val / 100000).toFixed(0)}L
                  </text>
                </g>
              );
            })}

            {/* Target Label */}
            <text
              x={width - padding.right}
              y={targetY - 6}
              textAnchor="end"
              className="text-[10px] font-bold fill-indigo-600"
            >
              Goal Target: ₹35L
            </text>

            {/* Vertical Year Grid Lines */}
            {[0, 1, 2, 3, 4, 5, 6].map((yrIdx) => {
              const x = getX(yrIdx);
              const yearLabel = 2026 + yrIdx;
              return (
                <g key={yrIdx}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#f8fafc"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className={`text-[11px] font-semibold ${
                      yrIdx === 0
                        ? 'fill-slate-900 font-bold'
                        : yrIdx === 6
                        ? 'fill-indigo-700 font-bold'
                        : 'fill-slate-400'
                    }`}
                  >
                    {yearLabel}
                  </text>
                  <text
                    x={x}
                    y={height - padding.bottom + 30}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400"
                  >
                    {yrIdx === 0 ? 'Now' : `Yr ${yrIdx}`}
                  </text>
                </g>
              );
            })}

            {/* Trajectory Paths */}
            {scenarioKeys.map((key) => {
              const sc = scenarios[key];
              const isSelected = selectedScenario === key;
              return (
                <g key={key}>
                  <path
                    d={buildPath(sc)}
                    fill="none"
                    stroke={sc.color}
                    strokeWidth={isSelected ? '3.5' : '1.75'}
                    strokeOpacity={isSelected ? '1' : '0.45'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* End Value Circle Marker */}
                  <circle
                    cx={getX(6)}
                    cy={getY(sc.projectedValue)}
                    r={isSelected ? '6' : '4'}
                    fill={sc.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-300 shadow-sm"
                  />
                </g>
              );
            })}

            {/* Starting Accumulated Position Marker */}
            <circle
              cx={getX(0)}
              cy={getY(2485000)}
              r="5.5"
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text
              x={getX(0) + 8}
              y={getY(2485000) - 8}
              className="text-[10px] font-extrabold fill-slate-900"
            >
              Current: ₹24.85L (71%)
            </text>

            {/* Selected Scenario Data Points on Hover / Display */}
            {scenarios[selectedScenario].trajectory.map((pt) => (
              <g
                key={pt.yearIndex}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredYear(pt.yearIndex)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <circle
                  cx={getX(pt.yearIndex)}
                  cy={getY(pt.projectedAmount)}
                  r={hoveredYear === pt.yearIndex ? '6.5' : '4'}
                  fill={scenarios[selectedScenario].color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />
                {hoveredYear === pt.yearIndex && (
                  <g>
                    <rect
                      x={getX(pt.yearIndex) - 45}
                      y={getY(pt.projectedAmount) - 34}
                      width="90"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      opacity="0.9"
                    />
                    <text
                      x={getX(pt.yearIndex)}
                      y={getY(pt.projectedAmount) - 18}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-white"
                    >
                      {formatINR(pt.projectedAmount)}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Chart Subtitle & Disclaimer Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">
            Current trajectory: <span className="text-slate-900">₹24.85L</span> accumulated → Projected at 2032:{' '}
            <strong style={{ color: scenarios[selectedScenario].color }}>
              ₹{scenarios[selectedScenario].projectedValue.toLocaleString('en-IN')}
            </strong>{' '}
            <span className="text-emerald-700 font-bold">
              (+₹{scenarios[selectedScenario].surplus.toLocaleString('en-IN')} Surplus)
            </span>
          </span>
          <span className="text-slate-400 italic">
            Illustrative scenario — not a return forecast.
          </span>
        </div>
      </div>
    </div>
  );
};
