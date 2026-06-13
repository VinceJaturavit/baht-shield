export type OpsIndicatorTone = "neutral" | "good" | "watch" | "risk" | "critical";

const TONE_STYLES: Record<OpsIndicatorTone, { text: string; indicator: string }> = {
  neutral: { text: "text-ourox-ink/70", indicator: "bg-ourox-ink/40" },
  good: { text: "text-ourox-ink/75", indicator: "bg-ourox-yellow/70" },
  watch: { text: "text-ourox-orange", indicator: "bg-ourox-orange" },
  risk: { text: "text-red-300/90", indicator: "bg-red-500" },
  critical: { text: "text-red-300/90", indicator: "bg-red-500" },
};

export interface OpsIndicatorLabelProps {
  label: string;
  tone?: OpsIndicatorTone;
  detail?: string;
  className?: string;
}

export function OpsIndicatorLabel({
  label,
  tone = "neutral",
  detail,
  className = "",
}: OpsIndicatorLabelProps) {
  const styles = TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${styles.text} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      <span>{label}</span>
      {detail && <span className="text-[10px] text-ourox-ink/45">({detail})</span>}
    </span>
  );
}
