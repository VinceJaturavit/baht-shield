import type { ParsedPatternVariable, VariableCategory } from "./types";
import type { PatternFamily } from "./types";

// ---------------------------------------------------------------------------
// Category styles — explicit map (no dynamic Tailwind class construction)
// ---------------------------------------------------------------------------

export const VARIABLE_CATEGORY_STYLES: Record<
  VariableCategory,
  { dot: string; chip: string; label: string }
> = {
  "Device/SIM": {
    dot: "bg-indigo-400",
    chip: "border-indigo-800/60 bg-indigo-950/50 text-indigo-200",
    label: "Device / SIM",
  },
  "Endpoint/Beneficiary": {
    dot: "bg-emerald-400",
    chip: "border-emerald-800/60 bg-emerald-950/50 text-emerald-300",
    label: "Endpoint / Beneficiary",
  },
  "Behavior/Velocity": {
    dot: "bg-sky-400",
    chip: "border-sky-800/60 bg-sky-950/50 text-sky-300",
    label: "Behavior / Velocity",
  },
  "Identity/KYC": {
    dot: "bg-amber-400",
    chip: "border-amber-800/60 bg-amber-950/50 text-amber-300",
    label: "Identity / KYC",
  },
  Other: {
    dot: "bg-slate-500",
    chip: "border-slate-700/70 bg-slate-800/70 text-slate-300",
    label: "Other",
  },
};

// ---------------------------------------------------------------------------
// Category sort order per scenario family
// ---------------------------------------------------------------------------

const CATEGORY_ORDER: Record<
  PatternFamily | "default",
  VariableCategory[]
> = {
  "Onboarding Mule Farm": [
    "Device/SIM",
    "Identity/KYC",
    "Behavior/Velocity",
    "Endpoint/Beneficiary",
    "Other",
  ],
  "Sleeper Mule Activation": [
    "Behavior/Velocity",
    "Endpoint/Beneficiary",
    "Device/SIM",
    "Identity/KYC",
    "Other",
  ],
  "APP Scam Cash-out": [
    "Endpoint/Beneficiary",
    "Behavior/Velocity",
    "Device/SIM",
    "Identity/KYC",
    "Other",
  ],
  "Endpoint Intelligence": [
    "Endpoint/Beneficiary",
    "Behavior/Velocity",
    "Device/SIM",
    "Identity/KYC",
    "Other",
  ],
  Other: [
    "Endpoint/Beneficiary",
    "Device/SIM",
    "Behavior/Velocity",
    "Identity/KYC",
    "Other",
  ],
  default: [
    "Endpoint/Beneficiary",
    "Device/SIM",
    "Behavior/Velocity",
    "Identity/KYC",
    "Other",
  ],
};

// ---------------------------------------------------------------------------
// Operator formatting
// ---------------------------------------------------------------------------

function formatOperator(op: string): string {
  if (op === ">=") return "≥";
  if (op === "<=") return "≤";
  return op;
}

