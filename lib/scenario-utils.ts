import type { PatternFamily } from "./types";

export type ScenarioType =
  | "Onboarding Mule Farm"
  | "Sleeper Mule Activation"
  | "APP Scam Cash-out Ring"
  | "Background";

// Primary detection: case_id prefix
export function getScenarioFromCaseId(caseId: string): ScenarioType {
  if (caseId.startsWith("CASE_MF")) return "Onboarding Mule Farm";
  if (caseId.startsWith("CASE_SM")) return "Sleeper Mule Activation";
  if (caseId.startsWith("CASE_APP")) return "APP Scam Cash-out Ring";
  return "Background";
}

// Fallback detection: alert rule name
export function getScenarioFromRuleName(ruleName: string): ScenarioType {
  if (ruleName.includes("MULE_FARM")) return "Onboarding Mule Farm";
  if (ruleName.includes("SLEEPER_MULE")) return "Sleeper Mule Activation";
  if (ruleName.includes("APP_SCAM")) return "APP Scam Cash-out Ring";
  return "Background";
}

export function isScenarioCase(caseId: string): boolean {
  return getScenarioFromCaseId(caseId) !== "Background";
}

export const SCENARIO_COLORS: Record<ScenarioType, string> = {
  "Onboarding Mule Farm":
    "border border-signal-border bg-white text-signal-body",
  "Sleeper Mule Activation":
    "border border-signal-border bg-white text-signal-body",
  "APP Scam Cash-out Ring":
    "border border-signal-border bg-white text-signal-body",
  Background: "border border-signal-border bg-signal-muted text-signal-secondary",
};

// ---------------------------------------------------------------------------
// Pattern Intelligence — Spec-005
// ---------------------------------------------------------------------------

export const PATTERN_FAMILY_COLORS: Record<string, string> = {
  "Onboarding Mule Farm": "border-signal-border bg-signal-muted text-signal-body",
  "Sleeper Mule Activation": "border-signal-border bg-signal-muted text-signal-body",
  "APP Scam Cash-out": "border-signal-border bg-signal-muted text-signal-body",
  "Endpoint Intelligence": "border-signal-border bg-signal-muted text-signal-body",
  Other: "border-signal-border bg-signal-muted text-signal-secondary",
};

export function getPatternFamily(pattern: {
  pattern_id?: string;
  name: string;
  cluster_type: string;
}): PatternFamily {
  const id = (pattern.pattern_id ?? "").toUpperCase();
  const name = pattern.name.toLowerCase();
  const ct = pattern.cluster_type.toLowerCase();

  if (
    id.includes("PAT_MF") ||
    name.includes("mule farm") ||
    name.includes("onboarding") ||
    ct.includes("onboarding_mule") ||
    ct.includes("mule_farm")
  ) {
    return "Onboarding Mule Farm";
  }

  if (
    id.includes("PAT_SM") ||
    name.includes("sleeper") ||
    name.includes("dormant") ||
    ct.includes("sleeper_mule")
  ) {
    return "Sleeper Mule Activation";
  }

  if (
    id.includes("PAT_APP") ||
    name.includes("app scam") ||
    name.includes("scam cash-out") ||
    ct.includes("app_scam") ||
    ct.includes("app_scam_cashout")
  ) {
    return "APP Scam Cash-out";
  }

  if (
    id.includes("PAT_ENDPOINT") ||
    name.includes("endpoint") ||
    name.includes("cash-out endpoint") ||
    name.includes("cross-border") ||
    ct.includes("endpoint") ||
    ct.includes("cashout_endpoint")
  ) {
    return "Endpoint Intelligence";
  }

  return "Other";
}
