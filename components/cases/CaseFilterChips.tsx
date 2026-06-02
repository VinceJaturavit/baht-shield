import type { CaseSavedView } from "@/lib/types";

const VIEW_LABELS: Record<CaseSavedView, string> = {
  open_needs_closure: "Open / needs closure",
  escalated: "Escalated",
  scenario_linked: "Scenario-linked",
  all: "All",
};

interface CaseFilterChipsProps {
  activeView: CaseSavedView;
  decisionFilter: string;
  onClearView: () => void;
  onClearDecision: () => void;
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-accentBorder bg-signal-accentSubtle px-3 py-1 text-xs font-medium text-signal-accent">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-signal-accent hover:bg-signal-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <path
            d="M1 1l6 6M7 1L1 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}

export function CaseFilterChips({
  activeView,
  decisionFilter,
  onClearView,
  onClearDecision,
}: CaseFilterChipsProps) {
  // Always show the view chip so users understand why the list is focused
  const showViewChip = true;
  const showDecisionChip = decisionFilter !== "all";

  if (!showViewChip && !showDecisionChip) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {showViewChip && (
        <FilterChip
          label={`View: ${VIEW_LABELS[activeView]}`}
          onRemove={onClearView}
        />
      )}
      {showDecisionChip && (
        <FilterChip
          label={`Decision: ${decisionFilter}`}
          onRemove={onClearDecision}
        />
      )}
    </div>
  );
}
