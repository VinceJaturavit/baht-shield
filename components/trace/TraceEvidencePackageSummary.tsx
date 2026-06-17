import type { TraceAuditEvent, TraceCase, TraceMethod, TraceReviewStatus, TraceVictimAttributionRow } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceAmount } from "./TraceAmount";
import { TraceReviewBadge } from "./TraceStatusBadge";
import { TraceVictimAttributionTable } from "./TraceVictimAttributionTable";

interface TraceEvidencePackageSummaryProps {
  traceCase: TraceCase;
  selectedMethod: TraceMethod | null;
  methodRationale: string;
  attributionRows: TraceVictimAttributionRow[];
  reviewStatus: TraceReviewStatus;
  auditEvents: TraceAuditEvent[];
}

export function TraceEvidencePackageSummary({
  traceCase,
  selectedMethod,
  methodRationale,
  attributionRows,
  reviewStatus,
  auditEvents,
}: TraceEvidencePackageSummaryProps) {
  return (
    <section>
      <div className="mb-6 rounded border border-ourox-yellow/40 bg-ourox-yellow/5 px-4 py-3">
        <p className="text-xs font-medium text-ourox-yellow">
          {TRACE_BOUNDARY.evidencePackageBanner}
        </p>
      </div>

      <div className="space-y-6 text-xs">
        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Case summary</h3>
          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-ourox-ink/40">Case ID</dt>
              <dd className="font-mono text-ourox-ink/90 mt-0.5">{traceCase.caseId}</dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Title</dt>
              <dd className="text-ourox-ink/90 mt-0.5">{traceCase.title}</dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Frozen amount</dt>
              <dd className="mt-0.5">
                <TraceAmount amount={traceCase.frozenAmount} asset={traceCase.asset} />
              </dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Review status</dt>
              <dd className="mt-0.5">
                <TraceReviewBadge status={reviewStatus} />
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Source vendor evidence</h3>
          <p className="text-ourox-ink/70 leading-relaxed">
            {traceCase.vendorEvidence.vendorName} · {traceCase.vendorEvidence.caseReference}.{" "}
            {TRACE_BOUNDARY.vendorEvidenceCaption}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Frozen pool</h3>
          <p className="text-ourox-ink/70 leading-relaxed">
            Co-mingled pool of {traceCase.poolTotalBeforeOutflow.toLocaleString()} {traceCase.asset}{" "}
            before {traceCase.frozenAmount.toLocaleString()} {traceCase.asset} seized outflow.
            Remaining balance: {traceCase.remainingPoolBalance.toLocaleString()} {traceCase.asset}.
            Held at {traceCase.vaspHoldingFunds}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Method selected</h3>
          {selectedMethod ? (
            <>
              <p className="text-ourox-ink/90 font-medium">{selectedMethod}</p>
              <p className="mt-2 text-ourox-ink/70 leading-relaxed">{methodRationale}</p>
            </>
          ) : (
            <p className="text-ourox-ink/50">Pending human method selection.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Victim attribution</h3>
          <TraceVictimAttributionTable rows={attributionRows} asset={traceCase.asset} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Uncertainty and limitations</h3>
          <ul className="space-y-1.5 text-ourox-ink/70 leading-relaxed">
            <li>Method choice can change victim outcome on the same frozen pool.</li>
            <li>Ambiguous claim excluded for insufficient evidence.</li>
            <li>Vendor evidence is synthetic read-only input — Ourox Trace does not perform the trace.</li>
            <li>Legal review would be required in a real recovery process.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ourox-ink mb-2">Audit log reference</h3>
          <p className="text-ourox-ink/60">
            {auditEvents.length} event{auditEvents.length !== 1 ? "s" : ""} recorded in review and audit tab.
          </p>
        </div>
      </div>
    </section>
  );
}
