import type { OpsPriorityTier } from "@/lib/ops/types";

const TIER_STYLES: Record<
  OpsPriorityTier,
  { border: string; text: string; indicator: string }
> = {
  Urgent: {
    border: "border-ourox-orange/50",
    text: "text-ourox-orange",
    indicator: "bg-ourox-orange",
  },
  High: {
    border: "border-ourox-yellow/40",
    text: "text-ourox-yellow",
    indicator: "bg-ourox-yellow",
  },
  Standard: {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/70",
    indicator: "bg-ourox-ink/40",
  },
};

interface Props {
  tier: OpsPriorityTier;
  compact?: boolean;
}

export function OpsPriorityBadge({ tier, compact }: Props) {
  const styles = TIER_STYLES[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles.border} ${styles.text} ${compact ? "text-[10px]" : ""}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {tier}
    </span>
  );
}
