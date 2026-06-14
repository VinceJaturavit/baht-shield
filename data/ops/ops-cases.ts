import type {
  OpsCase,
  OpsCaseStatus,
  OpsIncidentSeverity,
  OpsPriorityTier,
  OpsSocialPressure,
  OpsStreamCode,
} from "@/lib/ops/types";
import { getStreamDefinition } from "@/lib/ops/streams";
import { getSlaRuleForStream } from "@/lib/ops/sla-rules";
import { getSlaPressure, OPS_REFERENCE_NOW } from "@/lib/ops/sla";
import { buildCaseImpact } from "@/lib/ops/impact";

type ImpactSeed = {
  financialExposureThb: number;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
};

type CaseSeed = {
  stream: OpsStreamCode;
  type: string;
  priorityTier: OpsPriorityTier;
  urgencyReason: string;
  /** Minutes before OPS_REFERENCE_NOW that the case was created. */
  createdMinutesAgo: number;
  /** Minutes until SLA due from OPS_REFERENCE_NOW (negative = overdue). */
  minutesUntilDue: number;
  status: OpsCaseStatus;
  owner: string;
  impact?: ImpactSeed;
};

const OWNERS = ["Unassigned", "Analyst A", "Analyst B", "Ops Lead", "Queue Owner"] as const;

const STATUSES: OpsCaseStatus[] = [
  "New",
  "In progress",
  "Awaiting external",
  "Blocked",
  "Closed",
];

/** Default impact profiles — independent of SLA timing; index-aligned with SEEDS order. */
const DEFAULT_IMPACT_PROFILES: ImpactSeed[] = [
  // RFR (10)
  { financialExposureThb: 3_200_000, socialPressure: "Elevated", incidentSeverity: "Active incident" },
  { financialExposureThb: 1_800_000, socialPressure: "High", incidentSeverity: "Linked" },
  { financialExposureThb: 2_400_000, socialPressure: "Elevated", incidentSeverity: "Linked" },
  { financialExposureThb: 900_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 1_200_000, socialPressure: "Elevated", incidentSeverity: "None" },
  { financialExposureThb: 120_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 380_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 6_500_000, socialPressure: "High", incidentSeverity: "Active incident" },
  { financialExposureThb: 85_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 210_000, socialPressure: "None", incidentSeverity: "None" },
  // LAR (10)
  { financialExposureThb: 2_100_000, socialPressure: "High", incidentSeverity: "Linked" },
  { financialExposureThb: 4_800_000, socialPressure: "High", incidentSeverity: "Active incident" },
  { financialExposureThb: 1_600_000, socialPressure: "Elevated", incidentSeverity: "Linked" },
  { financialExposureThb: 750_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 520_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 290_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 95_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 1_400_000, socialPressure: "Elevated", incidentSeverity: "None" },
  { financialExposureThb: 45_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 180_000, socialPressure: "None", incidentSeverity: "None" },
  // PRO (12)
  { financialExposureThb: 5_200_000, socialPressure: "High", incidentSeverity: "Active incident" },
  { financialExposureThb: 3_600_000, socialPressure: "Elevated", incidentSeverity: "Linked" },
  { financialExposureThb: 2_800_000, socialPressure: "High", incidentSeverity: "Linked" },
  { financialExposureThb: 7_200_000, socialPressure: "High", incidentSeverity: "Active incident" },
  { financialExposureThb: 680_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 420_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 950_000, socialPressure: "Elevated", incidentSeverity: "None" },
  { financialExposureThb: 8_500_000, socialPressure: "High", incidentSeverity: "Active incident" },
  { financialExposureThb: 110_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 75_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 340_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 1_100_000, socialPressure: "Elevated", incidentSeverity: "Linked" },
  // DSP (14)
  { financialExposureThb: 620_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 880_000, socialPressure: "Elevated", incidentSeverity: "None" },
  { financialExposureThb: 1_050_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 55_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 240_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 90_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 35_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 410_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 720_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 65_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 28_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 310_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 150_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 540_000, socialPressure: "Emerging", incidentSeverity: "None" },
  // PRF (10)
  { financialExposureThb: 980_000, socialPressure: "Elevated", incidentSeverity: "None" },
  { financialExposureThb: 1_300_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 160_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 420_000, socialPressure: "Emerging", incidentSeverity: "None" },
  { financialExposureThb: 70_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 25_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 380_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 40_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 130_000, socialPressure: "None", incidentSeverity: "None" },
  { financialExposureThb: 860_000, socialPressure: "Emerging", incidentSeverity: "None" },
];

