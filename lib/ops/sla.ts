import type { OpsCase, OpsPriorityTier, OpsSlaPressure } from "./types";
import { getSlaRuleByRef } from "./sla-rules";

/** Fixed reference time for deterministic SLA pressure in UI and tests. */
export const OPS_REFERENCE_NOW = new Date("2026-06-13T12:00:00.000Z");

const PRIORITY_ORDER: Record<OpsPriorityTier, number> = {
  Urgent: 0,
  High: 1,
  Standard: 2,
};

const PRESSURE_SCORE: Record<OpsSlaPressure, number> = {
  Breached: 0,
  "Near breach": 1,
  "Due soon": 2,
  "On track": 3,
};

export function getSlaRuleForCase(caseItem: OpsCase) {
  const rule = getSlaRuleByRef(caseItem.slaRuleRef);
  if (!rule) {
    throw new Error(`Unknown SLA rule ref: ${caseItem.slaRuleRef}`);
  }
  return rule;
}

export function getMinutesUntilDue(
  caseItem: OpsCase,
  now: Date = OPS_REFERENCE_NOW,
): number {
  const due = new Date(caseItem.slaDue).getTime();
  return Math.round((due - now.getTime()) / 60_000);
}

export function getSlaPressure(
  caseItem: OpsCase,
  now: Date = OPS_REFERENCE_NOW,
): OpsSlaPressure {
  const minutesUntilDue = getMinutesUntilDue(caseItem, now);
  const rule = getSlaRuleForCase(caseItem);
  const duration = rule.durationMinutes;

  if (minutesUntilDue < 0) return "Breached";

  const remainingRatio = minutesUntilDue / duration;
  if (remainingRatio <= 0.1 || minutesUntilDue <= Math.min(60, duration * 0.05)) {
    return "Near breach";
  }
  if (remainingRatio <= 0.35) return "Due soon";
  return "On track";
}

export function getSlaPressureScore(
  caseItem: OpsCase,
  now: Date = OPS_REFERENCE_NOW,
): number {
  return PRESSURE_SCORE[getSlaPressure(caseItem, now)];
}

export function formatDuration(minutes: number): string {
  const abs = Math.abs(Math.round(minutes));
  if (abs < 60) return `${abs}m`;
  if (abs < 1440) {
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const d = Math.floor(abs / 1440);
  const h = Math.floor((abs % 1440) / 60);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}

export function formatTimeRemaining(caseItem: OpsCase, now: Date = OPS_REFERENCE_NOW): string {
  const minutes = getMinutesUntilDue(caseItem, now);
  if (minutes < 0) return `${formatDuration(minutes)} overdue`;
  if (minutes === 0) return "Due now";
  return `${formatDuration(minutes)} remaining`;
}

export function sortOpsCases(caseItems: OpsCase[], now: Date = OPS_REFERENCE_NOW): OpsCase[] {
  return [...caseItems].sort((a, b) => {
    const priorityDiff = PRIORITY_ORDER[a.priorityTier] - PRIORITY_ORDER[b.priorityTier];
    if (priorityDiff !== 0) return priorityDiff;

    const pressureDiff =
      getSlaPressureScore(a, now) - getSlaPressureScore(b, now);
    if (pressureDiff !== 0) return pressureDiff;

    return new Date(a.slaDue).getTime() - new Date(b.slaDue).getTime();
  });
}

export function buildWhyHereRationale(caseItem: OpsCase, now: Date = OPS_REFERENCE_NOW): string {
  const rule = getSlaRuleForCase(caseItem);
  const pressure = getSlaPressure(caseItem, now);
  const stream = caseItem.stream;

  const pressurePhrase =
    pressure === "Breached"
      ? "has breached its SLA"
      : pressure === "Near breach"
        ? `is near its ${rule.clockType} deadline`
        : pressure === "Due soon"
          ? "is approaching its SLA midpoint"
          : "is within its standard SLA window";

  const priorityPhrase =
    caseItem.priorityTier === "Urgent"
      ? "It is routed above standard queues because the cost of delay is high"
      : caseItem.priorityTier === "High"
        ? "It ranks above standard backlog because sensitivity or exposure warrants earlier action"
        : "It follows standard queue discipline relative to higher-priority work";

  return `This ${stream} case ${pressurePhrase}. ${priorityPhrase} — ${caseItem.urgencyReason.toLowerCase().replace(/\.$/, "")}. ${rule.costOfDelay.split(".")[0]}.`;
}
