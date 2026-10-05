import {
  InvestorProfile,
  PortfolioSummary,
  FinancialGoal,
  InvestmentAsset,
  SimulatedMarketEvent,
  DecisionContext,
  GeminiMomentInsight,
} from '../types';
import {
  DEMO_INVESTOR,
  DEMO_PORTFOLIO,
  DEMO_GOALS,
  DEMO_INVESTMENTS,
  DEMO_MARKET_EVENT,
  DEMO_DECISION_CONTEXT,
} from '../data/demoData';

export interface MomentInsightContext {
  investor: InvestorProfile;
  portfolio: PortfolioSummary;
  goal: FinancialGoal;
  investment: InvestmentAsset;
  marketContext: SimulatedMarketEvent;
  decisionContext: DecisionContext;
}

export interface ScenarioExplanationResponse {
  headline: string;
  plainLanguageExplanation: string;
  tradeoffSummary: string;
  horizonContext: string;
  disclaimer: string;
  isAiGenerated?: boolean;
  isFallback?: boolean;
  modelUsed?: string;
  generatedAt?: string;
}

export interface ScenarioExplanationInput {
  selectedScenario: 'continue' | 'reduce' | 'pause';
  calculatedResults: any;
  investor?: InvestorProfile;
  goal?: FinancialGoal;
  assumptions?: any;
}

export interface MemoryComparisonInput {
  currentRecord: any;
  previousRecord: any;
  investor?: InvestorProfile;
}

export interface FollowUpIntelligenceInput {
  followUpData: any;
  investor?: InvestorProfile;
  goal?: FinancialGoal;
  scenarioOutputs?: any;
}

export interface DecisionBriefInput {
  comparison: any;
  scenarios: any;
  investor?: InvestorProfile;
  goal?: FinancialGoal;
}

export interface DecisionReflectionInput {
  comparison: any;
  scenarios: any;
  investor?: InvestorProfile;
  goal?: FinancialGoal;
}

/**
 * FinLit MOMENT AI Decision Support Service (Milestone 2, Milestone 3, Milestone 4, Milestone 5, Milestone 6, Milestone 7)
 *
 * Secure Gemini-powered decision intelligence:
 * - Server-side only: never exposes API keys in browser bundles.
 * - Single structured entry point: generateMomentInsight(context).
 * - M3 Scenario Explanation Layer: explainScenario(context) strictly explains calculated numbers.
 * - M4 Decision Memory Comparison Layer: compareDecisionMemories(context) explains differences between past and present decisions.
 * - M5 Follow-Up Intelligence Layer: generateFollowUpIntelligence(context) analyzes post-decision context evolution.
 * - M6 Decision Brief Layer: generateDecisionBrief(context) synthesizes concise, contextual decision briefs.
 * - M7 Behavioral Decision Intelligence: generateDecisionReflection(context) guides neutral decision reflection without diagnosis.
 * - Enforces financial guardrails, fact vs simulation segregation.
 * - Provides graceful deterministic fallback if server/Gemini is unavailable.
 */
class AIService {
  private apiEndpoint = '/api/ai/decision-support';
  private scenarioApiEndpoint = '/api/ai/scenario-explanation';
  private memoryComparisonApiEndpoint = '/api/ai/decision-memory-comparison';
  private followUpApiEndpoint = '/api/ai/follow-up-intelligence';
  private decisionBriefApiEndpoint = '/api/ai/decision-brief';
  private decisionReflectionApiEndpoint = '/api/ai/decision-reflection';

