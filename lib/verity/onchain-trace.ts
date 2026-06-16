import type {
  VerityAgentScenario,
  VerityCashOutEndpoint,
  VerityOnChainTrace,
  VerityOnChainTraceHop,
} from "./agent-types";

const SYNTHETIC_ADDRESS_PATTERN = /SYNTH|DEMO|SYNTHETIC/i;

export const TRACING_METHOD_EXPLANATIONS: Record<
  Exclude<import("./agent-types").VerityTracingMethod, "not_applicable">,
  string
> = {
  FIFO: "first-in, first-out assumption.",
  LIFO: "last-in, first-out assumption.",
  LIBR: "lowest intermediate balance rule.",
  "pro-rata": "proportional allocation across co-mingled funds.",
};

export const RECOVERY_BACKTRACE_ROADMAP_COPY = {
  title: "Recovery backtrace roadmap",
  body: "This demo builds the forward trace to a synthetic cash-out VASP endpoint. A recovery-grade backward trace would start from frozen funds and work backward through co-mingled hops to attribute value to specific victims at evidentiary standard. That step is human-led and methodology-sensitive, not auto-run by this agent.",
  caption:
    "Forward tracing to a regulated cash-out endpoint is where this agent assists; recovery-grade backward tracing to victims stays a human-led evidentiary process.",
  recoveryChain: "freeze → seize → restitution",
};

export const TRACE_GOVERNANCE_COPY = {
  synthetic:
    "This trace is synthetic and deterministic. It uses clearly fake addresses and does not query a live blockchain, a real VASP, or a chain-analytics vendor. In production, the same workflow would need to be grounded in a TRM/Chainalysis-class tool, with human judgment, source citations, and an audit trail preserved.",
  methods:
    "Method labels such as FIFO, LIFO, LIBR, and pro-rata are shown as defensible judgment-call labels. They are not automatic truth.",
};

function hop(
  partial: Omit<VerityOnChainTraceHop, "index"> & { index: number }
): VerityOnChainTraceHop {
  return partial;
}

function buildAppScamTrace(caseId: string): VerityOnChainTrace {
  const hops: VerityOnChainTraceHop[] = [
    hop({
      index: 1,
      fromAddress: "0xSYNTH-APP-VICTIM-001",
      toAddress: "0xSYNTH-APP-COLLECTOR-002",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 48500,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Victim-linked inflow to cash-out collector",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Initial victim inflow to synthetic APP scam collector wallet.",
    }),
    hop({
      index: 2,
      fromAddress: "0xSYNTH-APP-COLLECTOR-002",
      toAddress: "0xSYNTH-APP-INTERMEDIARY-003",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 47200,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Fan-out to intermediary wallet",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Fan-out from collector to intermediary wallet — layering stage.",
    }),
    hop({
      index: 3,
      fromAddress: "0xSYNTH-APP-INTERMEDIARY-003",
      toAddress: "0xSYNTH-APP-PEEL-004",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 45800,
      hopType: "peel",
      attributionType: "self_custody_cluster",
      attributionLabel: "Peel transfer to secondary wallet",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Peel transfer reduces visible balance while moving funds to secondary wallet.",
    }),
    hop({
      index: 4,
      fromAddress: "0xSYNTH-APP-PEEL-004",
      toAddress: "0xSYNTH-APP-CONSOLIDATION-005",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 44100,
      hopType: "consolidation",
      attributionType: "unknown_cluster",
      attributionLabel: "Co-mingled consolidation wallet",
      isCoMingled: true,
      tracingMethod: "pro-rata",
      methodNote:
        "Funds co-mingle with unrelated synthetic inflows at this consolidation hop. A pro-rata allocation is shown as a defensible judgment-call label for this synthetic demo because no single outgoing transfer cleanly maps to one inflow.",
      ledgerModel: "account_based",
      note: "Consolidation hop where victim-linked funds mix with unrelated synthetic inflows.",
    }),
    hop({
      index: 5,
      fromAddress: "0xSYNTH-APP-CONSOLIDATION-005",
      toAddress: "0xSYNTH-EXCHANGE-A-DEPOSIT-006",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 43500,
      hopType: "transfer",
      attributionType: "synthetic_exchange_vasp",
      attributionLabel: "Transfer to SYNTH-Exchange-A deposit address",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Outbound transfer toward synthetic exchange deposit address.",
    }),
    hop({
      index: 6,
      fromAddress: "0xSYNTH-EXCHANGE-A-DEPOSIT-006",
      toAddress: "0xSYNTH-EXCHANGE-A-HOT-007",
      chain: "ETH",
      asset: "USDT-ETH",
      amount: 43500,
      hopType: "cash-out",
      attributionType: "synthetic_exchange_vasp",
      attributionLabel: "Cash-out at SYNTH-Exchange-A",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Funds reach synthetic exchange hot wallet — actionable VASP cash-out endpoint.",
    }),
  ];

  const cashOutEndpoint: VerityCashOutEndpoint = {
    hopIndex: 6,
    vaspLabel: "SYNTH-Exchange-A",
    address: "0xSYNTH-EXCHANGE-A-HOT-007",
    asset: "USDT-ETH",
    chain: "ETH",
    amount: 43500,
    whyActionable:
      "This synthetic VASP endpoint is the point where a real investigation would focus freeze/seizure coordination because funds touch a regulated platform.",
    recoveryPointLabel: "Actionable recovery point",
  };

  return {
    id: `trace-${caseId}-app`,
    caseId,
    scenario: "APP Scam Cash-out Ring",
    traceDirection: "forward",
    traceLabel: "Forward trace: theft / victim inflow to cash-out endpoint",
    summary:
      "Forward trace follows victim-linked inflows through fan-out and consolidation into a synthetic exchange cash-out endpoint. The exchange/VASP endpoint is the actionable recovery point because it represents where a regulated platform could receive a freeze request in a real investigation.",
    ledgerAwarenessNote:
      "This synthetic USDT trace is account-based, so balances are observed at wallet/address level rather than as discrete UTXO outputs.",
    hops,
    cashOutEndpoint,
    methodologyNotes: [
      "Fan-out and peel hops show layering before consolidation.",
      "Co-mingling at hop 4 requires method-aware judgment — pro-rata shown as defensible label only.",
    ],
    syntheticBoundary:
      "Synthetic deterministic trace using clearly fake addresses. No live chain query, no real VASP enrichment.",
  };
}

