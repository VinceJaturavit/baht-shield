import type { OpsRoleFairnessSummary } from "@/lib/ops/fairness-types";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  summaries: OpsRoleFairnessSummary[];
}

function summaryTone(status: OpsRoleFairnessSummary["status"]) {
  return status === "Balanced" ? "good" : "watch";
}

export function OpsFairnessSummary({ summaries }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {summaries.map((summary) => (
        <div
          key={summary.role}
          className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20 px-3 py-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-ourox-ink">{summary.role}</span>
            <OpsIndicatorLabel
              label={summary.status}
              tone={summaryTone(summary.status)}
              detail={summary.imbalancedReason}
            />
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <div>
              <dt className="text-ourox-ink/40">Role average</dt>
              <dd className="tabular-nums text-ourox-ink/70">
                {summary.averageWeightedDifficulty.toFixed(1)}
              </dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Spread</dt>
              <dd className="tabular-nums text-ourox-ink/70">{summary.spread.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Min / Max</dt>
              <dd className="tabular-nums text-ourox-ink/70">
                {summary.minWeightedDifficulty.toFixed(1)} /{" "}
                {summary.maxWeightedDifficulty.toFixed(1)}
              </dd>
            </div>
            <div>
              <dt className="text-ourox-ink/40">Median</dt>
              <dd className="tabular-nums text-ourox-ink/70">
                {summary.medianWeightedDifficulty.toFixed(1)}
              </dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
