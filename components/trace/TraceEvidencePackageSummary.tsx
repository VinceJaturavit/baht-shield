import type { TraceAuditEvent, TraceCase, TraceMethod, TraceReviewStatus, TraceVictimAttributionRow } from "@/lib/trace/types";
import type { TraceAiAssistOutput } from "@/lib/trace/ai-assist";
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
  methodSaved: boolean;
  aiOutput: TraceAiAssistOutput;
}

export function TraceEvidencePackageSummary({
  traceCase,
  selectedMethod,
  methodRationale,
  attributionRows,
  reviewStatus,
  auditEvents,
  methodSaved,
  aiOutput,
}: TraceEvidencePackageSummaryProps) {
  if (!methodSaved) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-trace-heading mb-1">Recovery evidence package</h2>
        <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
          This read-only memo assembles the imported tracing evidence, frozen-pool analysis, selected
          method, attribution outcome, gaps, and review status.
        </p>
        <div className="rounded border border-trace-border bg-trace-muted px-4 py-6 text-center">
          <p className="text-sm font-medium text-trace-heading">Method selection required</p>
          <p className="mt-1 text-xs text-trace-secondary">
            Save a recovery method before the evidence package can be assembled.
          </p>
        </div>
      </section>
    );
  }

  const unresolvedGaps = attributionRows.flatMap((r) =>
    r.gaps.map((g) => ({ claimant: r.victimNameSynthetic, gap: g })),
  );

  return (
    <section>
      <div className="mb-4 rounded-lg border border-trace-cyan/40 bg-trace-cyan/10 px-4 py-3">
        <p className="text-xs font-medium text-trace-obsidian">
          {TRACE_BOUNDARY.evidencePackageBanner}
        </p>
      </div>

      <h2 className="text-sm font-semibold text-trace-heading mb-1">Recovery evidence package</h2>
      <p className="mb-6 text-xs text-trace-secondary leading-relaxed">
        This read-only memo assembles the imported tracing evidence, frozen-pool analysis, selected
        method, attribution outcome, gaps, and review status.
      </p>

      <article className="space-y-6 text-xs border border-trace-border rounded-lg bg-trace-card px-5 py-5">
        <header className="border-b border-trace-border pb-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-trace-secondary">
            Recovery memo — {traceCase.caseId}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-trace-heading">{traceCase.title}</h3>
        </header>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Case summary</h4>
          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-trace-secondary">Frozen amount</dt>
              <dd className="mt-0.5">
                <TraceAmount amount={traceCase.frozenAmount} asset={traceCase.asset} />
              </dd>
            </div>
            <div>
              <dt className="text-trace-secondary">Review status</dt>
              <dd className="mt-0.5">
                <TraceReviewBadge status={reviewStatus} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-trace-secondary">VASP holding funds</dt>
              <dd className="text-trace-body mt-0.5">{traceCase.vaspHoldingFunds}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Source vendor evidence</h4>
          <p className="text-trace-body leading-relaxed">
            {traceCase.vendorEvidence.vendorName} · {traceCase.vendorEvidence.caseReference}.{" "}
            {traceCase.vendorEvidence.traceHops.length} synthetic trace hops imported as read-only
            input. {TRACE_BOUNDARY.vendorEvidenceCaption}
          </p>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Frozen pool summary</h4>
          <p className="text-trace-body leading-relaxed">
            Co-mingled pool of {traceCase.poolTotalBeforeOutflow.toLocaleString()} {traceCase.asset}{" "}
            before {traceCase.frozenAmount.toLocaleString()} {traceCase.asset} seized outflow.
            Remaining balance: {traceCase.remainingPoolBalance.toLocaleString()} {traceCase.asset}.
            Held at {traceCase.vaspHoldingFunds}.
          </p>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Selected method and rationale</h4>
          {selectedMethod ? (
            <>
              <p className="text-trace-heading font-medium">{selectedMethod}</p>
              <p className="mt-2 text-trace-body leading-relaxed whitespace-pre-wrap">{methodRationale}</p>
            </>
          ) : (
            <p className="text-trace-secondary">Pending human method selection.</p>
          )}
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Victim attribution outcome</h4>
          <TraceVictimAttributionTable rows={attributionRows} asset={traceCase.asset} compact />
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Unresolved gaps</h4>
          {unresolvedGaps.length > 0 ? (
            <ul className="space-y-1 text-trace-body">
              {unresolvedGaps.map(({ claimant, gap }) => (
                <li key={`${claimant}-${gap}`}>
                  <span className="font-medium">{claimant}:</span> {gap}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-trace-secondary">No unresolved gaps recorded.</p>
          )}
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">AI-drafted narrative</h4>
          <p className="rounded border border-dashed border-trace-border bg-trace-muted px-3 py-2 text-trace-body leading-relaxed">
            <span className="font-medium text-trace-secondary">Draft — human edit required: </span>
            {aiOutput.methodDifferenceSummary}
          </p>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Reviewer approval status</h4>
          <TraceReviewBadge status={reviewStatus} />
        </section>

        <section>
          <h4 className="text-xs font-semibold text-trace-heading mb-2">Audit log reference</h4>
          <p className="text-trace-secondary">
            {auditEvents.length} event{auditEvents.length !== 1 ? "s" : ""} recorded in senior review.
          </p>
        </section>
      </article>
    </section>
  );
}
