import { OpsIndicatorLabel, type OpsIndicatorTone } from "./OpsIndicatorLabel";

export type MetricStatus =
  | "On track"
  | "Watch"
  | "Needs review"
  | "Stable"
  | "Pressure"
  | "Breached";

const STATUS_TONES: Record<MetricStatus, OpsIndicatorTone> = {
  "On track": "good",
  Watch: "watch",
  "Needs review": "risk",
  Stable: "good",
  Pressure: "watch",
  Breached: "critical",
};

interface Props {
  status: MetricStatus;
}

export function OpsKpiMetricBadge({ status }: Props) {
  return <OpsIndicatorLabel label={status} tone={STATUS_TONES[status]} />;
}
