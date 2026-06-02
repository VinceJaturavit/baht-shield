// Cases Investigation Workspace — Spec-014
// Pure derivation from local seed data only. No DB, no API, no mutation.
// Case age uses case.opened_at ONLY. No transaction timestamps invented.

import {
  alerts,
  analystPatterns,
  caseNotes,
  cases,
  graphEdges,
  walletAccounts,
} from "./seed-data";

import type {
  AlertScenario,
  AnalystPattern,
  CaseInvestigationStatus,
  CaseSavedView,
  CasesKpis,
  EnrichedCaseDetail,
  EnrichedCaseRow,
  WalletAccount,
} from "./types";

import { getNaiveMissNote } from "./wallet-profile";

// ---------------------------------------------------------------------------
// Precomputed lookup maps
// ---------------------------------------------------------------------------

/** alert_id → Alert */
const alertById = new Map(alerts.map((a) => [a.alert_id, a]));

/** wallet_id → WalletAccount */
const walletById = new Map(walletAccounts.map((w) => [w.wallet_id, w]));

/** pattern_id → AnalystPattern */
const patternById = new Map(analystPatterns.map((p) => [p.pattern_id, p]));

/** wallet_id → pattern_id via graph pattern_match edges */
const walletToPatternId = new Map<string, string>();
for (const edge of graphEdges) {
  if (edge.edge_type === "pattern_match" && edge.to_entity.startsWith("PAT_")) {
    walletToPatternId.set(edge.from_entity, edge.to_entity);
  }
}

/** case_id → CaseNote[] */
const notesByCase = new Map<string, typeof caseNotes>();
for (const note of caseNotes) {
  const existing = notesByCase.get(note.case_id) ?? [];
  existing.push(note);
  notesByCase.set(note.case_id, existing);
}

// ---------------------------------------------------------------------------
// Seed reference date for age computation
// ---------------------------------------------------------------------------

const SEED_REF_DATE = new Date("2026-06-01T00:00:00.000Z");

// ---------------------------------------------------------------------------
// Scenario inference — deterministic, priority order
// ---------------------------------------------------------------------------

function inferScenario(params: {
  alertRuleName: string | null;
  caseId: string;
  patternId: string | null;
}): AlertScenario {
  const rule = (params.alertRuleName ?? "").toUpperCase();
  const cid = params.caseId.toUpperCase();
  const pat = (params.patternId ?? "").toUpperCase();

  // 1. alert.rule_name
  if (rule.includes("MULE_FARM") || rule.includes("PATTERN_MULE_FARM_CLUSTER"))
    return "Onboarding Mule Farm";
  if (rule.includes("SLEEPER_MULE") || rule.includes("PATTERN_SLEEPER_MULE") || rule.includes("DORMANT_REACTIVATION"))
    return "Sleeper Mule Activation";
  if (rule.includes("APP_SCAM") || rule.includes("PATTERN_APP_SCAM"))
    return "APP Scam Cash-out Ring";
  if (rule.includes("CASHOUT_ENDPOINT") || rule.includes("CASHOUT_FREQ") || rule.includes("CROSS_BORDER"))
    return "Endpoint Intelligence";

  // 2. case_id prefix
  if (cid.startsWith("CASE_MF")) return "Onboarding Mule Farm";
  if (cid.startsWith("CASE_SM")) return "Sleeper Mule Activation";
  if (cid.startsWith("CASE_APP")) return "APP Scam Cash-out Ring";

  // 3. linked pattern
  if (pat.includes("PAT_MF")) return "Onboarding Mule Farm";
  if (pat.includes("PAT_SM")) return "Sleeper Mule Activation";
  if (pat.includes("PAT_APP")) return "APP Scam Cash-out Ring";
  if (pat.includes("PAT_ENDPOINT")) return "Endpoint Intelligence";

  return "Background";
}

// ---------------------------------------------------------------------------
// Pattern inference — deterministic fallback chain
// ---------------------------------------------------------------------------

