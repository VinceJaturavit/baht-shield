import type { OpsStreamWeight } from "@/lib/ops/kpi-types";

export const OPS_STREAM_COMPLEXITY_WEIGHTS: readonly OpsStreamWeight[] = [
  {
    stream: "RFR",
    weight: 2.5,
    rationale: "Regulatory reporting and decision-bearing work require senior review.",
  },
  {
    stream: "LAR",
    weight: 2.25,
    rationale: "Authority requests require careful handling, documentation, and escalation discipline.",
  },
  {
    stream: "PRO",
    weight: 1.75,
    rationale: "Funds-in-flight alerts require speed and judgment under time pressure.",
  },
  {
    stream: "DSP",
    weight: 1.0,
    rationale: "Dispute and complaint intake is structured but still SLA-sensitive.",
  },
  {
    stream: "PRF",
    weight: 0.8,
    rationale: "Profile review intake is important but generally lower urgency and more SOP-driven.",
  },
] as const;
