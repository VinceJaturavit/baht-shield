"use client";

import type { VerityEvidencePack } from "@/lib/verity/agent-types";

interface VerityAgentEvidencePackProps {
  pack: VerityEvidencePack;
  displaySummary?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  account_history: "Account history",
  transaction_graph: "Transaction graph",
  device_ip_funding: "Device / IP / funding",
  onchain_exposure: "On-chain exposure",
  prior_flags: "Prior flags",
  pattern_match: "Pattern match",
};

export function VerityAgentEvidencePack({
  pack,
  displaySummary,
}: VerityAgentEvidencePackProps) {
  const summary = displaySummary ?? pack.summary;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-signal-ink">Atomic evidence steps</h3>
        <p className="mt-1 text-[13px] text-signal-slate">
          Each step is a discrete, auditable evidence assembly action — not a
          single narrative paragraph.
        </p>
        <ol className="mt-3 space-y-3">
          {pack.atomicSteps.map((step, i) => (
            <li
              key={step.id}
              className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-4 py-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-signal-ink">
                  {i + 1}. {step.label}
                </span>
                <span className="shrink-0 text-xs font-medium text-signal-indigo">
                  {step.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-signal-slate">{step.output}</p>
              <p className="mt-1 text-xs text-signal-secondary">
                Evidence refs: {step.evidenceRefs.join(", ")}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-signal-ink">Evidence items</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-signal-border text-xs text-signal-secondary">
                <th className="pb-2 pr-3 font-medium">ID</th>
                <th className="pb-2 pr-3 font-medium">Category</th>
                <th className="pb-2 pr-3 font-medium">Finding</th>
                <th className="pb-2 pr-3 font-medium">Source</th>
                <th className="pb-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {pack.evidenceItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-signal-borderSubtle align-top"
                >
                  <td className="py-2 pr-3 font-mono text-xs text-signal-indigo">
                    {item.id}
                  </td>
                  <td className="py-2 pr-3 text-xs text-signal-body">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </td>
                  <td className="py-2 pr-3 text-signal-slate">{item.finding}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-signal-secondary">
                    {item.sourceRef}
                  </td>
                  <td className="py-2 text-xs font-medium text-signal-body">
                    {item.confidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-signalSm border border-signal-border bg-signal-surfaceSubtle px-4 py-3">
        <h3 className="text-sm font-semibold text-signal-ink">Neutral summary</h3>
        <p className="mt-2 text-sm leading-relaxed text-signal-slate">{summary}</p>
      </div>
    </div>
  );
}
