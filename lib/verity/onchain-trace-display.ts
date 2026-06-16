import type { VerityOnChainTraceHop } from "./agent-types";

export const HOP_TYPE_LABELS: Record<
  VerityOnChainTraceHop["hopType"],
  string
> = {
  transfer: "Transfer",
  peel: "Peel",
  bridge: "Bridge",
  mixer: "Mixer",
  consolidation: "Consolidation",
  "cash-out": "Cash-out",
};

export const RECOVERY_CHAIN_STAGES = [
  {
    label: "Freeze",
    gloss: "VASP holds funds on legal request.",
    tone: "watch" as const,
  },
  {
    label: "Seize",
    gloss: "Legal process transfers custody.",
    tone: "neutral" as const,
  },
  {
    label: "Restitution",
    gloss: "Funds returned to victims.",
    tone: "good" as const,
  },
] as const;

export const RECOVERY_CHAIN_CAVEAT =
  "Explanatory only. No freeze, seizure, or restitution action is executed in this demo.";

export function getShortAttribution(hop: VerityOnChainTraceHop): string {
  const vaspMatch = hop.attributionLabel.match(/SYNTH-Exchange-[A-Z]/);
  if (vaspMatch) return vaspMatch[0];

  switch (hop.attributionType) {
    case "unknown_cluster":
      return "unknown cluster";
    case "synthetic_bridge":
      return "synthetic bridge";
    case "synthetic_exchange_vasp":
      return "cash-out VASP";
    default:
      break;
  }

  const lower = hop.attributionLabel.toLowerCase();
  if (lower.includes("victim")) return "victim-linked inflow";
  if (lower.includes("intermediary") || lower.includes("peel"))
    return "intermediary wallet";
  if (lower.includes("co-mingled") || hop.isCoMingled)
    return "co-mingled consolidation";
  if (lower.includes("cluster")) return "cluster wallet";
  if (lower.includes("dormant")) return "dormant wallet";
  if (lower.includes("inflow")) return "small inflow";
  if (lower.includes("bridge")) return "synthetic bridge";

  const firstClause = hop.attributionLabel.split(/[—–]/)[0]?.trim();
  return firstClause ? firstClause.toLowerCase() : hop.attributionLabel;
}

export interface HopPrimaryLineParts {
  index: number;
  hopType: string;
  amount: string;
  asset: string;
  attribution: string;
  isCashOut: boolean;
  isCoMingled: boolean;
  tracingMethod: string | null;
}

export function getHopPrimaryLineParts(
  hop: VerityOnChainTraceHop,
  isCashOut: boolean
): HopPrimaryLineParts {
  return {
    index: hop.index,
    hopType: HOP_TYPE_LABELS[hop.hopType],
    amount: hop.amount.toLocaleString(),
    asset: hop.asset,
    attribution: getShortAttribution(hop),
    isCashOut,
    isCoMingled: hop.isCoMingled,
    tracingMethod:
      hop.isCoMingled && hop.tracingMethod !== "not_applicable"
        ? hop.tracingMethod
        : null,
  };
}

export function formatHopPrimaryLine(
  hop: VerityOnChainTraceHop,
  isCashOut: boolean
): string {
  const parts = getHopPrimaryLineParts(hop, isCashOut);
  const segments = [
    `Hop ${parts.index}`,
    parts.hopType,
    `${parts.amount} ${parts.asset}`,
    parts.attribution,
  ];
  if (parts.isCoMingled) {
    segments.push("co-mingled");
    if (parts.tracingMethod) segments.push(parts.tracingMethod);
  }
  if (parts.isCashOut) segments.push("recovery point");
  return segments.join(" · ");
}

export function getHopDetailFields(hop: VerityOnChainTraceHop) {
  return {
    fromAddress: hop.fromAddress,
    toAddress: hop.toAddress,
    chain: hop.chain,
    ledgerModel: hop.ledgerModel === "utxo" ? "UTXO" : "Account-based",
    attributionLabel: hop.attributionLabel,
    note: hop.note,
    methodNote: hop.methodNote,
    tracingMethod:
      hop.tracingMethod !== "not_applicable" ? hop.tracingMethod : null,
  };
}

export function formatRecoveryPointLabel(label: string): string {
  if (label === "Actionable recovery point") return "Recovery point";
  return label;
}
