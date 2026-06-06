"use client";

import type {
  DominantMissCluster,
  FeaturePatternGroup,
} from "@/lib/arbiter/feedback-analysis";

interface Props {
  cluster: DominantMissCluster;
  patternGroups: FeaturePatternGroup[];
}

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

export function DominantPatternPanel({ cluster, patternGroups }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
        <h3 className="mb-1 text-sm font-semibold tracking-wide text-ourox-ink">
          Dominant miss cluster
        </h3>
        <p className="mb-4 text-xs text-ourox-ink/40">
          {cluster.displayName} — {cluster.count} cases ({pct(cluster.share)} of misses)
        </p>
        <p className="text-sm leading-6 text-ourox-ink/70">
          The dominant miss cluster is <strong className="font-medium text-ourox-ink">{cluster.displayName}</strong>.
          These events show {cluster.dominantPatternLabel.toLowerCase()}, but many do not cross a
          single hard rule threshold strongly enough to become REVIEW or BLOCK. The model learns
          the combined pattern — pass-through behaviour on aged accounts with elevated ML
          probability. The hand rules treat withdrawal-after-deposit (R5 at 0.9) and score-band
          thresholds more separately, so some cases remain APPROVE or STEP_UP.
        </p>
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-ourox-ink">
          Feature patterns across misses
        </h3>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniStat
            label="Avg withdrawal-after-deposit"
            value={cluster.stats.avgWithdrawalAfterDeposit.toFixed(2)}
          />
          <MiniStat
            label="Share new beneficiary"
            value={pct(cluster.stats.shareNewBeneficiary)}
          />
          <MiniStat
            label="Share risky beneficiary"
            value={pct(cluster.stats.shareRiskyBeneficiary)}
          />
          <MiniStat
            label="Avg ML probability"
            value={pct(cluster.stats.avgMlProbability)}
          />
          <MiniStat
            label="Avg rule score"
            value={cluster.stats.avgRuleScore.toFixed(1)}
          />
          <MiniStat
            label="Avg daily cumulative (THB)"
            value={Math.round(cluster.stats.avgDailyCumulativeThb).toLocaleString()}
          />
        </div>

        <div className="space-y-2">
          {patternGroups.map((g) => (
            <div
              key={g.pattern}
              className="flex items-center justify-between rounded-md border border-ourox-obsidianMid/60 bg-ourox-obsidian/40 px-3 py-2"
            >
              <span className="text-xs text-ourox-ink/60">{g.label}</span>
              <span className="font-mono text-xs text-ourox-ink/80">
                {g.count} ({pct(g.share)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-ourox-ink/35">{label}</div>
      <div className="mt-0.5 font-mono text-xs text-ourox-ink/80">{value}</div>
    </div>
  );
}
