import { analystPatterns, graphEdges, alerts, cases } from "./seed-data";
import { getNaiveMissNote } from "./wallet-profile";
import { getPatternFamily } from "./scenario-utils";
import type { AnalystPattern, LinkedPatternWallet, PatternSummary, PatternFamily } from "./types";

const FAMILY_ORDER: PatternFamily[] = [
  "Onboarding Mule Farm",
  "Sleeper Mule Activation",
  "APP Scam Cash-out",
  "Endpoint Intelligence",
  "Other",
];

export function getPatternId(pattern: AnalystPattern): string {
  if (pattern.pattern_id) return pattern.pattern_id;
  return pattern.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

export function getPatternLinkedWallets(patternId: string): LinkedPatternWallet[] {
  const walletIds = new Set<string>();

  for (const edge of graphEdges) {
    if (edge.edge_type !== "pattern_match") continue;
    if (edge.from_entity === patternId && edge.to_entity.startsWith("WAL_")) {
      walletIds.add(edge.to_entity);
    }
    if (edge.to_entity === patternId && edge.from_entity.startsWith("WAL_")) {
      walletIds.add(edge.from_entity);
    }
  }

  return Array.from(walletIds).map((walletId) => {
    const walletAlerts = alerts.filter((a) => a.wallet_id === walletId);
    const alertIds = new Set(walletAlerts.map((a) => a.alert_id));
    const walletCases = cases.filter((c) => alertIds.has(c.alert_id));

    return {
      wallet_id: walletId,
      linked_alert_count: walletAlerts.length,
      linked_case_count: walletCases.length,
    };
  });
}

function buildPatternSummary(pattern: AnalystPattern): PatternSummary {
  const patternId = getPatternId(pattern);
  const linkedWallets = getPatternLinkedWallets(patternId);

  const uniqueCaseIds = new Set<string>();
  for (const lw of linkedWallets) {
    const walletAlerts = alerts.filter((a) => a.wallet_id === lw.wallet_id);
    const alertIds = new Set(walletAlerts.map((a) => a.alert_id));
    for (const c of cases) {
      if (alertIds.has(c.alert_id)) uniqueCaseIds.add(c.case_id);
    }
  }

  return {
    pattern_id: patternId,
    name: pattern.name,
    variables: pattern.variables,
    cluster_type: pattern.cluster_type,
    status: pattern.status,
    created_by: pattern.created_by,
    family: getPatternFamily(pattern),
    linked_wallet_count: linkedWallets.length,
    linked_case_count: uniqueCaseIds.size,
    linked_wallets: linkedWallets,
    naive_miss_note: getNaiveMissNote(patternId),
  };
}

export function getPatternSummaries(): PatternSummary[] {
  const summaries = analystPatterns.map(buildPatternSummary);

  summaries.sort((a, b) => {
    const familyA = FAMILY_ORDER.indexOf(a.family);
    const familyB = FAMILY_ORDER.indexOf(b.family);
    if (familyA !== familyB) return familyA - familyB;
    if (b.linked_case_count !== a.linked_case_count) return b.linked_case_count - a.linked_case_count;
    if (b.linked_wallet_count !== a.linked_wallet_count) return b.linked_wallet_count - a.linked_wallet_count;
    return a.name.localeCompare(b.name);
  });

  return summaries;
}

export function getPatternSummary(patternId: string): PatternSummary | null {
  const pattern = analystPatterns.find((p) => getPatternId(p) === patternId);
  if (!pattern) return null;
  return buildPatternSummary(pattern);
}
