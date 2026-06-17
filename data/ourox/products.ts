export const OUROX_PRODUCTS = [
  {
    key: "ops",
    name: "Ops",
    href: "/ops",
    label: "Fraud Operations Management",
    description:
      "Case management, queues, SLA, roster, and KPI control — the operations layer after an alert becomes a case.",
    cta: "Enter Ops",
  },
  {
    key: "verity",
    name: "Verity",
    href: "/verity",
    label: "Investigation & Pattern Intelligence",
    description:
      "Investigation and pattern-intelligence workspace for analyst-curated fraud evidence.",
    cta: "Enter Verity",
  },
  {
    key: "arbiter",
    name: "Arbiter",
    href: "/arbiter",
    label: "Risk Scoring & Decisioning",
    description:
      "Risk scoring and decisioning sandbox for features, rules, thresholds, and tuning.",
    cta: "Enter Arbiter",
  },
  {
    key: "trace",
    name: "Trace",
    href: "/trace",
    label: "Recovery Tracing Workflow",
    description:
      "AI-assisted recovery-tracing workflow — frozen-pool analysis, co-mingling method comparison, and victim attribution. Sits on top of vendor tracing tools.",
    cta: "Enter Trace",
  },
] as const;
