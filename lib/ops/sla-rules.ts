import type { OpsSlaRule } from "./types";

export const OPS_SLA_RULES = [
  {
    ruleRef: "SLA-RFR-STATUTORY-6H",
    stream: "RFR",
    clockType: "statutory submission clock",
    startTrigger: "case created from reportable fraud intake",
    durationMinutes: 360,
    costOfDelay:
      "Regulatory reporting cases carry statutory exposure. Near-deadline RFR cases rise above standard operational queues because late submission creates institutional risk.",
  },
  {
    ruleRef: "SLA-LAR-REQUEST-DEADLINE",
    stream: "LAR",
    clockType: "authority request deadline",
    startTrigger: "deadline received with request",
    durationMinutes: 480,
    costOfDelay:
      "Authority requests often include explicit response deadlines. Delay can affect legal response quality and escalation handling.",
  },
  {
    ruleRef: "SLA-PRO-FUNDS-IN-FLIGHT-2H",
    stream: "PRO",
    clockType: "funds-in-flight clock",
    startTrigger: "proactive alert generated while funds may still move",
    durationMinutes: 120,
    costOfDelay:
      "Proactive alerts can involve funds still in motion. Delay increases the chance that funds leave the recoverable window.",
  },
  {
    ruleRef: "SLA-DSP-CUSTOMER-UPDATE-24H",
    stream: "DSP",
    clockType: "customer update clock",
    startTrigger: "dispute or complaint case opened",
    durationMinutes: 1440,
    costOfDelay:
      "Dispute and complaint cases require timely customer updates, but usually have more operational tolerance than statutory or funds-in-flight cases.",
  },
  {
    ruleRef: "SLA-PRF-REVIEW-72H",
    stream: "PRF",
    clockType: "profile review clock",
    startTrigger: "profile review case queued",
    durationMinutes: 4320,
    costOfDelay:
      "Profile reviews are important for control quality and backlog hygiene, but generally carry the longest SLA and are managed through dashboard discipline.",
  },
] as const satisfies readonly OpsSlaRule[];

export function getSlaRuleByRef(ruleRef: string): OpsSlaRule | undefined {
  return OPS_SLA_RULES.find((r) => r.ruleRef === ruleRef);
}

export function getSlaRuleForStream(stream: OpsSlaRule["stream"]): OpsSlaRule {
  return OPS_SLA_RULES.find((r) => r.stream === stream)!;
}