function inferPatternId(params: {
  walletId: string | null;
  alertRuleName: string | null;
  caseId: string;
}): string | null {
  const { walletId, alertRuleName, caseId } = params;

  // Tier 1: graph_edges pattern_match
  if (walletId) {
    const fromGraph = walletToPatternId.get(walletId);
    if (fromGraph) return fromGraph;
  }

  // Tier 2: alert rule_name
  const rule = (alertRuleName ?? "").toUpperCase();
  if (rule.includes("MULE_FARM") || rule.includes("PATTERN_MULE_FARM_CLUSTER")) return "PAT_MF_001";
  if (rule.includes("SLEEPER_MULE") || rule.includes("DORMANT_REACTIVATION")) return "PAT_SM_001";
  if (rule.includes("APP_SCAM")) return "PAT_APP_001";
  if (rule.includes("CASHOUT_ENDPOINT") || rule.includes("CASHOUT_FREQ")) return "PAT_ENDPOINT_001";
  if (rule.includes("CROSS_BORDER")) return "PAT_ENDPOINT_002";

  // Tier 3: case_id prefix
  const cid = caseId.toUpperCase();
  if (cid.startsWith("CASE_MF")) return "PAT_MF_001";
  if (cid.startsWith("CASE_SM")) return "PAT_SM_001";
  if (cid.startsWith("CASE_APP")) return "PAT_APP_001";

  return null;
}

// ---------------------------------------------------------------------------
// Age label — from case.opened_at ONLY
// ---------------------------------------------------------------------------

function computeCaseAgeLabel(openedAt: string | null, closedAt: string | null): string | null {
  if (!openedAt) return null;
  if (closedAt) return "Closed";

  const opened = new Date(openedAt);
  if (isNaN(opened.getTime())) return null;

  const diffMs = SEED_REF_DATE.getTime() - opened.getTime();
  if (diffMs < 0) return null;

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h open`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d open`;
}

// ---------------------------------------------------------------------------
// Investigation status derivation — display-only
// ---------------------------------------------------------------------------

function deriveInvestigationStatus(
  decision: string,
  closedAt: string | null
): CaseInvestigationStatus {
  if (closedAt) return "closed";

  const d = (decision ?? "").toLowerCase();

  if (d.includes("escalat")) return "escalated";
  if (d === "pending") return "open";
  if (d === "monitor") return "open";
  if (d === "clear") return "needs_closure";
  if (d === "close_account") return "needs_closure";
  if (d === "suspend_wallet") return "needs_closure";

  return "open";
}

// ---------------------------------------------------------------------------
// Next action hint — deterministic
// ---------------------------------------------------------------------------

export function getCaseNextActionHint(row: {
  investigation_status: CaseInvestigationStatus;
  severity: string;
  scenario: AlertScenario;
}): string {
  const { investigation_status, severity, scenario } = row;

  if (investigation_status === "closed") return "Closed";
  if (investigation_status === "escalated") return "Review escalation";
  if (investigation_status === "needs_closure") return "Draft closure note";

  const isScenarioLinked = scenario !== "Background";
  const isHighOrCritical = severity === "high" || severity === "critical";

  if (isHighOrCritical && isScenarioLinked) return "Prioritise review";
  if (isHighOrCritical) return "Prioritise review";
  if (isScenarioLinked) return "Review evidence";

  return "Continue review";
}

// ---------------------------------------------------------------------------
// getEnrichedCaseRows — main list enrichment
// ---------------------------------------------------------------------------

export function getEnrichedCaseRows(): EnrichedCaseRow[] {
  return cases.map((c) => {
    const linkedAlert = alertById.get(c.alert_id) ?? null;
    const walletId = linkedAlert?.wallet_id ?? null;
    const wallet = walletId ? (walletById.get(walletId) ?? null) : null;

    const patternId = inferPatternId({
      walletId,
      alertRuleName: linkedAlert?.rule_name ?? null,
      caseId: c.case_id,
    });
    const pattern: AnalystPattern | null = patternId ? (patternById.get(patternId) ?? null) : null;

    const scenario = inferScenario({
      alertRuleName: linkedAlert?.rule_name ?? null,
      caseId: c.case_id,
      patternId,
    });

    const investigation_status = deriveInvestigationStatus(c.decision, c.closed_at);

    const age_label = computeCaseAgeLabel(c.opened_at, c.closed_at);

    const notes = notesByCase.get(c.case_id) ?? [];
    const note_count = notes.length;

    // Latest note timestamp (ascending sort, pick last)
    let latest_note_at: string | null = null;
    if (notes.length > 0) {
      const sorted = [...notes].sort((a, b) => {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return a.timestamp.localeCompare(b.timestamp);
      });
      latest_note_at = sorted[sorted.length - 1].timestamp ?? null;
    }

    const rowWithoutHint: Omit<EnrichedCaseRow, "next_action_hint"> = {
      case_id: c.case_id,
      alert_id: c.alert_id,
      owner: c.owner,
      decision: c.decision,
      loss_amount: c.loss_amount,
      opened_at: c.opened_at,
      closed_at: c.closed_at,
      investigation_status,
      severity: linkedAlert?.severity ?? "unknown",
      scenario,
      wallet_id: walletId,
      linked_pattern_id: pattern?.pattern_id ?? patternId,
      linked_pattern_name: pattern?.name ?? null,
      linked_pattern_cluster_type: pattern?.cluster_type ?? null,
      linked_pattern_variables: pattern?.variables ?? null,
      alert_rule_name: linkedAlert?.rule_name ?? null,
      alert_status: linkedAlert?.status ?? null,
      age_label,
      age_source: c.opened_at ? "case.opened_at" : null,
      note_count,
      latest_note_at,
    };

    return {
      ...rowWithoutHint,
      next_action_hint: getCaseNextActionHint({
        investigation_status,
        severity: rowWithoutHint.severity,
        scenario,
      }),
    };
  });
}

