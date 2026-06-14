import type {
  OpsCase,
  OpsFinancialExposureBand,
  OpsImpactTier,
  OpsIncidentSeverity,
  OpsSocialPressure,
} from "./types";
import { getSlaPressureScore, OPS_REFERENCE_NOW } from "./sla";

const FINANCIAL_POINTS: Record<OpsFinancialExposureBand, number> = {
  Low: 0,
  Moderate: 1,
  High: 2,
  Severe: 3,
};

const SOCIAL_POINTS: Record<OpsSocialPressure, number> = {
  None: 0,
  Emerging: 1,
  Elevated: 2,
  High: 3,
};

const INCIDENT_POINTS: Record<OpsIncidentSeverity, number> = {
  None: 0,
  Linked: 2,
  "Active incident": 3,
};

const IMPACT_TIER_RANK: Record<OpsImpactTier, number> = {
  Critical: 0,
  High: 1,
  Moderate: 2,
  Low: 3,
};

export function getFinancialExposureBand(amountThb: number): OpsFinancialExposureBand {
  if (amountThb >= 5_000_000) return "Severe";
  if (amountThb >= 1_000_000) return "High";
  if (amountThb >= 250_000) return "Moderate";
  return "Low";
}

export function getFinancialExposurePoints(band: OpsFinancialExposureBand): number {
  return FINANCIAL_POINTS[band];
}

export function getSocialPressurePoints(pressure: OpsSocialPressure): number {
  return SOCIAL_POINTS[pressure];
}

export function getIncidentSeverityPoints(severity: OpsIncidentSeverity): number {
  return INCIDENT_POINTS[severity];
}

function totalImpactPoints(input: {
  financialExposureBand: OpsFinancialExposureBand;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
}): number {
  return (
    getFinancialExposurePoints(input.financialExposureBand) +
    getSocialPressurePoints(input.socialPressure) +
    getIncidentSeverityPoints(input.incidentSeverity)
  );
}

export function deriveImpactTier(input: {
  financialExposureBand: OpsFinancialExposureBand;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
}): OpsImpactTier {
  const { financialExposureBand, socialPressure, incidentSeverity } = input;
  const fin = getFinancialExposurePoints(financialExposureBand);
  const soc = getSocialPressurePoints(socialPressure);
  const inc = getIncidentSeverityPoints(incidentSeverity);
  const total = fin + soc + inc;

  const isCritical =
    (incidentSeverity === "Active incident" &&
      (financialExposureBand === "High" || financialExposureBand === "Severe")) ||
    (incidentSeverity === "Active incident" &&
      (socialPressure === "Elevated" || socialPressure === "High")) ||
    (financialExposureBand === "Severe" && socialPressure === "High") ||
    total >= 6;

  if (isCritical) return "Critical";

  const isHigh =
    incidentSeverity === "Active incident" ||
    financialExposureBand === "Severe" ||
    (socialPressure === "High" && financialExposureBand === "High") ||
    (total >= 4 && total <= 5);

  if (isHigh) return "High";

  const isModerate =
    incidentSeverity === "Linked" ||
    financialExposureBand === "Moderate" ||
    financialExposureBand === "High" ||
    socialPressure === "Emerging" ||
    socialPressure === "Elevated" ||
    (total >= 2 && total <= 3);

  if (isModerate) return "Moderate";

  return "Low";
}

export function getImpactTierRank(tier: OpsImpactTier): number {
  return IMPACT_TIER_RANK[tier];
}

export function getImpactTone(tier: OpsImpactTier): "good" | "neutral" | "watch" | "risk" {
  switch (tier) {
    case "Critical":
      return "risk";
    case "High":
      return "watch";
    case "Moderate":
      return "neutral";
    case "Low":
      return "good";
  }
}

export function getImpactRationale(input: {
  financialExposureBand: OpsFinancialExposureBand;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
  impactTier: OpsImpactTier;
}): string[] {
  const reasons: string[] = [];
  const { financialExposureBand, socialPressure, incidentSeverity, impactTier } = input;

  if (incidentSeverity === "Active incident") {
    reasons.push("Active incident linkage raises consequence of delay.");
  } else if (incidentSeverity === "Linked") {
    reasons.push("Linked to an open incident — elevated reputational exposure.");
  }

  if (financialExposureBand === "Severe") {
    reasons.push("Severe synthetic financial exposure band.");
  } else if (financialExposureBand === "High") {
    reasons.push("High synthetic financial exposure band.");
  } else if (financialExposureBand === "Moderate") {
    reasons.push("Moderate synthetic financial exposure band.");
  }

  if (socialPressure === "High") {
    reasons.push("High social / reputational pressure signal.");
  } else if (socialPressure === "Elevated") {
    reasons.push("Elevated social / reputational pressure signal.");
  } else if (socialPressure === "Emerging") {
    reasons.push("Emerging social / reputational pressure signal.");
  }

  if (reasons.length === 0) {
    reasons.push("Low combined exposure across financial, social, and incident inputs.");
  }

  reasons.push(`Derived impact tier: ${impactTier}.`);
  return reasons;
}

export function buildCaseImpact(input: {
  financialExposureThb: number;
  socialPressure: OpsSocialPressure;
  incidentSeverity: OpsIncidentSeverity;
}) {
  const financialExposureBand = getFinancialExposureBand(input.financialExposureThb);
  const impactTier = deriveImpactTier({
    financialExposureBand,
    socialPressure: input.socialPressure,
    incidentSeverity: input.incidentSeverity,
  });

  return {
    financialExposureThb: input.financialExposureThb,
    financialExposureBand,
    socialPressure: input.socialPressure,
    incidentSeverity: input.incidentSeverity,
    impactTier,
    impactRationale: getImpactRationale({
      financialExposureBand,
      socialPressure: input.socialPressure,
      incidentSeverity: input.incidentSeverity,
      impactTier,
    }),
  };
}

export function sortByImpactThenSla(
  cases: OpsCase[],
  now = OPS_REFERENCE_NOW,
): OpsCase[] {
  return [...cases].sort((a, b) => {
    const impactDiff =
      getImpactTierRank(a.impact.impactTier) - getImpactTierRank(b.impact.impactTier);
    if (impactDiff !== 0) return impactDiff;

    const slaDiff = getSlaPressureScore(a, now) - getSlaPressureScore(b, now);
    if (slaDiff !== 0) return slaDiff;

    return new Date(a.slaDue).getTime() - new Date(b.slaDue).getTime();
  });
}

export const IMPACT_RULE_SUMMARY =
  "Impact tier is derived from three synthetic inputs: financial exposure, social/reputational pressure, and incident severity. Active incidents and severe financial/social pressure raise the tier. This is a transparent rule, not an ML model.";

export const IMPACT_RULE_ROWS = [
  "Financial: Low (0) / Moderate (1) / High (2) / Severe (3)",
  "Social: None (0) / Emerging (1) / Elevated (2) / High (3)",
  "Incident: None (0) / Linked (2) / Active incident (3)",
  "Critical: active incident + high exposure, severe + high social, or total >= 6",
  "High: active incident, severe financial, or total 4–5",
  "Moderate: linked incident, moderate/high financial, or total 2–3",
  "Low: total 0–1 with no incident linkage",
] as const;

export { totalImpactPoints };
