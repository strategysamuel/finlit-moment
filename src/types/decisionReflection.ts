import { InvestorProfile, FinancialGoal } from './index';
import { AuthoritativeM5Comparison } from './followUp';
import { CalculatedScenarioResult } from '../services/scenarioEngine';

/**
 * FinLit MOMENT Behavioral Decision Intelligence Types (Milestone 7)
 *
 * Helps the investor reflect on decision context without psychological diagnosis,
 * advice, or automated actions.
 */

export interface DecisionReflectionIntelligence {
  contextObservation: string;
  possibleInfluences: string[];
  reflectionQuestions: string[];
  longTermPerspective: string;
  guardrail: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
}

export interface DecisionReflectionInput {
  comparison: AuthoritativeM5Comparison;
  scenarios: {
    continue: CalculatedScenarioResult;
    reduce: CalculatedScenarioResult;
    pause: CalculatedScenarioResult;
  };
  investor?: InvestorProfile;
  goal?: FinancialGoal;
}
