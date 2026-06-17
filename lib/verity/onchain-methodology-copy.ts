export const TRACING_METHODOLOGY_PANEL = {
  title: "Tracing methodology",
  caption:
    "Plain-language guide to forward tracing, co-mingling, VASP recovery points, and method choice.",
  intro:
    "On-chain tracing connects movement across wallets and services. This guide explains the concepts behind the forward trace shown above — not legal advice.",
} as const;

export const TRACING_METHODOLOGY_SECTIONS = [
  {
    id: "forward-vs-backward",
    heading: "Forward vs backward tracing",
    body: [
      "Forward tracing asks: where did the funds go? Backward / recovery tracing asks: whose funds are in the frozen balance?",
      "Forward tracing follows funds downstream from the theft or victim-inflow point toward consolidation, bridges, mixers, and cash-out endpoints. This demo assists the forward trace: theft → multi-hop movement → cash-out VASP.",
      "Backward tracing is a recovery-grade process. It starts from frozen or located funds and works backward through prior hops to attribute value to specific victims at evidentiary standard. In this demo, backward recovery tracing is shown as a human-led roadmap, not an automated feature.",
    ],
  },
  {
    id: "co-mingling",
    heading: "Co-mingling",
    body: [
      "Co-mingling means funds from multiple sources mix in one wallet or cluster.",
      "Co-mingling happens when suspected illicit funds mix with other funds in the same wallet, cluster, or transaction path. Once value is mixed, you usually cannot say which exact unit of value left first with physical certainty. The investigator applies an accounting assumption — the tracing method — and must apply it consistently and defensibly.",
    ],
  },
  {
    id: "tracing-methods",
    heading: "Tracing methods",
    body: [
      "Legal defaults and accepted methods can vary by jurisdiction, case facts, asset type, and evidentiary standard. The demo uses these as methodology labels, not legal advice.",
      "UTXO chains such as Bitcoin track discrete inputs and outputs. Account-based chains such as Ethereum-style stablecoin flows track balances at addresses or accounts. Both can involve co-mingling, but the tracing mechanics differ.",
    ],
    methods: [
      {
        label: "FIFO",
        description:
          "First in, first out. A common default-style assumption in some tracing contexts: the earliest incoming value is treated as leaving first.",
      },
      {
        label: "LIFO",
        description:
          "Last in, first out. Often used to follow rapid layering where the most recent incoming value is treated as leaving first.",
      },
      {
        label: "LIBR",
        description:
          "Lowest intermediate balance rule. A conservative constraint: recoverable value cannot exceed the lowest balance after the relevant funds entered.",
      },
      {
        label: "Pro-rata",
        description:
          "Proportional taint. Mixed funds are allocated proportionally across sources instead of assigning all value to one inflow.",
      },
    ],
  },
  {
    id: "judgment-call",
    heading: "Method choice is a judgment call",
    body: [
      "Method choice is not automatic. Different defensible methods can produce different answers on the same mixed funds. A recovery investigator must choose a method that fits the chain model, transaction pattern, legal context, and evidence available — and be prepared to explain it under review.",
      "The important discipline is consistency, transparency, and auditability.",
    ],
  },
  {
    id: "vasp-attribution",
    heading: "VASP attribution and recovery endpoint",
    body: [
      "The practical goal of a forward trace is often to find where funds touch a regulated platform — an exchange, VASP, bridge, or other identifiable service. On-chain tracing can continue indefinitely, but recovery becomes operationally realistic when funds reach a point where a freeze or legal process can be directed.",
      "VASP attribution identifies which regulated platform received the funds. The cash-out endpoint — also called the recovery endpoint — is where forward tracing typically stops for operational purposes: it is the point where freeze or seizure can be requested.",
    ],
  },
  {
    id: "recovery-pathway",
    heading: "Recovery pathway",
    body: [
      "Freeze → Seize → Restitution",
      "Freeze: the VASP holds funds after an appropriate legal request.",
      "Seize: legal process transfers custody or control.",
      "Restitution: recovered funds are returned to victims through the applicable process.",
      "This demo explains the pathway only. It does not execute legal, operational, or recovery actions.",
    ],
  },
  {
    id: "synthetic-boundary",
    heading: "Synthetic boundary",
    body: [
      "This tracing guide is attached to a synthetic demo. The addresses are clearly fake, the trace is deterministic, and no live blockchain, VASP, vendor system, customer data, or real case data is queried. In production, the same workflow would be grounded in a chain-analytics tool and reviewed by a human investigator with source citations and an audit trail.",
    ],
  },
] as const;

export const TRACING_METHODOLOGY_GUIDE_ANCHOR = {
  id: "on-chain-tracing-methodology",
  title: "On-chain tracing methodology",
  summary:
    "Forward tracing follows funds downstream toward a cash-out VASP; recovery-grade backward tracing is human-led. Co-mingled funds require a consistent accounting method — FIFO, LIFO, LIBR, or pro-rata — chosen as a defensible judgment call. The full guide is available in the on-chain trace area during agentic investigation.",
} as const;

/** Flat list of required content strings for smoke tests. */
export const TRACING_METHODOLOGY_REQUIRED_STRINGS = [
  "Forward vs backward tracing",
  "Co-mingling",
  "FIFO",
  "LIFO",
  "LIBR",
  "pro-rata",
  "UTXO",
  "account-based",
  "judgment call",
  "VASP",
  "cash-out endpoint",
  "Freeze",
  "Seize",
  "Restitution",
  "synthetic",
  "no live blockchain",
  "human investigator",
  "audit trail",
] as const;
