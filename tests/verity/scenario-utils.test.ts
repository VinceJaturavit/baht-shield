import { describe, it, expect } from "vitest";
import {
  SCENARIO_COLORS,
  PATTERN_FAMILY_COLORS,
} from "@/lib/scenario-utils";

const REAL_SCENARIOS = [
  "Onboarding Mule Farm",
  "Sleeper Mule Activation",
  "APP Scam Cash-out Ring",
] as const;

describe("SCENARIO_COLORS", () => {
  it("has distinct values for the three real scenarios", () => {
    const values = REAL_SCENARIOS.map((s) => SCENARIO_COLORS[s]);
    expect(new Set(values).size).toBe(3);
  });

  it("does not use bg-white for real scenarios", () => {
    for (const scenario of REAL_SCENARIOS) {
      expect(SCENARIO_COLORS[scenario]).not.toContain("bg-white");
    }
  });

  it("includes readable text classes for real scenarios", () => {
    for (const scenario of REAL_SCENARIOS) {
      expect(SCENARIO_COLORS[scenario]).toMatch(/text-/);
    }
  });

  it("uses neutral/muted styling for Background", () => {
    expect(SCENARIO_COLORS.Background).toContain("bg-signal-muted");
    expect(SCENARIO_COLORS.Background).toContain("text-signal-secondary");
  });
});

describe("PATTERN_FAMILY_COLORS", () => {
  it("does not use bg-white text-signal-body on dark surfaces", () => {
    for (const classes of Object.values(PATTERN_FAMILY_COLORS)) {
      expect(classes).not.toBe("border-signal-border bg-white text-signal-body");
      expect(classes).not.toContain("bg-white");
    }
  });
});
