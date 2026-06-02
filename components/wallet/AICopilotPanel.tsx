import type { WalletProfileData } from "@/lib/wallet-profile";
import { generateDeterministicCopilotSummary } from "@/lib/copilot-summary";

interface AICopilotPanelProps {
  walletProfile: WalletProfileData;
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

export function AICopilotPanel({ walletProfile }: AICopilotPanelProps) {
  const summary = generateDeterministicCopilotSummary(walletProfile);

  return (
    <section>
      <div className="overflow-hidden rounded-signal border border-signal-indigoBorder border-l-[3px] border-l-signal-indigo bg-signal-surface shadow-signalSubtle">
        {/* Header */}
        <div className="border-b border-signal-indigoBorder bg-signal-indigoSubtle px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
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
            {summary.sourcePatternId && (
              <span className="shrink-0 rounded-md border border-signal-indigoBorder bg-signal-surface px-2 py-0.5 font-mono text-[10px] text-signal-indigo">
                {summary.sourcePatternId}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-signal-borderSubtle px-6 py-4 space-y-4">
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

        {/* Footer */}
        <div className="border-t border-signal-indigoBorder bg-signal-indigoSubtle px-6 py-3">
          <p className="text-[10px] text-signal-slate">
            Copilot assists analyst review — it does not decide, block, or confirm fraud.
            All outputs are deterministic from synthetic case and pattern data.
          </p>
        </div>
      </div>
    </section>
  );
}
