"use client";

export function FeedbackFramingBanner() {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/60 px-5 py-4">
      <div
        className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ourox-orange/80"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Feedback — simulation only
      </div>
      <p className="text-sm leading-6 text-ourox-ink/70">
        This view demonstrates the feedback loop using synthetic data. It starts with
        ML-high / rule-low disagreement cases, identifies the dominant miss pattern,
        proposes one candidate rule refinement, and back-tests the change before any
        human decision. The candidate is simulated only; the live JDM and{" "}
        <span style={{ fontFamily: "'Space Mono', monospace" }}>/api/arbiter/score</span>{" "}
        remain unchanged.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {[
          "Synthetic evaluation data",
          "One candidate refinement",
          "Back-test before deploy",
          "Human decides",
          "Live JDM untouched",
        ].map((item) => (
          <span
            key={item}
            className="text-xs tracking-wide text-ourox-ink/40"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
