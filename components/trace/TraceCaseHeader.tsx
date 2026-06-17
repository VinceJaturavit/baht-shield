import Link from "next/link";
import type { TraceCase } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TRACE_GUIDE_NAV } from "@/lib/trace/trace-guide-content";
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          href="/trace"
          className="text-xs text-trace-secondary hover:text-trace-primary transition-colors"
        >
          Back to Trace cases
        </Link>
        <Link
          href={TRACE_GUIDE_NAV.guideLink.href}
          className="text-xs text-trace-secondary hover:text-trace-primary transition-colors"
        >
          {TRACE_GUIDE_NAV.guideLink.label}
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <TraceLogo size={32} className="shrink-0" />
          <div className="min-w-0 border-l border-trace-border pl-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-trace-heading tracking-tight">
                Ourox Trace
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-trace-primary">
                Recovery Tracing Workflow
              </span>
            </div>
            <h1 className="mt-1 text-lg font-semibold text-trace-heading leading-snug">
              {traceCase.title}
            </h1>
            <p className="mt-0.5 text-xs font-mono text-trace-secondary">{traceCase.caseId}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded border border-trace-cyan/40 bg-trace-cyan/10 px-2 py-0.5 text-[10px] font-medium text-trace-obsidian">
            {TRACE_BOUNDARY.syntheticNotice.split(".")[0]}
          </span>
          <TraceReviewBadge status={reviewStatus} />
        </div>
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
