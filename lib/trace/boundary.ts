export const TRACE_BOUNDARY = {
  productName: "Ourox Trace",
  tagline:
    "AI-assisted recovery-tracing workflow layer that sits after vendor tracing.",
  isList: [
    "Synthetic demo recovery-workflow assistant",
    "Post-vendor-trace workflow layer",
    "Evidence organiser for imported vendor exports",
    "Co-mingling method-comparison layer",
    "Victim attribution workspace",
    "Human-in-the-loop analyst aid",
    "Decision-support AI only — never autonomous closure",
  ],
  isNotList: [
    "Ourox Trace is not a tracing engine",
    "Does not replace vendor tracing tools",
    "Not a blockchain analytics engine",
    "Not an automated tracing engine",
    "Not a legal attribution engine",
    "Not a real recovery product",
    "Does not independently decide victim ownership",
    "Does not independently approve attribution",
    "Not a live chain query system",
    "Not a real vendor integration",
  ],
  syntheticNotice:
    "All data on this layer is synthetic. Clearly fake addresses only. No real victims, exchanges, or vendor exports.",
  vendorEvidenceCaption:
    "Synthetic vendor export — represents evidence an investigator would bring from a vendor tracing platform. Ourox Trace does not perform the trace.",
  aiRoleStatement:
    "AI assist is decision-support only. It can summarise, flag gaps, compare methods, and draft rationale — it cannot choose the final method or approve attribution.",
  evidencePackageBanner:
    "Synthetic demonstration package — not legal advice, not a real recovery filing.",
  methodComparisonCaption:
    "Method choice is a defensible judgment call, not automatic. Different methods produce different victim outcomes on the same frozen pool, so the selected method must be justified and may face legal or reviewer scrutiny.",
  frozenPoolCaption:
    "The pool is co-mingled because victim funds and dirty funds enter the same recoverable pool before the seized outflow. Attribution depends on the method selected by the investigator.",
} as const;

export const TRACE_SEIZED_AMOUNT = 12_000;

export const TRACE_VICTIM_IDS = {
  alice: "VICTIM-ALICE-001",
  bob: "VICTIM-BOB-002",
  scammer: "TAINT-SCAMMER-003",
} as const;
