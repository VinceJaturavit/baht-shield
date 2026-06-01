// Alert Queue Decision Hierarchy — Spec-011
// All derived from local seed data only. No DB, no API, no mutation.

import { alerts, cases, graphEdges } from "./seed-data";
import type {
  AlertScenario,
  AlertSavedView,
  EnrichedAlertQueueRow,
  AlertQueueKpis,
} from "./types";

// ---------------------------------------------------------------------------
// Scenario / Pattern mappings (derived from rule_name or IDs)
// ---------------------------------------------------------------------------

interface PatternInfo {
  pattern_id: string;
  pattern_name: string;
  scenario: AlertScenario;
}

const RULE_TO_PATTERN: Record<string, PatternInfo> = {
  PATTERN_MULE_FARM_CLUSTER: {
    pattern_id: "PAT_MF_001",
    pattern_name: "Mule Farm Cluster",
    scenario: "Onboarding Mule Farm",
  },
  PATTERN_SLEEPER_MULE_ACTIVATION: {
    pattern_id: "PAT_SM_001",
    pattern_name: "Sleeper Mule Activation",
    scenario: "Sleeper Mule Activation",
  },
  PATTERN_APP_SCAM_CASHOUT_RING: {
    pattern_id: "PAT_APP_001",
    pattern_name: "APP Scam Cash-out Ring",
    scenario: "APP Scam Cash-out Ring",
  },
  RULE_CROSS_BORDER_TRANSFER: {
    pattern_id: "PAT_ENDPOINT_002",
    pattern_name: "Cross-Border Exit Pattern",
    scenario: "Endpoint Intelligence",
  },
  RULE_CASHOUT_FREQUENCY: {
    pattern_id: "PAT_ENDPOINT_001",
    pattern_name: "Cash-out Endpoint Cluster",
    scenario: "Endpoint Intelligence",
  },
  RULE_DORMANT_REACTIVATION: {
    pattern_id: "PAT_SM_001",
    pattern_name: "Sleeper Mule Activation",
    scenario: "Sleeper Mule Activation",
  },
};

const GRAPH_PATTERN_TO_INFO: Record<string, PatternInfo> = {
  PAT_MF_001: {
    pattern_id: "PAT_MF_001",
    pattern_name: "Mule Farm Cluster",
    scenario: "Onboarding Mule Farm",
  },
  PAT_SM_001: {
    pattern_id: "PAT_SM_001",
    pattern_name: "Sleeper Mule Activation",
    scenario: "Sleeper Mule Activation",
  },
  PAT_APP_001: {
    pattern_id: "PAT_APP_001",
    pattern_name: "APP Scam Cash-out Ring",
    scenario: "APP Scam Cash-out Ring",
  },
  PAT_ENDPOINT_001: {
    pattern_id: "PAT_ENDPOINT_001",
    pattern_name: "Cash-out Endpoint Cluster",
    scenario: "Endpoint Intelligence",
  },
  PAT_ENDPOINT_002: {
    pattern_id: "PAT_ENDPOINT_002",
    pattern_name: "Cross-Border Exit Pattern",
    scenario: "Endpoint Intelligence",
  },
};

// ---------------------------------------------------------------------------
// Precomputed lookup maps
// ---------------------------------------------------------------------------

/** wallet_id → pattern_id via graph pattern_match edges */
const walletToPatternMap = new Map<string, string>();
for (const edge of graphEdges) {
  if (edge.edge_type === "pattern_match" && edge.to_entity.startsWith("PAT_")) {
    walletToPatternMap.set(edge.from_entity, edge.to_entity);
  }
}

/** pattern_id → linked wallet_ids */
const patternToWalletsMap = new Map<string, Set<string>>();
for (const edge of graphEdges) {
  if (edge.edge_type === "pattern_match" && edge.to_entity.startsWith("PAT_")) {
    const existing = patternToWalletsMap.get(edge.to_entity) ?? new Set();
    existing.add(edge.from_entity);
    patternToWalletsMap.set(edge.to_entity, existing);
  }
}

