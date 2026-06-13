import type { OpsCase } from "./types";
import { getSlaRuleForCase } from "./sla";

export type OpsAgingBucket = "Fresh" | "Mid" | "At-Risk" | "Breached";

export type OpsAgingGroupBy = "queue" | "owner" | "caseType";

export type OpsWaitingSplit = "on_us" | "external";

export interface OpsAgingRow {
  groupKey: string;
  groupLabel: string;
  total: number;
  fresh: number;
  mid: number;
  atRisk: number;
  breached: number;
  waitingOnUs: number;
  waitingOnExternal: number;
}

export function isActiveAgingCase(caseItem: OpsCase): boolean {
  return caseItem.status !== "Closed";
}

export function getSlaElapsedPercent(caseItem: OpsCase): number {
  const rule = getSlaRuleForCase(caseItem);
  const duration = rule.durationMinutes;

  if (duration <= 0) return 0;

  if (caseItem.ageMinutes >= 0) {
    return caseItem.ageMinutes / duration;
  }

  const created = new Date(caseItem.createdAt).getTime();
  if (Number.isNaN(created)) return 0;

  const elapsedMinutes = Math.max(0, (Date.now() - created) / 60_000);
  return elapsedMinutes / duration;
}

export function getAgingBucket(caseItem: OpsCase): OpsAgingBucket {
  const pct = getSlaElapsedPercent(caseItem);

  if (pct > 1) return "Breached";
  if (pct >= 0.75) return "At-Risk";
  if (pct >= 0.25) return "Mid";
  return "Fresh";
}

export function getWaitingSplit(caseItem: OpsCase): OpsWaitingSplit {
  if (caseItem.status === "Awaiting external") return "external";
  return "on_us";
}

function getGroupKey(caseItem: OpsCase, groupBy: OpsAgingGroupBy): string {
  switch (groupBy) {
    case "queue":
      return caseItem.queue;
    case "owner":
      return caseItem.owner;
    case "caseType":
      return caseItem.type;
  }
}

function emptyRow(groupKey: string, groupLabel: string): OpsAgingRow {
  return {
    groupKey,
    groupLabel,
    total: 0,
    fresh: 0,
    mid: 0,
    atRisk: 0,
    breached: 0,
    waitingOnUs: 0,
    waitingOnExternal: 0,
  };
}

export function groupAgingCases(
  caseItems: OpsCase[],
  groupBy: OpsAgingGroupBy,
): OpsAgingRow[] {
  const active = caseItems.filter(isActiveAgingCase);
  const rows = new Map<string, OpsAgingRow>();

  for (const caseItem of active) {
    const groupKey = getGroupKey(caseItem, groupBy);
    const row = rows.get(groupKey) ?? emptyRow(groupKey, groupKey);
    row.total += 1;

    const bucket = getAgingBucket(caseItem);
    switch (bucket) {
      case "Fresh":
        row.fresh += 1;
        break;
      case "Mid":
        row.mid += 1;
        break;
      case "At-Risk":
        row.atRisk += 1;
        break;
      case "Breached":
        row.breached += 1;
        break;
    }

    const split = getWaitingSplit(caseItem);
    if (split === "on_us") row.waitingOnUs += 1;
    else row.waitingOnExternal += 1;

    rows.set(groupKey, row);
  }

  return [...rows.values()].sort((a, b) => {
    if (b.atRisk !== a.atRisk) return b.atRisk - a.atRisk;
    if (b.breached !== a.breached) return b.breached - a.breached;
    return a.groupLabel.localeCompare(b.groupLabel);
  });
}
