import Link from "next/link";
import type { TraceCase } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";
import { TraceLogo } from "./TraceLogo";

interface TraceCaseHeaderProps {
  traceCase: TraceCase;
  reviewStatus: TraceCase["status"];
}

export function TraceCaseHeader({ traceCase, reviewStatus }: TraceCaseHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          <TraceLogo size={36} className="mt-0.5" />
          <div className="min-w-0">
            <Link
              href="/trace"
              className="text-xs text-trace-secondary hover:text-trace-primary transition-colors"
            >
              Back to Trace cases
            </Link>
            <p className="mt-1 text-xs font-mono text-trace-primary tracking-wide uppercase">
              Ourox Trace
            </p>
            <h1 className="mt-0.5 text-xl font-semibold text-trace-heading">{traceCase.title}</h1>
            <p className="mt-1 text-xs font-mono text-trace-secondary">{traceCase.caseId}</p>
            <p className="mt-2 inline-flex rounded border border-trace-cyan/40 bg-trace-cyan/10 px-2 py-0.5 text-xs font-medium text-trace-obsidian">
              {TRACE_BOUNDARY.syntheticNotice}
            </p>
          </div>
        </div>
        <TraceReviewBadge status={reviewStatus} />
      </div>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
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
          <dd className="text-trace-body mt-0.5 truncate">{traceCase.vaspHoldingFunds}</dd>
        </div>
        <div>
          <dt className="text-trace-secondary">Last updated</dt>
          <dd className="text-trace-body mt-0.5">
            {new Date(traceCase.lastUpdated).toLocaleDateString()}
          </dd>
        </div>
      </dl>
    </header>
  );
}
