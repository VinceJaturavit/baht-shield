"use client";

import type { TraceAuditEvent, TraceMethod, TraceReviewStatus } from "@/lib/trace/types";

interface TraceReviewAuditProps {
  selectedMethod: TraceMethod | null;
  methodRationale: string;
  methodSaved: boolean;
  reviewStatus: TraceReviewStatus;
  reviewerNote: string;
  reviewError: string | null;
  auditEvents: TraceAuditEvent[];
  onReviewerNoteChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function TraceReviewAudit({
  selectedMethod,
  methodRationale,
  methodSaved,
  reviewStatus,
  reviewerNote,
  reviewError,
  auditEvents,
  onReviewerNoteChange,
  onApprove,
  onReject,
}: TraceReviewAuditProps) {
  const canReview = methodSaved && selectedMethod && methodRationale.trim().length > 0;

  return (
    <section className="space-y-8">
      <div className="border border-ourox-obsidianMid rounded-lg p-4">
        <h3 className="text-sm font-semibold text-ourox-ink mb-2">Senior reviewer gate</h3>
        <p className="text-xs text-ourox-ink/60 mb-4 leading-relaxed">
          Human review required. Method and rationale must be saved before approval. AI cannot
          approve attribution. Reject requires a reviewer note.
        </p>

        {!canReview && (
          <p className="mb-4 text-xs text-amber-400/90">
            Save method selection with rationale before submitting for review.
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="reviewer-note" className="block text-xs font-medium text-ourox-ink/70 mb-2">
            Reviewer note
          </label>
          <textarea
            id="reviewer-note"
            value={reviewerNote}
            onChange={(e) => onReviewerNoteChange(e.target.value)}
            rows={3}
            placeholder="Required for rejection. Optional for approval."
            className="w-full rounded border border-ourox-obsidianMid bg-ourox-obsidian px-3 py-2 text-xs text-ourox-ink placeholder:text-ourox-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
          />
        </div>

        {reviewError && (
          <p className="mb-3 text-xs text-red-400" role="alert">
            {reviewError}
          </p>
        )}

        {reviewStatus === "approved" && (
          <p className="mb-3 text-xs text-emerald-400">Attribution package approved.</p>
        )}
        {reviewStatus === "rejected" && (
          <p className="mb-3 text-xs text-red-400">Attribution package rejected.</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onApprove}
            disabled={!canReview || reviewStatus === "approved"}
            className="rounded bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Approve attribution package
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={!canReview || reviewStatus === "rejected"}
            className="rounded border border-red-800/50 bg-red-950/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Reject attribution package
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ourox-ink mb-1">Audit trail</h3>
        <p className="text-xs text-ourox-ink/50 mb-4">
          Exam-ready log of AI suggestions and human decisions.
        </p>

        {auditEvents.length === 0 ? (
          <p className="text-xs text-ourox-ink/40">No audit events yet.</p>
        ) : (
          <ol className="space-y-3">
            {auditEvents.map((event) => (
              <li
                key={event.id}
                className="border-l-2 border-ourox-orange/50 pl-4 py-1 text-xs"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-medium text-ourox-ink">{event.action}</span>
                  <span className="text-ourox-ink/40">{formatTimestamp(event.timestamp)}</span>
                </div>
                <p className="mt-1 text-ourox-ink/50">
                  <span className="font-medium text-ourox-ink/60">{event.actor}: </span>
                  {event.detail}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