function buildMuleFarmTrace(caseId: string): VerityOnChainTrace {
  const hops: VerityOnChainTraceHop[] = [
    hop({
      index: 1,
      fromAddress: "0xSYNTH-MULE-INFLOW-A-001",
      toAddress: "0xSYNTH-MULE-CLUSTER-002",
      chain: "TRON",
      asset: "USDT-TRON",
      amount: 3200,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Small synthetic inflow to mule account cluster",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "One of many small onboarding inflows into mule farm cluster.",
    }),
    hop({
      index: 2,
      fromAddress: "0xSYNTH-MULE-INFLOW-B-003",
      toAddress: "0xSYNTH-MULE-CLUSTER-002",
      chain: "TRON",
      asset: "USDT-TRON",
      amount: 2800,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Additional small inflow to same cluster",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Second small inflow — cluster receives multiple onboarding wallets.",
    }),
    hop({
      index: 3,
      fromAddress: "0xSYNTH-MULE-CLUSTER-002",
      toAddress: "0xSYNTH-MULE-COLLECTOR-004",
      chain: "TRON",
      asset: "USDT-TRON",
      amount: 5800,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Transfer from mule wallet to cluster collector",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Mule cluster transfers toward collector wallet.",
    }),
    hop({
      index: 4,
      fromAddress: "0xSYNTH-MULE-COLLECTOR-004",
      toAddress: "0xSYNTH-MULE-CONSOLIDATION-005",
      chain: "TRON",
      asset: "USDT-TRON",
      amount: 11200,
      hopType: "consolidation",
      attributionType: "unknown_cluster",
      attributionLabel: "Cluster consolidation with other small inflows",
      isCoMingled: true,
      tracingMethod: "FIFO",
      methodNote:
        "Multiple small onboarding inflows consolidate at this hop. FIFO is shown as a defensible judgment-call label because earliest synthetic inflows are treated as first-out in this demo — attribution uncertainty remains at evidentiary standard.",
      ledgerModel: "account_based",
      note: "Consolidation of many small mule-farm inflows before VASP touchpoint.",
    }),
    hop({
      index: 5,
      fromAddress: "0xSYNTH-MULE-CONSOLIDATION-005",
      toAddress: "0xSYNTH-EXCHANGE-B-DEPOSIT-006",
      chain: "TRON",
      asset: "USDT-TRON",
      amount: 10800,
      hopType: "cash-out",
      attributionType: "synthetic_exchange_vasp",
      attributionLabel: "Cash-out endpoint at SYNTH-Exchange-B",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Lower-amount cash-out at synthetic VASP — earlier-stage than APP scam trace.",
    }),
  ];

  const cashOutEndpoint: VerityCashOutEndpoint = {
    hopIndex: 5,
    vaspLabel: "SYNTH-Exchange-B",
    address: "0xSYNTH-EXCHANGE-B-DEPOSIT-006",
    asset: "USDT-TRON",
    chain: "TRON",
    amount: 10800,
    whyActionable:
      "This synthetic VASP endpoint is the point where a real investigation would focus freeze/seizure coordination because funds touch a regulated platform.",
    recoveryPointLabel: "Actionable recovery point",
  };

  return {
    id: `trace-${caseId}-mf`,
    caseId,
    scenario: "Onboarding Mule Farm",
    traceDirection: "forward",
    traceLabel: "Forward trace: theft / victim inflow to cash-out endpoint",
    summary:
      "Forward trace shows clustered mule-farm flows moving from multiple synthetic onboarding wallets into a consolidation address before touching a synthetic VASP endpoint. The trace is useful for identifying the recovery point, but co-mingling at the consolidation hop requires method-aware judgment.",
    ledgerAwarenessNote:
      "This synthetic USDT-TRON trace is account-based, so balances are observed at wallet/address level rather than as discrete UTXO outputs.",
    hops,
    cashOutEndpoint,
    methodologyNotes: [
      "Many-inflow cluster consolidation pattern typical of onboarding mule farms.",
      "Co-mingling at hop 4 uses FIFO as defensible judgment label — not automatic truth.",
    ],
    syntheticBoundary:
      "Synthetic deterministic trace using clearly fake addresses. No live chain query, no real VASP enrichment.",
  };
}

