export interface TracePreviewCase {
  caseId: string;
  title: string;
  description: string;
  status: string;
  locked: true;
}

export const tracePreviewCases: TracePreviewCase[] = [
  {
    caseId: "TRACE-CASE-002",
    title: "Bridge-hop USDC recovery preview",
    description:
      "Synthetic ETH-to-Polygon bridge-hop case for future cross-chain recovery workflow.",
    status: "Coming soon / preview",
    locked: true,
  },
  {
    caseId: "TRACE-CASE-003",
    title: "BTC UTXO peel-chain recovery preview",
    description:
      "Synthetic BTC peel-chain case for future UTXO-vs-account tracing comparison.",
    status: "Coming soon / preview",
    locked: true,
  },
];

export const TRACE_LANDING_THESIS =
  "Ourox Trace turns vendor tracing evidence into a human-reviewed recovery workflow.";

export const TRACE_THREE_STEP_EXPLAINER = [
  {
    step: 1,
    title: "Vendor trace comes in",
    detail:
      "A synthetic vendor evidence packet is reviewed as read-only input.",
  },
  {
    step: 2,
    title: "Recovery method is selected",
    detail:
      "The investigator compares FIFO, LIFO, LIBR, and pro-rata on the same frozen pool.",
  },
  {
    step: 3,
    title: "Evidence package goes to review",
    detail:
      "The selected method, attribution outcome, gaps, and rationale are assembled for senior review.",
  },
] as const;

export const TRACE_CASE_001_STORY =
  "Three synthetic deposits flow into a co-mingled USDT pool: Alice, Bob, and a dirty-fund deposit from the scammer. A synthetic VASP freezes 12,000 USDT from that pool. The investigator must decide which recovery method is defensible before victim attribution can be reviewed.";

export const TRACE_LANDING_SAFETY =
  "Synthetic demo only. Ourox Trace organises recovery workflow after vendor tracing; it does not perform tracing, decide victim ownership, or produce legal filings.";
