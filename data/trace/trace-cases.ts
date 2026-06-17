import type { TraceCase, TraceMethodComparison } from "@/lib/trace/types";
import { TRACE_VICTIM_IDS } from "@/lib/trace/boundary";

const ADDRESSES = {
  alice: "0xSYNTH-TRACE-ALICE-001",
  bob: "0xSYNTH-TRACE-BOB-002",
  scammer: "0xSYNTH-TRACE-SCAMMER-003",
  pool: "0xSYNTH-TRACE-POOL-004",
  vasp: "0xSYNTH-FROZEN-VASP-005",
  seed: "0xSYNTH-TRACE-SEED-000",
  hop1: "0xSYNTH-TRACE-HOP-A-001",
  hop2: "0xSYNTH-TRACE-HOP-B-002",
  cashOut: "0xSYNTH-TRACE-CASHOUT-003",
} as const;

const methodComparisons: TraceMethodComparison[] = [
  {
    method: "FIFO",
    assumption:
      "Earliest supported deposits are attributed to the seized outflow first.",
    allocations: [
      {
        victimId: TRACE_VICTIM_IDS.alice,
        victimNameSynthetic: "Alice",
        role: "victim",
        allocatedAmount: 10_000,
      },
      {
        victimId: TRACE_VICTIM_IDS.bob,
        victimNameSynthetic: "Bob",
        role: "victim",
        allocatedAmount: 2_000,
      },
      {
        victimId: TRACE_VICTIM_IDS.scammer,
        victimNameSynthetic: "Scammer",
        role: "scammer",
        allocatedAmount: 0,
      },
    ],
    weakness:
      "Can over-favour early claimants when later flows are closer to the seized funds.",
    defensibility:
      "Simple, consistent, and easy to explain where chronology is the chosen assumption.",
    uncertainty:
      "May be challenged if rapid layering suggests later funds are more directly connected.",
  },
  {
    method: "LIFO",
    assumption:
      "Latest supported deposits are attributed to the seized outflow first.",
    allocations: [
      {
        victimId: TRACE_VICTIM_IDS.alice,
        victimNameSynthetic: "Alice",
        role: "victim",
        allocatedAmount: 0,
      },
      {
        victimId: TRACE_VICTIM_IDS.bob,
        victimNameSynthetic: "Bob",
        role: "victim",
        allocatedAmount: 7_000,
      },
      {
        victimId: TRACE_VICTIM_IDS.scammer,
        victimNameSynthetic: "Scammer",
        role: "scammer",
        allocatedAmount: 5_000,
      },
    ],
    weakness:
      "Can exclude early victims even when they contributed to the pool.",
    defensibility:
      "Useful where rapid layering suggests the newest inflows are the funds most likely to have exited.",
    uncertainty:
      "Sensitive to transaction timing and may produce harsh claimant differences.",
  },
  {
    method: "pro-rata",
    assumption:
      "Seized funds are allocated proportionally across supported pool contributors.",
    allocations: [
      {
        victimId: TRACE_VICTIM_IDS.alice,
        victimNameSynthetic: "Alice",
        role: "victim",
        allocatedAmount: 4_800,
      },
      {
        victimId: TRACE_VICTIM_IDS.bob,
        victimNameSynthetic: "Bob",
        role: "victim",
        allocatedAmount: 4_800,
      },
      {
        victimId: TRACE_VICTIM_IDS.scammer,
        victimNameSynthetic: "Scammer",
        role: "scammer",
        allocatedAmount: 2_400,
      },
    ],
    weakness:
      "May dilute stronger claims by spreading value across all included contributors.",
    defensibility:
      "Transparent where funds are genuinely mixed and no single flow can be cleanly traced.",
    uncertainty:
      "Depends on who is allowed into the pool and what evidence supports inclusion.",
  },
  {
    method: "LIBR",
    assumption:
      "Recoverable attribution is constrained by the lowest intermediate balance after funds enter.",
    allocations: [
      {
        victimId: TRACE_VICTIM_IDS.alice,
        victimNameSynthetic: "Alice",
        role: "victim",
        allocatedAmount: 7_000,
      },
      {
        victimId: TRACE_VICTIM_IDS.bob,
        victimNameSynthetic: "Bob",
        role: "victim",
        allocatedAmount: 0,
      },
      {
        victimId: TRACE_VICTIM_IDS.scammer,
        victimNameSynthetic: "Scammer",
        role: "scammer",
        allocatedAmount: 5_000,
      },
    ],
    weakness: "Conservative and can reduce recovery for some victims.",
    defensibility:
      "Prevents attribution above the lowest balance that remained after relevant funds entered.",
    uncertainty:
      "Depends on the selected claimant scope and balance timeline.",
  },
];

