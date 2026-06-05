// Arbiter Phase 1 — Synthetic Data Banner
// Must be visible without scrolling on every Arbiter screen.

export function ArbiterSyntheticBanner() {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-ourox-yellow/30 bg-ourox-obsidianLight px-4 py-3"
      role="note"
      aria-label="Synthetic data notice"
    >
      <span
        className="mt-0.5 shrink-0 text-sm font-bold text-ourox-yellow"
        aria-hidden="true"
      >
        ⚗
      </span>
      <p className="text-sm leading-relaxed text-ourox-ink/80">
        <span className="font-semibold text-ourox-yellow">Synthetic data only</span>
        {' '}— Arbiter is a learning prototype for fraud scoring and decisioning.
        No real customer data, no production decisions.
      </p>
    </div>
  );
}
