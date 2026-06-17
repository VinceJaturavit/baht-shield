import type { TraceAttributionStatus, TraceConfidence, TraceReviewStatus } from "@/lib/trace/types";

const STATUS_LABELS: Record<TraceAttributionStatus, string> = {
  attributed: "Attributed",
  partial: "Partial",
  "insufficient-evidence": "Insufficient evidence",
  rejected: "Rejected",
  "pending-method": "Pending method",
};

const STATUS_STYLES: Record<TraceAttributionStatus, string> = {
  attributed: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
  partial: "bg-amber-950/50 text-amber-300 border-amber-800/50",
  "insufficient-evidence": "bg-ourox-obsidianLight text-ourox-ink/70 border-ourox-obsidianMid",
  rejected: "bg-red-950/50 text-red-300 border-red-800/50",
  "pending-method": "bg-ourox-obsidianLight text-ourox-ink/60 border-ourox-obsidianMid",
};

interface TraceStatusBadgeProps {
  status: TraceAttributionStatus;
}

export function TraceStatusBadge({ status }: TraceStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium tracking-wide ${STATUS_STYLES[status]}`}
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
  draft: "bg-ourox-obsidianLight text-ourox-ink/60 border-ourox-obsidianMid",
  "pending-review": "bg-amber-950/50 text-amber-300 border-amber-800/50",
  approved: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
  rejected: "bg-red-950/50 text-red-300 border-red-800/50",
};

interface TraceReviewBadgeProps {
  status: TraceReviewStatus;
}

export function TraceReviewBadge({ status }: TraceReviewBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium tracking-wide ${REVIEW_STYLES[status]}`}
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
  High: "bg-emerald-950/40 text-emerald-300 border-emerald-800/40",
  Medium: "bg-amber-950/40 text-amber-300 border-amber-800/40",
  Low: "bg-ourox-obsidianLight text-ourox-ink/60 border-ourox-obsidianMid",
};

interface TraceConfidenceBadgeProps {
  confidence: TraceConfidence;
}

export function TraceConfidenceBadge({ confidence }: TraceConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${CONFIDENCE_STYLES[confidence]}`}
    >
      {CONFIDENCE_LABELS[confidence]}
    </span>
  );
}
