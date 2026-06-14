import { describe, it, expect } from "vitest";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_CASES } from "@/data/ops/ops-cases";
import {
  EMPTY_CASE_FILTERS,
  EMPTY_MEMBER_FILTERS,
  filterByMemberFilters,
  filterOpsCases,
  filterRowsByMemberFilters,
  hasAnyActiveFilter,
  isFilterActive,
  matchesTextSearch,
  normaliseSearchText,
} from "@/lib/ops/filters";
import { OPS_TEAM } from "@/data/ops/ops-team";

describe("normaliseSearchText", () => {
  it("trims and lowercases", () => {
    expect(normaliseSearchText("  Case-001  ")).toBe("case-001");
    expect(normaliseSearchText("RFR")).toBe("rfr");
  });
});

describe("matchesTextSearch", () => {
  it("is case-insensitive", () => {
    expect(matchesTextSearch(["Case-001", "RFR"], "case")).toBe(true);
    expect(matchesTextSearch(["Case-001"], "rfr")).toBe(false);
  });

  it("returns true for empty query", () => {
    expect(matchesTextSearch(["anything"], "")).toBe(true);
    expect(matchesTextSearch(["anything"], "   ")).toBe(true);
  });
});

describe("isFilterActive", () => {
  it("treats all/empty as inactive", () => {
    expect(isFilterActive("all")).toBe(false);
    expect(isFilterActive("")).toBe(false);
    expect(isFilterActive(undefined)).toBe(false);
  });

  it("treats specific values as active", () => {
    expect(isFilterActive("RFR")).toBe(true);
    expect(isFilterActive("Fraud Analyst")).toBe(true);
  });
});

describe("filterOpsCases", () => {
  const sample = OPS_CASES.slice(0, 5);

  it("combines text and stream filters with AND", () => {
    const rfrCases = sample.filter((c) => c.stream === "RFR");
    if (rfrCases.length === 0) return;

    const target = rfrCases[0];
    const filtered = filterOpsCases(sample, {
      text: target.id.slice(0, 4),
      stream: "RFR",
      bucket: "all",
      impactTier: "all",
    });

    expect(filtered.every((c) => c.stream === "RFR")).toBe(true);
    expect(filtered.some((c) => c.id === target.id)).toBe(true);
  });

  it("filters by aging bucket", () => {
    const breached = OPS_CASES.filter(
      (caseItem) =>
        filterOpsCases([caseItem], { ...EMPTY_CASE_FILTERS, bucket: "Breached" }).length === 1,
    );
    if (breached.length === 0) return;

    const filtered = filterOpsCases(OPS_CASES, {
      ...EMPTY_CASE_FILTERS,
      bucket: "Breached",
    });
    expect(filtered.length).toBe(breached.length);
  });

  it("returns zero results when nothing matches", () => {
    const filtered = filterOpsCases(OPS_CASES, {
      text: "zzz-no-match-zzz",
      stream: "all",
      bucket: "all",
      impactTier: "all",
    });
    expect(filtered.length).toBe(0);
  });

  it("filters by impact tier", () => {
    const critical = OPS_CASES.filter((c) => c.impact.impactTier === "Critical");
    if (critical.length === 0) return;

    const filtered = filterOpsCases(OPS_CASES, {
      ...EMPTY_CASE_FILTERS,
      impactTier: "Critical",
    });
    expect(filtered.every((c) => c.impact.impactTier === "Critical")).toBe(true);
    expect(filtered.length).toBe(critical.length);
  });

  it("combines impact tier with stream and SLA bucket using AND", () => {
    const target = OPS_CASES.find((c) => c.impact.impactTier === "High");
    expect(target).toBeDefined();

    const filtered = filterOpsCases(OPS_CASES, {
      text: "",
      stream: target!.stream,
      bucket: "all",
      impactTier: "High",
    });
    expect(filtered.every((c) => c.stream === target!.stream)).toBe(true);
    expect(filtered.every((c) => c.impact.impactTier === "High")).toBe(true);
  });

  it("empty state can trigger when impact filter excludes all rows", () => {
    const filtered = filterOpsCases(OPS_CASES, {
      ...EMPTY_CASE_FILTERS,
      impactTier: "Critical",
      text: "zzz-no-match-zzz",
    });
    expect(filtered.length).toBe(0);
  });
});

describe("filterByMemberFilters", () => {
  it("filters Fraud Analyst role", () => {
    const filtered = filterByMemberFilters(OPS_TEAM, {
      text: "",
      role: "Fraud Analyst",
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((m) => m.role === "Fraud Analyst")).toBe(true);
  });

  it("filters Junior Analyst role", () => {
    const filtered = filterByMemberFilters(OPS_TEAM, {
      text: "",
      role: "Junior Analyst",
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((m) => m.role === "Junior Analyst")).toBe(true);
  });

  it("combines name search with role filter", () => {
    const fraud = OPS_TEAM.find((m) => m.role === "Fraud Analyst");
    expect(fraud).toBeDefined();
    const filtered = filterByMemberFilters(OPS_TEAM, {
      text: fraud!.name.split(" ")[0],
      role: "Fraud Analyst",
    });
    expect(filtered.some((m) => m.id === fraud!.id)).toBe(true);
    expect(filtered.every((m) => m.role === "Fraud Analyst")).toBe(true);
  });
});

describe("filterRowsByMemberFilters", () => {
  it("filters analyst rows by role", () => {
    const rows = OPS_TEAM.map((m) => ({
      analystName: m.name,
      role: m.role,
    }));
    const filtered = filterRowsByMemberFilters(rows, {
      text: "",
      role: "Junior Analyst",
    });
    expect(filtered.every((r) => r.role === "Junior Analyst")).toBe(true);
  });
});

describe("clear state helpers", () => {
  it("detects active filters", () => {
    expect(hasAnyActiveFilter({ text: "", stream: "all", bucket: "all", impactTier: "all" })).toBe(
      false,
    );
    expect(hasAnyActiveFilter({ text: "case", stream: "all", bucket: "all", impactTier: "all" })).toBe(
      true,
    );
    expect(hasAnyActiveFilter({ text: "", stream: "RFR", bucket: "all", impactTier: "all" })).toBe(
      true,
    );
    expect(hasAnyActiveFilter({ text: "", stream: "all", bucket: "all", impactTier: "Critical" })).toBe(
      true,
    );
  });

  it("empty result condition when count is zero", () => {
    const filtered = filterOpsCases(OPS_CASES, {
      text: "no-match-query",
      stream: "all",
      bucket: "all",
      impactTier: "all",
    });
    expect(filtered.length).toBe(0);
  });

  it("EMPTY filters reset state including impact tier", () => {
    expect(EMPTY_CASE_FILTERS.text).toBe("");
    expect(EMPTY_CASE_FILTERS.stream).toBe("all");
    expect(EMPTY_CASE_FILTERS.impactTier).toBe("all");
    expect(EMPTY_MEMBER_FILTERS.role).toBe("all");
  });
});
