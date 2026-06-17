import type { TraceAttributionStatus, TraceConfidence, TraceReviewStatus } from "@/lib/trace/types";

const STATUS_LABELS: Record<TraceAttributionStatus, string> = {
  attributed: "Attributed",
  partial: "Partial",
  "insufficient-evidence": "Insufficient evidence",
  rejected: "Rejected",
  "pending-method": "Pending method",
};

const STATUS_STYLES: Record<TraceAttributionStatus, string> = {
  attributed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  partial: "bg-amber-50 text-amber-800 border-amber-200",
  "insufficient-evidence": "bg-trace-muted text-trace-secondary border-trace-border",
  rejected: "bg-red-50 text-red-800 border-red-200",
  "pending-method": "bg-trace-muted text-trace-body border-trace-border",
};

interface TraceStatusBadgeProps {
  status: TraceAttributionStatus;
}

export function TraceStatusBadge({ status }: TraceStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium tracking-wide ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

const REVIEW_LABELS: Record<TraceReviewStatus, string> = {
  draft: "Draft",
  "pending-review": "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

const REVIEW_STYLES: Record<TraceReviewStatus, string> = {
  draft: "bg-trace-muted text-trace-secondary border-trace-border",
  "pending-review": "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
};

interface TraceReviewBadgeProps {
  status: TraceReviewStatus;
}

export function TraceReviewBadge({ status }: TraceReviewBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium tracking-wide ${REVIEW_STYLES[status]}`}
    >
      {REVIEW_LABELS[status]}
    </span>
  );
}

const CONFIDENCE_LABELS: Record<TraceConfidence, string> = {
  High: "High confidence",
  Medium: "Medium confidence",
  Low: "Low confidence",
};

const CONFIDENCE_STYLES: Record<TraceConfidence, string> = {
  High: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  Low: "bg-trace-muted text-trace-secondary border-trace-border",
};

interface TraceConfidenceBadgeProps {
  confidence: TraceConfidence;
}

export function TraceConfidenceBadge({ confidence }: TraceConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[confidence]}`}
    >
      {CONFIDENCE_LABELS[confidence]}
    </span>
  );
}
