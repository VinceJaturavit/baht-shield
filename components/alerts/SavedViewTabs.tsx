import type { AlertSavedView } from "@/lib/types";

interface SavedViewTabsProps {
  activeView: AlertSavedView;
  onViewChange: (view: AlertSavedView) => void;
}

const VIEWS: { value: AlertSavedView; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical_escalated", label: "Critical & escalated" },
  { value: "scenario_linked", label: "Scenario-linked only" },
];

export function SavedViewTabs({ activeView, onViewChange }: SavedViewTabsProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="tablist"
      aria-label="Saved views"
    >
      {VIEWS.map((view) => (
        <button
          key={view.value}
          role="tab"
          aria-selected={activeView === view.value}
          onClick={() => onViewChange(view.value)}
          className={`rounded-signalSm px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent focus-visible:ring-offset-1 ${
            activeView === view.value
              ? "bg-signal-accentSubtle text-signal-accent ring-1 ring-signal-accentBorder"
              : "bg-signal-muted text-signal-secondary hover:bg-signal-border/60 hover:text-signal-heading"
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
