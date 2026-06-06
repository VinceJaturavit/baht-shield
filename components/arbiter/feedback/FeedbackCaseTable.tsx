"use client";

import type { FeedbackCase } from "@/lib/arbiter/feedback-backtest";

interface Props {
  cases: FeedbackCase[];
}

const TYPOLOGY_LABEL: Record<string, string> = {
  app_scam_cashout: "APP scam cash-out",
  sleeper_activation: "Sleeper activation",
  onboarding_mule_farm: "Mule farm",
  background: "Background",
};

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function featureSummary(features: Record<string, number | boolean | string>): string {
  const parts: string[] = [];
  if (features.withdrawal_after_deposit !== undefined) {
    parts.push(`wd=${Number(features.withdrawal_after_deposit).toFixed(2)}`);
  }
  if (features.account_age_days !== undefined) {
    parts.push(`age=${features.account_age_days}d`);
  }
  if (features.is_new_beneficiary) {
    parts.push("new_ben");
  }
  if (features.beneficiary_risk_tier) {
    parts.push(String(features.beneficiary_risk_tier));
  }
  return parts.join(", ") || "—";
}

export function FeedbackCaseTable({ cases }: Props) {
  const caught = cases.filter((c) => c.kind === "newly_caught_miss");
  const fps = cases.filter((c) => c.kind === "added_false_positive");

  return (
    <div className="space-y-4">
      {caught.length > 0 && (
        <CaseSection title="Sample newly caught misses" rows={caught} />
      )}
      {fps.length > 0 && (
        <CaseSection title="Sample added false positives" rows={fps} />
      )}
    </div>
  );
}

function CaseSection({ title, rows }: { title: string; rows: FeedbackCase[] }) {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-ourox-ink">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-ourox-ink/40">
              <th className="pb-2 pr-3 font-medium">Event ID</th>
              <th className="pb-2 pr-3 font-medium">Typology</th>
              <th className="pb-2 pr-3 font-medium">ML prob</th>
              <th className="pb-2 pr-3 font-medium">Before</th>
              <th className="pb-2 pr-3 font-medium">After</th>
              <th className="pb-2 pr-3 font-medium">Key features</th>
              <th className="pb-2 font-medium">Why hit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.kind}-${row.eventId}`}
                className="border-b border-ourox-obsidianMid/50 text-ourox-ink/70"
              >
                <td className="py-2 pr-3 font-mono text-ourox-ink/80">{row.eventId}</td>
                <td className="py-2 pr-3">
                  {TYPOLOGY_LABEL[row.scenarioLabel ?? ""] ?? row.scenarioLabel ?? "—"}
                </td>
                <td className="py-2 pr-3 font-mono">{pct(row.mlProbability)}</td>
                <td className="py-2 pr-3 font-mono">{row.ruleDecisionBefore}</td>
                <td className="py-2 pr-3 font-mono text-ourox-orange">{row.simulatedDecisionAfter}</td>
                <td className="py-2 pr-3 font-mono text-ourox-ink/50">
                  {featureSummary(row.keyFeatures)}
                </td>
                <td className="py-2 font-mono text-ourox-ink/45">{row.whyCandidateHit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
