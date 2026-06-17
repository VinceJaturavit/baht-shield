"use client";

import type { TraceAiAssistOutput } from "@/lib/trace/ai-assist";

interface TraceAiAssistPanelProps {
  output: TraceAiAssistOutput;
  onGenerateSummary?: () => void;
  summaryGenerated?: boolean;
}

export function TraceAiAssistPanel({
  output,
  onGenerateSummary,
  summaryGenerated,
}: TraceAiAssistPanelProps) {
  return (
    <aside className="border border-trace-border rounded-lg overflow-hidden bg-trace-card">
      <div className="px-4 py-3 border-b border-trace-border bg-trace-surface">
        <h3 className="text-xs font-semibold text-trace-heading">AI assist</h3>
        <p className="mt-1 text-xs text-trace-secondary">
          Decision-support only. Cannot choose method or approve attribution.
        </p>
      </div>
      <div className="px-4 py-3 space-y-4 text-xs">
        <div>
          <h4 className="font-medium text-trace-body mb-1">Method difference summary</h4>
          <p className="text-trace-body leading-relaxed">{output.methodDifferenceSummary}</p>
        </div>

        <div>
          <h4 className="font-medium text-trace-body mb-1">Gap flags</h4>
          <ul className="space-y-1">
            {output.gapFlags.map((flag) => (
              <li key={flag} className="text-trace-secondary leading-relaxed">
                {flag}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-trace-body mb-1">Rationale starter (draft only)</h4>
          <p className="text-trace-secondary leading-relaxed italic">{output.rationaleStarter}</p>
        </div>

        <div>
          <h4 className="font-medium text-trace-body mb-1">Reviewer questions</h4>
          <ul className="space-y-1">
            {output.reviewerQuestions.map((q) => (
              <li key={q} className="text-trace-secondary leading-relaxed">
                {q}
              </li>
            ))}
          </ul>
        </div>

        {onGenerateSummary && (
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={summaryGenerated}
            className="w-full rounded border border-trace-border bg-trace-surface px-3 py-2 text-xs font-medium text-trace-body hover:border-trace-primary/50 hover:text-trace-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
          >
            {summaryGenerated ? "Summary logged to audit trail" : "Log AI summary to audit trail"}
          </button>
        )}
      </div>
    </aside>
  );
}
