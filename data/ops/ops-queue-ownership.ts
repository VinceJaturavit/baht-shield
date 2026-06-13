import type { OpsQueueOwnership } from "@/lib/ops/roster-types";

export const OPS_QUEUE_OWNERSHIP: OpsQueueOwnership[] = [
  {
    queueCode: "Urgent",
    queueLabel: "Urgent overlay",
    ownerOfDay: "Ops Lead",
    backup: "Analyst A",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Officer-owned — decision-bearing priority overlay",
  },
  {
    queueCode: "RFR",
    queueLabel: "Regulatory Fraud Reporting",
    ownerOfDay: "Ops Lead",
    backup: "Analyst A",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Officer-owned — statutory deadline",
  },
  {
    queueCode: "LAR",
    queueLabel: "Legal & Authority Requests",
    ownerOfDay: "Analyst A",
    backup: "Queue Owner",
    nextOwner: "Ops Lead",
    rotationNote: "Rotates daily",
    ownershipRule: "Officer-owned — authority deadline",
  },
  {
    queueCode: "PRO",
    queueLabel: "Proactive Alerts",
    ownerOfDay: "Queue Owner",
    backup: "Ops Lead",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Officer-owned — funds-in-flight escalation path",
  },
  {
    queueCode: "DSP",
    queueLabel: "Dispute & Complaint",
    ownerOfDay: "Contractor A",
    backup: "Contractor B",
    nextOwner: "Contractor C",
    rotationNote: "Rotates daily",
    ownershipRule: "Contractor-owned intake under SOP — officer escalation available",
  },
  {
    queueCode: "PRF",
    queueLabel: "Profile Review",
    ownerOfDay: "Contractor E",
    backup: "Contractor B",
    nextOwner: "Contractor H",
    rotationNote: "Rotates daily",
    ownershipRule: "Contractor-owned intake under SOP — officer escalation available",
  },
];

export const OFFICER_OWNED_QUEUES = ["Urgent", "RFR", "LAR"] as const;
export const CONTRACTOR_OWNED_QUEUES = ["DSP", "PRF"] as const;
