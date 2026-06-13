import type { OpsSlaPressure } from "@/lib/ops/types";

const PRESSURE_STYLES: Record<
  OpsSlaPressure,
  { border: string; text: string; indicator: string }
> = {
  Breached: {
    border: "border-red-500/40",
    text: "text-red-300",
    indicator: "bg-red-500",
  },
  "Near breach": {
    border: "border-ourox-orange/40",
    text: "text-ourox-orange",
    indicator: "bg-ourox-orange",
  },
  "Due soon": {
    border: "border-ourox-yellow/30",
    text: "text-ourox-yellow",
    indicator: "bg-ourox-yellow",
  },
  "On track": {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/60",
    indicator: "bg-ourox-ink/35",
  },
};

interface Props {
  pressure: OpsSlaPressure;
}

export function OpsSlaPressureBadge({ pressure }: Props) {
  const styles = PRESSURE_STYLES[pressure];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${styles.border} ${styles.text}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {pressure}
    </span>
  );
}
