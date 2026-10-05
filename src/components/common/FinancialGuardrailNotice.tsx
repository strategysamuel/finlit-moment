import React from 'react';
import { Shield, Check, X, Lock } from 'lucide-react';

interface GuardrailNoticeProps {
  compact?: boolean;
}

export const FinancialGuardrailNotice: React.FC<GuardrailNoticeProps> = ({ compact }) => {
  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Decision-Support Only:</strong> FinLit MOMENT provides contextual simulation. It never executes transactions or overrides your decisions.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          User in Control
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              FinLit MOMENT Guardrail & Trust Framework
            </h4>
            <p className="text-xs text-slate-500">
              Clear regulatory and behavioral boundaries ensuring investor sovereignty
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Investor Sovereignty
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* What MOMENT Can Do */}
        <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100">
          <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
            <Check className="w-4 h-4 text-emerald-600" />
            WHAT MOMENT DOES
          </div>
          <ul className="text-xs text-emerald-950 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Contextualizes market volatility against your investment horizon</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Simulates mathematical impact on specific life goals</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Offers balanced middle-ground options (e.g., partial reduction)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Explains transparently why an intervention was surfaced</span>
            </li>
          </ul>
        </div>

        {/* What MOMENT Cannot Do */}
        <div className="bg-rose-50/40 rounded-xl p-3.5 border border-rose-100">
          <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-2">
            <X className="w-4 h-4 text-rose-600" />
            WHAT MOMENT NEVER DOES
          </div>
          <ul className="text-xs text-rose-950 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span className="text-rose-600 font-bold">•</span>
              <span>Never automatically executes or blocks an SIP change</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-600 font-bold">•</span>
              <span>Never guarantees future market directions or specific returns</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-600 font-bold">•</span>
              <span>Never overrides your final investor intent</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-600 font-bold">•</span>
              <span>Never acts as an autonomous broker without your explicit choice</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
