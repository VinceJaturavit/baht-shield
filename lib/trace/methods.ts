import type { TraceCase, TraceMethod, TraceMethodComparison } from "./types";
import { TRACE_SEIZED_AMOUNT } from "./boundary";

export function getMethodComparison(
  traceCase: TraceCase,
  method: TraceMethod,
): TraceMethodComparison | undefined {
  return traceCase.methodComparisons.find((m) => m.method === method);
}

export function getAllocationForParty(
  comparison: TraceMethodComparison,
  victimId: string,
): number {
  const row = comparison.allocations.find((a) => a.victimId === victimId);
  return row?.allocatedAmount ?? 0;
}

export function validateMethodAllocations(comparisons: TraceMethodComparison[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const comparison of comparisons) {
    const total = comparison.allocations.reduce(
      (sum, a) => sum + a.allocatedAmount,
      0,
    );
    if (total !== TRACE_SEIZED_AMOUNT) {
      errors.push(
        `${comparison.method} total ${total} !== ${TRACE_SEIZED_AMOUNT}`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getAliceOutcomesByMethod(
  comparisons: TraceMethodComparison[],
): Record<TraceMethod, number> {
  const outcomes = {} as Record<TraceMethod, number>;
  for (const c of comparisons) {
    const alice = c.allocations.find((a) => a.victimNameSynthetic === "Alice");
    outcomes[c.method] = alice?.allocatedAmount ?? 0;
  }
  return outcomes;
}

export function getScammerOutcomesByMethod(
  comparisons: TraceMethodComparison[],
): Record<TraceMethod, number> {
  const outcomes = {} as Record<TraceMethod, number>;
  for (const c of comparisons) {
    const scammer = c.allocations.find(
      (a) => a.victimNameSynthetic === "Scammer",
    );
    outcomes[c.method] = scammer?.allocatedAmount ?? 0;
  }
  return outcomes;
}
