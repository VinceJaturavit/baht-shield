import type { TraceVendorEvidencePacket } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceConfidenceBadge } from "./TraceStatusBadge";

interface TraceVendorEvidenceProps {
  evidence: TraceVendorEvidencePacket;
}

export function TraceVendorEvidence({ evidence }: TraceVendorEvidenceProps) {
  return (
    <section>
      <div className="mb-4 rounded border border-ourox-yellow/30 bg-ourox-obsidianLight px-4 py-3">
        <p className="text-xs text-ourox-ink/80 leading-relaxed">
          {TRACE_BOUNDARY.vendorEvidenceCaption}
        </p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs mb-6">
        <div>
          <dt className="text-ourox-ink/40">Vendor export</dt>
          <dd className="text-ourox-ink/90 mt-0.5">{evidence.vendorName}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Case reference</dt>
          <dd className="font-mono text-ourox-ink/90 mt-0.5">{evidence.caseReference}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Export timestamp</dt>
          <dd className="text-ourox-ink/90 mt-0.5">
            {new Date(evidence.exportTimestamp).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Imported by</dt>
          <dd className="text-ourox-ink/90 mt-0.5">{evidence.analystImportedBy}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Seed address</dt>
          <dd className="font-mono text-ourox-ink/90 mt-0.5 break-all">{evidence.seedAddress}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Chain / asset</dt>
          <dd className="text-ourox-ink/90 mt-0.5">
            {evidence.chain} · {evidence.asset}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">Cash-out endpoint</dt>
          <dd className="font-mono text-ourox-ink/90 mt-0.5 break-all">{evidence.cashOutEndpoint}</dd>
        </div>
        <div>
          <dt className="text-ourox-ink/40">VASP holding funds</dt>
          <dd className="font-mono text-ourox-ink/90 mt-0.5 break-all">{evidence.vaspHoldingFunds}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-ourox-ink/40">Notes</dt>
          <dd className="text-ourox-ink/80 mt-0.5 leading-relaxed">{evidence.notes}</dd>
        </div>
      </dl>

      <h3 className="text-sm font-semibold text-ourox-ink mb-2">Trace hops</h3>
      <div className="overflow-hidden rounded border border-ourox-obsidianMid">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight text-left">
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Hop</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">From</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">To</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Service / cluster</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Confidence</th>
              <th className="px-3 py-2 font-medium text-ourox-ink/50">Note</th>
            </tr>
          </thead>
          <tbody>
            {evidence.traceHops.map((hop) => (
              <tr key={hop.hopIndex} className="border-b border-ourox-obsidianMid/50 last:border-0">
                <td className="px-3 py-2 text-ourox-ink/80">{hop.hopIndex}</td>
                <td className="px-3 py-2 font-mono text-ourox-ink/70 break-all">{hop.fromAddress}</td>
                <td className="px-3 py-2 font-mono text-ourox-ink/70 break-all">{hop.toAddress}</td>
                <td className="px-3 py-2 text-ourox-ink/80">{hop.serviceOrCluster}</td>
                <td className="px-3 py-2">
                  <TraceConfidenceBadge confidence={hop.attributionConfidence} />
                </td>
                <td className="px-3 py-2 text-ourox-ink/70">{hop.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
