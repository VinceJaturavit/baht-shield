type MetricStatus = "On track" | "Watch" | "Needs review" | "Stable" | "Pressure" | "Breached";

const STATUS_STYLES: Record<
  MetricStatus,
  { text: string; indicator: string }
> = {
  "On track": { text: "text-ourox-ink/75", indicator: "bg-ourox-yellow/70" },
  Watch: { text: "text-ourox-orange", indicator: "bg-ourox-orange" },
  "Needs review": { text: "text-red-300/90", indicator: "bg-red-500" },
  Stable: { text: "text-ourox-ink/75", indicator: "bg-ourox-yellow/70" },
  Pressure: { text: "text-ourox-orange", indicator: "bg-ourox-orange" },
  Breached: { text: "text-red-300/90", indicator: "bg-red-500" },
};

interface Props {
  status: MetricStatus;
}

export function OpsKpiMetricBadge({ status }: Props) {
  const styles = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${styles.text}`}>
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
