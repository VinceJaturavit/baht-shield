import { describe, it, expect } from "vitest";
import { OUROX_PRODUCTS } from "@/data/ourox/products";

describe("home page Trace entry", () => {
  const trace = OUROX_PRODUCTS.find((p) => p.key === "trace");

  it("Trace entry exists", () => {
    expect(trace).toBeDefined();
  });

  it("Trace href is /trace", () => {
    expect(trace?.href).toBe("/trace");
  });

  it("Trace CTA is Enter Trace", () => {
    expect(trace?.cta).toBe("Enter Trace");
  });

  it("Trace label is Recovery Tracing Workflow", () => {
    expect(trace?.label).toBe("Recovery Tracing Workflow");
  });
});
