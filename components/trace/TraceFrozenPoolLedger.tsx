import type { TraceCase } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceAmount } from "./TraceAmount";
import { TraceStatusBadge } from "./TraceStatusBadge";

interface TraceFrozenPoolLedgerProps {
  traceCase: TraceCase;
}

export function TraceFrozenPoolLedger({ traceCase }: TraceFrozenPoolLedgerProps) {
  return (
    <section>
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-ourox-ink/40 block">Frozen amount</span>
          <TraceAmount
            amount={traceCase.frozenAmount}
            asset={traceCase.asset}
            className="text-ourox-orange text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-ourox-ink/40 block">Held at</span>
          <span className="text-ourox-ink/90 mt-0.5 block">{traceCase.vaspHoldingFunds}</span>
        </div>
        <div>
          <span className="text-ourox-ink/40 block">Pool total before outflow</span>
          <TraceAmount
            amount={traceCase.poolTotalBeforeOutflow}
            asset={traceCase.asset}
            className="text-ourox-ink/90 text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-ourox-ink/40 block">Remaining pool balance</span>
          <TraceAmount
            amount={traceCase.remainingPoolBalance}
            asset={traceCase.asset}
            className="text-ourox-ink/90 text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-ourox-ink/40 block">Co-mingled</span>
          <span className="text-ourox-ink/90 mt-0.5 block">Yes</span>
        </div>
      </div>

      <p className="mb-4 text-xs text-ourox-ink/60 leading-relaxed">
        {TRACE_BOUNDARY.frozenPoolCaption}
      </p>

      <div className="overflow-hidden rounded border border-ourox-obsidianMid">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight text-left">
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Time</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Tx</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Party</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Role</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Direction</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50 text-right">Amount</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50 text-right">Running balance</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Evidence status</th>
            </tr>
          </thead>
          <tbody>
            {traceCase.poolLedger.map((entry) => (
              <tr key={entry.txId} className="border-b border-ourox-obsidianMid/50 last:border-0">
                <td className="px-3 py-2 font-mono text-ourox-ink/80">{entry.time}</td>
                <td className="px-3 py-2 font-mono text-ourox-ink/60">{entry.txId}</td>
                <td className="px-3 py-2 text-ourox-ink/90">{entry.depositor}</td>
                <td className="px-3 py-2 text-ourox-ink/70 capitalize">{entry.role}</td>
                <td className="px-3 py-2 text-ourox-ink/70 capitalize">{entry.direction}</td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={entry.amount} asset={traceCase.asset} className="text-ourox-ink/90" />
                </td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={entry.runningBalance} asset={traceCase.asset} className="text-ourox-ink/80" />
                </td>
                <td className="px-3 py-2">
                  {entry.evidenceStatus === "supported" ? (
                    <span className="text-[11px] text-ourox-ink/70">Supported</span>
                  ) : (
                    <TraceStatusBadge status="insufficient-evidence" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
