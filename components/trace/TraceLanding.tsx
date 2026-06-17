import Link from "next/link";
import { traceCases } from "@/data/trace/trace-cases";
import {
  tracePreviewCases,
  TRACE_LANDING_THESIS,
  TRACE_THREE_STEP_EXPLAINER,
  TRACE_LANDING_SAFETY,
} from "@/data/trace/trace-preview-cases";
import { TraceBoundaryDrawer } from "./TraceBoundaryDrawer";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";
import { TRACE_GUIDE_NAV } from "@/lib/trace/trace-guide-content";
import { TraceLogo } from "./TraceLogo";

export function TraceLanding() {
  return (
    <div className="max-w-4xl">
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <TraceLogo size={40} className="shrink-0" />
            <div className="border-l border-trace-border pl-3 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h1 className="text-xl font-semibold text-trace-heading tracking-tight">Ourox Trace</h1>
                <span className="text-[10px] font-mono uppercase tracking-wider text-trace-primary">
                  Recovery Tracing Workflow
                </span>
              </div>
              <p className="mt-2 text-sm text-trace-body leading-relaxed">{TRACE_LANDING_THESIS}</p>
            </div>
          </div>
          <Link
            href={TRACE_GUIDE_NAV.guideLink.href}
            className="inline-flex shrink-0 rounded border border-trace-border bg-trace-card px-3 py-1.5 text-xs font-medium text-trace-body hover:border-trace-primary hover:text-trace-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
          >
            {TRACE_GUIDE_NAV.guideLink.label}
          </Link>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-trace-secondary mb-3">
          How it works
        </h2>
        <ol className="space-y-3">
          {TRACE_THREE_STEP_EXPLAINER.map((item) => (
            <li
              key={item.step}
              className="flex gap-3 rounded border border-trace-border bg-trace-card px-4 py-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-trace-primary/10 text-xs font-semibold text-trace-primary">
                {item.step}
              </span>
              <div>
                <p className="text-xs font-semibold text-trace-heading">{item.title}</p>
                <p className="mt-0.5 text-xs text-trace-secondary leading-relaxed">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-trace-heading mb-3">Recovery cases</h2>
        <div className="space-y-3">
          {traceCases.map((c) => (
            <article
              key={c.caseId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-trace-border bg-trace-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-mono text-trace-secondary">{c.caseId}</p>
                <h3 className="text-sm font-semibold text-trace-heading">{c.title}</h3>
                <p className="mt-1 text-xs text-trace-body">
                  {c.asset} · {c.chain} ·{" "}
                  <TraceAmount amount={c.frozenAmount} asset={c.asset} className="inline text-trace-primary" />{" "}
                  frozen at {c.vaspHoldingFunds}
                </p>
                <div className="mt-2">
                  <TraceReviewBadge status={c.status} />
                </div>
              </div>
              <Link
                href={`/trace/cases/${c.caseId}`}
                className="inline-flex shrink-0 rounded bg-trace-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-trace-blue1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
              >
                Open recovery workflow
              </Link>
            </article>
          ))}

          {tracePreviewCases.map((preview) => (
            <article
              key={preview.caseId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-trace-border bg-trace-muted px-4 py-3 opacity-80"
            >
              <div className="min-w-0">
                <p className="text-xs font-mono text-trace-secondary">{preview.caseId}</p>
                <h3 className="text-sm font-semibold text-trace-heading">{preview.title}</h3>
                <p className="mt-1 text-xs text-trace-secondary leading-relaxed">{preview.description}</p>
                <p className="mt-2 text-xs font-medium text-trace-secondary">{preview.status}</p>
              </div>
              <span
                className="inline-flex shrink-0 rounded border border-trace-border bg-trace-surface px-3 py-1.5 text-xs font-medium text-trace-secondary cursor-not-allowed"
                aria-disabled="true"
              >
                Preview locked
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 space-y-2">
        <p className="text-xs text-trace-body leading-relaxed rounded border border-trace-border bg-trace-surface px-3 py-2">
          {TRACE_LANDING_SAFETY}
        </p>
        <TraceBoundaryDrawer />
      </section>
    </div>
  );
}
