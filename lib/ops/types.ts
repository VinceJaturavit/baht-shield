export type OpsStreamCode = "RFR" | "DSP" | "LAR" | "PRO" | "PRF";

export type OpsPriorityTier = "Urgent" | "High" | "Standard";

export type OpsCaseStatus =
  | "New"
  | "In progress"
  | "Awaiting external"
  | "Blocked"
  | "Closed";

export type OpsSlaPressure = "Breached" | "Near breach" | "Due soon" | "On track";

export type OpsFinancialExposureBand = "Low" | "Moderate" | "High" | "Severe";

export type OpsSocialPressure = "None" | "Emerging" | "Elevated" | "High";

export type OpsIncidentSeverity = "None" | "Linked" | "Active incident";

export type OpsImpactTier = "Critical" | "High" | "Moderate" | "Low";

export interface OpsCaseImpact {
  financialExposureThb: number;
  financialExposureBand: OpsFinancialExposureBand;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
  impactTier: OpsImpactTier;
  impactRationale: string[];
}

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
  impact: OpsCaseImpact;
}