function buildCase(seed: CaseSeed, streamIndex: number, globalIndex: number): OpsCase {
  const streamDef = getStreamDefinition(seed.stream);
  const rule = getSlaRuleForStream(seed.stream);
  const seq = String(streamIndex + 1).padStart(3, "0");
  const id = `OPS-${seed.stream}-${seq}`;

  const createdAt = new Date(
    OPS_REFERENCE_NOW.getTime() - seed.createdMinutesAgo * 60_000,
  ).toISOString();
  const slaDue = new Date(
    OPS_REFERENCE_NOW.getTime() + seed.minutesUntilDue * 60_000,
  ).toISOString();

  const queue =
    seed.priorityTier === "Urgent"
      ? "Urgent Overlay"
      : `${seed.stream} Queue`;

  const impactSeed = seed.impact ?? DEFAULT_IMPACT_PROFILES[globalIndex];

  return {
    id,
    stream: seed.stream,
    streamLabel: streamDef.label,
    type: seed.type,
    priorityTier: seed.priorityTier,
    urgencyReason: seed.urgencyReason,
    createdAt,
    slaRuleRef: rule.ruleRef,
    slaDue,
    ageMinutes: seed.createdMinutesAgo,
    status: seed.status,
    owner: seed.owner,
    queue,
    impact: buildCaseImpact(impactSeed),
  };
}