function snakeToTitle(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Variable mapping table
// ---------------------------------------------------------------------------

type VariableMapping = {
  category: VariableCategory;
  rank: number;
  label: (key: string, operator?: string, value?: string) => string;
};

const VARIABLE_MAP: Record<string, VariableMapping> = {
  // Device / SIM
  shared_device_count: {
    category: "Device/SIM",
    rank: 10,
    label: (_, op, val) => {
      if (op === ">=" && val) return `Shared device ≥ ${val} accounts`;
      if (op === "=" && val) return `Shared device across ${val} accounts`;
      return "Shared device count";
    },
  },
  device_reuse_count: {
    category: "Device/SIM",
    rank: 11,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Device reused across ≥ ${val} wallets`;
      return "Device reuse count";
    },
  },
  shared_sim_count: {
    category: "Device/SIM",
    rank: 12,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Shared SIM cluster ≥ ${val} accounts`;
      return "Shared SIM cluster";
    },
  },
  individual_device_score: {
    category: "Device/SIM",
    rank: 30,
    label: (_, op, val) => {
      if (op === "<" && val) return `Standalone device score < ${val}`;
      if (op === "<=" && val) return `Standalone device score ≤ ${val}`;
      return "Standalone device score";
    },
  },
  sim_change_count: {
    category: "Device/SIM",
    rank: 25,
    label: (_, op, val) => {
      if (op === ">" && val === "0") return "SIM change history present";
      if ((op === ">=" || op === ">") && val) return "Multiple SIM changes";
      return "SIM change count";
    },
  },

  // Endpoint / Beneficiary
  outbound_to_known_endpoint: {
    category: "Endpoint/Beneficiary",
    rank: 5,
    label: (_, op, val) => {
      if (val === "true") return "Outbound to known cash-out endpoint";
      return "Outbound to known endpoint";
    },
  },
  known_cashout_endpoint: {
    category: "Endpoint/Beneficiary",
    rank: 5,
    label: () => "Known cash-out endpoint",
  },
  endpoint_reuse_count: {
    category: "Endpoint/Beneficiary",
    rank: 6,
    label: (_, op, val) => {
      const numVal = val?.replace(/_cases?$/i, "").trim();
      if (numVal && (op === ">=" || op === ">"))
        return `Endpoint reused across ≥ ${numVal} cases`;
      if (numVal && op === "=") return `Endpoint matched ${numVal} cases`;
      return "Endpoint reuse count";
    },
  },
  cashout_beneficiary: {
    category: "Endpoint/Beneficiary",
    rank: 7,
    label: (_, op, val) => {
      if (val === "true") return "Cash-out beneficiary present";
      return "Cash-out beneficiary";
    },
  },
  cash_out_beneficiary: {
    category: "Endpoint/Beneficiary",
    rank: 7,
    label: (_, op, val) => {
      if (val === "true") return "Cash-out beneficiary present";
      return "Cash-out beneficiary";
    },
  },
  cross_border_endpoint: {
    category: "Endpoint/Beneficiary",
    rank: 8,
    label: (_, op, val) => {
      if (val === "true") return "Cross-border exit endpoint";
      return "Cross-border endpoint";
    },
  },
  beneficiary_reuse_count: {
    category: "Endpoint/Beneficiary",
    rank: 9,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Beneficiary reused across ≥ ${val} wallets`;
      return "Beneficiary reuse count";
    },
  },
  shared_destination_count: {
    category: "Endpoint/Beneficiary",
    rank: 9,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Shared destination across ≥ ${val} wallets`;
      return "Shared destination count";
    },
  },
  beneficiary_wallet_provider: {
    category: "Endpoint/Beneficiary",
    rank: 7,
    label: (_, op, val) => {
      if (val === "agent_cashout") return "Agent cash-out beneficiary provider";
      if (val) return `Beneficiary provider: ${val.replace(/_/g, " ")}`;
      return "Beneficiary wallet provider";
    },
  },
  endpoint_appears_in_cases: {
    category: "Endpoint/Beneficiary",
    rank: 6,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Endpoint appears in ≥ ${val} cases`;
      return "Endpoint appears in cases";
    },
  },
  linked_to_mule_wallet: {
    category: "Endpoint/Beneficiary",
    rank: 8,
    label: (_, op, val) => {
      if (val === "true") return "Linked to known mule wallet";
      return "Mule wallet link";
    },
  },
  linked_to_mule_ring: {
    category: "Endpoint/Beneficiary",
    rank: 8,
    label: (_, op, val) => {
      if (val === "true") return "Linked to known mule ring";
      return "Mule ring link";
    },
  },
  beneficiary_country: {
    category: "Endpoint/Beneficiary",
    rank: 8,
    label: (_, op, val) => {
      if (val) return `Beneficiary country: ${val.replace(/[\[\]]/g, "").trim()}`;
      return "Cross-border beneficiary country";
    },
  },
  outbound_channel: {
    category: "Endpoint/Beneficiary",
    rank: 6,
    label: (_, op, val) => {
      if (val) {
        const channels = val
          .replace(/[\[\]]/g, "")
          .split(",")
          .map((c) => c.trim().replace(/_/g, " "))
          .join(", ");
        return `Outbound channel: ${channels}`;
      }
      return "Outbound cash-out channel";
    },
  },
  channel: {
    category: "Endpoint/Beneficiary",
    rank: 7,
    label: (_, op, val) => {
      if (val === "cross_border_remittance") return "Cross-border remittance channel";
      if (val) return `Channel: ${val.replace(/_/g, " ")}`;
      return "Transaction channel";
    },
  },

  // Behavior / Velocity
  inbound_count: {
    category: "Behavior/Velocity",
    rank: 20,
    label: (_, op, val) => {
      const numVal = val?.split(" ")[0];
      if ((op === ">=" || op === ">") && numVal)
        return `Inbound fan-in ≥ ${numVal} transfers`;
      return "Inbound transfer count";
    },
  },
  outbound_count: {
    category: "Behavior/Velocity",
    rank: 22,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Outbound movement ≥ ${val} transfers`;
      return "Outbound transfer count";
    },
  },
  individual_velocity_below_threshold: {
    category: "Behavior/Velocity",
    rank: 26,
    label: (_, op, val) => {
      if (val === "true") return "Individual velocity below naive threshold";
      return "Individual velocity below threshold";
    },
  },
  days_since_last_active: {
    category: "Behavior/Velocity",
    rank: 15,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Dormant ≥ ${val} days before activation`;
      return "Days since last active";
    },
  },
  dormant_days: {
    category: "Behavior/Velocity",
    rank: 15,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val) return `Dormant ≥ ${val} days`;
      return "Dormant account age";
    },
  },
  account_age_days: {
    category: "Behavior/Velocity",
    rank: 24,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val) return `Aged account ≥ ${val} days`;
      return "Account age";
    },
  },
  wallet_age_days: {
    category: "Behavior/Velocity",
    rank: 24,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val) return `Aged wallet ≥ ${val} days`;
      return "Wallet age";
    },
  },
  amount_per_hop: {
    category: "Behavior/Velocity",
    rank: 27,
    label: (_, op, val) => {
      const numVal = val?.replace(/\s*THB\s*/i, "");
      if (op === "<" && numVal)
        return `Per-hop amount below high-value threshold`;
      return "Amount per hop";
    },
  },
  amount_per_txn: {
    category: "Behavior/Velocity",
    rank: 28,
    label: (_, op, val) => {
      const numVal = val?.replace(/\s*THB\s*/i, "");
      if (op === "<" && numVal)
        return `Per-transaction amount below threshold`;
      return "Transaction amount";
    },
  },
  rapid_pass_through: {
    category: "Behavior/Velocity",
    rank: 14,
    label: (_, op, val) => {
      if (val === "true") return "Rapid inbound-to-outbound pass-through";
      return "Rapid pass-through behavior";
    },
  },
  pass_through_minutes: {
    category: "Behavior/Velocity",
    rank: 16,
    label: (_, op, val) => {
      if (op === "<=" && val) return `Pass-through within ${val} minutes`;
      return "Pass-through timing indicator";
    },
  },
  transaction_amount_below_threshold: {
    category: "Behavior/Velocity",
    rank: 28,
    label: (_, op, val) => {
      if (val === "true") return "Transaction amount below naive threshold";
      return "Amount below threshold";
    },
  },
  victim_fan_in: {
    category: "Behavior/Velocity",
    rank: 18,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Victim fan-in ≥ ${val} transfers`;
      return "Victim fan-in transfers";
    },
  },

  // Identity / KYC
  repeated_doc_type: {
    category: "Identity/KYC",
    rank: 35,
    label: (_, op, val) => {
      if (val === "thai_id_card") return "Repeated Thai ID document type";
      if (val === "passport") return "Repeated passport document type";
      if (val) return `Repeated ${val.replace(/_/g, " ")} document type`;
      return "Repeated document type";
    },
  },
  liveness_scores_clustered: {
    category: "Identity/KYC",
    rank: 36,
    label: (_, op, val) => {
      if (val === "true") return "Liveness scores clustered";
      return "Clustered liveness scores";
    },
  },
  signup_window: {
    category: "Identity/KYC",
    rank: 34,
    label: (_, op, val) => {
      if (op === "<=" && val) return `Signup window ≤ ${val}`;
      if (op === "<" && val) return `Signup window < ${val}`;
      return "Clustered signup window";
    },
  },
  kyc_decision: {
    category: "Identity/KYC",
    rank: 38,
    label: (_, op, val) => {
      if (val === "approved") return "KYC approved individually";
      return "KYC decision";
    },
  },
  liveness_score: {
    category: "Identity/KYC",
    rank: 39,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val) return `Acceptable liveness score`;
      return "Liveness score";
    },
  },
  doc_type_reuse_count: {
    category: "Identity/KYC",
    rank: 37,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val)
        return `Document type repeated across ≥ ${val} users`;
      return "Document type reuse";
    },
  },

  // Other — pattern metadata in background patterns
  cluster_type: {
    category: "Other",
    rank: 90,
    label: (_, op, val) => {
      if (val) return `Cluster type: ${val.replace(/_/g, " ")}`;
      return "Cluster type";
    },
  },
  analyst_flagged: {
    category: "Other",
    rank: 91,
    label: (_, op, val) => {
      if (val === "true") return "Analyst flagged";
      return "Analyst flag";
    },
  },
  case_count: {
    category: "Other",
    rank: 92,
    label: (_, op, val) => {
      if ((op === ">=" || op === ">") && val) return `≥ ${val} linked cases`;
      return "Linked case count";
    },
  },
  victim_authorized_payment: {
    category: "Other",
    rank: 80,
    label: (_, op, val) => {
      if (val === "true") return "Victim-authorized payment";
      return "Authorized payment flag";
    },
  },
};