// ---------------------------------------------------------------------------
// getCasesKpis
// ---------------------------------------------------------------------------

export function getCasesKpis(rows: EnrichedCaseRow[]): CasesKpis {
  let open_case_count = 0;
  let escalated_case_count = 0;
  let needs_closure_count = 0;
  let total_synthetic_loss = 0;
  let scenario_linked_case_count = 0;

  for (const row of rows) {
    if (row.investigation_status !== "closed") open_case_count++;
    if (row.investigation_status === "escalated") escalated_case_count++;
    if (row.investigation_status === "needs_closure") needs_closure_count++;
    if (row.scenario !== "Background") scenario_linked_case_count++;
    total_synthetic_loss += row.loss_amount ?? 0;
  }

  return {
    open_case_count,
    escalated_case_count,
    needs_closure_count,
    total_synthetic_loss,
    scenario_linked_case_count,
  };
}

// ---------------------------------------------------------------------------
// applyCaseSavedView
// ---------------------------------------------------------------------------

export function applyCaseSavedView(
  rows: EnrichedCaseRow[],
  view: CaseSavedView
): EnrichedCaseRow[] {
  if (view === "all") return rows;

  if (view === "open_needs_closure") {
    return rows.filter(
      (r) =>
        r.investigation_status === "open" || r.investigation_status === "needs_closure"
    );
  }

  if (view === "escalated") {
    return rows.filter((r) => r.investigation_status === "escalated");
  }

  if (view === "scenario_linked") {
    return rows.filter((r) => r.scenario !== "Background");
  }

  return rows;
}

// ---------------------------------------------------------------------------
// applyCaseDecisionFilter
// ---------------------------------------------------------------------------

export function applyCaseDecisionFilter(
  rows: EnrichedCaseRow[],
  decisionFilter: string
): EnrichedCaseRow[] {
  if (!decisionFilter || decisionFilter === "all") return rows;
  return rows.filter((r) => (r.decision ?? "").toLowerCase() === decisionFilter.toLowerCase());
}

// ---------------------------------------------------------------------------
// applyDefaultCaseOrdering — actionable-first + scenario interleave
// Does not mutate input.
// ---------------------------------------------------------------------------

const CASE_STATUS_PRIORITY: Record<CaseInvestigationStatus, number> = {
  escalated: 0,
  needs_closure: 1,
  open: 2,
  resolved: 3,
  closed: 4,
};

const CASE_SEVERITY_PRIORITY: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  unknown: 4,
};

const CASE_SCENARIO_PRIORITY: Record<AlertScenario, number> = {
  "Onboarding Mule Farm": 0,
  "Sleeper Mule Activation": 0,
  "APP Scam Cash-out Ring": 0,
  "Endpoint Intelligence": 1,
  Background: 2,
};

const INTERLEAVE_ORDER: AlertScenario[] = [
  "Onboarding Mule Farm",
  "Sleeper Mule Activation",
  "APP Scam Cash-out Ring",
  "Endpoint Intelligence",
  "Background",
];

function getCaseActionabilityScore(row: EnrichedCaseRow): number {
  const statusScore = CASE_STATUS_PRIORITY[row.investigation_status] ?? 3;
  const severityScore = CASE_SEVERITY_PRIORITY[row.severity] ?? 4;
  const scenarioScore = CASE_SCENARIO_PRIORITY[row.scenario] ?? 2;
  // Small exposure boost — does not override status/severity
  const exposureBoost = row.loss_amount > 0 ? -(row.loss_amount / 1_000_000) * 0.1 : 0;
  return statusScore * 1000 + severityScore * 100 + scenarioScore * 10 + exposureBoost;
}