const SEEDS: CaseSeed[] = [
  // RFR — statutory, tightest clock (10 cases)
  { stream: "RFR", type: "Statutory fraud report", priorityTier: "Urgent", urgencyReason: "RFR statutory submission due in 45m", createdMinutesAgo: 315, minutesUntilDue: 45, status: "In progress", owner: "Ops Lead" },
  { stream: "RFR", type: "Registry submission follow-up", priorityTier: "Urgent", urgencyReason: "RFR near statutory deadline — evidence assembly incomplete", createdMinutesAgo: 330, minutesUntilDue: 30, status: "Blocked", owner: "Analyst A" },
  { stream: "RFR", type: "Suspicious transaction report", priorityTier: "Urgent", urgencyReason: "RFR statutory window closing — submission pending sign-off", createdMinutesAgo: 300, minutesUntilDue: 60, status: "In progress", owner: "Ops Lead" },
  { stream: "RFR", type: "Statutory fraud report", priorityTier: "High", urgencyReason: "RFR reportable intake — statutory clock running", createdMinutesAgo: 120, minutesUntilDue: 240, status: "New", owner: "Analyst B" },
  { stream: "RFR", type: "Cross-border fraud report", priorityTier: "High", urgencyReason: "RFR high-sensitivity report — coordinated fund-flow review", createdMinutesAgo: 180, minutesUntilDue: 180, status: "In progress", owner: "Analyst A" },
  { stream: "RFR", type: "Registry submission follow-up", priorityTier: "Standard", urgencyReason: "RFR routine follow-up on prior submission", createdMinutesAgo: 90, minutesUntilDue: 270, status: "Awaiting external", owner: "Analyst B" },
  { stream: "RFR", type: "Suspicious transaction report", priorityTier: "Standard", urgencyReason: "RFR standard intake — mid-SLA review", createdMinutesAgo: 200, minutesUntilDue: 160, status: "In progress", owner: "Queue Owner" },
  { stream: "RFR", type: "Statutory fraud report", priorityTier: "High", urgencyReason: "RFR breached submission window — remediation required", createdMinutesAgo: 400, minutesUntilDue: -40, status: "Blocked", owner: "Ops Lead" },
  { stream: "RFR", type: "Suspicious transaction report", priorityTier: "Standard", urgencyReason: "RFR low-complexity report — on track", createdMinutesAgo: 60, minutesUntilDue: 300, status: "New", owner: "Unassigned", impact: { financialExposureThb: 6_800_000, socialPressure: "High", incidentSeverity: "Active incident" } },
  { stream: "RFR", type: "Cross-border fraud report", priorityTier: "Standard", urgencyReason: "RFR closed-loop verification", createdMinutesAgo: 350, minutesUntilDue: 10, status: "Closed", owner: "Analyst A" },

  // LAR — authority requests (10 cases)
  { stream: "LAR", type: "Authority information request", priorityTier: "Urgent", urgencyReason: "LAR explicit authority deadline in 2h", createdMinutesAgo: 360, minutesUntilDue: 120, status: "In progress", owner: "Ops Lead" },
  { stream: "LAR", type: "Court order response", priorityTier: "Urgent", urgencyReason: "LAR court-ordered response due today", createdMinutesAgo: 400, minutesUntilDue: 80, status: "Awaiting external", owner: "Analyst A" },
  { stream: "LAR", type: "Regulator inquiry", priorityTier: "Urgent", urgencyReason: "LAR regulator deadline — response pack in review", createdMinutesAgo: 420, minutesUntilDue: 60, status: "In progress", owner: "Ops Lead" },
  { stream: "LAR", type: "Police evidence request", priorityTier: "High", urgencyReason: "LAR high-sensitivity authority request", createdMinutesAgo: 200, minutesUntilDue: 280, status: "In progress", owner: "Analyst B" },
  { stream: "LAR", type: "Authority information request", priorityTier: "High", urgencyReason: "LAR escalated legal review — deadline tracked", createdMinutesAgo: 150, minutesUntilDue: 330, status: "New", owner: "Analyst A" },
  { stream: "LAR", type: "Regulator inquiry", priorityTier: "Standard", urgencyReason: "LAR standard information request — mid-SLA", createdMinutesAgo: 240, minutesUntilDue: 240, status: "In progress", owner: "Queue Owner" },
  { stream: "LAR", type: "Court order response", priorityTier: "Standard", urgencyReason: "LAR routine authority correspondence", createdMinutesAgo: 100, minutesUntilDue: 380, status: "Awaiting external", owner: "Analyst B" },
  { stream: "LAR", type: "Police evidence request", priorityTier: "High", urgencyReason: "LAR near authority deadline — pack incomplete", createdMinutesAgo: 450, minutesUntilDue: 30, status: "Blocked", owner: "Ops Lead" },
  { stream: "LAR", type: "Authority information request", priorityTier: "Standard", urgencyReason: "LAR follow-up on prior response", createdMinutesAgo: 480, minutesUntilDue: -20, status: "In progress", owner: "Analyst A" },
  { stream: "LAR", type: "Regulator inquiry", priorityTier: "Standard", urgencyReason: "LAR closed authority matter", createdMinutesAgo: 500, minutesUntilDue: -60, status: "Closed", owner: "Queue Owner" },

  // PRO — proactive alerts (12 cases)
  { stream: "PRO", type: "Funds-in-flight alert", priorityTier: "Urgent", urgencyReason: "PRO funds still in flight — hold action pending", createdMinutesAgo: 90, minutesUntilDue: 30, status: "In progress", owner: "Ops Lead" },
  { stream: "PRO", type: "Velocity anomaly alert", priorityTier: "Urgent", urgencyReason: "PRO outbound transfer chain active — recovery window narrowing", createdMinutesAgo: 100, minutesUntilDue: 20, status: "New", owner: "Analyst A" },
  { stream: "PRO", type: "Account takeover signal", priorityTier: "Urgent", urgencyReason: "PRO suspected takeover — funds may exit within the hour", createdMinutesAgo: 80, minutesUntilDue: 40, status: "In progress", owner: "Ops Lead" },
  { stream: "PRO", type: "Funds-in-flight alert", priorityTier: "Urgent", urgencyReason: "PRO high-value movement detected — triage overdue", createdMinutesAgo: 130, minutesUntilDue: -10, status: "Blocked", owner: "Analyst B" },
  { stream: "PRO", type: "Mule network alert", priorityTier: "High", urgencyReason: "PRO escalated alert — pattern match without confirmed movement", createdMinutesAgo: 60, minutesUntilDue: 60, status: "In progress", owner: "Analyst A" },
  { stream: "PRO", type: "Velocity anomaly alert", priorityTier: "High", urgencyReason: "PRO repeated small transfers — investigation opened", createdMinutesAgo: 45, minutesUntilDue: 75, status: "New", owner: "Unassigned" },
  { stream: "PRO", type: "Account takeover signal", priorityTier: "High", urgencyReason: "PRO device change plus outbound attempt", createdMinutesAgo: 70, minutesUntilDue: 50, status: "In progress", owner: "Analyst B" },
  { stream: "PRO", type: "Funds-in-flight alert", priorityTier: "Standard", urgencyReason: "PRO standard proactive alert — on track", createdMinutesAgo: 30, minutesUntilDue: 90, status: "New", owner: "Queue Owner", impact: { financialExposureThb: 5_500_000, socialPressure: "High", incidentSeverity: "Active incident" } },
  { stream: "PRO", type: "Mule network alert", priorityTier: "Standard", urgencyReason: "PRO low-risk signal — routine triage", createdMinutesAgo: 20, minutesUntilDue: 100, status: "New", owner: "Unassigned" },
  { stream: "PRO", type: "Velocity anomaly alert", priorityTier: "Standard", urgencyReason: "PRO mid-SLA review — no active movement", createdMinutesAgo: 55, minutesUntilDue: 65, status: "Awaiting external", owner: "Analyst A" },
  { stream: "PRO", type: "Account takeover signal", priorityTier: "High", urgencyReason: "PRO near funds-in-flight breach", createdMinutesAgo: 115, minutesUntilDue: 5, status: "In progress", owner: "Ops Lead" },
  { stream: "PRO", type: "Funds-in-flight alert", priorityTier: "Standard", urgencyReason: "PRO alert closed after hold confirmed", createdMinutesAgo: 125, minutesUntilDue: -15, status: "Closed", owner: "Analyst B" },

  // DSP — disputes (14 cases)
  { stream: "DSP", type: "Customer dispute", priorityTier: "High", urgencyReason: "DSP vulnerable customer — repeat complaint", createdMinutesAgo: 900, minutesUntilDue: 540, status: "In progress", owner: "Analyst A" },
  { stream: "DSP", type: "Complaint escalation", priorityTier: "High", urgencyReason: "DSP escalated complaint — customer update overdue", createdMinutesAgo: 1200, minutesUntilDue: 240, status: "Blocked", owner: "Analyst B" },
  { stream: "DSP", type: "Chargeback review", priorityTier: "High", urgencyReason: "DSP high-value dispute — evidence gathering", createdMinutesAgo: 600, minutesUntilDue: 840, status: "In progress", owner: "Queue Owner" },
  { stream: "DSP", type: "Customer dispute", priorityTier: "Standard", urgencyReason: "DSP standard customer dispute — on track", createdMinutesAgo: 400, minutesUntilDue: 1040, status: "New", owner: "Unassigned" },
  { stream: "DSP", type: "Complaint escalation", priorityTier: "Standard", urgencyReason: "DSP mid-SLA customer update window", createdMinutesAgo: 800, minutesUntilDue: 640, status: "In progress", owner: "Analyst A" },
  { stream: "DSP", type: "Unauthorized transaction claim", priorityTier: "Standard", urgencyReason: "DSP routine dispute intake", createdMinutesAgo: 300, minutesUntilDue: 1140, status: "New", owner: "Unassigned" },
  { stream: "DSP", type: "Customer dispute", priorityTier: "Standard", urgencyReason: "DSP near customer-update SLA", createdMinutesAgo: 1300, minutesUntilDue: 140, status: "In progress", owner: "Analyst B" },
  { stream: "DSP", type: "Chargeback review", priorityTier: "Standard", urgencyReason: "DSP dispute awaiting customer reply", createdMinutesAgo: 500, minutesUntilDue: 940, status: "Awaiting external", owner: "Analyst A" },
  { stream: "DSP", type: "Complaint escalation", priorityTier: "High", urgencyReason: "DSP repeat complainant — priority handling", createdMinutesAgo: 1000, minutesUntilDue: 440, status: "In progress", owner: "Ops Lead" },
  { stream: "DSP", type: "Unauthorized transaction claim", priorityTier: "Standard", urgencyReason: "DSP low-complexity claim", createdMinutesAgo: 200, minutesUntilDue: 1240, status: "New", owner: "Queue Owner" },
  { stream: "DSP", type: "Customer dispute", priorityTier: "Standard", urgencyReason: "DSP breached customer-update SLA", createdMinutesAgo: 1500, minutesUntilDue: -60, status: "In progress", owner: "Analyst B" },
  { stream: "DSP", type: "Chargeback review", priorityTier: "Standard", urgencyReason: "DSP standard chargeback — due soon", createdMinutesAgo: 1100, minutesUntilDue: 340, status: "In progress", owner: "Analyst A" },
  { stream: "DSP", type: "Complaint escalation", priorityTier: "Standard", urgencyReason: "DSP resolved complaint", createdMinutesAgo: 1400, minutesUntilDue: 40, status: "Closed", owner: "Queue Owner" },
  { stream: "DSP", type: "Unauthorized transaction claim", priorityTier: "High", urgencyReason: "DSP sensitive dispute — near SLA midpoint", createdMinutesAgo: 720, minutesUntilDue: 720, status: "In progress", owner: "Analyst B" },

  // PRF — profile review (10 cases)
  { stream: "PRF", type: "Enhanced due diligence", priorityTier: "High", urgencyReason: "PRF high-risk profile — elevated review required", createdMinutesAgo: 1800, minutesUntilDue: 2520, status: "In progress", owner: "Analyst A" },
  { stream: "PRF", type: "Periodic profile review", priorityTier: "High", urgencyReason: "PRF flagged identity mismatch — priority queue", createdMinutesAgo: 2400, minutesUntilDue: 1920, status: "New", owner: "Unassigned" },
  { stream: "PRF", type: "Document re-verification", priorityTier: "Standard", urgencyReason: "PRF routine profile review — on track", createdMinutesAgo: 1200, minutesUntilDue: 3120, status: "In progress", owner: "Analyst B" },
  { stream: "PRF", type: "Enhanced due diligence", priorityTier: "Standard", urgencyReason: "PRF mid-SLA dashboard review", createdMinutesAgo: 2800, minutesUntilDue: 1520, status: "In progress", owner: "Queue Owner" },
  { stream: "PRF", type: "Periodic profile review", priorityTier: "Standard", urgencyReason: "PRF standard backlog item", createdMinutesAgo: 800, minutesUntilDue: 3520, status: "New", owner: "Unassigned" },
  { stream: "PRF", type: "Document re-verification", priorityTier: "Standard", urgencyReason: "PRF awaiting document upload", createdMinutesAgo: 3600, minutesUntilDue: 720, status: "Awaiting external", owner: "Analyst A" },
  { stream: "PRF", type: "Enhanced due diligence", priorityTier: "Standard", urgencyReason: "PRF near review deadline", createdMinutesAgo: 4000, minutesUntilDue: 320, status: "In progress", owner: "Analyst B", impact: { financialExposureThb: 15_000, socialPressure: "None", incidentSeverity: "None" } },
  { stream: "PRF", type: "Periodic profile review", priorityTier: "Standard", urgencyReason: "PRF breached review SLA — backlog hygiene", createdMinutesAgo: 4500, minutesUntilDue: -180, status: "Blocked", owner: "Ops Lead" },
  { stream: "PRF", type: "Document re-verification", priorityTier: "Standard", urgencyReason: "PRF closed after verification", createdMinutesAgo: 4200, minutesUntilDue: 120, status: "Closed", owner: "Analyst A" },
  { stream: "PRF", type: "Periodic profile review", priorityTier: "High", urgencyReason: "PRF elevated risk tier — dashboard priority", createdMinutesAgo: 2000, minutesUntilDue: 2320, status: "In progress", owner: "Queue Owner" },
];

export const OPS_CASES: OpsCase[] = (() => {
  const streamCounters: Record<OpsStreamCode, number> = {
    RFR: 0,
    LAR: 0,
    PRO: 0,
    DSP: 0,
    PRF: 0,
  };
  return SEEDS.map((seed) => {
    const idx = streamCounters[seed.stream];
    streamCounters[seed.stream] += 1;
    const globalIndex = SEEDS.indexOf(seed);
    return buildCase(seed, idx, globalIndex);
  });
})();

export const OPS_CASE_COUNT = OPS_CASES.length;

export function getOpsStreamDistribution() {
  const counts: Record<OpsStreamCode, number> = {
    RFR: 0,
    LAR: 0,
    PRO: 0,
    DSP: 0,
    PRF: 0,
  };
  for (const c of OPS_CASES) counts[c.stream] += 1;
  return counts;
}

export function getOpsSlaPressureDistribution(now = OPS_REFERENCE_NOW) {
  const counts = {
    Breached: 0,
    "Near breach": 0,
    "Due soon": 0,
    "On track": 0,
  };
  for (const c of OPS_CASES) {
    counts[getSlaPressure(c, now)] += 1;
  }
  return counts;
}

// Re-export owners/statuses for tests
export { OWNERS, STATUSES };
