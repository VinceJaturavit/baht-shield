import Link from "next/link";
import type { TraceCase } from "@/lib/trace/types";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";

interface TraceCaseHeaderProps {
  traceCase: TraceCase;
  reviewStatus: TraceCase["status"];
}

export function TraceCaseHeader({ traceCase, reviewStatus }: TraceCaseHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/trace"
            className="text-xs text-ourox-ink/50 hover:text-ourox-orange transition-colors"
          >
            Back to Trace cases
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-ourox-ink">{traceCase.title}</h1>
          <p className="mt-1 text-xs font-mono text-ourox-ink/50">{traceCase.caseId}</p>
        </div>
        <TraceReviewBadge status={reviewStatus} />
      </div>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
        <div>
          <dt className="text-ourox-ink/40">Asset / chain</dt>
          <dd className="text-ourox-ink/80 mt-0.5">
            {traceCase.asset} · {traceCase.chain}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Frozen amount</dt>
          <dd className="mt-0.5">
            <TraceAmount amount={traceCase.frozenAmount} asset={traceCase.asset} className="text-ourox-orange" />
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">VASP holding funds</dt>
          <dd className="text-ourox-ink/80 mt-0.5 truncate">{traceCase.vaspHoldingFunds}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Last updated</dt>
          <dd className="text-ourox-ink/80 mt-0.5">
            {new Date(traceCase.lastUpdated).toLocaleDateString()}
          </dd>
        </div>
      </dl>
    </header>
  );
}
