import type { OpsQueueOwnership } from "@/lib/ops/roster-types";

export const OPS_QUEUE_OWNERSHIP: OpsQueueOwnership[] = [
  {
    queueCode: "Urgent",
    queueLabel: "Urgent overlay",
    ownerOfDay: "Ops Lead",
    backup: "Analyst A",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Decision-bearing queue — Fraud Analyst owner required",
  },
  {
    queueCode: "RFR",
    queueLabel: "Regulatory Fraud Reporting",
    ownerOfDay: "Ops Lead",
    backup: "Analyst A",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Decision-bearing queue — Fraud Analyst owner required",
  },
  {
    queueCode: "LAR",
    queueLabel: "Legal & Authority Requests",
    ownerOfDay: "Analyst A",
    backup: "Queue Owner",
    nextOwner: "Ops Lead",
    rotationNote: "Rotates daily",
    ownershipRule: "Decision-bearing queue — Fraud Analyst owner required",
  },
  {
    queueCode: "PRO",
    queueLabel: "Proactive Alerts",
    ownerOfDay: "Queue Owner",
    backup: "Ops Lead",
    nextOwner: "Analyst B",
    rotationNote: "Rotates daily",
    ownershipRule: "Decision-bearing queue — Fraud Analyst owner required",
  },
  {
    queueCode: "DSP",
    queueLabel: "Dispute & Complaint",
    ownerOfDay: "Junior Analyst A",
    backup: "Junior Analyst B",
    nextOwner: "Junior Analyst C",
    rotationNote: "Rotates daily",
    ownershipRule: "Structured intake — Junior Analyst owner allowed under SOP",
  },
  {
    queueCode: "PRF",
    queueLabel: "Profile Review",
    ownerOfDay: "Junior Analyst E",
    backup: "Junior Analyst B",
    nextOwner: "Junior Analyst H",
    rotationNote: "Rotates daily",
    ownershipRule: "Structured intake — Junior Analyst owner allowed under SOP",
  },
];

export const FRAUD_ANALYST_OWNED_QUEUES = ["Urgent", "RFR", "LAR"] as const;
export const JUNIOR_ANALYST_OWNED_QUEUES = ["DSP", "PRF"] as const;
