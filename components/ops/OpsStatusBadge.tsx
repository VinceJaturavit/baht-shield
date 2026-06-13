import type { OpsCaseStatus } from "@/lib/ops/types";

const STATUS_STYLES: Record<
  OpsCaseStatus,
  { border: string; text: string; indicator: string }
> = {
  New: {
    border: "border-ourox-orange/30",
    text: "text-ourox-ink/80",
    indicator: "bg-ourox-orange",
  },
  "In progress": {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/80",
    indicator: "bg-ourox-yellow",
  },
  "Awaiting external": {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/70",
    indicator: "bg-ourox-ink/30",
  },
  Blocked: {
    border: "border-red-500/30",
    text: "text-red-300/90",
    indicator: "bg-red-500",
  },
  Closed: {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/50",
    indicator: "bg-ourox-ink/25",
  },
};

interface Props {
  status: OpsCaseStatus;
}

export function OpsStatusBadge({ status }: Props) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${styles.border} ${styles.text}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
