"use client";

// ModelFramingBanner — always-visible framing copy for the Model view.
// Communicates the architecture boundary: offline model, second opinion,
// rules remain authoritative.

export function ModelFramingBanner() {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/60 px-5 py-4">
      <div
        className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ourox-orange/80"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Model — offline analysis only
      </div>
      <p className="text-sm leading-6 text-ourox-ink/70">
        This view compares an offline-trained logistic-regression score against
        Arbiter&apos;s transparent rule-weighted score. The model is trained on
        synthetic labels and imported as static JSON artifacts. It is a
        learning-grade second opinion on synthetic data — not the decision
        authority. The rule engine remains authoritative.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {[
          "Offline-trained on synthetic labels",
          "Static JSON artifacts — no runtime inference",
          "Second opinion only",
          "Rules remain decision authority",
        ].map((item) => (
          <span
            key={item}
            className="text-xs text-ourox-ink/40 tracking-wide"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
