import React from 'react';
import { FinancialGoal } from '../../types';
import { formatINR } from '../../utils/formatters';
import { GraduationCap, Landmark, Calendar, ArrowRight } from 'lucide-react';

interface GoalCardProps {
  goal: FinancialGoal;
  isPrimary?: boolean;
  onInspect?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isPrimary,
  onInspect,
}) => {
  const Icon = goal.category === 'Education' ? GraduationCap : Landmark;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isPrimary
          ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              goal.category === 'Education'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">{goal.title}</h4>
              {isPrimary && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  Primary Goal
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            goal.status === 'On Track'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {goal.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-500 font-medium">Accumulated Progress</span>
          <span className="font-bold text-slate-900 text-sm">
            {goal.progressPercent}%{' '}
            <span className="text-xs font-normal text-slate-500">
              ({formatINR(goal.currentAmount, { compact: true })} of {formatINR(goal.targetAmount, { compact: true })})
            </span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              goal.category === 'Education' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}
            style={{ width: `${goal.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Details Row */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Monthly Contribution</span>
          <span className="font-bold text-slate-800">
            {formatINR(goal.monthlyContribution)}/mo
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Horizon Remaining</span>
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {goal.yearsRemaining} Years (Year {goal.targetYear})
          </span>
        </div>
        {onInspect && (
          <div className="flex items-center justify-end col-span-2 sm:col-span-1">
            <button
              onClick={onInspect}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group"
            >
              <span>View SIP Link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
