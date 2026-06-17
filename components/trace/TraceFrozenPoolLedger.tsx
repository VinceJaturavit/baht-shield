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
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs rounded-lg border border-trace-border bg-trace-card px-4 py-4">
        <div>
          <span className="text-trace-secondary block">Frozen amount</span>
          <TraceAmount
            amount={traceCase.frozenAmount}
            asset={traceCase.asset}
            className="text-trace-primary text-sm mt-0.5 font-medium"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Pool total before outflow</span>
          <TraceAmount
            amount={traceCase.poolTotalBeforeOutflow}
            asset={traceCase.asset}
            className="text-trace-heading text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Remaining balance</span>
          <TraceAmount
            amount={traceCase.remainingPoolBalance}
            asset={traceCase.asset}
            className="text-trace-heading text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">VASP holding funds</span>
          <span className="text-trace-body mt-0.5 block">{traceCase.vaspHoldingFunds}</span>
        </div>
        <div>
          <span className="text-trace-secondary block">Co-mingled</span>
          <span className="text-trace-heading font-medium mt-0.5 block">Yes</span>
        </div>
      </div>

      <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
        {TRACE_BOUNDARY.frozenPoolCaption}
      </p>

      <div className="overflow-hidden rounded-lg border border-trace-border bg-trace-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-trace-border bg-trace-surface text-left">
              <th className="px-3 py-2 font-medium text-trace-secondary">Time</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Tx</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Party</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Role</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Direction</th>
              <th className="px-3 py-2 font-medium text-trace-secondary text-right">Amount</th>
              <th className="px-3 py-2 font-medium text-trace-secondary text-right">Running balance</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Evidence status</th>
            </tr>
          </thead>
          <tbody>
            {traceCase.poolLedger.map((entry) => (
              <tr key={entry.txId} className="border-b border-trace-border/60 last:border-0">
                <td className="px-3 py-2 font-mono text-trace-body">{entry.time}</td>
                <td className="px-3 py-2 font-mono text-trace-secondary">{entry.txId}</td>
                <td className="px-3 py-2 text-trace-heading">{entry.depositor}</td>
                <td className="px-3 py-2 text-trace-body capitalize">{entry.role}</td>
                <td className="px-3 py-2 text-trace-body capitalize">{entry.direction}</td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={entry.amount} asset={traceCase.asset} className="text-trace-heading" />
                </td>
                <td className="px-3 py-2 text-right">
                  <TraceAmount amount={entry.runningBalance} asset={traceCase.asset} className="text-trace-body" />
                </td>
                <td className="px-3 py-2">
                  {entry.evidenceStatus === "supported" ? (
                    <span className="text-xs text-trace-body">Supported</span>
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
