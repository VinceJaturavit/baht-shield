import type { EnrichedCaseDetail } from "@/lib/types";
import { getWalletProfile } from "@/lib/wallet-profile";
import { generateDeterministicCopilotSummary } from "@/lib/copilot-summary";

interface CaseDetailCopilotPanelProps {
  caseDetail: EnrichedCaseDetail;
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

function Section({ label, children }: SectionProps) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-signal-indigo">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-signal-body">{children}</p>
    </div>
  );
}

export function CaseDetailCopilotPanel({ caseDetail }: CaseDetailCopilotPanelProps) {
  // Preferred: get linked wallet profile and generate the deterministic summary from it
  const walletProfile = caseDetail.wallet_id
    ? getWalletProfile(caseDetail.wallet_id)
    : null;

  const summary = walletProfile
    ? generateDeterministicCopilotSummary(walletProfile)
    : null;

  return (
    <div className="overflow-hidden rounded-signal border border-signal-indigoBorder border-l-[3px] border-l-signal-indigo bg-signal-surface shadow-signalSubtle">
      {/* Header */}
      <div className="border-b border-signal-indigoBorder bg-signal-indigoSubtle px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-0.5 rounded-full bg-signal-indigo" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-signal-indigoActive">
                AI Copilot — synthetic demo (human-in-the-loop)
              </h2>
            </div>
            <p className="mt-1 ml-4 text-[11px] text-signal-slate">
              Scripted demo output from synthetic data. No live model call.{" "}
              <span className="font-semibold text-signal-body">
                Human-in-the-loop: the analyst decides.
              </span>
            </p>
          </div>
          {summary?.sourcePatternId && (
            <span className="shrink-0 rounded-md border border-signal-indigoBorder bg-signal-surface px-2 py-0.5 font-mono text-[10px] text-signal-indigo">
              {summary.sourcePatternId}
            </span>
          )}
        </div>

        {/* Case context anchor */}
        <div className="mt-2 ml-4 rounded-signalSm border border-signal-indigoBorder bg-signal-surface/60 px-3 py-2">
          <p className="text-[11px] text-signal-secondary">
            <span className="font-medium text-signal-indigo">Case:</span>{" "}
            <span className="font-mono">{caseDetail.case_id}</span>
            {caseDetail.scenario !== "Background" && (
              <>
                {" · "}
                <span className="font-medium">{caseDetail.scenario}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Content */}
      {summary ? (
        <div className="divide-y divide-signal-borderSubtle px-5 py-4 space-y-4">
          <Section label="Risk Summary">{summary.riskSummary}</Section>
          <div className="pt-4">
            <Section label="Matched Pattern Explained">
              {summary.matchedPatternExplanation}
            </Section>
          </div>
          <div className="pt-4">
            <Section label="What a Naive Score Missed">
              {summary.naiveScoreMissed}
            </Section>
          </div>
          <div className="pt-4">
            <Section label="Suggested Next Investigative Step">
              {summary.suggestedNextStep}
            </Section>
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm text-signal-secondary">
          Copilot summary unavailable — no linked wallet profile found for this case.
        </div>
      )}

      {/* Closure note CTA */}
      <div className="border-t border-signal-indigoBorder bg-signal-indigoSubtle px-5 py-3">
        <a
          href="#closure-note"
          className="inline-flex items-center gap-1.5 rounded-signalSm border border-signal-accentBorder bg-signal-accentSubtle px-3 py-1.5 text-xs font-medium text-signal-accent transition-colors hover:bg-signal-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Draft closure note
        </a>
      </div>

      {/* Footer */}
      <div className="border-t border-signal-indigoBorder bg-signal-indigoSubtle px-5 py-2.5">
        <p className="text-[10px] text-signal-slate">
          Copilot assists analyst review — it does not decide, block, or confirm fraud. All outputs
          are deterministic from synthetic case and pattern data.
        </p>
      </div>
    </div>
  );
}