function buildSleeperMuleTrace(caseId: string): VerityOnChainTrace {
  const hops: VerityOnChainTraceHop[] = [
    hop({
      index: 1,
      fromAddress: "bc1-SYNTH-SLEEPER-DORMANT-001",
      toAddress: "bc1-SYNTH-SLEEPER-ACTIVE-002",
      chain: "BTC",
      asset: "BTC",
      amount: 0.42,
      hopType: "transfer",
      attributionType: "self_custody_cluster",
      attributionLabel: "Dormant wallet activation transfer",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "utxo",
      note: "Dormant synthetic wallet reactivates with sudden outbound movement.",
    }),
    hop({
      index: 2,
      fromAddress: "bc1-SYNTH-SLEEPER-ACTIVE-002",
      toAddress: "bc1-SYNTH-SLEEPER-PEEL-003",
      chain: "BTC",
      asset: "BTC",
      amount: 0.38,
      hopType: "peel",
      attributionType: "self_custody_cluster",
      attributionLabel: "Peel transfer to intermediary",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "utxo",
      note: "Peel hop reduces visible UTXO linkage before bridge.",
    }),
    hop({
      index: 3,
      fromAddress: "bc1-SYNTH-SLEEPER-PEEL-003",
      toAddress: "0xSYNTH-BRIDGE-TRON-004",
      chain: "BTC",
      asset: "BTC",
      amount: 0.35,
      hopType: "bridge",
      attributionType: "synthetic_bridge",
      attributionLabel: "Bridge through synthetic cross-chain bridge",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "utxo",
      note: "Cross-chain bridge hop — attribution more judgment-dependent than direct exchange deposit.",
    }),
    hop({
      index: 4,
      fromAddress: "0xSYNTH-BRIDGE-TRON-004",
      toAddress: "0xSYNTH-SLEEPER-DEST-005",
      chain: "Polygon",
      asset: "USDC-Polygon",
      amount: 14200,
      hopType: "transfer",
      attributionType: "unknown_cluster",
      attributionLabel: "Destination-chain wallet (unknown cluster)",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Bridged funds arrive at destination-chain wallet with weaker attribution.",
    }),
    hop({
      index: 5,
      fromAddress: "0xSYNTH-SLEEPER-DEST-005",
      toAddress: "0xSYNTH-EXCHANGE-C-DEPOSIT-006",
      chain: "Polygon",
      asset: "USDC-Polygon",
      amount: 13800,
      hopType: "cash-out",
      attributionType: "synthetic_exchange_vasp",
      attributionLabel: "Cash-out at SYNTH-Exchange-C",
      isCoMingled: false,
      tracingMethod: "not_applicable",
      ledgerModel: "account_based",
      note: "Less direct path to VASP cash-out — bridge adds attribution ambiguity.",
    }),
  ];

  const cashOutEndpoint: VerityCashOutEndpoint = {
    hopIndex: 5,
    vaspLabel: "SYNTH-Exchange-C",
    address: "0xSYNTH-EXCHANGE-C-DEPOSIT-006",
    asset: "USDC-Polygon",
    chain: "Polygon",
    amount: 13800,
    whyActionable:
      "This synthetic VASP endpoint is the point where a real investigation would focus freeze/seizure coordination because funds touch a regulated platform.",
    recoveryPointLabel: "Actionable recovery point",
  };

  return {
    id: `trace-${caseId}-sm`,
    caseId,
    scenario: "Sleeper Mule Activation",
    traceDirection: "forward",
    traceLabel: "Forward trace: theft / victim inflow to cash-out endpoint",
    summary:
      "Forward trace shows a dormant synthetic wallet activating, peeling funds through an intermediary, then crossing a synthetic bridge before reaching a cash-out VASP endpoint. The bridge hop makes attribution more judgment-dependent than a direct exchange deposit.",
    ledgerAwarenessNote:
      "This synthetic BTC-style hop is UTXO-aware: recovery tracing would need to account for input/output selection, change outputs, and co-mingling methodology.",
    hops,
    cashOutEndpoint,
    methodologyNotes: [
      "Dormant-to-active narrative with bridge hop — weaker attribution than APP scam.",
      "UTXO hops require input/output selection awareness; account-based hops on Polygon follow address-level balances.",
    ],
    syntheticBoundary:
      "Synthetic deterministic trace using clearly fake addresses. No live chain query, no real VASP enrichment.",
  };
}

