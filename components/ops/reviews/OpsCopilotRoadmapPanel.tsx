export function OpsCopilotRoadmapPanel() {
  return (
    <details className="min-w-0 border border-ourox-obsidianMid/60 bg-ourox-obsidian/10">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ourox-ink/70 hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange">
        Roadmap: live AI review
      </summary>
      <div className="border-t border-ourox-obsidianMid/60 px-3 py-2.5">
        <p className="max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Today this review is a synthetic mock. A future loop could replace the mock with a
          one-time Claude API call per analyst. The request would send the same embedded rubric as
          system context plus the analyst&apos;s structured review-pack data, and return a generated
          draft for the manager to edit.
        </p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          That upgrade would require a server API route and an Anthropic API key stored as a
          server-side environment variable on deployment. No key is stored and no live API call is
          made in this loop.
        </p>
      </div>
    </details>
  );
}