export const traceAnchorCase: TraceCase = {
  caseId: "TRACE-CASE-001",
  title: "Synthetic co-mingled USDT recovery case",
  asset: "USDT",
  chain: "Ethereum (synthetic)",
  frozenAmount: 12_000,
  poolTotalBeforeOutflow: 25_000,
  remainingPoolBalance: 13_000,
  vaspHoldingFunds: "SYNTH-VASP Recovery Desk",
  status: "draft",
  lastUpdated: "2026-06-15T14:30:00.000Z",
  vendorEvidence: {
    vendorName: "Synthetic Vendor Export",
    caseReference: "SYNTH-VENDOR-REF-TRACE-001",
    exportTimestamp: "2026-06-14T09:00:00.000Z",
    seedAddress: ADDRESSES.seed,
    chain: "Ethereum (synthetic)",
    asset: "USDT",
    traceHops: [
      {
        hopIndex: 1,
        fromAddress: ADDRESSES.seed,
        toAddress: ADDRESSES.hop1,
        serviceOrCluster: "SYNTH-Mixer Cluster A",
        attributionConfidence: "Medium",
        note: "Synthetic hop — illustrative layering path",
      },
      {
        hopIndex: 2,
        fromAddress: ADDRESSES.hop1,
        toAddress: ADDRESSES.hop2,
        serviceOrCluster: "SYNTH-Aggregator Pool",
        attributionConfidence: "Medium",
        note: "Funds consolidated before pool deposit",
      },
      {
        hopIndex: 3,
        fromAddress: ADDRESSES.hop2,
        toAddress: ADDRESSES.pool,
        serviceOrCluster: "SYNTH-Co-mingled Pool",
        attributionConfidence: "High",
        note: "Terminal pool before VASP freeze",
      },
    ],
    cashOutEndpoint: ADDRESSES.cashOut,
    vaspHoldingFunds: ADDRESSES.vasp,
    notes:
      "Synthetic vendor packet imported by investigator. Represents post-trace evidence only — Ourox Trace does not perform this trace.",
    analystImportedBy: "SYNTH-Investigator-001",
  },
  poolLedger: [
    {
      txId: "SYNTH-TX-ALICE-T1",
      time: "t1",
      depositor: "Alice",
      role: "victim",
      direction: "in",
      amount: 10_000,
      runningBalance: 10_000,
      address: ADDRESSES.alice,
      evidenceStatus: "supported",
    },
    {
      txId: "SYNTH-TX-BOB-T2",
      time: "t2",
      depositor: "Bob",
      role: "victim",
      direction: "in",
      amount: 10_000,
      runningBalance: 20_000,
      address: ADDRESSES.bob,
      evidenceStatus: "supported",
    },
    {
      txId: "SYNTH-TX-SCAMMER-T3",
      time: "t3",
      depositor: "Scammer",
      role: "scammer",
      direction: "in",
      amount: 5_000,
      runningBalance: 25_000,
      address: ADDRESSES.scammer,
      evidenceStatus: "supported",
    },
    {
      txId: "SYNTH-TX-SEIZED-T4",
      time: "t4",
      depositor: "Seized outflow",
      role: "outflow",
      direction: "out",
      amount: 12_000,
      runningBalance: 13_000,
      address: ADDRESSES.vasp,
      evidenceStatus: "supported",
    },
  ],
  methodComparisons,
  ambiguousClaim: {
    victimId: "CLAIM-AMB-001",
    victimNameSynthetic: "Ambiguous Claimant",
    depositTx: "SYNTH-TX-AMB-UNVERIFIED",
    depositAmount: 1_250,
    attributedAmount: 0,
    confidence: "Low",
    evidenceCount: 0,
    gaps: [
      "Origin not established",
      "Unsupported source-of-funds link",
      "Not included in frozen-pool method allocation",
    ],
    status: "insufficient-evidence",
  },
};

export const traceCases: TraceCase[] = [traceAnchorCase];

export function getTraceCaseById(caseId: string): TraceCase | undefined {
  return traceCases.find((c) => c.caseId === caseId);
}

/** All trace-layer addresses for guardrail tests */
export function getAllTraceAddresses(): string[] {
  const c = traceAnchorCase;
  const hopAddresses = c.vendorEvidence.traceHops.flatMap((h) => [
    h.fromAddress,
    h.toAddress,
  ]);
  const ledgerAddresses = c.poolLedger.map((e) => e.address);
  return [
    c.vendorEvidence.seedAddress,
    c.vendorEvidence.cashOutEndpoint,
    c.vendorEvidence.vaspHoldingFunds,
    ...hopAddresses,
    ...ledgerAddresses,
  ];
}