/** alert_id → cases[] */
const alertToCasesMap = new Map<string, typeof cases>();
for (const c of cases) {
  const existing = alertToCasesMap.get(c.alert_id) ?? [];
  existing.push(c);
  alertToCasesMap.set(c.alert_id, existing);
}

/** wallet_id → alert_ids */
const walletToAlertsMap = new Map<string, string[]>();
for (const a of alerts) {
  const existing = walletToAlertsMap.get(a.wallet_id) ?? [];
  existing.push(a.alert_id);
  walletToAlertsMap.set(a.wallet_id, existing);
}

// ---------------------------------------------------------------------------
// Reference date for age calculation (seed reference: May 30, 2026)
// ---------------------------------------------------------------------------
const SEED_REF_DATE = new Date("2026-06-01T00:00:00.000Z");

function computeAgeLabel(openedAt: string | null, closedAt: string | null): string | null {
  if (!openedAt) return null;
  if (closedAt) return "Closed";

  const opened = new Date(openedAt);
  const diffMs = SEED_REF_DATE.getTime() - opened.getTime();
  if (diffMs < 0) return null;

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h open`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d open`;
}

// ---------------------------------------------------------------------------
// getNextActionHint — deterministic
// ---------------------------------------------------------------------------

export function getNextActionHint(row: {
  status: string;
  severity: string;
  scenario: AlertScenario;
  linked_case_loss_exposure: number;
}): string {
  const { status, severity, scenario, linked_case_loss_exposure } = row;

  if (status === "closed") return "Closed";
  if (status === "escalated") return "Escalate / review evidence";

  const isScenarioLinked = scenario !== "Background";
  const isCritical = severity === "critical";
  const isHigh = severity === "high";

  if (isCritical && isScenarioLinked) return "Review wallet now";
  if (isCritical) return "Review wallet now";
  if (isHigh && linked_case_loss_exposure > 0) return "Prioritise review";
  if (isHigh && isScenarioLinked) return "Prioritise review";
  if (status === "new" && isScenarioLinked) return "Review wallet";
  if (status === "in_review") return "Continue investigation";
  if (status === "new" && (isHigh || isCritical)) return "Review wallet";

  return "Triage if capacity";
}

// ---------------------------------------------------------------------------
// getEnrichedAlertRows — main enrichment function
// ---------------------------------------------------------------------------

