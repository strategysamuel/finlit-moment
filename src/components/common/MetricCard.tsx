import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  changePercent?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  changePercent,
  changeLabel,
  icon,
  badge,
  highlight,
}) => {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        highlight
          ? 'bg-gradient-to-br from-indigo-50/70 to-white border-indigo-200/90 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
        {badge}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap">
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </span>
          {subValue && (
            <span className="block text-xs font-medium text-slate-500 mt-0.5">
              {subValue}
            </span>
          )}
        </div>

        {changePercent !== undefined && (
          <div
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              changePercent > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : changePercent < 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            {changePercent > 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : changePercent < 0 ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>
              {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
            </span>
            {changeLabel && (
              <span className="text-[10px] font-normal opacity-80 ml-0.5">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
