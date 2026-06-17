"use client";

import type { TraceAuditEvent, TraceMethod, TraceReviewStatus } from "@/lib/trace/types";
import { REVIEW_GATE_LOCKED_COPY } from "@/lib/trace/workflow-steps";

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
      <div>
        <h2 className="text-sm font-semibold text-trace-heading mb-1">Approve or reject the recovery package</h2>
        <p className="text-xs text-trace-secondary mb-4 leading-relaxed">
          Human review required. Method and rationale must be saved before approval. AI cannot
          approve attribution. Reject requires a reviewer note.
        </p>
      </div>

      <div className="border border-trace-border rounded-lg p-4 bg-trace-card">
        <h3 className="text-sm font-semibold text-trace-heading mb-2">Senior reviewer gate</h3>

        {!canReview && (
          <p className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            {REVIEW_GATE_LOCKED_COPY}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="reviewer-note" className="block text-xs font-medium text-trace-body mb-2">
            Reviewer note
          </label>
          <textarea
            id="reviewer-note"
            value={reviewerNote}
            onChange={(e) => onReviewerNoteChange(e.target.value)}
            rows={3}
            placeholder="Required for rejection. Optional for approval."
            className="w-full rounded border border-trace-border bg-trace-card px-3 py-2 text-xs text-trace-heading placeholder:text-trace-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
          />
        </div>

        {reviewError && (
          <p className="mb-3 text-xs text-red-700" role="alert">
            {reviewError}
          </p>
        )}

        {reviewStatus === "approved" && (
          <p className="mb-3 text-xs text-emerald-700">Attribution package approved.</p>
        )}
        {reviewStatus === "rejected" && (
          <p className="mb-3 text-xs text-red-700">Attribution package rejected.</p>
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
            className="rounded border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-800 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Reject attribution package
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-trace-heading mb-1">Audit trail</h3>
        <p className="text-xs text-trace-secondary mb-4">
          Exam-ready log of AI suggestions and human decisions.
        </p>

        {auditEvents.length === 0 ? (
          <p className="text-xs text-trace-secondary">No audit events yet.</p>
        ) : (
          <ol className="space-y-3">
            {auditEvents.map((event) => (
              <li
                key={event.id}
                className="border-l-2 border-trace-primary/50 pl-4 py-1 text-xs"
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-medium text-trace-heading">{event.action}</span>
                  <span className="text-trace-secondary">{formatTimestamp(event.timestamp)}</span>
                </div>
                <p className="mt-1 text-trace-body">
                  <span className="font-medium text-trace-secondary">{event.actor}: </span>
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