// ---------------------------------------------------------------------------
// Parse a single raw token (one semicolon-delimited segment)
// ---------------------------------------------------------------------------

function parseToken(raw: string): ParsedPatternVariable {
  const trimmed = raw.trim();

  // Try: key op value   (e.g. "shared_device_count >= 6", "repeated_doc_type = thai_id_card")
  // Also handles "in [...] " syntax and ">= N_cases" syntax
  const match = trimmed.match(
    /^([a-z_][a-z0-9_]*)\s*(>=|<=|>|<|=|in)\s*(.+)?$/i
  );

  let key = trimmed;
  let operator: string | undefined;
  let value: string | undefined;

  if (match) {
    key = match[1].toLowerCase();
    operator = match[2];
    value = match[3]?.trim();
  } else {
    // Bare key (e.g. "liveness_scores_clustered" without value)
    key = trimmed.toLowerCase().replace(/\s+/g, "_");
  }

  const mapping = VARIABLE_MAP[key];

  if (mapping) {
    return {
      raw: trimmed,
      key,
      operator,
      value,
      label: mapping.label(key, operator, value),
      category: mapping.category,
      rank: mapping.rank,
    };
  }

  // Fallback: snake_case → Title Case, preserve operator/value
  const baseLabel = snakeToTitle(key);
  const opPart = operator ? ` ${formatOperator(operator)}` : "";
  const valPart = value
    ? ` ${value.replace(/[\[\]]/g, "").replace(/_/g, " ")}`
    : "";
  return {
    raw: trimmed,
    key,
    operator,
    value,
    label: `${baseLabel}${opPart}${valPart}`.trim(),
    category: "Other",
    rank: 95,
  };
}

// ---------------------------------------------------------------------------
// Main parse function
// ---------------------------------------------------------------------------

export function parsePatternVariables(variables: string): ParsedPatternVariable[] {
  if (!variables || variables === "—") return [];

  const parts = variables
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.map(parseToken);
}

// ---------------------------------------------------------------------------
// Sort chips by scenario family
// ---------------------------------------------------------------------------

export function rankChips(
  chips: ParsedPatternVariable[],
  family?: PatternFamily
): ParsedPatternVariable[] {
  const order = CATEGORY_ORDER[family ?? "default"] ?? CATEGORY_ORDER["default"];

  return [...chips].sort((a, b) => {
    const catA = order.indexOf(a.category);
    const catB = order.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return a.rank - b.rank;
  });
}
