import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_INVESTOR } from '../../data/demoData';
import { formatINR } from '../../utils/formatters';
import {
  ShieldAlert,
  Bell,
  Menu,
  X,
  Compass,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    navigateTo,
    currentRoute,
    recordedDecisions,
    resetDemo,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsWhyMomentOpen,
    isCompetitionDemoActive,
  } = useApp();

  const isMomentActive =
    currentRoute === 'moment-intervention' ||
    currentRoute === 'simulator' ||
    currentRoute === 'explainability';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Tagline */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    FinLit <span className="text-indigo-600">MOMENT</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-normal -mt-0.5">
                  Pause. Understand. Decide.
                </p>
              </div>
            </button>
          </div>

          {/* Center: Live MOMENT Intervention Alert Pill */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigateTo('sip-details')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isMomentActive
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 ring-2 ring-indigo-200/60'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold">MOMENT Active: Decision support available</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">• Priya is considering a SIP change</span>
              <span className="ml-1 text-[11px] text-indigo-600 underline font-semibold">
                Inspect
              </span>
            </button>
          </div>

          {/* Right: Investor Persona Profile & Demo Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsWhyMomentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Experience the MOMENT</span>
              <span className="hidden lg:inline text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider">
                M8 Demo
              </span>
            </button>

            {recordedDecisions.length > 0 && (
              <button
                onClick={resetDemo}
                title="Reset simulation back to initial state"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900">
                  {DEMO_INVESTOR.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {DEMO_INVESTOR.occupation} • {DEMO_INVESTOR.riskProfile} Risk
                </div>
              </div>
              <div className="relative">
                <img
                  src={DEMO_INVESTOR.avatarUrl}
                  alt={DEMO_INVESTOR.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                />
                <span
                  title="KYC Verified"
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
