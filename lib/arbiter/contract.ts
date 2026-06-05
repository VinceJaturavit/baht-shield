// Arbiter Phase 1 — Canonical Event Contract
// All types flow from this file. _scenario_label is metadata only; it never
// enters feature computation, scoring, or Zen-Engine rule evaluation.

export type ArbiterDirection = 'outbound' | 'inbound';

export type ArbiterRail =
  | 'promptpay'
  | 'bank_transfer'
  | 'internal';

export type ArbiterSource =
  | 'seed'
  | 'mockingbird'
  | 'verity';

export type ArbiterScenarioLabel =
  | 'onboarding_mule_farm'
  | 'sleeper_activation'
  | 'app_scam_cashout'
  | 'background';

export type ArbiterDecision =
  | 'APPROVE'
  | 'STEP_UP'
  | 'REVIEW'
  | 'BLOCK';

export type BeneficiaryRiskTier =
  | 'black'
  | 'dark_grey'
  | 'light_grey'
  | 'clean';

export interface ArbiterGeo {
  lat: number;
  lon: number;
}

export interface ArbiterEvent {
  event_id: string;
  wallet_id: string;
  timestamp: string;
  amount_thb: number;
  direction: ArbiterDirection;
  rail: ArbiterRail;
  beneficiary_id: string | null;
  device_id: string;
  ip_country: string;
  has_facial_scan: boolean;
  geo: ArbiterGeo | null;
  source: ArbiterSource;

  /**
   * Scenario label is for synthetic QA / UI filtering ONLY.
   * It must never enter feature computation, weighted scoring, or Zen-Engine rules.
   * Use stripScenarioLabel() before any scoring or rule evaluation.
   */
  _scenario_label?: ArbiterScenarioLabel;
}

// ---------------------------------------------------------------------------
// Response contracts
// ---------------------------------------------------------------------------

export interface ArbiterFeatureResult {
  key: string;
  value: number | boolean | string;
  normalized_value?: number;
  explanation: string;
}

export interface ArbiterFeatureContribution {
  key: string;
  value: number | boolean | string;
  weight: number;
  points: number;
  explanation: string;
}

export interface ArbiterRuleHit {
  rule_id: string;
  action: ArbiterDecision;
  reason_code: string;
  explanation: string;
}

export interface ArbiterScoreResult {
  score: number;
  contributions: ArbiterFeatureContribution[];
}

export interface ArbiterDecisionResult {
  action: ArbiterDecision;
  reasons: ArbiterRuleHit[];
  precedence_explanation: string;
}

export interface ArbiterScoreResponseItem {
  event: ArbiterEvent;
  features: ArbiterFeatureResult[];
  score: ArbiterScoreResult;
  fired_rules: ArbiterRuleHit[];
  final_decision: ArbiterDecisionResult;
}

// ---------------------------------------------------------------------------
// IP Gate helper — must be called before any feature/rule computation
// ---------------------------------------------------------------------------

/**
 * Strips _scenario_label before feature computation, scoring, or rule input.
 * This is the IP Gate enforcement point. The scenario label is purely
 * synthetic metadata for UI filtering and QA; it must never influence
 * the fraud signal pipeline.
 */
export function stripScenarioLabel(
  event: ArbiterEvent,
): Omit<ArbiterEvent, '_scenario_label'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _scenario_label, ...safeEvent } = event;
  return safeEvent;
}
