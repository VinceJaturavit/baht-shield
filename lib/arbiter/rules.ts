// Arbiter Phase 1 — Rules Adapter (Zen-Engine)
//
// Loads the JDM file, executes it via @gorules/zen-engine, and applies
// the BLOCK > REVIEW > STEP_UP > score-band precedence order.
//
// Rule CONDITIONS live exclusively in the JDM. This file does not re-evaluate
// any conditions — it only sorts and picks from the JDM's COLLECT output.

import { readFileSync } from 'fs';
import path from 'path';
import type { ArbiterEvent, ArbiterDecision, ArbiterDecisionResult, ArbiterRuleHit } from './contract';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArbiterRulesInput {
  event: Omit<ArbiterEvent, '_scenario_label'>;
  features: Record<string, number | boolean | string>;
  score: number;
}

// Shape of one row returned by the JDM COLLECT decision table
interface JdmRuleRow {
  action: string;
  rule_id: string;
  reason_code: string;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Precedence ordering — higher number = higher priority
// This is NOT a rule condition. It is purely a sort key on the JDM's output.
// ---------------------------------------------------------------------------
const PRECEDENCE: Record<ArbiterDecision, number> = {
  BLOCK: 4,
  REVIEW: 3,
  STEP_UP: 2,
  APPROVE: 1,
};

function toDecision(raw: string): ArbiterDecision {
  if (raw === 'BLOCK' || raw === 'REVIEW' || raw === 'STEP_UP' || raw === 'APPROVE') {
    return raw;
  }
  return 'APPROVE';
}

// ---------------------------------------------------------------------------
// JDM loader — reads once from repo root; cached across requests in the same
// Node.js process lifetime (module-level singleton).
// ---------------------------------------------------------------------------
let _jdmContent: Buffer | null = null;

function loadJdm(): Buffer {
  if (!_jdmContent) {
    const jdmPath = path.resolve(process.cwd(), 'rules/arbiter/phase1_decisioning.jdm.json');
    _jdmContent = readFileSync(jdmPath);
  }
  return _jdmContent;
}

// ---------------------------------------------------------------------------
// runArbiterRules
//
// _scenario_label is impossible to pass here: ArbiterRulesInput.event is
// typed as Omit<ArbiterEvent, '_scenario_label'>, and the features record
// is built from computeArbiterFeatures which never emits _scenario_label.
// ---------------------------------------------------------------------------
export async function runArbiterRules(
  input: ArbiterRulesInput,
): Promise<ArbiterDecisionResult> {
  // Build the flat context object the JDM input node will receive.
  // Contains: event signal fields + each feature by key + composite score.
  // _scenario_label is absent by type contract.
  const context: Record<string, number | boolean | string | null> = {
    // Event signals used by explicit rules
    amount_thb: input.event.amount_thb,
    has_facial_scan: input.event.has_facial_scan,
    // Features and score
    ...input.features,
    score: input.score,
  };

  let firedRules: ArbiterRuleHit[] = [];

  try {
    // Dynamic import keeps @gorules/zen-engine server-only (next.config serverExternalPackages)
    const { ZenEngine } = await import('@gorules/zen-engine');
    const engine = new ZenEngine();
    const jdm = loadJdm();
    const decision = engine.createDecision(jdm);
    const result = await decision.evaluate(context);

    // With COLLECT hit policy, result.result is an array of matched rule rows.
    // If the engine wraps the array in an object, unwrap it.
    const rawResult = result?.result ?? result;
    const rows: JdmRuleRow[] = Array.isArray(rawResult) ? rawResult : [];

    firedRules = rows.map((row) => ({
      rule_id: row.rule_id ?? 'UNKNOWN',
      action: toDecision(row.action ?? 'APPROVE'),
      reason_code: row.reason_code ?? 'UNKNOWN',
      explanation: row.explanation ?? '',
    }));
  } catch (err) {
    // Zen-Engine failed to load or evaluate. Per Spec-001b: do NOT silently
    // fall back to score-band. Surface the failure so it is visible in logs
    // and in the API response, rather than producing a misleading APPROVE/BLOCK.
    // This is a hard escalation signal — see rules/arbiter/README.md.
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[Arbiter] Zen-Engine evaluation failed — NOT falling back to score-band:', errMsg);
    firedRules = [{
      rule_id: 'ENGINE_FAILED',
      action: 'BLOCK',
      reason_code: 'ZEN_ENGINE_LOAD_FAILURE',
      explanation: `Zen-Engine failed to load or evaluate: ${errMsg}. Blocking as fail-safe. Requires escalation.`,
    }];
  }

  if (firedRules.length === 0) {
    firedRules = buildScoreBandFallback(input.score);
  }

  // Apply precedence: pick the highest-priority action from all fired rules.
  const sorted = [...firedRules].sort(
    (a, b) => (PRECEDENCE[b.action] ?? 0) - (PRECEDENCE[a.action] ?? 0),
  );
  const finalAction = sorted[0].action;

  // Collect all rules that contributed to or overrode the final decision
  const reasons = firedRules.filter((r) => r.rule_id !== 'SCORE_BAND' || r.action === finalAction);

  const precedenceExplanation = buildPrecedenceExplanation(finalAction, firedRules, input.score);

  return {
    action: finalAction,
    reasons: firedRules,
    precedence_explanation: precedenceExplanation,
  };
}

// ---------------------------------------------------------------------------
// Score-band fallback — mirrors the JDM score-band logic for error resilience.
// This is NOT a rule condition duplication; it is an emergency fallback that
// produces the same output as the JDM would for the score-band rows only.
// ---------------------------------------------------------------------------
function buildScoreBandFallback(score: number): ArbiterRuleHit[] {
  if (score >= 75) {
    return [{ rule_id: 'SCORE_BAND', action: 'BLOCK', reason_code: 'SCORE_HIGH_RISK', explanation: `Composite fraud score ${score} >= 75 — score-band BLOCK threshold.` }];
  }
  if (score >= 50) {
    return [{ rule_id: 'SCORE_BAND', action: 'REVIEW', reason_code: 'SCORE_MEDIUM_RISK', explanation: `Composite fraud score ${score} in [50, 75) — score-band REVIEW threshold.` }];
  }
  if (score >= 25) {
    return [{ rule_id: 'SCORE_BAND', action: 'STEP_UP', reason_code: 'SCORE_LOW_RISK', explanation: `Composite fraud score ${score} in [25, 50) — score-band STEP_UP threshold.` }];
  }
  return [{ rule_id: 'SCORE_BAND', action: 'APPROVE', reason_code: 'SCORE_MINIMAL_RISK', explanation: `Composite fraud score ${score} < 25 — score-band APPROVE threshold.` }];
}

// ---------------------------------------------------------------------------
// Human-readable precedence explanation for the UI explainability drawer
// ---------------------------------------------------------------------------
function buildPrecedenceExplanation(
  finalAction: ArbiterDecision,
  allRules: ArbiterRuleHit[],
  score: number,
): string {
  const namedRules = allRules.filter((r) => r.rule_id !== 'SCORE_BAND');
  const scoreBand = allRules.find((r) => r.rule_id === 'SCORE_BAND');

  if (namedRules.length === 0) {
    return `Score-band decision: composite score ${score} maps to ${finalAction}.`;
  }

  const blockingRules = namedRules.filter((r) => r.action === 'BLOCK');
  const reviewRules = namedRules.filter((r) => r.action === 'REVIEW');
  const stepUpRules = namedRules.filter((r) => r.action === 'STEP_UP');

  if (finalAction === 'BLOCK' && blockingRules.length > 0) {
    const codes = blockingRules.map((r) => `${r.rule_id} ${r.reason_code}`).join(', ');
    const scoreBandNote = scoreBand ? ` despite score-band suggesting ${scoreBand.action} (score ${score})` : '';
    return `Blocked by ${codes}${scoreBandNote} — BLOCK rules always override lower-precedence outcomes.`;
  }

  if (finalAction === 'REVIEW' && reviewRules.length > 0) {
    const codes = reviewRules.map((r) => `${r.rule_id} ${r.reason_code}`).join(', ');
    const scoreBandNote = scoreBand && scoreBand.action === 'STEP_UP'
      ? ` overriding score-band STEP_UP (score ${score})`
      : '';
    return `Review required by ${codes}${scoreBandNote} — REVIEW takes precedence over STEP_UP.`;
  }

  if (finalAction === 'STEP_UP' && stepUpRules.length > 0) {
    const codes = stepUpRules.map((r) => `${r.rule_id} ${r.reason_code}`).join(', ');
    return `Step-up required by ${codes}. Composite score: ${score}.`;
  }

  return `Final decision ${finalAction} — composite score ${score}.`;
}
