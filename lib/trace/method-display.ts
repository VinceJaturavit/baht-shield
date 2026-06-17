import type { TraceMethod, TraceMethodComparison } from "./types";
import { TRACE_VICTIM_IDS } from "./boundary";
import { getAllocationForParty } from "./methods";

const METHOD_ORDER: TraceMethod[] = ["FIFO", "LIFO", "LIBR", "pro-rata"];

const PARTY_ORDER = [
  { id: TRACE_VICTIM_IDS.alice, label: "Alice" },
  { id: TRACE_VICTIM_IDS.bob, label: "Bob" },
  { id: TRACE_VICTIM_IDS.scammer, label: "Scammer" },
] as const;

export interface SamePoolMatrixRow {
  party: string;
  allocations: Record<TraceMethod, number>;
}

export function buildSamePoolMatrix(
  comparisons: TraceMethodComparison[],
): SamePoolMatrixRow[] {
  return PARTY_ORDER.map(({ id, label }) => ({
    party: label,
    allocations: Object.fromEntries(
      METHOD_ORDER.map((method) => {
        const comparison = comparisons.find((c) => c.method === method);
        return [
          method,
          comparison ? getAllocationForParty(comparison, id) : 0,
        ] as const;
      }),
    ) as Record<TraceMethod, number>,
  }));
}

export { METHOD_ORDER as TRACE_METHOD_DISPLAY_ORDER };
