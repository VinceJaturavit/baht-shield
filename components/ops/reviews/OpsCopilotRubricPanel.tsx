import { OPS_REVIEWS_COPILOT_RUBRIC } from "@/lib/ops/reviews-copilot-rubric";

export function OpsCopilotRubricPanel() {
  return (
    <details className="min-w-0 border border-ourox-obsidianMid/60 bg-ourox-obsidian/10">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ourox-ink/70 hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange">
        How this review is generated
      </summary>
      <div className="border-t border-ourox-obsidianMid/60 px-3 py-2.5">
        <p className="mb-2 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          The mock copilot uses this rubric as its system context. The important part is not the
          wording alone, but the management guardrails: keep signals separate, compare only role
          peers, flag low samples, and keep the manager in control.
        </p>
        <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words border border-ourox-obsidianMid/50 bg-ourox-obsidian/20 p-2.5 font-mono text-[9px] leading-relaxed text-ourox-ink/60">
          {OPS_REVIEWS_COPILOT_RUBRIC}
        </pre>
      </div>
    </details>
  );
}
