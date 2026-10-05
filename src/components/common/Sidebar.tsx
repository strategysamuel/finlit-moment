import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import {
  LayoutDashboard,
  PieChart,
  Target,
  TrendingUp,
  Zap,
  SlidersHorizontal,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  History,
  Compass,
  FileText,
  Brain,
} from 'lucide-react';

interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    isSidebarOpen,
    setIsSidebarOpen,
    recordedDecisions,
    startCompetitionDemo,
    setIsWhyMomentOpen,
  } = useApp();

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
  ];

  const momentNavItems: NavItem[] = [
    {
      id: 'sip-details',
      label: 'SIP Details',
      icon: Layers,
      badge: 'Action Hub',
    },
    {
      id: 'moment-intervention',
      label: 'MOMENT Intervention',
      icon: Zap,
      badge: 'Hero Demo',
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
      icon: SlidersHorizontal,
    },
    {
      id: 'explainability',
      label: 'Why MOMENT',
      icon: HelpCircle,
    },
    {
      id: 'decision-confirmation',
      label: 'Decision Status',
      icon: CheckCircle2,
      badge: recordedDecisions.length > 0 ? `${recordedDecisions.length}` : undefined,
    },
    {
      id: 'decision-memory',
      label: 'Decision Memory',
      icon: History,
      badge: 'M4',
    },
    {
      id: 'follow-up',
      label: 'MOMENT Follow-Up',
      icon: Compass,
      badge: 'M5',
    },
    {
      id: 'decision-brief',
      label: 'MOMENT Decision Brief',
      icon: FileText,
      badge: 'M6',
    },
    {
      id: 'decision-reflection',
      label: 'Decision Reflection',
      icon: Brain,
      badge: 'M7',
    },
  ];

  const isMomentActive = [
    'sip-details',
    'moment-intervention',
    'simulator',
    'explainability',
    'decision-confirmation',
    'decision-memory',
    'follow-up',
    'decision-brief',
    'decision-reflection',
  ].includes(currentRoute);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* M8 Competition Demo Launch Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white space-y-2 shadow-xs border border-indigo-700/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                Milestone 8
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-amber-300">
                Judge Demo
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Experience the MOMENT</h4>
              <p className="text-[10px] text-indigo-200 leading-tight mt-0.5">
                8-step guided decision journey from reaction to reflection.
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  startCompetitionDemo();
                  setIsSidebarOpen(false);
                }}
                className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors text-center shadow-2xs"
              >
                Start Demo
              </button>
              <button
                onClick={() => {
                  setIsWhyMomentOpen(true);
                  setIsSidebarOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-semibold text-[11px] transition-colors text-center"
              >
                Briefing
              </button>
            </div>
          </div>

          {/* Main App Navigation */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Overview
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* MOMENT Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-2 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                MOMENT Engine
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                Active
              </span>
            </div>

            <nav className="space-y-1">
              {momentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-indigo-700 text-white'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Decision Support Quick Pitch Card */}
          <div className="rounded-xl p-3.5 bg-gradient-to-br from-indigo-50 via-slate-50 to-white border border-indigo-100/80 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  FinLit MOMENT
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Intervenes at the exact moment before you pause or reduce your SIP.
                </p>
                <button
                  onClick={() => navigateTo('sip-details')}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Experience Demo Flow</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Persona & Guardrail Indicator */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              <strong>Non-Transactional:</strong> Investor always remains in full control.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
