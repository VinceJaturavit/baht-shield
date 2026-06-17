import Link from "next/link";
import { traceCases } from "@/data/trace/trace-cases";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceBoundaryPanel } from "./TraceBoundaryPanel";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";
import { TraceLogo } from "./TraceLogo";

export function TraceLanding() {
  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <TraceLogo size={48} />
          <div>
            <h1 className="text-2xl font-semibold text-trace-heading">Ourox Trace</h1>
            <p className="mt-1 text-xs font-mono text-trace-primary tracking-wider uppercase">
              Recovery Tracing Workflow
            </p>
            <p className="mt-2 text-sm text-trace-body leading-relaxed">{TRACE_BOUNDARY.tagline}</p>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <TraceBoundaryPanel />
      </div>

      <section>
        <h2 className="text-sm font-semibold text-trace-heading mb-3">Recovery cases</h2>
        <div className="overflow-hidden rounded-lg border border-trace-border bg-trace-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-trace-border bg-trace-surface text-left">
                <th className="px-4 py-2.5 font-medium text-trace-secondary">Case ID</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary">Title</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary">Asset / chain</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary text-right">Frozen amount</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary">VASP</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary">Status</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary">Last updated</th>
                <th className="px-4 py-2.5 font-medium text-trace-secondary"></th>
              </tr>
            </thead>
            <tbody>
              {traceCases.map((c) => (
                <tr key={c.caseId} className="border-b border-trace-border/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-trace-body">{c.caseId}</td>
                  <td className="px-4 py-3 text-trace-heading">{c.title}</td>
                  <td className="px-4 py-3 text-trace-body">
                    {c.asset} · {c.chain}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TraceAmount amount={c.frozenAmount} asset={c.asset} className="text-trace-primary" />
                  </td>
                  <td className="px-4 py-3 text-trace-body">{c.vaspHoldingFunds}</td>
                  <td className="px-4 py-3">
                    <TraceReviewBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-trace-secondary">
                    {new Date(c.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/trace/cases/${c.caseId}`}
                      className="inline-flex rounded bg-trace-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-trace-blue1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
                    >
                      Open recovery workflow
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
