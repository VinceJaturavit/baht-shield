import type { TraceCase } from "@/lib/trace/types";
import { TraceAmount } from "./TraceAmount";
import { TraceStatusBadge } from "./TraceStatusBadge";
import { TraceLearningNote } from "./TraceLearningNote";

interface TraceFrozenPoolLedgerProps {
  traceCase: TraceCase;
}

export function TraceFrozenPoolLedger({ traceCase }: TraceFrozenPoolLedgerProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-trace-heading mb-1">Frozen funds to allocate</h2>
      <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
        Start from the recoverable endpoint: 12,000 USDT is frozen at a synthetic VASP, but the pool
        is co-mingled.
      </p>

      <div className="mb-4">
        <TraceLearningNote title="Why start from frozen funds?">
          Recovery attribution starts from the funds that can actually be recovered. The question is
          not only where the funds went, but which claimants can be attributed to the frozen balance.
        </TraceLearningNote>
      </div>

      <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs rounded-lg border border-trace-border bg-trace-card px-4 py-4">
        <div>
          <span className="text-trace-secondary block">Held at</span>
          <span className="text-trace-body mt-0.5 block">{traceCase.vaspHoldingFunds}</span>
        </div>
        <div>
          <span className="text-trace-secondary block">Asset / chain</span>
          <span className="text-trace-body mt-0.5 block">
            {traceCase.asset} · {traceCase.chain}
          </span>
        </div>
        <div>
          <span className="text-trace-secondary block">Frozen amount</span>
          <TraceAmount
            amount={traceCase.frozenAmount}
            asset={traceCase.asset}
            className="text-trace-primary text-sm mt-0.5 font-medium"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Pool balance before seized outflow</span>
          <TraceAmount
            amount={traceCase.poolTotalBeforeOutflow}
            asset={traceCase.asset}
            className="text-trace-heading text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Remaining balance after seized outflow</span>
          <TraceAmount
            amount={traceCase.remainingPoolBalance}
            asset={traceCase.asset}
            className="text-trace-heading text-sm mt-0.5"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Co-mingled</span>
          <span className="text-trace-heading font-medium mt-0.5 block">Yes</span>
        </div>
        <div className="sm:col-span-3">
          <span className="text-trace-secondary block">Why backward tracing is needed</span>
          <span className="text-trace-body mt-0.5 block leading-relaxed">
            Victim and scammer deposits entered the same pool before the seized outflow. Attribution
            requires a defensible method applied backward from the frozen endpoint.
          </span>
        </div>
        <div className="sm:col-span-3">
          <span className="text-trace-secondary block">Supporting evidence</span>
          <span className="text-trace-body mt-0.5 block">
            Synthetic vendor trace hops and pool ledger entries (read-only).
          </span>
        </div>
      </div>

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
