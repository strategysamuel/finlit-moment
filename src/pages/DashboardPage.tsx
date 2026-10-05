import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DEMO_INVESTOR,
  DEMO_PORTFOLIO,
  DEMO_GOALS,
  DEMO_MARKET_EVENT,
  DEMO_INVESTMENTS,
} from '../data/demoData';
import { formatINR, formatPercent } from '../utils/formatters';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { MomentCard } from '../components/common/MomentCard';
import { GoalCard } from '../components/common/GoalCard';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import { PerformanceSparkline } from '../components/charts/PerformanceSparkline';
import {
  Wallet,
  TrendingDown,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Portfolio Dashboard</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">Live Context</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {DEMO_INVESTOR.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your financial trajectory, simulated market status, and active decision cues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Primary Goal:</span>
            <strong className="text-slate-900">Child Education (71%)</strong>
          </div>
        </div>
      </div>

      {/* Prominent MOMENT Intervention Hero Card */}
      <section aria-label="MOMENT Decision Intervention">
        <MomentCard onReview={() => navigateTo('moment-intervention', { action: 'pause' })} />
      </section>

      {/* Primary KPI Metrics: Portfolio Value, Monthly Movement, Risk Profile, Horizon */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Portfolio Value"
          value={formatINR(DEMO_PORTFOLIO.totalValue)}
          subValue={`Invested: ${formatINR(DEMO_PORTFOLIO.totalInvested)}`}
          changePercent={DEMO_PORTFOLIO.recentMovementPercent}
          changeLabel="recent"
          icon={<Wallet className="w-4 h-4" />}
          highlight={true}
        />

        <MetricCard
          label="Monthly Movement"
          value={formatPercent(DEMO_PORTFOLIO.recentMovementPercent, { includeSign: true })}
          subValue={`vs Nifty 50: ${formatPercent(DEMO_MARKET_EVENT.marketMovementPercent)}`}
          changePercent={DEMO_PORTFOLIO.recentMovementPercent}
          icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
        />

        <MetricCard
          label="Risk Profile"
          value={DEMO_INVESTOR.riskProfile}
          subValue="Equity-Debt Balanced"
          badge={<RiskBadge level={DEMO_INVESTOR.riskProfile} size="sm" />}
          icon={<Shield className="w-4 h-4" />}
        />

        <MetricCard
          label="Investment Horizon"
          value={DEMO_INVESTOR.investmentHorizon}
          subValue="Targeting Year 2032"
          badge={
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              Long Term
            </span>
          }
          icon={<Clock className="w-4 h-4" />}
        />
      </section>

      {/* Simulated Volatility Context vs Portfolio Buffer */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulated Market Event
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                Demo Benchmark
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {DEMO_MARKET_EVENT.eventTitle} ({DEMO_MARKET_EVENT.timeframe})
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Portfolio outperforming broader drop by <strong className="text-emerald-700">+1.4% buffer</strong>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <PerformanceSparkline
              marketMovement={DEMO_MARKET_EVENT.marketMovementPercent}
              portfolioMovement={DEMO_PORTFOLIO.recentMovementPercent}
            />
          </div>
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-600">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              What this means for you:
            </div>
            <p className="leading-relaxed">
              When market prices dip by 8.2%, your monthly SIP buys <strong className="text-slate-900">more mutual fund units</strong> for the same ₹25,000 rupee amount. This is the mathematical core of rupee-cost averaging.
            </p>
            <button
              onClick={() => navigateTo('moment-intervention')}
              className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
            >
              <span>Explore what happens if paused</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Financial Goals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Financial Goals</h2>
            <p className="text-xs text-slate-500">
              Track progress against target amounts and life horizons
            </p>
          </div>
          <button
            onClick={() => navigateTo('goals')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            <span>All Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            goal={DEMO_GOALS[0]}
            isPrimary={true}
            onInspect={() => navigateTo('sip-details')}
          />
          <GoalCard
            goal={DEMO_GOALS[1]}
            isPrimary={false}
            onInspect={() => navigateTo('goals')}
          />
        </div>
      </section>

      {/* Featured Holding / SIP Callout */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              FG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {DEMO_INVESTMENTS[0].name}
                </h4>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  XIRR {DEMO_INVESTMENTS[0].xirr}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active Monthly SIP: <strong className="text-slate-800">{formatINR(DEMO_INVESTMENTS[0].monthlySip)}/mo</strong> • Linked to Child Education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('sip-details')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Manage SIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Financial Guardrail Notice */}
      <FinancialGuardrailNotice compact={true} />
    </div>
  );
};