const SCENARIO_TRACE_BUILDERS: Record<
  VerityAgentScenario,
  (caseId: string) => VerityOnChainTrace
> = {
  "APP Scam Cash-out Ring": buildAppScamTrace,
  "Onboarding Mule Farm": buildMuleFarmTrace,
  "Sleeper Mule Activation": buildSleeperMuleTrace,
};

export function buildOnChainTraceForScenario(input: {
  caseId: string;
  scenario: VerityAgentScenario;
}): VerityOnChainTrace {
  return SCENARIO_TRACE_BUILDERS[input.scenario](input.caseId);
}

export function buildOnChainTrace(
  caseContext: { caseId: string; scenario: VerityAgentScenario } | null
): VerityOnChainTrace | null {
  if (!caseContext) return null;
  return buildOnChainTraceForScenario({
    caseId: caseContext.caseId,
    scenario: caseContext.scenario,
  });
}

export function getTraceSummary(trace: VerityOnChainTrace): string {
  const hopCount = trace.hops.length;
  const coMingledHops = trace.hops.filter((h) => h.isCoMingled);
  const peelCount = trace.hops.filter((h) => h.hopType === "peel").length;
  const consolidationCount = trace.hops.filter(
    (h) => h.hopType === "consolidation"
  ).length;
  const bridgeCount = trace.hops.filter((h) => h.hopType === "bridge").length;

  const narrativeParts: string[] = ["victim inflow"];
  if (peelCount > 0) {
    narrativeParts.push(`${peelCount} peel${peelCount > 1 ? "s" : ""}`);
  }
  if (bridgeCount > 0) {
    narrativeParts.push("bridge");
  }
  if (consolidationCount > 0) {
    narrativeParts.push("consolidation");
  }
  narrativeParts.push(`${trace.cashOutEndpoint.vaspLabel} cash-out`);

  let summary = `Forward trace: ${hopCount} hops · ${narrativeParts.join(" → ")}`;
  if (coMingledHops.length > 0) {
    const indices = coMingledHops.map((h) => h.index).join(", ");
    summary += ` · co-mingling at hop${coMingledHops.length > 1 ? "s" : ""} ${indices}`;
  }
  return summary;
}

export function getCashOutEndpoint(
  trace: VerityOnChainTrace
): VerityCashOutEndpoint {
  return trace.cashOutEndpoint;
}

export function validateSyntheticTraceAddresses(
  trace: VerityOnChainTrace
): boolean {
  const addresses = [
    ...trace.hops.flatMap((h) => [h.fromAddress, h.toAddress]),
    trace.cashOutEndpoint.address,
  ];
  return addresses.every((addr) => SYNTHETIC_ADDRESS_PATTERN.test(addr));
}

export function getOnChainExposureFinding(trace: VerityOnChainTrace): string {
  const coMingled = trace.hops.filter((h) => h.isCoMingled);
  const coMinglingNote =
    coMingled.length > 0
      ? `, with co-mingling identified at hop ${coMingled.map((h) => h.index).join(", ")}`
      : "";
  return `Forward on-chain trace reaches a synthetic VASP cash-out endpoint after ${trace.hops.length} hops${coMinglingNote}. No live chain query performed.`;
}
