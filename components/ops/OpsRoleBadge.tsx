import type { OpsTeamRole } from "@/lib/ops/roster-types";

const ROLE_STYLES: Record<
  OpsTeamRole,
  { border: string; text: string; indicator: string }
> = {
  "Fraud Analyst": {
    border: "border-ourox-orange/30",
    text: "text-ourox-ink/85",
    indicator: "bg-ourox-orange",
  },
  "Junior Analyst": {
    border: "border-ourox-obsidianMid",
    text: "text-ourox-ink/70",
    indicator: "bg-ourox-ink/40",
  },
};

interface Props {
  role: OpsTeamRole;
}

export function OpsRoleBadge({ role }: Props) {
  const styles = ROLE_STYLES[role];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${styles.border} ${styles.text}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.indicator}`}
        aria-hidden="true"
      />
      {role}
    </span>
  );
}
