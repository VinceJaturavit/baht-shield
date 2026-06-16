"use client";

type VerityAgentContributionChipProps = {
  contribution: number;
  label?: string;
};

function getContributionClasses(contribution: number): string {
  const rounded = Math.round(contribution);
  if (rounded >= 15) {
    return "border border-risk-high/40 bg-risk-high/10 text-risk-high";
  }
  if (rounded >= 8) {
    return "border border-risk-medium/40 bg-risk-medium/10 text-risk-medium";
  }
  return "border border-signal-border bg-signal-muted text-signal-secondary";
}

export function VerityAgentContributionChip({
  contribution,
  label,
}: VerityAgentContributionChipProps) {
  const displayLabel = label ?? `+${Math.round(contribution)} pts`;

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${getContributionClasses(contribution)}`}
    >
      {displayLabel}
    </span>
  );
}
