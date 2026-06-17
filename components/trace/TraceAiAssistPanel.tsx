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
    <aside className="border border-ourox-obsidianMid rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ourox-obsidianMid bg-ourox-obsidianLight">
        <h3 className="text-xs font-semibold text-ourox-ink">AI assist</h3>
        <p className="mt-1 text-[11px] text-ourox-ink/50">
          Decision-support only. Cannot choose method or approve attribution.
        </p>
      </div>
      <div className="px-4 py-3 space-y-4 text-xs">
        <div>
          <h4 className="font-medium text-ourox-ink/70 mb-1">Method difference summary</h4>
          <p className="text-ourox-ink/80 leading-relaxed">{output.methodDifferenceSummary}</p>
        </div>

        <div>
          <h4 className="font-medium text-ourox-ink/70 mb-1">Gap flags</h4>
          <ul className="space-y-1">
            {output.gapFlags.map((flag) => (
              <li key={flag} className="text-ourox-ink/70 leading-relaxed">
                {flag}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-ourox-ink/70 mb-1">Rationale starter (draft only)</h4>
          <p className="text-ourox-ink/60 leading-relaxed italic">{output.rationaleStarter}</p>
        </div>

        <div>
          <h4 className="font-medium text-ourox-ink/70 mb-1">Reviewer questions</h4>
          <ul className="space-y-1">
            {output.reviewerQuestions.map((q) => (
              <li key={q} className="text-ourox-ink/70 leading-relaxed">
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
            className="w-full rounded border border-ourox-obsidianMid bg-ourox-obsidianLight px-3 py-2 text-xs font-medium text-ourox-ink/80 hover:border-ourox-orange/50 hover:text-ourox-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
          >
            {summaryGenerated ? "Summary logged to audit trail" : "Log AI summary to audit trail"}
          </button>
        )}
      </div>
    </aside>
  );
}
