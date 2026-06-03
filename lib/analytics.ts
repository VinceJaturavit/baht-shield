// lib/analytics.ts — Fraud Leadership Analytics (Spec-016)
// Derives all figures from existing synthetic seed data and existing lib helpers.
// No hard-coded numbers. No seed mutation. No transaction timestamps.
// Trend logic uses cases.opened_at ONLY.

import { cases } from "./seed-data";
import { getScenarioFromCaseId } from "./scenario-utils";
import { getPatternSummaries } from "./pattern-intelligence";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LossExposureByScenario {
  scenario: string;
  case_count: number;
  loss_amount: number;
  share: number;
}

export interface CaseDecisionMixItem {
  decision: string;
  label: string;
  count: number;
  share: number;
}

export interface PatternCoverageItem {
  pattern_id: string;
  name: string;
  family: string;
  status: string;
  linked_wallet_count: number;
  linked_case_count: number;
}

export interface CaseOpenDateBucket {
  label: string;
  start_date: string;
  end_date?: string;
  count: number;
  bucket_type: "day" | "week";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDecisionLabel(decision: string): string {
  return decision
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

function toDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function startOfWeek(date: Date): Date {
  // ISO week — Monday start
  const d = toDateOnly(date);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

// ---------------------------------------------------------------------------
// Panel 1 — Loss Exposure by Scenario
// ---------------------------------------------------------------------------

export function getLossExposureByScenario(): LossExposureByScenario[] {
  const groupAmount: Record<string, number> = {};
  const groupCount: Record<string, number> = {};

  for (const c of cases) {
    const scenario = getScenarioFromCaseId(c.case_id);
    const amount = Number(c.loss_amount || 0);
    groupAmount[scenario] = (groupAmount[scenario] ?? 0) + amount;
    groupCount[scenario] = (groupCount[scenario] ?? 0) + 1;
  }

  const total = Object.values(groupAmount).reduce((s, v) => s + v, 0);

  // Canonical order: scenario typologies first, Background last
  const order = [
    "Onboarding Mule Farm",
    "Sleeper Mule Activation",
    "APP Scam Cash-out Ring",
    "Background",
  ];

  return order
    .filter((s) => (groupCount[s] ?? 0) > 0)
    .map((scenario) => ({
      scenario,
      case_count: groupCount[scenario] ?? 0,
      loss_amount: groupAmount[scenario] ?? 0,
      share: total > 0 ? (groupAmount[scenario] ?? 0) / total : 0,
    }));
}

// ---------------------------------------------------------------------------
// Panel 2 — Case Decision Mix
// ---------------------------------------------------------------------------

export function getCaseDecisionMixAnalytics(): CaseDecisionMixItem[] {
  const counts: Record<string, number> = {};

  for (const c of cases) {
    const d = c.decision || "unknown";
    counts[d] = (counts[d] ?? 0) + 1;
  }

  const total = cases.length;

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([decision, count]) => ({
      decision,
      label: formatDecisionLabel(decision),
      count,
      share: total > 0 ? count / total : 0,
    }));
}

// ---------------------------------------------------------------------------
// Panel 3 — Pattern Hit-Rate / Coverage
// ---------------------------------------------------------------------------

export function getPatternCoverageAnalytics(): PatternCoverageItem[] {
  const summaries = getPatternSummaries();

  // Already sorted by family then linked_case_count desc by getPatternSummaries.
  // Re-sort for leadership view: linked_case_count desc → linked_wallet_count desc → status priority.
  const STATUS_PRIORITY: Record<string, number> = {
    verified: 3,
    probable: 2,
    emerging: 1,
  };

  const sorted = [...summaries].sort((a, b) => {
    if (b.linked_case_count !== a.linked_case_count)
      return b.linked_case_count - a.linked_case_count;
    if (b.linked_wallet_count !== a.linked_wallet_count)
      return b.linked_wallet_count - a.linked_wallet_count;
    const pa = STATUS_PRIORITY[a.status] ?? 0;
    const pb = STATUS_PRIORITY[b.status] ?? 0;
    return pb - pa;
  });

  return sorted.map((s) => ({
    pattern_id: s.pattern_id,
    name: s.name,
    family: s.family,
    status: s.status,
    linked_wallet_count: s.linked_wallet_count,
    linked_case_count: s.linked_case_count,
  }));
}

// ---------------------------------------------------------------------------
// Panel 4 — Case Volume by Open Date
// Trend uses cases.opened_at ONLY. No transaction timestamps.
// ---------------------------------------------------------------------------

export function getCaseOpenDateBuckets(): CaseOpenDateBucket[] {
  // Parse and validate opened_at dates
  const validDates: { date: Date; caseId: string }[] = [];
  for (const c of cases) {
    if (!c.opened_at) continue;
    const d = new Date(c.opened_at);
    if (isNaN(d.getTime())) continue;
    validDates.push({ date: d, caseId: c.case_id });
  }

  if (validDates.length === 0) return [];

  const timestamps = validDates.map((v) => v.date.getTime());
  const minDate = toDateOnly(new Date(Math.min(...timestamps)));
  const maxDate = toDateOnly(new Date(Math.max(...timestamps)));

  const rangeDays =
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

  if (rangeDays <= 21) {
    // Daily buckets
    const buckets: Map<string, number> = new Map();
    let cursor = toDateOnly(minDate);
    while (cursor <= maxDate) {
      buckets.set(cursor.toISOString().slice(0, 10), 0);
      cursor = addDays(cursor, 1);
    }

    for (const { date } of validDates) {
      const key = toDateOnly(date).toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    }

    return Array.from(buckets.entries()).map(([key, count]) => ({
      label: formatDayLabel(new Date(key + "T00:00:00Z")),
      start_date: key,
      count,
      bucket_type: "day" as const,
    }));
  } else {
    // Weekly buckets (Monday-start ISO weeks)
    const weekStarts: Map<string, Date> = new Map();

    for (const { date } of validDates) {
      const ws = startOfWeek(date);
      const key = ws.toISOString().slice(0, 10);
      if (!weekStarts.has(key)) weekStarts.set(key, ws);
    }

    // Also ensure all weeks in range are represented
    let cursor = startOfWeek(minDate);
    const maxWeekStart = startOfWeek(maxDate);
    while (cursor <= maxWeekStart) {
      const key = cursor.toISOString().slice(0, 10);
      if (!weekStarts.has(key)) weekStarts.set(key, new Date(cursor));
      cursor = addDays(cursor, 7);
    }

    const counts: Map<string, number> = new Map(
      Array.from(weekStarts.keys()).map((k) => [k, 0])
    );

    for (const { date } of validDates) {
      const key = startOfWeek(date).toISOString().slice(0, 10);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    const sortedKeys = Array.from(weekStarts.keys()).sort();

    return sortedKeys.map((key) => {
      const weekStart = weekStarts.get(key)!;
      const weekEnd = addDays(weekStart, 6);
      const startLabel = formatDayLabel(weekStart);
      const endLabel = formatDayLabel(weekEnd);
      return {
        label: `${startLabel}–${endLabel}`,
        start_date: key,
        end_date: weekEnd.toISOString().slice(0, 10),
        count: counts.get(key) ?? 0,
        bucket_type: "week" as const,
      };
    });
  }
}
