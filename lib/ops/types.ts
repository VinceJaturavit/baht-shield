export type OpsStreamCode = "RFR" | "DSP" | "LAR" | "PRO" | "PRF";

export type OpsPriorityTier = "Urgent" | "High" | "Standard";

export type OpsCaseStatus =
  | "New"
  | "In progress"
  | "Awaiting external"
  | "Blocked"
  | "Closed";

export type OpsSlaPressure = "Breached" | "Near breach" | "Due soon" | "On track";

export interface OpsStreamDefinition {
  code: OpsStreamCode;
  label: string;
  slaCharacter: string;
}

export interface OpsSlaRule {
  ruleRef: string;
  stream: OpsStreamCode;
  clockType: string;
  startTrigger: string;
  durationMinutes: number;
  costOfDelay: string;
}

export interface OpsCase {
  id: string;
  stream: OpsStreamCode;
  streamLabel: string;
  type: string;
  priorityTier: OpsPriorityTier;
  urgencyReason: string;
  createdAt: string;
  slaRuleRef: string;
  slaDue: string;
  ageMinutes: number;
  status: OpsCaseStatus;
  owner: string;
  queue: string;
}
