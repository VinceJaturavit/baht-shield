import type { OpsStreamDefinition } from "./types";

export const OPS_STREAMS = [
  {
    code: "RFR",
    label: "Regulatory Fraud Reporting",
    slaCharacter: "Statutory deadline — tightest clock",
  },
  {
    code: "LAR",
    label: "Legal & Authority Requests",
    slaCharacter: "Per-request deadline, often urgent",
  },
  {
    code: "PRO",
    label: "Proactive Alerts",
    slaCharacter: "Funds-in-flight; fastest where money still moving",
  },
  {
    code: "DSP",
    label: "Dispute & Complaint",
    slaCharacter: "Customer-update SLA, moderate",
  },
  {
    code: "PRF",
    label: "Profile Review",
    slaCharacter: "Longest SLA, dashboard-managed",
  },
] as const satisfies readonly OpsStreamDefinition[];

export const OPS_STREAM_CODES = OPS_STREAMS.map((s) => s.code);

export function getStreamDefinition(code: OpsStreamDefinition["code"]) {
  return OPS_STREAMS.find((s) => s.code === code)!;
}
