import Link from "next/link";
import type { EnrichedCaseDetail, PatternFamily } from "@/lib/types";
import { VariableChipGroup } from "@/components/patterns/VariableChipGroup";
import { getPatternFamily } from "@/lib/scenario-utils";

interface CaseEvidencePanelProps {
  caseDetail: EnrichedCaseDetail;
}

function formatTHB(amount: number): string {
  if (amount <= 0) return "—";
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(0)}K`;
  return `฿${amount.toLocaleString("th-TH")}`;
}

export function CaseEvidencePanel({ caseDetail }: CaseEvidencePanelProps) {
  const pattern = caseDetail.matchedPattern;
  const patternFamily: PatternFamily | undefined = pattern
    ? getPatternFamily({
        pattern_id: pattern.pattern_id,
        name: pattern.name,
        cluster_type: pattern.cluster_type,
      })
    : undefined;

  return (
    <section className="overflow-hidden rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle">
      <div className="border-b border-signal-borderSubtle bg-signal-surfaceSubtle px-5 py-3">
        <h2 className="text-sm font-semibold text-signal-ink">Evidence &amp; Linkage</h2>
      </div>

      <div className="divide-y divide-signal-borderSubtle">
        {/* Linked wallet */}
        <div className="flex items-start gap-4 px-5 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-signal-faint">
            Wallet
          </span>
          {caseDetail.wallet_id ? (
            <Link
              href={`/wallet/${caseDetail.wallet_id}`}
              className="font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
            >
              {caseDetail.wallet_id}
            </Link>
          ) : (
            <span className="text-xs text-signal-faint">No linked wallet</span>
          )}
        </div>

        {/* Linked alert */}
        <div className="flex items-start gap-4 px-5 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-signal-faint">
            Alert
          </span>
          <div className="flex flex-col gap-0.5">
            <Link
              href={`/alerts?alertId=${caseDetail.alert_id}`}
              className="font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
            >
              {caseDetail.alert_id}
            </Link>
            {caseDetail.alert_rule_name && (
              <span className="text-[11px] text-signal-secondary">
                {caseDetail.alert_rule_name}
              </span>
            )}
          </div>
        </div>

        {/* Matched pattern */}
        <div className="flex items-start gap-4 px-5 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-signal-faint">
            Pattern
          </span>
          {caseDetail.linked_pattern_id ? (
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/patterns?patternId=${caseDetail.linked_pattern_id}`}
                className="font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
              >
                {caseDetail.linked_pattern_id}
              </Link>
              {caseDetail.linked_pattern_name && (
                <span className="text-[11px] text-signal-secondary">
                  {caseDetail.linked_pattern_name}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-signal-faint">No matched pattern</span>
          )}
        </div>

        {/* Scenario */}
        <div className="flex items-start gap-4 px-5 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-signal-faint">
            Scenario
          </span>
          <span className="text-xs text-signal-body">{caseDetail.scenario}</span>
        </div>

        {/* Linked loss */}
        <div className="flex items-start gap-4 px-5 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-wide text-signal-faint">
            Synthetic Loss
          </span>
          <span className="text-xs font-semibold tabular-nums text-signal-heading">
            {formatTHB(caseDetail.loss_amount)}
          </span>
        </div>

        {/* Signal chips */}
        <div className="px-5 py-4">
          <p className="mb-3 text-[11px] uppercase tracking-wide text-signal-faint">
            Key signal chips
          </p>
          {pattern ? (
            <VariableChipGroup
              variables={pattern.variables}
              patternFamily={patternFamily}
              showLegend={false}
            />
          ) : (
            <p className="text-xs text-signal-secondary">
              No analyst-curated pattern variables linked to this case.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
