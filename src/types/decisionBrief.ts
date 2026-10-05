import { InvestorProfile, FinancialGoal } from './index';
import { AuthoritativeM5Comparison } from './followUp';
import { CalculatedScenarioResult } from '../services/scenarioEngine';

/**
 * FinLit MOMENT Decision Brief Types (Milestone 6)
 *
 * Concise, contextual synthesis bringing together:
 * 1. What is happening now
 * 2. What changed since the previous decision
 * 3. What the investor previously decided
 * 4. What the deterministic scenarios show
 * 5. What matters most right now
 * 6. What the investor may want to review
 * 7. Why MOMENT is surfacing this information
 */

export interface DecisionBriefIntelligence {
  headline: string;
  summary: string;
  whatChanged: string[];
  whatStayedConsistent: string[];
  decisionContext: string;
  scenarioInterpretation: string;
  reviewFactors: string[];
  confidence: 'context-complete' | 'context-limited';
  disclaimer: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
}

export interface DecisionBriefViewModel {
  investor: InvestorProfile;
  goal: FinancialGoal;
  comparison: AuthoritativeM5Comparison;
  scenarios: {
    continue: CalculatedScenarioResult;
    reduce: CalculatedScenarioResult;
    pause: CalculatedScenarioResult;
  };
  intelligence?: DecisionBriefIntelligence;
}
