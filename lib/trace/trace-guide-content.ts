export const TRACE_GUIDE_THESIS =
  "Ourox Trace turns vendor tracing evidence into a human-reviewed recovery workflow: frozen pool → co-mingling method → victim attribution → evidence package → reviewer approval.";

export const TRACE_GUIDE_ROUTE = "/trace/guide";
export const TRACE_LANDING_ROUTE = "/trace";
export const TRACE_DEMO_CASE_ROUTE = "/trace/cases/TRACE-CASE-001";

export const TRACE_GUIDE_NAV = {
  backToTrace: { label: "Back to Trace", href: TRACE_LANDING_ROUTE },
  openCaseWorkflow: { label: "Open case workflow", href: TRACE_DEMO_CASE_ROUTE },
  guideLink: { label: "Guide", href: TRACE_GUIDE_ROUTE },
} as const;

export interface TraceGuideSectionMeta {
  id: string;
  title: string;
}

export const TRACE_GUIDE_SECTIONS: TraceGuideSectionMeta[] = [
  { id: "what-trace-is", title: "What Trace is" },
  { id: "is-is-not", title: "Is / is not" },
  { id: "recovery-mindset", title: "Recovery mindset" },
  { id: "forward-vs-backward", title: "Forward vs backward" },
  { id: "co-mingling", title: "Co-mingling" },
  { id: "tracing-methods", title: "Tracing methods" },
  { id: "vasp-recovery", title: "VASP recovery endpoint" },
  { id: "ai-assists", title: "Where AI assists" },
  { id: "insufficient-evidence", title: "Insufficient evidence" },
  { id: "workflow", title: "Workflow" },
  { id: "synthetic-boundary", title: "Synthetic boundary" },
];

export const TRACE_GUIDE_WHAT_IS = {
  heading: "What Ourox Trace is",
  thesis: TRACE_GUIDE_THESIS,
  explanation:
    "Ourox Trace is an AI-assisted recovery-tracing workflow layer that sits after vendor tracing. Investigators still perform blockchain tracing in specialist vendor tools. Trace starts once evidence has been imported and the recovery question becomes: which frozen funds can be attributed to which claimants, under which defensible method, with what evidence and limitations?",
  boundary: "Ourox Trace does not perform the trace.",
} as const;

export const TRACE_GUIDE_IS_LIST = [
  "Synthetic recovery-workflow demo.",
  "AI-assisted evidence organiser.",
  "Co-mingling method-comparison layer.",
  "Victim attribution workspace.",
  "Recovery documentation workspace.",
  "Human-in-the-loop analyst aid.",
] as const;

export const TRACE_GUIDE_IS_NOT_LIST = [
  "Not a blockchain tracing engine.",
  "Not a replacement for vendor tracing tools.",
  "Not a legal attribution engine.",
  "Not a real recovery product.",
  "Not a tool that independently decides victim ownership.",
  "Not a tool that approves attribution without human review.",
] as const;

export const TRACE_GUIDE_RECOVERY_MINDSET = {
  heading: "Recovery mindset: start from frozen funds",
  principle: "Recovery work starts from the funds that can actually be recovered.",
  body:
    "Forward tracing asks where funds went. Recovery attribution starts from the frozen pool: the money a regulated platform or legal process may be able to hold. From there, the investigator works backward to decide which victims can be attributed to that frozen balance and which claims remain unsupported.",
} as const;

export const TRACE_GUIDE_FORWARD_BACKWARD = {
  heading: "Forward vs backward tracing",
  forward:
    "Forward tracing follows funds downstream from a theft or victim-inflow point toward consolidation, bridges, mixers, and cash-out endpoints. This is usually performed in specialist vendor tracing tools.",
  backward:
    "Backward or recovery tracing starts from frozen or located funds and works back toward specific claimants. It asks: whose value is represented in this frozen balance, and can that attribution be defended?",
  traceRole:
    "In Ourox Trace, vendor tracing evidence is the input. The recovery workflow is the work product.",
} as const;

export const TRACE_GUIDE_CO_MINGLING = {
  heading: "Co-mingling and method choice",
  intro:
    "Co-mingling happens when funds from multiple sources enter the same wallet, account, pool, or transaction path before the recoverable outflow. Once value is mixed, the investigator cannot simply point to one exact unit of money and say it physically belongs to one claimant.",
  method:
    "A tracing method is an accounting assumption applied to the mixed pool. The method must be consistent, explainable, and defensible. Different methods can produce different victim outcomes on the same frozen pool, which is why method choice is a defensible judgment call rather than an automatic system output.",
} as const;

export const TRACE_GUIDE_METHODS = {
  heading: "The four methods",
  items: [
    {
      id: "fifo",
      label: "FIFO",
      description:
        "First in, first out. The earliest supported deposits are treated as leaving first.",
    },
    {
      id: "lifo",
      label: "LIFO",
      description:
        "Last in, first out. The latest supported deposits are treated as leaving first, often relevant where rapid layering is the case theory.",
    },
    {
      id: "libr",
      label: "LIBR",
      description:
        "Lowest intermediate balance rule. A conservative constraint that limits recoverable attribution to the lowest balance after relevant funds entered.",
    },
    {
      id: "pro-rata",
      label: "pro-rata",
      description:
        "Proportional taint. Mixed funds are allocated proportionally across supported contributors.",
    },
  ],
  samePool:
    "The same frozen pool can produce different victim allocations depending on which method is selected. In the demo case, the difference between FIFO and LIFO changes which claimant appears recoverable.",
  utxoNote:
    "UTXO chains such as Bitcoin track discrete inputs and outputs. Account-based chains such as Ethereum-style stablecoin flows track balances at addresses or accounts. Both can involve co-mingling, but the tracing mechanics differ.",
  caveat:
    "Accepted methods and legal treatment vary by jurisdiction, facts, asset type, and evidentiary standard. This guide is methodology education, not legal advice.",
} as const;