export function getEnrichedAlertRows(): EnrichedAlertQueueRow[] {
  return alerts.map((alert) => {
    // Resolve pattern from graph edges first, then fallback to rule_name
    const graphPatternId = walletToPatternMap.get(alert.wallet_id) ?? null;
    const graphPatternInfo = graphPatternId
      ? (GRAPH_PATTERN_TO_INFO[graphPatternId] ?? null)
      : null;
    const rulePatternInfo = RULE_TO_PATTERN[alert.rule_name] ?? null;

    // Prefer graph-edge match, then rule_name inference
    const resolvedPattern = graphPatternInfo ?? rulePatternInfo ?? null;
    const linked_pattern_id = resolvedPattern?.pattern_id ?? null;
    const linked_pattern_name = resolvedPattern?.pattern_name ?? null;
    const scenario: AlertScenario = resolvedPattern?.scenario ?? "Background";

    // Linked wallet count — via pattern, else 1
    let linked_wallet_count = 1;
    if (linked_pattern_id) {
      const wallets = patternToWalletsMap.get(linked_pattern_id);
      linked_wallet_count = wallets ? wallets.size : 1;
    }

    // Collect cases directly linked to this alert
    const directCases = alertToCasesMap.get(alert.alert_id) ?? [];

    // Linked case count — via pattern's wallets, else direct cases
    let linked_case_count = directCases.length;
    const linked_case_ids: string[] = directCases.map((c) => c.case_id);

    if (linked_pattern_id) {
      const patternWallets = patternToWalletsMap.get(linked_pattern_id);
      if (patternWallets && patternWallets.size > 0) {
        const allCaseIds = new Set<string>();
        for (const wid of patternWallets) {
          const walletAlerts = walletToAlertsMap.get(wid) ?? [];
          for (const aid of walletAlerts) {
            const wCases = alertToCasesMap.get(aid) ?? [];
            for (const c of wCases) {
              allCaseIds.add(c.case_id);
            }
          }
        }
        linked_case_count = allCaseIds.size;
      }
    }

    // Loss exposure from direct linked cases only
    const linked_case_loss_exposure = directCases.reduce(
      (sum, c) => sum + (c.loss_amount ?? 0),
      0
    );

    // Case age — earliest opened_at from direct cases
    let earliest_case_opened_at: string | null = null;
    let latestClosedAt: string | null = null;

    if (directCases.length > 0) {
      const sorted = [...directCases].sort(
        (a, b) => new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime()
      );
      earliest_case_opened_at = sorted[0].opened_at;
      // closed only if ALL direct cases are closed
      const allClosed = sorted.every((c) => c.closed_at !== null);
      if (allClosed) {
        latestClosedAt = sorted[sorted.length - 1].closed_at;
      }
    }

    const alert_age_label = computeAgeLabel(earliest_case_opened_at, latestClosedAt);

    const row: Omit<EnrichedAlertQueueRow, "next_action_hint"> = {
      alert_id: alert.alert_id,
      rule_name: alert.rule_name,
      severity: alert.severity,
      wallet_id: alert.wallet_id,
      status: alert.status,
      scenario,
      linked_pattern_id,
      linked_pattern_name,
      linked_wallet_count,
      linked_case_count,
      linked_case_ids,
      linked_case_loss_exposure,
      opened_at_source: earliest_case_opened_at ? "linked_case.opened_at" : null,
      earliest_case_opened_at,
      alert_age_label,
    };

    return {
      ...row,
      next_action_hint: getNextActionHint({
        status: row.status,
        severity: row.severity,
        scenario: row.scenario,
        linked_case_loss_exposure: row.linked_case_loss_exposure,
      }),
    };
  });
}

// ---------------------------------------------------------------------------
// getAlertQueueKpis
// ---------------------------------------------------------------------------

export function getAlertQueueKpis(rows: EnrichedAlertQueueRow[]): AlertQueueKpis {
  let open_alert_count = 0;
  let escalated_alert_count = 0;
  let high_severity_count = 0;
  let total_synthetic_loss_exposure = 0;
  let scenario_linked_alert_count = 0;

  // Deduplicate loss by case_id so we don't double-count pattern-linked cases
  const seenCaseIds = new Set<string>();

  for (const row of rows) {
    if (row.status !== "closed") open_alert_count++;
    if (row.status === "escalated") escalated_alert_count++;
    if (row.severity === "critical" || row.severity === "high") high_severity_count++;
    if (row.scenario !== "Background") scenario_linked_alert_count++;

    for (const cid of row.linked_case_ids) {
      if (!seenCaseIds.has(cid)) {
        seenCaseIds.add(cid);
        const c = cases.find((x) => x.case_id === cid);
        if (c) total_synthetic_loss_exposure += c.loss_amount ?? 0;
      }
    }
  }

  return {
    open_alert_count,
    escalated_alert_count,
    high_severity_count,
    total_synthetic_loss_exposure,
    scenario_linked_alert_count,
  };
}

// ---------------------------------------------------------------------------
// applyAlertSavedView
// ---------------------------------------------------------------------------

export function applyAlertSavedView(
  rows: EnrichedAlertQueueRow[],
  view: AlertSavedView
): EnrichedAlertQueueRow[] {
  if (view === "all") return rows;

  if (view === "critical_escalated") {
    return rows.filter(
      (r) =>
        r.severity === "critical" ||
        r.severity === "high" ||
        r.status === "escalated"
    );
  }

  if (view === "scenario_linked") {
    return rows.filter((r) => r.scenario !== "Background");
  }

  return rows;
}