  /**
   * Generates behavioral decision reflection synthesis (M7).
   */
  async generateDecisionReflection(input: DecisionReflectionInput): Promise<any> {
    const payload = {
      comparison: input.comparison,
      scenarios: input.scenarios,
      investor: input.investor || DEMO_INVESTOR,
      goal: input.goal || DEMO_GOALS[0],
    };

    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(this.decisionReflectionApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.contextObservation) {
            return {
              contextObservation: data.contextObservation,
              possibleInfluences: Array.isArray(data.possibleInfluences) ? data.possibleInfluences : [],
              reflectionQuestions: Array.isArray(data.reflectionQuestions) ? data.reflectionQuestions : [],
              longTermPerspective: data.longTermPerspective || '',
              guardrail:
                data.guardrail ||
                'MOMENT helps you reflect on your decision context. You remain responsible for the decision. These are contextual factors to consider, not conclusions about your intent.',
              isAiGenerated: data.isAiGenerated !== false,
              isFallback: data.isFallback === true,
              modelUsed: data.modelUsed,
              generatedAt: data.generatedAt || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e: any) {
      console.warn('Decision Reflection API call failed, using deterministic fallback:', e?.message);
    }

    return this.getFallbackDecisionReflection();
  }

  getFallbackDecisionReflection(): any {
    return {
      contextObservation:
        'On your Decision Date (October 5, 2026), you chose to reduce your monthly contribution from ₹25,000 to ₹12,500 amid an 8.2% market drawdown and a 6.8% portfolio pullback, when your Child Education goal was 71% funded with ₹24,85,000 accumulated.',
      possibleInfluences: [
        'Simulated short-term market volatility and negative index movements on the October 5, 2026 decision date.',
        'Portfolio drawdown of -6.8% creating heightened awareness of short-term volatility.',
        'Household desire for monthly cash-flow flexibility and near-term liquidity buffer.',
        'Confidence in the remaining 6.0-year timeline alongside ₹24.85L in accumulated corpus.',
        'Preference to maintain ongoing investment discipline through a reduced commitment rather than halting completely.',
      ],
      reflectionQuestions: [
        'Would you make the same SIP decision if the market had not recently fallen?',
        'Has your household cash-flow situation changed since October?',
        'Has your investment horizon or goal priority changed?',
        'Has your tolerance for investment volatility changed as market conditions stabilized?',
      ],
      longTermPerspective:
        'In the subsequent Simulated Follow-Up Context (Follow-up observation — November 15, 2026), simulated market movement moderated to -4.8% and portfolio movement to -3.9%, while your accumulated corpus grew by ₹27,000 to reach ₹25,12,000 (advancing goal progress from 71% to 72%). Your market and portfolio context has improved since the decision, while your contribution level remains reduced. This improvement does not prove the decision was right or wrong, but offers an updated perspective for your long-term 2032 milestone.',
      guardrail:
        'MOMENT helps you reflect on your decision context. You remain responsible for the decision. These are contextual factors to consider, not conclusions about your intent. No transaction is executed.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates concise, contextual Decision Brief synthesis (M6).
   */
  async generateDecisionBrief(input: DecisionBriefInput): Promise<any> {
    const payload = {
      comparison: input.comparison,
      scenarios: input.scenarios,
      investor: input.investor || DEMO_INVESTOR,
      goal: input.goal || DEMO_GOALS[0],
    };

    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(this.decisionBriefApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.headline && data.summary) {
            return {
              headline: data.headline,
              summary: data.summary,
              whatChanged: Array.isArray(data.whatChanged) ? data.whatChanged : [],
              whatStayedConsistent: Array.isArray(data.whatStayedConsistent) ? data.whatStayedConsistent : [],
              decisionContext: data.decisionContext || '',
              scenarioInterpretation: data.scenarioInterpretation || '',
              reviewFactors: Array.isArray(data.reviewFactors) ? data.reviewFactors : [],
              confidence: data.confidence === 'context-limited' ? 'context-limited' : 'context-complete',
              disclaimer:
                data.disclaimer ||
                'This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. MOMENT does not execute transactions. The investor remains in full control.',
              isAiGenerated: data.isAiGenerated !== false,
              isFallback: data.isFallback === true,
              modelUsed: data.modelUsed,
              generatedAt: data.generatedAt || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e: any) {
      console.warn('Decision Brief API call failed, using deterministic fallback:', e?.message);
    }

    return this.getFallbackDecisionBrief(input.comparison, input.scenarios);
  }

  getFallbackDecisionBrief(comparison: any, scenarios: any): any {
    return {
      headline: 'Decision Synthesis: Navigating Your Post-Adjustment Position',
      summary:
        'Since your October decision to reduce monthly contributions to ₹12,500, simulated market and portfolio drawdowns have moderated (-4.8% vs -8.2% and -3.9% vs -6.8%), while goal progress advanced to 72% with ₹25,12,000 accumulated (+₹27,000 increase). Under current illustrative scenario assumptions, your active ₹12,500 monthly contribution remains associated with a projected surplus (+₹23,99,483) over your ₹35L target.',
      whatChanged: [
        'Simulated market movement improved from -8.2% to -4.8%.',
        'Portfolio movement recovered from -6.8% to -3.9%.',
        'Accumulated value increased by ₹27,000 since the decision (₹25,12,000 vs ₹24,85,000).',
        'Goal progress advanced from 71% to 72%.',
        'Remaining horizon is now approximately 5.9 years until target year 2032.',
      ],
      whatStayedConsistent: [
        'Target goal remains Child Education with a ₹35,00,000 funding requirement.',
        'Monthly SIP remains active at the reduced ₹12,500 level.',
        'Investor risk tolerance profile remains Moderate.',
        'All three deterministic scenarios remain above the ₹35L target under current illustrative assumptions.',
        'Investor sovereignty: MOMENT informs the investor; the investor decides.',
      ],
      decisionContext:
        'On October 5, 2026, you chose to reduce your monthly contribution from ₹25,000 to ₹12,500 to preserve cash flow during market weakness while maintaining continuous disciplined unit accumulation.',
      scenarioInterpretation:
        'Deterministic scenario simulations show that continuing at ₹12,500/month projects a final corpus of ₹58,99,483 (+₹23.99L surplus). Even pausing entirely projects ₹46,53,094 (+₹11.53L surplus), while resuming ₹25,000/month projects ₹71,45,872 (+₹36.45L surplus). All three scenarios remain above target under illustrative assumptions.',
      reviewFactors: [
        'Whether the reduced contribution still fits your longer-term goal priorities.',
        'Whether your monthly cash-flow preference has changed since October.',
        'Whether the current contribution level remains appropriate as your personal circumstances evolve.',
        'Whether the assumptions used in the illustration remain reasonable for your 5.9-year planning horizon.',
      ],
      confidence: 'context-complete',
      disclaimer:
        'This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. MOMENT does not execute transactions. The investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates post-decision follow-up intelligence (M5).
   * Explains what changed after an investor's decision in neutral, objective language.
   */
  async generateFollowUpIntelligence(
    input: FollowUpIntelligenceInput
  ): Promise<any> {
    const payload = {
      followUpData: input.followUpData,
      investor: input.investor || DEMO_INVESTOR,
      goal: input.goal || DEMO_GOALS[0],
      scenarioOutputs: input.scenarioOutputs,
    };

    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(this.followUpApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.headline && data.summary) {
            return {
              headline: data.headline,
              summary: data.summary,
              whatChanged: Array.isArray(data.whatChanged) ? data.whatChanged : [],
              whatStayedSimilar: Array.isArray(data.whatStayedSimilar) ? data.whatStayedSimilar : [],
              goalContext: data.goalContext || '',
              decisionContext: data.decisionContext || '',
              reviewFactors: Array.isArray(data.reviewFactors) ? data.reviewFactors : [],
              confidence: 'Context completeness: High',
              disclaimer:
                data.disclaimer ||
                'This is contextual decision support based on synthetic demo data, not financial advice. No transaction is executed.',
              isAiGenerated: data.isAiGenerated !== false,
              isFallback: data.isFallback === true,
              modelUsed: data.modelUsed,
              generatedAt: data.generatedAt || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e: any) {
      console.warn('Follow-up intelligence API call failed, using deterministic fallback:', e?.message);
    }

    return this.getFallbackFollowUpIntelligence(input.followUpData);
  }

  getFallbackFollowUpIntelligence(followUpData: any): any {
    return {
      headline: 'Post-Decision Context Evolution: Reviewing Your SIP Reduction',
      summary:
        'Since your October decision to reduce your monthly contribution to ₹12,500, the simulated market environment has shown signs of stabilization (-4.8% vs -8.2%) while your Child Education goal has progressed from 71% to 72% with accumulated capital increasing by ₹27,000. Under the current illustrative assumptions, continuing the ₹12,500 monthly contribution remains above the ₹35L target trajectory, while actual outcomes may vary.',
      whatChanged: [
        'Simulated market drawdown moderated from -8.2% to -4.8%.',
        'Portfolio movement recovered from -6.8% to -3.9% relative drawdown.',
        'Monthly capital commitment is currently active at ₹12,500 (reduced by 50%).',
        'Accumulated capital has increased by ₹27,000 since the decision (₹25,12,000 vs ₹24,85,000).',
        'Goal progress advanced from 71% to 72%.',
        'Remaining horizon is now 5.9 years until target year 2032.',
      ],
      whatStayedSimilar: [
        'Target goal remains Child Education with a ₹35,00,000 funding requirement.',
        'Investor risk profile remains Moderate.',
        'Under current illustrative assumptions, the goal remains above the target trajectory.',
        'Investor sovereignty: every decision remains entirely in your hands.',
      ],
      goalContext:
        'Under current illustrative assumptions, the goal remains above the target trajectory with a projected corpus of ₹58,99,483 and an estimated surplus of ₹23,99,483. This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ.',
      decisionContext:
        'Your choice to reduce your SIP to ₹12,500 preserved monthly cash flow during the market dip while maintaining ongoing disciplined unit accumulation.',
      reviewFactors: [
        'Evaluating whether current cash-flow needs still require the reduced allocation.',
        'Assessing how long-term rupee-cost averaging aligns with the 5.9-year timeline.',
        'Reviewing the goal trajectory in the Scenario Simulator before deciding on next steps.',
      ],
      confidence: 'Context completeness: High',
      disclaimer:
        'This is a mathematical illustration, not a return forecast or guarantee. Actual investment outcomes may differ. No transaction is executed. The investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Compares current decision context with historical decision context (M4).
   * Gemini provides neutral contextual explanation, never making recommendations or transactions.
   */
  async compareDecisionMemories(
    input: MemoryComparisonInput
  ): Promise<any> {
    const payload = {
      currentRecord: input.currentRecord,
      previousRecord: input.previousRecord,
      investor: input.investor || DEMO_INVESTOR,
    };

    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(this.memoryComparisonApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.headline && data.summary) {
            return {
              headline: data.headline,
              summary: data.summary,
              whatChanged: Array.isArray(data.whatChanged) ? data.whatChanged : [],
              whatStayedSimilar: Array.isArray(data.whatStayedSimilar) ? data.whatStayedSimilar : [],
              goalContext: data.goalContext || '',
              decisionContext: data.decisionContext || '',
              neutralObservation: data.neutralObservation || '',
              confidenceLabel: data.confidenceLabel || 'Context completeness: High',
              disclaimer:
                data.disclaimer ||
                'This is contextual decision support based on synthetic demo data, not financial advice. No transaction is executed.',
              isAiGenerated: data.isAiGenerated !== false,
              isFallback: data.isFallback === true,
              modelUsed: data.modelUsed,
              generatedAt: data.generatedAt || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e: any) {
      console.warn('Memory comparison API call failed, using deterministic fallback:', e?.message);
    }

    return this.getFallbackMemoryComparison(input.currentRecord, input.previousRecord);
  }

  getFallbackMemoryComparison(current: any, previous: any): any {
    return {
      headline: "What's Different Today Compared to Your Previous Decision",
      summary:
        "Today's market movement is more pronounced (-8.2% vs -4.1%) than in the previous recorded decision, while your goal progress has increased from 62% to 71%. The remaining horizon is still long enough to evaluate the decision in the context of the full goal rather than short-term market movement.",
      whatChanged: [
        "Market decline is steeper today (-8.2% vs -4.1% in July 2026).",
        "Portfolio movement is lower (-6.8% vs -3.2% in July 2026).",
        "Goal progress has strengthened from 62% to 71% (accumulated ₹24.85L vs ₹21.70L).",
        "Remaining horizon is now 6.0 years until target year 2032.",
      ],
      whatStayedSimilar: [
        "Committed monthly SIP amount remains ₹25,000 in FinLit Flexi Growth Fund.",
        "Investor risk tolerance profile remains Moderate.",
        "Primary anchor remains Child Education with a ₹35,00,000 target.",
        "Investor sovereignty: every choice remains under your direct control.",
      ],
      goalContext:
        "Your accumulated corpus is now ₹24,85,000 (71% of target), which creates a larger base for long-term compounding than during the previous review.",
      decisionContext:
        "In July, you chose to continue contributions through a -4.1% market dip. Today's -8.2% contraction represents a wider pullback, but occurs against a stronger goal foundation.",
      neutralObservation:
        "Evaluating decisions against long-term goal horizons helps prevent emotional reactions to short-term market volatility.",
      confidenceLabel: "Context completeness: High",
      disclaimer:
        "This is contextual decision support based on synthetic demo data, not financial advice. No transaction is executed. The investor remains in full control.",
      isAiGenerated: false,
      isFallback: true,
      modelUsed: "deterministic-engine",
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Explains deterministic scenario calculation results in neutral plain language (M3).
   * Gemini explains but never recalculates or modifies the numbers.
   */
  async explainScenario(
    input: ScenarioExplanationInput
  ): Promise<ScenarioExplanationResponse> {
    const payload = {
      selectedScenario: input.selectedScenario,
      calculatedResults: input.calculatedResults,
      investor: input.investor || DEMO_INVESTOR,
      goal: input.goal || DEMO_GOALS[0],
      assumptions: input.assumptions,
    };

    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(this.scenarioApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.plainLanguageExplanation) {
            return {
              headline: data.headline || `Scenario Analysis (${input.selectedScenario})`,
              plainLanguageExplanation: data.plainLanguageExplanation,
              tradeoffSummary: data.tradeoffSummary || '',
              horizonContext: data.horizonContext || '',
              disclaimer:
                data.disclaimer ||
                'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
              isAiGenerated: data.isAiGenerated !== false,
              isFallback: data.isFallback === true,
              modelUsed: data.modelUsed,
              generatedAt: data.generatedAt || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e: any) {
      console.warn('Scenario explanation API call failed, using deterministic fallback:', e?.message);
    }

    return this.getFallbackScenarioExplanation(input.selectedScenario, input.calculatedResults);
  }

  getFallbackScenarioExplanation(
    scenario: 'continue' | 'reduce' | 'pause',
    results: any
  ): ScenarioExplanationResponse {
    if (scenario === 'pause') {
      return {
        headline: 'Scenario Analysis: Pausing SIP Contributions (₹0/mo)',
        plainLanguageExplanation:
          `With the SIP paused, no additional monthly contributions are included in this scenario. Under the stated illustrative assumptions, this creates a projected funding gap of ₹${(results?.projectedGap || 940000).toLocaleString('en-IN')} relative to the ₹35,00,000 Child Education target.`,
        tradeoffSummary:
          'This choice halts capital deployment during market dips and preserves monthly cash flow, but significantly lowers the projected corpus.',
        horizonContext:
          'Over your 6-year remaining horizon, this scenario creates an estimated 2.8 year delay to fully fund college costs under these assumptions.',
        disclaimer:
          'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
        isAiGenerated: false,
        isFallback: true,
        modelUsed: 'deterministic-engine',
        generatedAt: new Date().toISOString(),
      };
    }
    if (scenario === 'reduce') {
      return {
        headline: 'Scenario Analysis: Reducing SIP by 50% (₹12,500/mo)',
        plainLanguageExplanation:
          `Under this illustrative scenario, contributing ₹12,500 per month maintains regular compounding while moderating your cash flow requirement. Under the stated assumptions, this reaches approximately 89% of your ₹35,00,000 target, leaving an estimated gap of ₹${(results?.projectedGap || 380000).toLocaleString('en-IN')}.`,
        tradeoffSummary:
          'Provides immediate monthly cash-flow relief while preserving partial unit accumulation at prevailing market NAVs.',
        horizonContext:
          'Across the 6-year timeline, this balanced path results in an estimated delay of 1.4 years relative to the target schedule under these assumptions.',
        disclaimer:
          'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
        isAiGenerated: false,
        isFallback: true,
        modelUsed: 'deterministic-engine',
        generatedAt: new Date().toISOString(),
      };
    }
    return {
      headline: 'Scenario Analysis: Continuing Regular SIP (₹25,000/mo)',
      plainLanguageExplanation:
        `Under this illustrative scenario, continuing your full ₹25,000 monthly SIP projects a corpus of approximately ₹${(results?.projectedCorpusAtYear6 || 3680000).toLocaleString('en-IN')}, fully reaching the ₹35,00,000 target under the stated illustrative assumptions.`,
      tradeoffSummary:
        'Requires maintaining regular monthly capital deployment through short-term market dips to capture rupee-cost averaging advantages.',
      horizonContext:
        'Your 6-year horizon until 2032 allows time for temporary market downturns to smooth out through disciplined, uninterrupted contributions.',
      disclaimer:
        'Illustrative simulation using synthetic assumptions. Not an investment return forecast or financial advice. The investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      modelUsed: 'deterministic-engine',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates structured decision support for an investor contemplating an SIP change.
   */
  async generateMomentInsight(
    input?: Partial<MomentInsightContext>
  ): Promise<GeminiMomentInsight> {
    const context: MomentInsightContext = {
      investor: input?.investor || DEMO_INVESTOR,
      portfolio: input?.portfolio || DEMO_PORTFOLIO,
      goal: input?.goal || DEMO_GOALS[0],
      investment: input?.investment || DEMO_INVESTMENTS[0],
      marketContext: input?.marketContext || DEMO_MARKET_EVENT,
      decisionContext: input?.decisionContext || DEMO_DECISION_CONTEXT,
    };

    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.headline && data.summary) {
            return this.sanitizeInsight(data);
          }
        }
      }
    } catch (err: any) {
      console.warn('Backend decision-support endpoint unreachable, using safe fallback:', err?.message);
    }

    // Safe deterministic fallback when offline, error, or unconfigured key
    return this.getFallbackInsight(context, "MOMENT couldn't generate a fresh AI insight right now.");
  }

  /**
   * Deterministic domain fallback maintaining application usability and accuracy.
   */
  getFallbackInsight(
    context: MomentInsightContext,
    failureNotice?: string
  ): GeminiMomentInsight {
    const isReduce = context.decisionContext.proposedAction === 'reduce';

    return {
      decisionType: isReduce ? 'SIP_REDUCE' : 'SIP_PAUSE',
      headline: isReduce
        ? 'Before you reduce your SIP...'
        : 'Before you pause your SIP...',
      summary:
        'The recent 6.8% portfolio decline is broadly aligned with the simulated 8.2% market movement. Because your education goal is still 6 years away, pausing your ₹25,000 monthly SIP forfeits accumulating mutual fund units at lower NAVs and could create a projected ₹9.4L shortfall.',
      marketContext:
        'Simulated Nifty 50 benchmark index experienced a -8.2% pullback under synthetic macro testing conditions. Broad market volatility is an expected occurrence in equity investing.',
      portfolioContext:
        'Your portfolio is down -6.8% (current value ₹18,42,600), demonstrating a +1.4% defensive buffer over the simulated market dip due to moderate asset diversification across debt and equities.',
      goalContext:
        'Your Child Education goal requires ₹35,00,000 with 6 years remaining (Year 2032). You have accumulated ₹24,85,000 (71% of target), making the final 6 years of uninterrupted contributions decisive.',
      riskContext:
        'As a Moderate risk investor with a 6+ year horizon, temporary cyclical drawdowns are a standard trade-off for long-term real wealth creation.',
      decisionImpact:
        'Pausing completely halts monthly capital deployment when prices are lower, creating an estimated ₹9.4L shortfall against your ₹35L goal and potentially delaying goal realization by 2.8 years.',
      factors: [
        'Market movement: -8.2% (Simulated Nifty 50 dip)',
        'Portfolio movement: -6.8% (+1.4% defensive buffer)',
        'Investment horizon: 6+ years remaining until 2032',
        'Financial goal: Child Education (Target ₹35,00,000)',
        'Goal progress: 71% completed (₹24.85L accumulated)',
        'Risk profile: Moderate risk tolerance',
        'SIP amount: ₹25,000/month regular contribution in FinLit Flexi Growth Fund',
      ],
      alternatives: [
        {
          action: 'CONTINUE',
          description:
            'Maintain regular ₹25,000/month SIP to accumulate additional units at discounted NAVs during this simulated correction.',
        },
        {
          action: 'REDUCE',
          description:
            'Lower monthly allocation to ₹12,500/month (50% reduction) to balance monthly cash flow while keeping 89% of your education goal funded.',
        },
        {
          action: 'PAUSE',
          description:
            'Halt all contributions temporarily. Understand that this leaves an estimated ₹9.4L funding gap for college matriculation in 2032.',
        },
      ],
      confidence: 0.87,
      disclaimer:
        'Illustrative simulation based on synthetic assumptions. Actual investment outcomes may differ. Investor remains in full control.',
      isAiGenerated: false,
      isFallback: true,
      generatedAt: new Date().toISOString(),
      errorNote: failureNotice,
    };
  }

  private sanitizeInsight(data: any): GeminiMomentInsight {
    return {
      decisionType: data.decisionType || 'SIP_PAUSE',
      headline: data.headline || 'Before you pause your SIP...',
      summary: data.summary || '',
      marketContext: data.marketContext || '',
      portfolioContext: data.portfolioContext || '',
      goalContext: data.goalContext || '',
      riskContext: data.riskContext || '',
      decisionImpact: data.decisionImpact || '',
      factors: Array.isArray(data.factors) ? data.factors : [],
      alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.87,
      disclaimer:
        data.disclaimer ||
        'Illustrative simulation based on synthetic assumptions. Actual investment outcomes may differ. Investor remains in full control.',
      isAiGenerated: data.isAiGenerated !== false,
      isFallback: data.isFallback === true,
      modelUsed: data.modelUsed,
      generatedAt: data.generatedAt || new Date().toISOString(),
      errorNote: data.errorNote,
    };
  }
}

export const aiService = new AIService();
