import type { OpsCase, OpsStreamCode } from "./types";
import { sortOpsCases, OPS_REFERENCE_NOW } from "./sla";

export function partitionOpsQueue(cases: OpsCase[]) {
  const urgentCases = cases.filter((c) => c.priorityTier === "Urgent");
  const mainQueueCases = cases.filter((c) => c.priorityTier !== "Urgent");
  return { urgentCases, mainQueueCases };
}

export function filterOpsCasesByStream(
  cases: OpsCase[],
  stream: OpsStreamCode | "all",
): OpsCase[] {
  if (stream === "all") return cases;
  return cases.filter((c) => c.stream === stream);
}

export function buildSortedQueueSections(
  cases: OpsCase[],
  stream: OpsStreamCode | "all" = "all",
  now = OPS_REFERENCE_NOW,
) {
  const { urgentCases, mainQueueCases } = partitionOpsQueue(cases);
  const filteredMain = filterOpsCasesByStream(mainQueueCases, stream);
  return {
    urgentCases: sortOpsCases(urgentCases, now),
    mainQueueCases: sortOpsCases(filteredMain, now),
  };
}
