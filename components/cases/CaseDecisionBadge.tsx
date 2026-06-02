import type { CaseInvestigationStatus } from "@/lib/types";

interface CaseDecisionBadgeProps {
  decision: string;
  investigation_status: CaseInvestigationStatus;
  /** compact: table cells — render only the dot+label badge, no stacked decision text */
  compact?: boolean;
}

const STATUS_STYLES: Record<CaseInvestigationStatus, string> = {
  escalated: "border-signal-amberBorder bg-signal-amberSubtle text-signal-body",
  needs_closure: "border-signal-accentBorder bg-signal-accentSubtle text-signal-accent",
  open: "border-signal-indigoBorder bg-signal-indigoSubtle text-signal-indigo",
  resolved: "border-signal-border bg-signal-surface text-signal-body",
  closed: "border-signal-border bg-signal-muted text-signal-secondary",
};

const STATUS_LABELS: Record<CaseInvestigationStatus, string> = {
  escalated: "Escalated",
  needs_closure: "Needs closure",
  open: "Open",
  resolved: "Resolved",
  closed: "Closed",
};

const STATUS_DOT: Record<CaseInvestigationStatus, string> = {
  escalated: "bg-signal-amber",
  needs_closure: "bg-signal-accent",
  open: "bg-signal-indigo",
  resolved: "bg-signal-slate",
  closed: "bg-signal-faintSlate",
};

export function CaseDecisionBadge({ decision, investigation_status, compact = false }: CaseDecisionBadgeProps) {
  const statusStyle = STATUS_STYLES[investigation_status] ?? STATUS_STYLES.open;
  const statusLabel = STATUS_LABELS[investigation_status] ?? investigation_status;
  const dot = STATUS_DOT[investigation_status] ?? "bg-signal-faintSlate";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
        {statusLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-signal-body font-mono">
        {decision || "pending"}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle}`}
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
        {statusLabel}
      </span>
    </div>
  );
}
