import type { TraceVendorEvidencePacket } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceConfidenceBadge } from "./TraceStatusBadge";

interface TraceVendorEvidenceProps {
  evidence: TraceVendorEvidencePacket;
}

export function TraceVendorEvidence({ evidence }: TraceVendorEvidenceProps) {
  return (
    <section>
      <div className="mb-6 rounded-lg border border-trace-border bg-trace-card px-4 py-4">
        <p className="text-xs font-medium text-trace-secondary mb-3">Read-only packet summary</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <div>
            <dt className="text-trace-secondary">Synthetic vendor export</dt>
            <dd className="text-trace-heading mt-0.5">{evidence.vendorName}</dd>
          </div>
          <div>
            <dt className="text-trace-secondary">Case reference</dt>
            <dd className="font-mono text-trace-heading mt-0.5">{evidence.caseReference}</dd>
          </div>
          <div>
            <dt className="text-trace-secondary">Chain / asset</dt>
            <dd className="text-trace-heading mt-0.5">
              {evidence.chain} · {evidence.asset}
            </dd>
          </div>
          <div>
            <dt className="text-trace-secondary">Seed address</dt>
            <dd className="font-mono text-trace-body mt-0.5 break-all">{evidence.seedAddress}</dd>
          </div>
          <div>
            <dt className="text-trace-secondary">Cash-out endpoint</dt>
            <dd className="font-mono text-trace-body mt-0.5 break-all">{evidence.cashOutEndpoint}</dd>
          </div>
          <div>
            <dt className="text-trace-secondary">VASP holding funds</dt>
            <dd className="font-mono text-trace-body mt-0.5 break-all">{evidence.vaspHoldingFunds}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-trace-secondary leading-relaxed border-t border-trace-border pt-3">
          {TRACE_BOUNDARY.vendorEvidenceCaption}
        </p>
      </div>

      <h3 className="text-sm font-semibold text-trace-heading mb-2">Trace hops</h3>
      <div className="overflow-hidden rounded-lg border border-trace-border bg-trace-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-trace-border bg-trace-surface text-left">
              <th className="px-3 py-2 font-medium text-trace-secondary">Hop</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">From</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">To</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Service / cluster</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Confidence</th>
              <th className="px-3 py-2 font-medium text-trace-secondary">Note</th>
            </tr>
          </thead>
          <tbody>
            {evidence.traceHops.map((hop) => (
              <tr key={hop.hopIndex} className="border-b border-trace-border/60 last:border-0">
                <td className="px-3 py-2 text-trace-body">{hop.hopIndex}</td>
                <td className="px-3 py-2 font-mono text-trace-secondary break-all">{hop.fromAddress}</td>
                <td className="px-3 py-2 font-mono text-trace-secondary break-all">{hop.toAddress}</td>
                <td className="px-3 py-2 text-trace-body">{hop.serviceOrCluster}</td>
                <td className="px-3 py-2">
                  <TraceConfidenceBadge confidence={hop.attributionConfidence} />
                </td>
                <td className="px-3 py-2 text-trace-secondary">{hop.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="mt-4 rounded-lg border border-trace-border bg-trace-surface">
        <summary className="px-4 py-2 text-xs font-medium text-trace-primary cursor-pointer">
          Notes and import details
        </summary>
        <div className="px-4 pb-3 text-xs space-y-2">
          <div>
            <span className="text-trace-secondary">Export timestamp: </span>
            <span className="text-trace-body">
              {new Date(evidence.exportTimestamp).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-trace-secondary">Imported by: </span>
            <span className="text-trace-body">{evidence.analystImportedBy}</span>
          </div>
          <p className="text-trace-body leading-relaxed">{evidence.notes}</p>
        </div>
      </details>
    </section>
  );
}
