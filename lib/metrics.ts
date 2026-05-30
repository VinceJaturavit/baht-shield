import type { Alert, FraudCase } from "./types";
import { getScenarioFromCaseId, type ScenarioType } from "./scenario-utils";

// Format as Thai Baht currency
export function formatTHB(value: number): string {
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `THB ${value.toLocaleString()}`;
  }
}

export interface AlertsBySeverity {
  critical: number;
  high: number;
  medium: number;
  low: number;
  other: number;
}

export interface OpenClosedCases {
  open: number;
  closed: number;
}

export interface ScenarioBreakdown {
  "Onboarding Mule Farm": number;
  "Sleeper Mule Activation": number;
  "APP Scam Cash-out Ring": number;
}

export interface DashboardMetrics {
  totalSyntheticLosses: number;
  openAlertCount: number;
  totalAlertCount: number;
  totalCaseCount: number;
  alertsBySeverity: AlertsBySeverity;
  decisionMix: Record<string, number>;
  openClosedCases: OpenClosedCases;
  scenarioBreakdown: ScenarioBreakdown;
  scenarioWalletCount: number;
  totalScenarioCases: number;
}

export function getDashboardMetrics(
  alerts: Alert[],
  cases: FraudCase[]
): DashboardMetrics {
  // Metric 1 — Total synthetic losses
  const totalSyntheticLosses = cases.reduce(
    (sum, c) => sum + Number(c.loss_amount || 0),
    0
  );

  // Metric 2 — Open alert count (anything not closed)
  const openAlertCount = alerts.filter((a) => a.status !== "closed").length;

  // Metric 3 — Alerts by severity
  const alertsBySeverity: AlertsBySeverity = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    other: 0,
  };
  for (const alert of alerts) {
    const sev = (alert.severity ?? "").toLowerCase();
    if (sev === "critical") alertsBySeverity.critical++;
    else if (sev === "high") alertsBySeverity.high++;
    else if (sev === "medium") alertsBySeverity.medium++;
    else if (sev === "low") alertsBySeverity.low++;
    else alertsBySeverity.other++;
  }

  // Metric 4a — Case decision mix
  const decisionMix: Record<string, number> = {};
  for (const c of cases) {
    const d = c.decision || "unknown";
    decisionMix[d] = (decisionMix[d] ?? 0) + 1;
  }

  // Metric 4b — Open vs closed
  const closedCount = cases.filter((c) => Boolean(c.closed_at)).length;
  const openClosedCases: OpenClosedCases = {
    closed: closedCount,
    open: cases.length - closedCount,
  };

  // Metric 5 — Scenario breakdown + unique scenario wallets
  const alertMap = new Map<string, Alert>();
  for (const alert of alerts) {
    alertMap.set(alert.alert_id, alert);
  }

  const scenarioBreakdown: ScenarioBreakdown = {
    "Onboarding Mule Farm": 0,
    "Sleeper Mule Activation": 0,
    "APP Scam Cash-out Ring": 0,
  };
  const scenarioWalletIds = new Set<string>();
  let totalScenarioCases = 0;

  for (const c of cases) {
    const scenario = getScenarioFromCaseId(c.case_id);
    if (scenario !== "Background") {
      scenarioBreakdown[scenario as keyof ScenarioBreakdown]++;
      totalScenarioCases++;
      const linkedAlert = alertMap.get(c.alert_id);
      if (linkedAlert) scenarioWalletIds.add(linkedAlert.wallet_id);
    }
  }

  return {
    totalSyntheticLosses,
    openAlertCount,
    totalAlertCount: alerts.length,
    totalCaseCount: cases.length,
    alertsBySeverity,
    decisionMix,
    openClosedCases,
    scenarioBreakdown,
    scenarioWalletCount: scenarioWalletIds.size,
    totalScenarioCases,
  };
}

export const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function severityRank(severity: string): number {
  return SEVERITY_ORDER[(severity ?? "").toLowerCase()] ?? 0;
}