export function applyDefaultCaseOrdering(rows: EnrichedCaseRow[]): EnrichedCaseRow[] {
  const copy = [...rows];

  // Build scenario buckets, each sorted by actionability
  const buckets: Record<string, EnrichedCaseRow[]> = {};
  for (const scenario of INTERLEAVE_ORDER) {
    buckets[scenario] = [];
  }
  for (const row of copy) {
    const key = (INTERLEAVE_ORDER as string[]).includes(row.scenario)
      ? row.scenario
      : "Background";
    buckets[key].push(row);
  }
  for (const scenario of INTERLEAVE_ORDER) {
    buckets[scenario].sort((a, b) => getCaseActionabilityScore(a) - getCaseActionabilityScore(b));
  }

  // Interleave scenario buckets in repeating order
  const result: EnrichedCaseRow[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const scenario of INTERLEAVE_ORDER) {
      const next = buckets[scenario].shift();
      if (next !== undefined) {
        result.push(next);
        added = true;
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// getCaseDetail
// ---------------------------------------------------------------------------

function buildWhyThisCase(params: {
  scenario: AlertScenario;
  patternId: string | null;
  patternName: string | null;
  alertId: string;
  naiveMissNote: string | null;
}): string {
  const { scenario, patternId, patternName, alertId, naiveMissNote } = params;

  if (scenario !== "Background" && patternId) {
    const patLabel = patternName ? `${patternId} (${patternName})` : patternId;
    const naivePart = naiveMissNote
      ? ` ${naiveMissNote}`
      : " Naive scoring may miss distributed risk signals not concentrated in a single account or transaction.";
    return `Why this case: ${scenario} linked to ${patLabel}.${naivePart}`;
  }

  if (scenario !== "Background") {
    return `Why this case: ${scenario} investigation linked to alert ${alertId}. Review available case notes and wallet context before disposition.`;
  }

  return `Why this case: Background investigation linked to alert ${alertId}. Review available case notes and wallet context before disposition.`;
}

export function getCaseDetail(caseId: string): EnrichedCaseDetail | null {
  const baseCase = cases.find((c) => c.case_id === caseId);
  if (!baseCase) return null;

  const linkedAlert = alertById.get(baseCase.alert_id) ?? null;
  const walletId = linkedAlert?.wallet_id ?? null;
  const wallet: WalletAccount | null = walletId
    ? (walletById.get(walletId) ?? null)
    : null;

  const patternId = inferPatternId({
    walletId,
    alertRuleName: linkedAlert?.rule_name ?? null,
    caseId: baseCase.case_id,
  });
  const matchedPattern: AnalystPattern | null = patternId
    ? (patternById.get(patternId) ?? null)
    : null;

  const scenario = inferScenario({
    alertRuleName: linkedAlert?.rule_name ?? null,
    caseId: baseCase.case_id,
    patternId,
  });

  const investigation_status = deriveInvestigationStatus(baseCase.decision, baseCase.closed_at);
  const age_label = computeCaseAgeLabel(baseCase.opened_at, baseCase.closed_at);

  const notes = [...(notesByCase.get(caseId) ?? [])].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return a.timestamp.localeCompare(b.timestamp);
  });

  const note_count = notes.length;
  const latest_note_at =
    notes.length > 0 ? (notes[notes.length - 1].timestamp ?? null) : null;

  const naive_miss_note = patternId ? getNaiveMissNote(patternId) : null;

  const why_this_case = buildWhyThisCase({
    scenario,
    patternId,
    patternName: matchedPattern?.name ?? null,
    alertId: baseCase.alert_id,
    naiveMissNote: naive_miss_note,
  });

  const rowWithoutHint: Omit<EnrichedCaseRow, "next_action_hint"> = {
    case_id: baseCase.case_id,
    alert_id: baseCase.alert_id,
    owner: baseCase.owner,
    decision: baseCase.decision,
    loss_amount: baseCase.loss_amount,
    opened_at: baseCase.opened_at,
    closed_at: baseCase.closed_at,
    investigation_status,
    severity: linkedAlert?.severity ?? "unknown",
    scenario,
    wallet_id: walletId,
    linked_pattern_id: matchedPattern?.pattern_id ?? patternId,
    linked_pattern_name: matchedPattern?.name ?? null,
    linked_pattern_cluster_type: matchedPattern?.cluster_type ?? null,
    linked_pattern_variables: matchedPattern?.variables ?? null,
    alert_rule_name: linkedAlert?.rule_name ?? null,
    alert_status: linkedAlert?.status ?? null,
    age_label,
    age_source: baseCase.opened_at ? "case.opened_at" : null,
    note_count,
    latest_note_at,
  };

  const next_action_hint = getCaseNextActionHint({
    investigation_status,
    severity: rowWithoutHint.severity,
    scenario,
  });

  return {
    ...rowWithoutHint,
    next_action_hint,
    notes,
    wallet,
    matchedPattern,
    linkedAlert,
    naive_miss_note,
    why_this_case,
  };
}
