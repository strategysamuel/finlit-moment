/**
 * FinLit MOMENT
 * "Pause. Understand. Decide."
 *
 * AI-powered financial decision-support layer for retail investors at the critical moment of SIP pause or reduction.
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GoalsPage } from './pages/GoalsPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { SipDetailsPage } from './pages/SipDetailsPage';
import { MomentInterventionPage } from './pages/MomentInterventionPage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { DecisionConfirmationPage } from './pages/DecisionConfirmationPage';
import { DecisionMemoryPage } from './pages/DecisionMemoryPage';
import { FollowUpPage } from './pages/FollowUpPage';
import { DecisionBriefPage } from './pages/DecisionBriefPage';
import { DecisionReflectionPage } from './pages/DecisionReflectionPage';
import { CompetitionGuidedBar } from './components/competition/CompetitionGuidedBar';
import { WhyMomentModal } from './components/competition/WhyMomentModal';

const MainLayout: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'goals':
        return <GoalsPage />;
      case 'investments':
        return <InvestmentsPage />;
      case 'sip-details':
        return <SipDetailsPage />;
      case 'moment-intervention':
        return <MomentInterventionPage />;
      case 'simulator':
        return <ScenarioSimulatorPage />;
      case 'explainability':
        return <ExplainabilityPage />;
      case 'decision-confirmation':
        return <DecisionConfirmationPage />;
      case 'decision-memory':
        return <DecisionMemoryPage />;
      case 'follow-up':
        return <FollowUpPage />;
      case 'decision-brief':
        return <DecisionBriefPage />;
      case 'decision-reflection':
        return <DecisionReflectionPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Demo Banner */}
      <DemoBanner />

      {/* Main App Header */}
      <Header />

      {/* M8 Competition Guided Bar */}
      <CompetitionGuidedBar />

      {/* M8 Why MOMENT / Competition Briefing Modal */}
      <WhyMomentModal />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 lg:pl-64 w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Footer */}
      <footer className="lg:pl-64 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">FinLit MOMENT</span>
            <span>•</span>
            <span className="italic font-medium text-indigo-700">"Pause. Understand. Decide."</span>
          </div>

          <div className="text-[11px] text-slate-500 text-center sm:text-right max-w-xl leading-relaxed">
            FinLit MOMENT is demonstrated using synthetic investor data and illustrative assumptions. Scenario outcomes are not forecasts or guarantees. The investor remains responsible for all financial decisions.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
