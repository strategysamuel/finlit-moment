import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_INVESTMENTS } from '../data/demoData';
import { formatINR } from '../utils/formatters';
import { RiskBadge } from '../components/common/RiskBadge';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  TrendingUp,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Equity Mutual Funds', 'ETFs', 'Debt', 'Cash & Liquid'];

  const filteredInvestments =
    selectedCategory === 'All'
      ? DEMO_INVESTMENTS
      : DEMO_INVESTMENTS.filter((inv) => inv.category === selectedCategory);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Portfolio Holdings</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">{DEMO_INVESTMENTS.length} Active Instruments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Investments & SIPs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review individual instruments, current returns, automated SIP mandates, and linked goals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Highlight Card for FinLit Flexi Growth Fund */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                PRIMARY DECISION DEMO
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Flexi-Cap Equity Direct Growth
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                FinLit Flexi Growth Fund
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Linked Goal: <strong className="text-indigo-700">Child Education (Year 2032)</strong> • Monthly SIP: <strong className="text-slate-900">₹25,000</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Value</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {formatINR(1120000)}
                </span>
              </div>
              <div className="pl-4 border-l border-slate-200">
                <span className="text-slate-400 block text-[11px]">Invested Value</span>
                <span className="text-lg font-bold text-slate-700">
                  {formatINR(940000)}
                </span>
              </div>
              <div className="pl-4 border-l border-slate-200">
                <span className="text-slate-400 block text-[11px]">XIRR Return</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  +12.8%
                </span>
              </div>
              <div className="pl-4 border-l border-slate-200">
                <span className="text-slate-400 block text-[11px]">Recent Drawdown</span>
                <span className="text-lg font-extrabold text-rose-600">
                  -6.8%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => navigateTo('sip-details')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow inline-flex items-center justify-center gap-2"
            >
              <span>View SIP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-500 text-center font-medium">
              Access Pause / Reduction controls
            </span>
          </div>
        </div>
      </div>

      {/* Grid of All Investments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInvestments.map((inv) => (
          <div
            key={inv.id}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              inv.isPrimaryDemo
                ? 'border-indigo-200 ring-1 ring-indigo-50 shadow-xs'
                : 'border-slate-200/90 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">
                    {inv.name}
                  </h3>
                  {inv.isPrimaryDemo && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{inv.category}</span>
                  <span>•</span>
                  <span>NAV: ₹{inv.nav}</span>
                </div>
              </div>

              <RiskBadge level={inv.riskCategory} size="sm" />
            </div>

            {/* Financial Numbers Grid */}
            <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Current</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatINR(inv.currentValue)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Invested</span>
                <span className="font-semibold text-slate-700">
                  {formatINR(inv.investedValue)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">XIRR</span>
                <span className="font-bold text-emerald-600 text-sm">
                  +{inv.xirr}%
                </span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] mr-1">Monthly SIP:</span>
                <strong className="text-slate-900">
                  {inv.monthlySip > 0 ? formatINR(inv.monthlySip) : 'None'}
                </strong>
                {inv.linkedGoalName && (
                  <span className="block text-[11px] text-slate-500">
                    Goal: {inv.linkedGoalName}
                  </span>
                )}
              </div>

              {inv.monthlySip > 0 ? (
                <button
                  onClick={() => navigateTo('sip-details')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View SIP</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-slate-400 text-[11px] italic">Lump-sum holding</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};
