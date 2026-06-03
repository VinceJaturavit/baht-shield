import { AnalyticsPanel } from "./AnalyticsPanel";
import { HorizontalBarRow } from "./HorizontalBarRow";
import type { LossExposureByScenario } from "@/lib/analytics";

interface Props {
  data: LossExposureByScenario[];
}

function formatTHB(amount: number): string {
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `THB ${amount.toLocaleString()}`;
  }
}

export function LossExposureByScenarioPanel({ data }: Props) {
  if (data.length === 0) {
    return (
      <AnalyticsPanel
        title="Loss Exposure by Scenario"
        caption="Answers: where is synthetic loss exposure concentrated by typology."
        sourceNote="Source: cases.loss_amount grouped by case_id scenario prefix."
      >
        <p className="text-[13px] text-signal-meta">
          No synthetic case loss data available.
        </p>
      </AnalyticsPanel>
    );
  }

  const maxShare = Math.max(...data.map((d) => d.share));
  const totalLoss = data.reduce((s, d) => s + d.loss_amount, 0);

  return (
    <AnalyticsPanel
      title="Loss Exposure by Scenario"
      caption="Answers: where is synthetic loss exposure concentrated by typology."
      sourceNote="Source: cases.loss_amount grouped by case_id scenario prefix."
    >
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
          Total synthetic loss
        </span>
        <span className="tabular-nums text-[18px] font-semibold text-signal-ink">
          {formatTHB(totalLoss)}
        </span>
      </div>

      <div className="space-y-4">
        {data.map((row) => (
          <HorizontalBarRow
            key={row.scenario}
            label={row.scenario}
            value={formatTHB(row.loss_amount)}
            share={row.share}
            maxShare={maxShare}
            description={`${row.case_count} case${row.case_count !== 1 ? "s" : ""}`}
          />
        ))}
      </div>
    </AnalyticsPanel>
  );
}
