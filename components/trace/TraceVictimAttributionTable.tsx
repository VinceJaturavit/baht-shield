import type { TraceVictimAttributionRow } from "@/lib/trace/types";
import { TraceAmount } from "./TraceAmount";
import { TraceStatusBadge } from "./TraceStatusBadge";

interface TraceVictimAttributionTableProps {
  rows: TraceVictimAttributionRow[];
  asset: string;
}

export function TraceVictimAttributionTable({ rows, asset }: TraceVictimAttributionTableProps) {
  return (
    <section>
      <p className="mb-4 text-xs text-ourox-ink/60 leading-relaxed">
        Attribution rows update after human method selection. Insufficient-evidence claims remain
        excluded regardless of method. AI cannot approve attribution.
      </p>

      <div className="overflow-hidden rounded border border-ourox-obsidianMid">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight text-left">
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Victim / claimant</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Deposit tx</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50 text-right">Deposit amount</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Method used</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50 text-right">Attributed amount</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Confidence</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50 text-center">Evidence count</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Gaps</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.victimId}
                className={`border-b border-ourox-obsidianMid/50 last:border-0 ${
                  row.status === "insufficient-evidence" ? "bg-ourox-obsidianLight/30" : ""
                }`}
              >
                <td className="px-3 py-2 text-ourox-ink/90">
                  {row.victimNameSynthetic}
                  {row.victimNameSynthetic === "Scammer" && (
                    <span className="ml-1 text-ourox-ink/40">(taint)</span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-ourox-ink/60">{row.depositTx}</td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={row.depositAmount} asset={asset} className="text-ourox-ink/80" />
                </td>
                <td className="px-3 py-2 text-ourox-ink/70">
                  {row.methodUsed ?? "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={row.attributedAmount} asset={asset} className="text-ourox-ink/90" />
                </td>
                <td className="px-3 py-2 text-ourox-ink/70">{row.confidence}</td>
                <td className="px-3 py-2 text-center text-ourox-ink/70">{row.evidenceCount}</td>
                <td className="px-3 py-2 text-ourox-ink/60 max-w-[200px]">
                  {row.gaps.length > 0 ? (
                    <ul className="space-y-0.5">
                      {row.gaps.map((gap) => (
                        <li key={gap}>{gap}</li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  <TraceStatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
