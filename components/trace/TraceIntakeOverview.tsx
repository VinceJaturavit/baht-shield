import type { TraceCase } from "@/lib/trace/types";
import { TraceAmount } from "./TraceAmount";

interface TraceIntakeOverviewProps {
  traceCase: TraceCase;
}

export function TraceIntakeOverview({ traceCase }: TraceIntakeOverviewProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-trace-heading mb-1">Understand the recovery case</h2>
      <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
        Review the case story and trace path above, then proceed through imported evidence, frozen
        funds, and co-mingling before selecting a recovery method.
      </p>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs rounded-lg border border-trace-border bg-trace-card px-4 py-4">
        <div>
          <dt className="text-trace-secondary">Case ID</dt>
          <dd className="font-mono text-trace-heading mt-0.5">{traceCase.caseId}</dd>
        </div>
        <div>
          <dt className="text-trace-secondary">Asset / chain</dt>
          <dd className="text-trace-body mt-0.5">
            {traceCase.asset} · {traceCase.chain}
          </dd>
        </div>
        <div>
          <dt className="text-trace-secondary">Frozen amount</dt>
          <dd className="mt-0.5">
            <TraceAmount amount={traceCase.frozenAmount} asset={traceCase.asset} className="text-trace-primary" />
          </dd>
        </div>
        <div>
          <dt className="text-trace-secondary">VASP holding funds</dt>
          <dd className="text-trace-body mt-0.5">{traceCase.vaspHoldingFunds}</dd>
        </div>
        <div>
          <dt className="text-trace-secondary">Pool before outflow</dt>
          <dd className="mt-0.5">
            <TraceAmount amount={traceCase.poolTotalBeforeOutflow} asset={traceCase.asset} />
          </dd>
        </div>
        <div>
          <dt className="text-trace-secondary">Status</dt>
          <dd className="text-trace-body mt-0.5 capitalize">{traceCase.status.replace("-", " ")}</dd>
        </div>
      </dl>
    </section>
  );
}
