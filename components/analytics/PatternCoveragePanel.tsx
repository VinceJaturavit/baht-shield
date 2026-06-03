import { AnalyticsPanel } from "./AnalyticsPanel";
import type { PatternCoverageItem } from "@/lib/analytics";

interface Props {
  data: PatternCoverageItem[];
}

const STATUS_LABELS: Record<string, string> = {
  verified: "Verified",
  probable: "Probable",
  emerging: "Emerging",
  retired: "Retired",
};

const STATUS_DOT: Record<string, string> = {
  verified: "bg-signal-indigo",
  probable: "bg-signal-amber",
  emerging: "bg-emerald-500",
  retired: "bg-signal-meta",
};

export function PatternCoveragePanel({ data }: Props) {
  if (data.length === 0) {
    return (
      <AnalyticsPanel
        title="Pattern Hit-Rate / Coverage"
        caption="Answers: whether analyst-curated intelligence is matching wallets and cases."
        sourceNote="Source: analyst_patterns + graph_edges pattern_match links + linked cases."
      >
        <p className="text-[13px] text-signal-meta">
          No pattern coverage records found.
        </p>
      </AnalyticsPanel>
    );
  }

  // Show top 8 by linked case count; all if ≤ 15
  const rows = data.slice(0, data.length <= 15 ? data.length : 8);

  return (
    <AnalyticsPanel
      title="Pattern Hit-Rate / Coverage"
      caption="Answers: whether analyst-curated intelligence is matching wallets and cases."
      sourceNote="Source: analyst_patterns + graph_edges pattern_match links + linked cases."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-signal-borderSubtle">
              <th className="pb-2 pr-3 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
                Pattern
              </th>
              <th className="pb-2 pr-3 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta hidden sm:table-cell">
                Family
              </th>
              <th className="pb-2 pr-3 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
                Status
              </th>
              <th className="pb-2 pr-3 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
                Wallets
              </th>
              <th className="pb-2 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
                Cases
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-signal-borderSubtle">
            {rows.map((p) => {
              const statusLabel = STATUS_LABELS[p.status] ?? p.status;
              const dotClass = STATUS_DOT[p.status] ?? "bg-signal-meta";
              return (
                <tr key={p.pattern_id} className="group">
                  <td className="py-2 pr-3 text-signal-body max-w-[140px]">
                    <span className="block truncate" title={p.name}>
                      {p.name}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-signal-slate hidden sm:table-cell max-w-[120px]">
                    <span className="block truncate" title={p.family}>
                      {p.family}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
                        aria-hidden="true"
                      />
                      <span className="text-signal-body">{statusLabel}</span>
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums text-signal-ink">
                    {p.linked_wallet_count}
                  </td>
                  <td className="py-2 text-right tabular-nums font-medium text-signal-ink">
                    {p.linked_case_count}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > rows.length && (
        <p className="mt-2 text-[11px] text-signal-meta">
          Showing top {rows.length} of {data.length} patterns by linked case count.
        </p>
      )}
    </AnalyticsPanel>
  );
}
