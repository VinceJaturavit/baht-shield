import Link from "next/link";
import { traceCases } from "@/data/trace/trace-cases";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceBoundaryPanel } from "./TraceBoundaryPanel";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";

export function TraceLanding() {
  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-mono text-ourox-orange tracking-wider uppercase mb-2">
          Ourox Trace
        </p>
        <h1 className="text-2xl font-semibold text-ourox-ink">{TRACE_BOUNDARY.productName}</h1>
        <p className="mt-2 text-sm text-ourox-ink/70 leading-relaxed">{TRACE_BOUNDARY.tagline}</p>
      </header>

      <div className="mb-8">
        <TraceBoundaryPanel />
      </div>

      <section>
        <h2 className="text-sm font-semibold text-ourox-ink mb-3">Recovery cases</h2>
        <div className="overflow-hidden rounded border border-ourox-obsidianMid">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight text-left">
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">Case ID</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">Title</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">Asset / chain</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50 text-right">Frozen amount</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">VASP</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">Status</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50">Last updated</th>
                <th className="px-4 py-2.5 font-medium text-ourox-ink/50"></th>
              </tr>
            </thead>
            <tbody>
              {traceCases.map((c) => (
                <tr key={c.caseId} className="border-b border-ourox-obsidianMid/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-ourox-ink/80">{c.caseId}</td>
                  <td className="px-4 py-3 text-ourox-ink/90">{c.title}</td>
                  <td className="px-4 py-3 text-ourox-ink/70">
                    {c.asset} · {c.chain}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TraceAmount amount={c.frozenAmount} asset={c.asset} className="text-ourox-orange" />
                  </td>
                  <td className="px-4 py-3 text-ourox-ink/70">{c.vaspHoldingFunds}</td>
                  <td className="px-4 py-3">
                    <TraceReviewBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-ourox-ink/60">
                    {new Date(c.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/trace/cases/${c.caseId}`}
                      className="inline-flex rounded bg-ourox-orange px-3 py-1.5 text-[11px] font-semibold text-ourox-obsidian hover:bg-ourox-orangeHover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
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
