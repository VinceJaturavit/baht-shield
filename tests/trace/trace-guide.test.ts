import { describe, it, expect } from "vitest";
import {
  TRACE_GUIDE_ROUTE,
  TRACE_GUIDE_NAV,
  TRACE_GUIDE_SECTIONS,
  TRACE_GUIDE_THESIS,
  getTraceGuideSearchableText,
} from "@/lib/trace/trace-guide-content";

describe("trace reviewer guide content", () => {
  const searchable = getTraceGuideSearchableText();

  const requiredStrings = [
    "Ourox Trace turns vendor tracing evidence into a human-reviewed recovery workflow",
    "does not perform the trace",
    "not a blockchain tracing engine",
    "recovery mindset",
    "frozen funds",
    "forward tracing",
    "backward or recovery tracing",
    "co-mingling",
    "defensible judgment call",
    "FIFO",
    "LIFO",
    "LIBR",
    "pro-rata",
    "UTXO",
    "account-based",
    "VASP",
    "Freeze",
    "Seize",
    "Restitution",
    "AI compresses the work around the decision",
    "insufficient evidence",
    "workflow at a glance",
    "synthetic data",
    "live blockchain",
  ];

  it.each(requiredStrings)("contains required content: %s", (fragment) => {
    expect(searchable.toLowerCase()).toContain(fragment.toLowerCase());
  });

  it("exports the guide route", () => {
    expect(TRACE_GUIDE_ROUTE).toBe("/trace/guide");
  });

  it("has eleven guide sections", () => {
    expect(TRACE_GUIDE_SECTIONS.length).toBe(11);
  });

  it("thesis matches spec one-liner", () => {
    expect(TRACE_GUIDE_THESIS).toMatch(/frozen pool/);
    expect(TRACE_GUIDE_THESIS).toMatch(/reviewer approval/);
  });
});

describe("trace reviewer guide navigation", () => {
  it("guide link points to /trace/guide", () => {
    expect(TRACE_GUIDE_NAV.guideLink.href).toBe("/trace/guide");
    expect(TRACE_GUIDE_NAV.guideLink.label).toBe("Guide");
  });

  it("guide links back to Trace landing", () => {
    expect(TRACE_GUIDE_NAV.backToTrace.href).toBe("/trace");
  });

  it("guide links to demo case workflow", () => {
    expect(TRACE_GUIDE_NAV.openCaseWorkflow.href).toBe("/trace/cases/TRACE-CASE-001");
  });
});
