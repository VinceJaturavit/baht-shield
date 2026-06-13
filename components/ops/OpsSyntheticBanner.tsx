"use client";

export function OpsSyntheticBanner() {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-ourox-yellow/30 bg-ourox-obsidianLight px-4 py-3"
      role="note"
      aria-label="Synthetic data notice"
    >
      <span
        className="mt-0.5 shrink-0 text-[10px] font-bold tracking-widest text-ourox-yellow uppercase"
        aria-hidden="true"
      >
        SYNTHETIC DATA
      </span>
      <p className="text-sm leading-relaxed text-ourox-ink/80">
        Illustrative fraud-operations cases only. No real customer data, employer data, or
        production queues.
      </p>
    </div>
  );
}
