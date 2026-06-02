import type { MatchedPatternDisplay } from "@/lib/wallet-profile";
import { EmptyState } from "./EmptyState";
import { VariableChipGroup } from "@/components/patterns/VariableChipGroup";
import { getPatternFamily } from "@/lib/scenario-utils";

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
        <h2 className="text-lg font-semibold text-signal-ink">Matched analyst patterns</h2>
        {patterns.length > 0 && (
          <span className="inline-flex items-center rounded-full border border-signal-indigoBorder bg-signal-indigoSubtle px-2.5 py-0.5 text-xs font-semibold text-signal-indigo">
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
          {patterns.map((p) => {
            const family = getPatternFamily({
              pattern_id: p.pattern_id,
              name: p.name,
              cluster_type: p.cluster_type,
            });
            return (
            <div
              key={p.pattern_id}
              className="rounded-signal border border-signal-indigoBorder bg-signal-surface shadow-signalSubtle overflow-hidden"
            >
              {/* Card header */}
              <div className="px-6 py-4 bg-signal-indigoSubtle border-b border-signal-indigoBorder flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-signal-ink leading-tight">{p.name}</p>
                  <p className="text-xs font-mono text-signal-indigo mt-0.5">{p.pattern_id}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center rounded-signalSm border px-2 py-0.5 text-[11px] font-medium ${clusterStyle()}`}>
                    {p.cluster_type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-signal-surface px-2.5 py-0.5 text-[11px] font-medium text-signal-body">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-signal-indigo" : "bg-signal-faintSlate"}`} />
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-signal-meta mb-2">
                    Matched variables
                  </p>
                  <VariableChipGroup
                    variables={p.variables}
                    patternFamily={family}
                  />
                </div>

                <div className="rounded-signalSm border-l-2 border-signal-indigoBorder bg-signal-indigoSubtle px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-signal-slate font-semibold mb-1">
                    What a naive score may miss:
                  </p>
                  <p className="text-sm text-signal-body leading-snug">{p.naive_miss_note}</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
