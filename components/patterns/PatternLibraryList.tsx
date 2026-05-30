import type { PatternSummary } from "@/lib/types";
import { PatternFamilyBadge } from "./PatternFamilyBadge";

interface PatternLibraryListProps {
  patterns: PatternSummary[];
  selectedPatternId: string | null;
  onSelectPattern: (patternId: string) => void;
}

const STATUS_CLASSES: Record<string, string> = {
  verified: "border border-signal-accentBorder bg-signal-accentSubtle text-signal-accent",
  probable: "border border-signal-border bg-white text-signal-body",
  emerging: "border border-signal-border bg-signal-muted text-signal-secondary",
  retired: "border border-signal-border bg-signal-muted text-signal-faint line-through",
};

export function PatternLibraryList({
  patterns,
  selectedPatternId,
  onSelectPattern,
}: PatternLibraryListProps) {
  return (
    <div className="flex flex-col gap-2">
      {patterns.map((p) => {
        const isSelected = p.pattern_id === selectedPatternId;
        const statusClass = STATUS_CLASSES[p.status] ?? "bg-gray-100 text-gray-600";
        const variablesPreview =
          p.variables.length > 160 ? p.variables.slice(0, 157) + "…" : p.variables;

        return (
          <button
            key={p.pattern_id}
            onClick={() => onSelectPattern(p.pattern_id)}
            className={`w-full rounded-signal border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent ${
              isSelected
                ? "border-signal-accentBorder bg-signal-accentSubtle ring-1 ring-signal-accentBorder"
                : "border-signal-border bg-white hover:border-signal-borderStrong hover:bg-signal-bg"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-signal-heading">{p.name}</span>
                <PatternFamilyBadge family={p.family} />
                <span
                  className={`inline-flex items-center rounded-signalSm px-1.5 py-0.5 text-xs font-medium ${statusClass}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-signal-secondary">
                <span>
                  <span className="font-medium tabular-nums text-signal-heading">{p.linked_wallet_count}</span> wallets
                </span>
                <span>
                  <span className="font-medium tabular-nums text-signal-heading">{p.linked_case_count}</span> cases
                </span>
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-signal-secondary">
              <span>
                <span className="text-signal-faint">ID:</span> {p.pattern_id}
              </span>
              <span>
                <span className="text-signal-faint">Cluster:</span> {p.cluster_type}
              </span>
              <span>
                <span className="text-signal-faint">By:</span> {p.created_by}
              </span>
            </div>

            <div className="mt-2 font-mono text-xs leading-relaxed text-signal-secondary">
              {variablesPreview}
            </div>
          </button>
        );
      })}
    </div>
  );
}
