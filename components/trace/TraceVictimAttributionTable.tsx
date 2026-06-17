import type { TraceVictimAttributionRow } from "@/lib/trace/types";
import { TraceAmount } from "./TraceAmount";
import { TraceStatusBadge } from "./TraceStatusBadge";

interface TraceVictimAttributionTableProps {
  rows: TraceVictimAttributionRow[];
  asset: string;
  methodSaved?: boolean;
  compact?: boolean;
}

export function TraceVictimAttributionTable({
  rows,
  asset,
  methodSaved = true,
  compact = false,
}: TraceVictimAttributionTableProps) {
  if (!methodSaved) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-trace-heading mb-1">
          Who can be attributed to the frozen funds?
        </h2>
        <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
          Attribution is the consequence of the selected method; unsupported claims remain
          insufficient evidence instead of being forced into recovery.
        </p>
        <div className="rounded border border-trace-border bg-trace-muted px-4 py-6 text-center">
          <p className="text-sm font-medium text-trace-heading">Pending method selection</p>
          <p className="mt-1 text-xs text-trace-secondary">
            Save a recovery method before reviewing victim attribution rows.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {!compact && (
        <>
          <h2 className="text-sm font-semibold text-trace-heading mb-1">
            Who can be attributed to the frozen funds?
          </h2>
          <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
            Attribution is the consequence of the selected method; unsupported claims remain
            insufficient evidence instead of being forced into recovery.
          </p>
        </>
      )}

      <div className="overflow-hidden rounded-lg border border-trace-border bg-trace-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-trace-border bg-trace-surface text-left">
              <th className="px-3 py-2 font-medium text-trace-heading">Victim / claimant</th>
              <th className="px-3 py-2 font-medium text-trace-heading">Method used</th>
              <th className="px-3 py-2 font-medium text-trace-heading text-right">Attributed amount</th>
              <th className="px-3 py-2 font-medium text-trace-heading">Status</th>
              <th className="px-3 py-2 font-medium text-trace-heading">Gaps</th>
              {!compact && (
                <>
                  <th className="px-3 py-2 font-medium text-trace-secondary">Deposit tx</th>
                  <th className="px-3 py-2 font-medium text-trace-secondary text-right">Deposit amount</th>
                  <th className="px-3 py-2 font-medium text-trace-secondary">Confidence</th>
                  <th className="px-3 py-2 font-medium text-trace-secondary text-center">Evidence count</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.victimId}
                className={`border-b border-trace-border/60 last:border-0 ${
                  row.status === "insufficient-evidence" ? "bg-trace-muted" : ""
                }`}
              >
                <td className="px-3 py-2 text-trace-heading font-medium">
                  {row.victimNameSynthetic}
                  {row.victimNameSynthetic === "Scammer" && (
                    <span className="ml-1 text-trace-secondary font-normal">(taint)</span>
                  )}
                </td>
                <td className="px-3 py-2 text-trace-body">
                  {row.methodUsed ?? "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={row.attributedAmount} asset={asset} className="text-trace-heading font-medium" />
                </td>
                <td className="px-3 py-2">
                  <TraceStatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-trace-body max-w-[200px]">
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
                {!compact && (
                  <>
                    <td className="px-3 py-2 font-mono text-trace-secondary">{row.depositTx}</td>
                    <td className="px-3 py-2 text-right">
                      <TraceAmount amount={row.depositAmount} asset={asset} className="text-trace-secondary" />
                    </td>
                    <td className="px-3 py-2 text-trace-secondary">{row.confidence}</td>
                    <td className="px-3 py-2 text-center text-trace-secondary">{row.evidenceCount}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
