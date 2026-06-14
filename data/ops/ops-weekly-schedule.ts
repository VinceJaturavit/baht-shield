import type { OpsWeeklyAssignment } from "@/lib/ops/weekly-schedule-types";

/** Synthetic Mon–Sun shift + task pattern per roster member (Ops-Spec-007). */
export const OPS_WEEKLY_ASSIGNMENTS: OpsWeeklyAssignment[] = [
  // ── FA-001 Ops Lead ──────────────────────────────────────────────────────
  { memberId: "FA-001", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting", isOwnerOfDay: true },
  { memberId: "FA-001", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "LAR", taskLabel: "Legal & Authority Requests" },
  { memberId: "FA-001", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "Urgent", taskLabel: "Cross-stream urgent overlay" },
  { memberId: "FA-001", day: "Thu", shiftCode: "D", shiftName: "Day", taskTag: "PRO", taskLabel: "Proactive Alerts" },
  { memberId: "FA-001", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-001", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "FA-001", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── FA-002 Analyst A ─────────────────────────────────────────────────────
  { memberId: "FA-002", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "LAR", taskLabel: "Legal & Authority Requests", isBackup: true },
  { memberId: "FA-002", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-002", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-002", day: "Thu", shiftCode: "E", shiftName: "Evening", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Handoff from Day shift for near-deadline request" },
  { memberId: "FA-002", day: "Fri", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "FA-002", day: "Sat", shiftCode: "D", shiftName: "Day", taskTag: "QA", taskLabel: "Quality / escalation review" },
  { memberId: "FA-002", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── FA-003 Analyst B ───────────────────────────────────────────────────
  { memberId: "FA-003", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "PRO", taskLabel: "Proactive Alerts" },
  { memberId: "FA-003", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "LAR", taskLabel: "Legal & Authority Requests" },
  { memberId: "FA-003", day: "Wed", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — coverage by Queue Owner" },
  { memberId: "FA-003", day: "Thu", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — coverage by Queue Owner" },
  { memberId: "FA-003", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-003", day: "Sat", shiftCode: "D", shiftName: "Day", taskTag: "Urgent", taskLabel: "Cross-stream urgent overlay" },
  { memberId: "FA-003", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── FA-004 Queue Owner ─────────────────────────────────────────────────
  { memberId: "FA-004", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "PRO", taskLabel: "Proactive Alerts", isOwnerOfDay: true },
  { memberId: "FA-004", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-004", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "LAR", taskLabel: "Legal & Authority Requests", note: "Covering Analyst B leave" },
  { memberId: "FA-004", day: "Thu", shiftCode: "E", shiftName: "Evening", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Evening handoff for LAR near-deadline queue" },
  { memberId: "FA-004", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "PRO", taskLabel: "Proactive Alerts" },
  { memberId: "FA-004", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "FA-004", day: "Sun", shiftCode: "N", shiftName: "Night / On-call", taskTag: "PRO", taskLabel: "Proactive Alerts", note: "On-call for funds-in-flight PRO alerts" },

  // ── FA-005 Fraud Analyst E (Evening) ───────────────────────────────────
  { memberId: "FA-005", day: "Mon", shiftCode: "E", shiftName: "Evening", taskTag: "LAR", taskLabel: "Legal & Authority Requests" },
  { memberId: "FA-005", day: "Tue", shiftCode: "E", shiftName: "Evening", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-005", day: "Wed", shiftCode: "E", shiftName: "Evening", taskTag: "Urgent", taskLabel: "Cross-stream urgent overlay" },
  { memberId: "FA-005", day: "Thu", shiftCode: "E", shiftName: "Evening", taskTag: "PRO", taskLabel: "Proactive Alerts" },
  { memberId: "FA-005", day: "Fri", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "FA-005", day: "Sat", shiftCode: "E", shiftName: "Evening", taskTag: "QA", taskLabel: "Quality / escalation review" },
  { memberId: "FA-005", day: "Sun", shiftCode: "E", shiftName: "Evening", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Sunday evening handoff to Night shift" },

  // ── FA-006 Fraud Analyst F (Night / On-call) ───────────────────────────
  { memberId: "FA-006", day: "Mon", shiftCode: "N", shiftName: "Night / On-call", taskTag: "Urgent", taskLabel: "Cross-stream urgent overlay", note: "On-call for statutory deadline cases" },
  { memberId: "FA-006", day: "Tue", shiftCode: "N", shiftName: "Night / On-call", taskTag: "PRO", taskLabel: "Proactive Alerts", note: "On-call for funds-in-flight alerts" },
  { memberId: "FA-006", day: "Wed", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "FA-006", day: "Thu", shiftCode: "N", shiftName: "Night / On-call", taskTag: "RFR", taskLabel: "Regulatory Fraud Reporting" },
  { memberId: "FA-006", day: "Fri", shiftCode: "N", shiftName: "Night / On-call", taskTag: "LAR", taskLabel: "Legal & Authority Requests" },
  { memberId: "FA-006", day: "Sat", shiftCode: "N", shiftName: "Night / On-call", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Night handoff from Evening shift" },
  { memberId: "FA-006", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-001 Junior Analyst A ────────────────────────────────────────────
  { memberId: "JA-001", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint", isOwnerOfDay: true },
  { memberId: "JA-001", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-001", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-001", day: "Thu", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-001", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-001", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-001", day: "Sun", shiftCode: "D", shiftName: "Day", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Day intake handoff to Evening shift" },

  // ── JA-002 Junior Analyst B ────────────────────────────────────────────
  { memberId: "JA-002", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review", isBackup: true },
  { memberId: "JA-002", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-002", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-002", day: "Thu", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-002", day: "Fri", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-002", day: "Sat", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-002", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-003 Junior Analyst C ────────────────────────────────────────────
  { memberId: "JA-003", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-003", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-003", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-003", day: "Thu", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-003", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-003", day: "Sat", shiftCode: "D", shiftName: "Day", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work" },
  { memberId: "JA-003", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-004 Junior Analyst D (Evening) ──────────────────────────────────
  { memberId: "JA-004", day: "Mon", shiftCode: "E", shiftName: "Evening", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-004", day: "Tue", shiftCode: "E", shiftName: "Evening", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-004", day: "Wed", shiftCode: "E", shiftName: "Evening", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-004", day: "Thu", shiftCode: "E", shiftName: "Evening", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-004", day: "Fri", shiftCode: "E", shiftName: "Evening", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Evening intake handoff to Night shift" },
  { memberId: "JA-004", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-004", day: "Sun", shiftCode: "E", shiftName: "Evening", taskTag: "DSP", taskLabel: "Dispute & Complaint" },

  // ── JA-005 Junior Analyst E ────────────────────────────────────────────
  { memberId: "JA-005", day: "Mon", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review", isOwnerOfDay: true },
  { memberId: "JA-005", day: "Tue", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-005", day: "Wed", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-005", day: "Thu", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-005", day: "Fri", shiftCode: "D", shiftName: "Day", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-005", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-005", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-006 Junior Analyst F (Off) ──────────────────────────────────────
  { memberId: "JA-006", day: "Mon", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Tue", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Wed", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Thu", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Fri", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-006", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-007 Junior Analyst G (Evening) ──────────────────────────────────
  { memberId: "JA-007", day: "Mon", shiftCode: "E", shiftName: "Evening", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-007", day: "Tue", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-007", day: "Wed", shiftCode: "E", shiftName: "Evening", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-007", day: "Thu", shiftCode: "E", shiftName: "Evening", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-007", day: "Fri", shiftCode: "E", shiftName: "Evening", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work" },
  { memberId: "JA-007", day: "Sat", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-007", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-008 Junior Analyst H (Leave) ──────────────────────────────────────
  { memberId: "JA-008", day: "Mon", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — PRF covered by Junior Analyst B" },
  { memberId: "JA-008", day: "Tue", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — PRF covered by Junior Analyst B" },
  { memberId: "JA-008", day: "Wed", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — PRF covered by Junior Analyst E" },
  { memberId: "JA-008", day: "Thu", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — PRF covered by Junior Analyst E" },
  { memberId: "JA-008", day: "Fri", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned", note: "Planned leave — PRF covered by Junior Analyst E" },
  { memberId: "JA-008", day: "Sat", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-008", day: "Sun", shiftCode: "LEAVE", shiftName: "Leave", taskTag: "Off", taskLabel: "Not assigned" },

  // ── JA-009 Junior Analyst I (Night / On-call) ──────────────────────────
  { memberId: "JA-009", day: "Mon", shiftCode: "N", shiftName: "Night / On-call", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-009", day: "Tue", shiftCode: "N", shiftName: "Night / On-call", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-009", day: "Wed", shiftCode: "N", shiftName: "Night / On-call", taskTag: "Handoff", taskLabel: "Shift-boundary handoff work", note: "Night intake handoff from Evening shift" },
  { memberId: "JA-009", day: "Thu", shiftCode: "N", shiftName: "Night / On-call", taskTag: "DSP", taskLabel: "Dispute & Complaint" },
  { memberId: "JA-009", day: "Fri", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
  { memberId: "JA-009", day: "Sat", shiftCode: "N", shiftName: "Night / On-call", taskTag: "PRF", taskLabel: "Profile Review" },
  { memberId: "JA-009", day: "Sun", shiftCode: "OFF", shiftName: "Off", taskTag: "Off", taskLabel: "Not assigned" },
];

export const OPS_WEEKLY_MEMBER_IDS = [
  "FA-001", "FA-002", "FA-003", "FA-004", "FA-005", "FA-006",
  "JA-001", "JA-002", "JA-003", "JA-004", "JA-005", "JA-006", "JA-007", "JA-008", "JA-009",
] as const;
