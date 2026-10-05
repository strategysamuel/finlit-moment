import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DEMO_PORTFOLIO,
  DEMO_INVESTMENTS,
  DEMO_INVESTOR,
  DEMO_MARKET_EVENT,
} from '../data/demoData';
import { formatINR, formatPercent } from '../utils/formatters';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { AssetAllocationDonut } from '../components/charts/AssetAllocationDonut';
import { FinancialGuardrailNotice } from '../components/common/FinancialGuardrailNotice';
import {
  PieChart,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Asset Overview</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">Synthetic Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive breakdown of your holdings, diversification, and simulated health indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Simulated demo data for Priya Sharma</span>
        </div>
      </div>

      {/* Top Portfolio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Value"
          value={formatINR(DEMO_PORTFOLIO.totalValue)}
          subValue={`Invested: ${formatINR(DEMO_PORTFOLIO.totalInvested)}`}
          changePercent={DEMO_PORTFOLIO.recentMovementPercent}
          changeLabel="recent dip"
          highlight={true}
        />
        <MetricCard
          label="Overall Gain / Return"
          value={`+${formatINR(DEMO_PORTFOLIO.overallReturn)}`}
          subValue={`+${DEMO_PORTFOLIO.overallReturnPercent}% Absolute`}
          changePercent={DEMO_PORTFOLIO.overallReturnPercent}
          changeLabel="since inception"
        />
        <MetricCard
          label="Recent Simulated Movement"
          value={formatPercent(DEMO_PORTFOLIO.recentMovementPercent, { includeSign: true })}
          subValue="vs -8.2% Nifty 50 benchmark"
          changePercent={DEMO_PORTFOLIO.recentMovementPercent}
        />
        <MetricCard
          label="Portfolio Risk Rating"
          value={DEMO_INVESTOR.riskProfile}
          subValue="Balanced Growth Strategy"
          badge={<RiskBadge level={DEMO_INVESTOR.riskProfile} size="sm" />}
        />
      </div>

      {/* Two Column Section: Health Score & Asset Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Score Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Portfolio Health Score
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Resilient
              </span>
            </div>

            <div className="my-6 flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-indigo-700 tracking-tight">
                  {DEMO_PORTFOLIO.healthScore}
                </span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  / 100
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Healthy Asset Structure
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {DEMO_PORTFOLIO.healthScoreExplanation}
                </p>
              </div>
            </div>

            {/* Health parameters */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Equity to Debt Proportion</span>
                <span className="font-semibold text-slate-800">82 : 18 (Moderate Growth)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Defensive Downside Buffer</span>
                <span className="font-semibold text-emerald-600">+1.4% vs Nifty</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Goal Alignment (6-Year Target)</span>
                <span className="font-semibold text-indigo-600">Strong (71% completed)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Considering pausing SIP?</span>
              <button
                onClick={() => navigateTo('moment-intervention')}
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
              >
                <span>Simulate Impact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Asset Allocation Donut Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Asset Allocation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across equity, ETFs, debt, and liquid reserves
              </p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              4 Asset Classes
            </span>
          </div>

          <AssetAllocationDonut
            data={DEMO_PORTFOLIO.assetAllocation}
            totalValue={DEMO_PORTFOLIO.totalValue}
          />
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Portfolio Holdings
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of active mutual funds, ETFs, and debt instruments
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Total {DEMO_INVESTMENTS.length} assets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Investment Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Invested</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">XIRR</th>
                <th className="py-3 px-4 text-right">Monthly SIP</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DEMO_INVESTMENTS.map((inv) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    inv.isPrimaryDemo ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{inv.name}</span>
                      {inv.isPrimaryDemo && (
                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded">
                          Decision Target
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      NAV: ₹{inv.nav} • {inv.units.toLocaleString()} units
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {inv.category}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium">
                    {formatINR(inv.investedValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {formatINR(inv.currentValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-emerald-600">
                      +{inv.xirr}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {inv.monthlySip > 0 ? (
                      formatINR(inv.monthlySip)
                    ) : (
                      <span className="text-slate-400 font-normal">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {inv.monthlySip > 0 ? (
                      <button
                        onClick={() => navigateTo('sip-details')}
                        className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                      >
                        View SIP
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FinancialGuardrailNotice />
    </div>
  );
};
