import type { MatchedPatternDisplay } from "@/lib/wallet-profile";
import { EmptyState } from "./EmptyState";

interface MatchedPatternsPanelProps {
  patterns: MatchedPatternDisplay[];
}

function clusterStyle(): string {
  return "border-signal-border bg-signal-muted text-signal-body";
}

export function MatchedPatternsPanel({ patterns }: MatchedPatternsPanelProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-signal-heading">Matched Analyst Patterns</h2>
        {patterns.length > 0 && (
          <span className="inline-flex items-center rounded-full border border-signal-accentBorder bg-signal-accentSubtle px-2.5 py-0.5 text-xs font-semibold text-signal-accent">
            {patterns.length} match{patterns.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      {patterns.length === 0 ? (
        <EmptyState
          title="No analyst-curated pattern match found for this wallet."
          description="For background wallets this is expected — no scenario pattern applies."
        />
      ) : (
        <div className="space-y-4">
          {patterns.map((p) => (
            <div
              key={p.pattern_id}
              className="rounded-signal border border-signal-accentBorder bg-white shadow-signal overflow-hidden"
            >
              {/* Card header */}
              <div className="px-6 py-4 bg-signal-accentSubtle border-b border-signal-accentBorder flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-signal-heading leading-tight">{p.name}</p>
                  <p className="text-xs font-mono text-signal-accent mt-0.5">{p.pattern_id}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center rounded-signalSm border px-2 py-0.5 text-[11px] font-medium ${clusterStyle()}`}>
                    {p.cluster_type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-signal-body">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-signal-accent" : "bg-signal-faint"}`} />
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-1">
                    Matched Variables
                  </p>
                  <p className="font-mono bg-signal-muted border border-signal-borderSubtle rounded-signalSm px-3 py-2 text-xs leading-relaxed text-signal-body">
                    {p.variables}
                  </p>
                </div>

                <div className="rounded-signalSm border-l-2 border-signal-accentBorder bg-signal-accentSubtle px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-signal-secondary font-semibold mb-1">
                    Naive score would miss:
                  </p>
                  <p className="text-sm text-signal-body leading-snug">{p.naive_miss_note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
