"use client";

interface CompactClosureEntryProps {
  hasLinkedCases: boolean;
}

export function CompactClosureEntry({ hasLinkedCases }: CompactClosureEntryProps) {
  function handleClick() {
    const target = document.getElementById("case-history");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="rounded-signal border border-signal-border bg-signal-surface p-4 shadow-signalSubtle">
      <p className="text-xs font-semibold uppercase tracking-widest text-signal-meta mb-2">
        Closure note
      </p>
      {hasLinkedCases ? (
        <>
          <p className="text-xs text-signal-slate leading-relaxed mb-3">
            Draft a standardised rationale from the linked case evidence.
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-signalSm border border-signal-accentBorder bg-signal-accentSubtle px-3 py-2 text-xs font-medium text-signal-accent transition-colors hover:bg-signal-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-signal-accent focus:ring-offset-1"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Draft closure note
          </button>
        </>
      ) : (
        <p className="text-xs text-signal-meta italic">
          No linked case available for closure-note drafting.
        </p>
      )}
    </div>
  );
}
