import type { OpsAgingBucket } from "./aging";
import { getAgingBucket } from "./aging";
import type { OpsCase, OpsStreamCode } from "./types";
import type { OpsTeamRole } from "./roster-types";

export type OpsStreamFilter = "all" | OpsStreamCode | "Urgent";

export type OpsAgingBucketFilter = "all" | OpsAgingBucket;

export type OpsRoleFilter = "all" | OpsTeamRole;

export function normaliseSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesTextSearch(
  searchableValues: Array<string | number | null | undefined>,
  query: string,
): boolean {
  const normalized = normaliseSearchText(query);
  if (!normalized) return true;

  return searchableValues.some((value) => {
    if (value == null) return false;
    return normaliseSearchText(String(value)).includes(normalized);
  });
}

export function isFilterActive(value: string | string[] | undefined): boolean {
  if (value === undefined || value === "" || value === "all") return false;
  if (Array.isArray(value)) {
    return value.length > 0 && !value.every((entry) => entry === "all");
  }
  return true;
}

export function hasAnyActiveFilter(filters: Record<string, string>): boolean {
  return Object.values(filters).some((value) => isFilterActive(value));
}

export function getCaseSearchValues(caseItem: OpsCase): Array<string | number> {
  return [
    caseItem.id,
    caseItem.stream,
    caseItem.streamLabel,
    caseItem.type,
    caseItem.urgencyReason,
    caseItem.priorityTier,
    caseItem.owner,
    caseItem.status,
    caseItem.queue,
  ];
}

export function matchesStreamFilter(
  caseItem: OpsCase,
  stream: OpsStreamFilter,
): boolean {
  if (stream === "all") return true;
  if (stream === "Urgent") return caseItem.priorityTier === "Urgent";
  return caseItem.stream === stream;
}

export function matchesAgingBucketFilter(
  caseItem: OpsCase,
  bucket: OpsAgingBucketFilter,
): boolean {
  if (bucket === "all") return true;
  return getAgingBucket(caseItem) === bucket;
}

export interface OpsCaseFilterState {
  text: string;
  stream: OpsStreamFilter;
  bucket: OpsAgingBucketFilter;
}

export function filterOpsCases(
  cases: OpsCase[],
  filters: OpsCaseFilterState,
): OpsCase[] {
  return cases.filter((caseItem) => {
    if (!matchesTextSearch(getCaseSearchValues(caseItem), filters.text)) {
      return false;
    }
    if (!matchesStreamFilter(caseItem, filters.stream)) {
      return false;
    }
    if (!matchesAgingBucketFilter(caseItem, filters.bucket)) {
      return false;
    }
    return true;
  });
}

export interface OpsMemberFilterState {
  text: string;
  role: OpsRoleFilter;
}

export function getMemberSearchValues(member: {
  name: string;
  role: OpsTeamRole;
}): Array<string> {
  return [member.name, member.role];
}

export function filterByMemberFilters<T extends { name: string; role: OpsTeamRole }>(
  members: T[],
  filters: OpsMemberFilterState,
): T[] {
  return members.filter((member) => {
    if (!matchesTextSearch(getMemberSearchValues(member), filters.text)) {
      return false;
    }
    if (filters.role !== "all" && member.role !== filters.role) {
      return false;
    }
    return true;
  });
}

export function filterRowsByMemberFilters<
  T extends { role: OpsTeamRole; name?: string; analystName?: string },
>(rows: T[], filters: OpsMemberFilterState): T[] {
  return rows.filter((row) => {
    const searchableName = row.name ?? row.analystName ?? "";
    if (!matchesTextSearch([searchableName, row.role], filters.text)) {
      return false;
    }
    if (filters.role !== "all" && row.role !== filters.role) {
      return false;
    }
    return true;
  });
}

export const OPS_QUEUE_STREAM_OPTIONS: { value: OpsStreamFilter; label: string }[] = [
  { value: "all", label: "All streams" },
  { value: "RFR", label: "RFR" },
  { value: "LAR", label: "LAR" },
  { value: "PRO", label: "PRO" },
  { value: "DSP", label: "DSP" },
  { value: "PRF", label: "PRF" },
  { value: "Urgent", label: "Urgent" },
];

export const OPS_AGING_STREAM_OPTIONS: { value: OpsStreamFilter; label: string }[] = [
  { value: "all", label: "All streams" },
  { value: "RFR", label: "RFR" },
  { value: "LAR", label: "LAR" },
  { value: "PRO", label: "PRO" },
  { value: "DSP", label: "DSP" },
  { value: "PRF", label: "PRF" },
];

export const OPS_AGING_BUCKET_OPTIONS: { value: OpsAgingBucketFilter; label: string }[] = [
  { value: "all", label: "All buckets" },
  { value: "Fresh", label: "Fresh" },
  { value: "Mid", label: "Mid" },
  { value: "At-Risk", label: "At-Risk" },
  { value: "Breached", label: "Breached" },
];

export const OPS_ROLE_FILTER_OPTIONS: { value: OpsRoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "Fraud Analyst", label: "Fraud Analyst" },
  { value: "Junior Analyst", label: "Junior Analyst" },
];

export const EMPTY_CASE_FILTERS: OpsCaseFilterState = {
  text: "",
  stream: "all",
  bucket: "all",
};

export const EMPTY_MEMBER_FILTERS: OpsMemberFilterState = {
  text: "",
  role: "all",
};