export const TRACE_GUIDE_VASP = {
  heading: "VASP attribution and recovery endpoint",
  intro:
    "Recovery becomes practical when funds touch a regulated platform or identifiable service. A VASP or exchange endpoint can become the place where a freeze or legal process is directed. On-chain tracing can continue across many hops, but recovery usually depends on an actionable endpoint.",
  pathway: "Freeze → Seize → Restitution",
  definitions: [
    {
      term: "Freeze",
      definition: "The platform holds funds after an appropriate legal request.",
    },
    {
      term: "Seize",
      definition: "Legal process transfers custody or control.",
    },
    {
      term: "Restitution",
      definition:
        "Recovered funds are returned to victims through the applicable process.",
    },
  ],
} as const;

export const TRACE_GUIDE_AI = {
  heading: "Where AI assists — and where it must not",
  principle: "AI compresses the work around the decision, not the decision.",
  can: [
    "summarise imported vendor evidence",
    "compare tracing methods",
    "flag gaps and unsupported claims",
    "draft rationale starters",
    "draft recovery-package narrative",
    "raise reviewer questions",
  ],
  cannot: [
    "perform real blockchain tracing",
    "choose the final method",
    "approve victim attribution",
    "claim legal certainty",
    "fabricate evidence",
    "suppress uncertainty",
    "replace senior review",
  ],
  humanOwned:
    "Method choice and victim attribution are human-owned. A reviewer must be able to see the evidence, the method selected, the rationale, the unresolved gaps, and the audit trail.",
} as const;

export const TRACE_GUIDE_INSUFFICIENT_EVIDENCE = {
  heading: "Insufficient evidence is a valid outcome",
  body:
    "A recovery workflow should not force every claimant into an attribution. If a claim cannot be substantiated, it should remain marked as insufficient evidence. That protects the integrity of the package and makes the reviewer's job clearer.",
} as const;

export const TRACE_GUIDE_WORKFLOW = {
  heading: "Workflow at a glance",
  steps: [
    "Intake — understand the case and recovery question.",
    "Imported tracing evidence — review vendor evidence as read-only input.",
    "Frozen funds — identify the recoverable endpoint and frozen pool.",
    "Co-mingling — understand why attribution is non-trivial.",
    "Method decision — compare FIFO, LIFO, LIBR, and pro-rata, then select a defensible method.",
    "Victim attribution — apply the selected method to supported claimants.",
    "Evidence package — assemble method, rationale, attribution, gaps, and audit context.",
    "Senior review — approve or reject the package through a human gate.",
  ],
} as const;

export const TRACE_GUIDE_SYNTHETIC = {
  heading: "Synthetic boundary",
  body:
    "Ourox Trace uses synthetic data only. The victims, claimants, addresses, vendor packet, VASP labels, ledger entries, and audit events are generated for demonstration and learning. The app does not query a live blockchain, call a vendor API, use real exchange data, process real victim data, or produce a legal recovery filing.",
  purpose:
    "The purpose is to demonstrate recovery-workflow design, method-comparison discipline, human-in-the-loop governance, and AI fluency in a public-safe prototype.",
} as const;

/** Flatten all guide copy for content-coverage tests. */
export function getTraceGuideSearchableText(): string {
  const parts: string[] = [
    TRACE_GUIDE_THESIS,
    TRACE_GUIDE_WHAT_IS.explanation,
    TRACE_GUIDE_WHAT_IS.boundary,
    ...TRACE_GUIDE_IS_LIST,
    ...TRACE_GUIDE_IS_NOT_LIST,
    TRACE_GUIDE_RECOVERY_MINDSET.heading,
    TRACE_GUIDE_RECOVERY_MINDSET.principle,
    TRACE_GUIDE_RECOVERY_MINDSET.body,
    TRACE_GUIDE_FORWARD_BACKWARD.forward,
    TRACE_GUIDE_FORWARD_BACKWARD.backward,
    TRACE_GUIDE_FORWARD_BACKWARD.traceRole,
    TRACE_GUIDE_CO_MINGLING.intro,
    TRACE_GUIDE_CO_MINGLING.method,
    ...TRACE_GUIDE_METHODS.items.map((m) => `${m.label} ${m.description}`),
    TRACE_GUIDE_METHODS.samePool,
    TRACE_GUIDE_METHODS.utxoNote,
    TRACE_GUIDE_VASP.intro,
    TRACE_GUIDE_VASP.pathway,
    ...TRACE_GUIDE_VASP.definitions.map((d) => `${d.term} ${d.definition}`),
    TRACE_GUIDE_AI.principle,
    ...TRACE_GUIDE_AI.can,
    ...TRACE_GUIDE_AI.cannot,
    TRACE_GUIDE_AI.humanOwned,
    TRACE_GUIDE_INSUFFICIENT_EVIDENCE.body,
    TRACE_GUIDE_WORKFLOW.heading,
    ...TRACE_GUIDE_WORKFLOW.steps,
    TRACE_GUIDE_SYNTHETIC.body,
    TRACE_GUIDE_SYNTHETIC.purpose,
  ];
  return parts.join(" ");
}
