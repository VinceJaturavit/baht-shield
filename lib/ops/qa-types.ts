export type OpsQaResult = "Pass" | "Fail";

export type OpsQaDefectCategory =
  | "Evidence incomplete"
  | "Misclassification"
  | "SLA mishandled"
  | "Documentation gap"
  | "Wrong escalation";

export interface OpsQaSample {
  id: string;
  handledCaseId: string;
  analystId: string;
  analystName: string;
  result: OpsQaResult;
  defectCategory?: OpsQaDefectCategory;
  qaScoreImpact: number;
}

export type OpsSlaPickupStatus = "Healthy" | "Watch" | "Avoidance risk";

export type OpsQaReadStatus = "On track" | "Watch" | "Needs review";

export interface OpsQaRow {
  analystId: string;
  analystName: string;
  role: import("./roster-types").OpsTeamRole;
  qaSampleCount: number;
  qaPassCount: number;
  qaFailCount: number;
  qaScore: number;
  topDefectCategory?: OpsQaDefectCategory;
  urgentPickupShare: number;
  roleExpectedUrgentPickupShare: number;
  slaPickupStatus: OpsSlaPickupStatus;
  slaPickupDetail?: string;
  qaReadStatus: OpsQaReadStatus;
}
