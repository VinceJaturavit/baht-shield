import type { OpsAttendanceStatus } from "@/lib/ops/roster-types";

const ATTENDANCE_STYLES: Record<
  OpsAttendanceStatus,
  { border: string; text: string; indicator: string }
> = {
  Present: {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/80",
    indicator: "bg-ourox-yellow/80",
  },
  Off: {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/50",
    indicator: "bg-ourox-ink/25",
  },
  Leave: {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/55",
    indicator: "bg-ourox-ink/30",
  },
};

interface Props {
  attendance: OpsAttendanceStatus;
}

export function OpsAttendanceBadge({ attendance }: Props) {
  const styles = ATTENDANCE_STYLES[attendance];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${styles.border} ${styles.text}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {attendance}
    </span>
  );
}
