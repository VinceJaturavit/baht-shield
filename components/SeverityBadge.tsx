interface SeverityBadgeProps {
  severity: string;
}

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-risk-critical",
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
  unknown: "bg-risk-unknown",
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const key = (severity ?? "").toLowerCase();
  const dot = SEVERITY_DOT[key] ?? SEVERITY_DOT.unknown;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-signal-surface px-2.5 py-0.5 text-xs font-medium capitalize text-signal-body">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      {severity ?? "—"}
    </span>
  );
}
