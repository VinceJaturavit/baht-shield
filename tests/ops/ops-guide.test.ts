import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  OPS_GUIDE_SECTIONS,
  OPS_GUIDE_SECTION_IDS,
} from "@/components/ops/guide/ops-guide-sections";

const ROOT = resolve(__dirname, "../..");

describe("Ops guide route", () => {
  it("has /ops/guide page file", () => {
    expect(existsSync(resolve(ROOT, "app/ops/guide/page.tsx"))).toBe(true);
  });
});

describe("OPS_GUIDE_SECTIONS", () => {
  it("defines thirteen sections with stable anchor IDs", () => {
    expect(OPS_GUIDE_SECTIONS).toHaveLength(13);
    expect(OPS_GUIDE_SECTION_IDS).toEqual([
      "what-ops-is",
      "intake-streams",
      "queues-priority",
      "sla-aging",
      "roster-sub-views",
      "weekly-schedule-coverage",
      "fairness",
      "performance",
      "qa-behaviour",
      "four-signals",
      "reviews",
      "how-it-connects",
      "synthetic-boundary",
    ]);
  });

  it("uses current role names in guide copy", () => {
    const guideSource = readFileSync(
      resolve(ROOT, "components/ops/guide/OpsGuidePage.tsx"),
      "utf8"
    );
    expect(guideSource).toContain("Fraud Analyst");
    expect(guideSource).toContain("Junior Analyst");
    expect(guideSource).not.toMatch(/\bOfficer\b/);
    expect(guideSource).not.toMatch(/\bContractor\b/);
  });

  it("covers people-management topics added in Phase 1.5", () => {
    const guideSource = readFileSync(
      resolve(ROOT, "components/ops/guide/OpsGuidePage.tsx"),
      "utf8"
    );
    expect(guideSource).toContain("Roster sub-views");
    expect(guideSource).toContain("Weekly Schedule");
    expect(guideSource).toContain("Fairness");
    expect(guideSource).toContain("weighted throughput");
    expect(guideSource).toContain("SLA-pickup");
    expect(guideSource).toContain("four-signals principle");
    expect(guideSource).toContain("Reviews");
    expect(guideSource).not.toMatch(/\bTrueMoney\b/i);
    expect(guideSource).not.toMatch(/\bKraken\b/i);
    expect(guideSource).not.toMatch(/\bSignalOS\b/i);
  });
});

describe("Main guide Ops integration", () => {
  const mainGuide = readFileSync(resolve(ROOT, "app/guide/page.tsx"), "utf8");

  it("includes Ops in sticky index and section", () => {
    expect(mainGuide).toContain('id: "ops-features"');
    expect(mainGuide).toContain("Ops — fraud operations management");
  });

  it("links to /ops/guide", () => {
    expect(mainGuide).toContain('href="/ops/guide"');
    expect(mainGuide).toContain("Read the Ops guide");
  });

  it("uses three-pillar framing instead of two products", () => {
    expect(mainGuide).toContain("three pillars");
    expect(mainGuide).not.toContain("The two products");
    expect(mainGuide).not.toContain("two products");
  });
});
