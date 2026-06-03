import { AnalyticsPanel } from "./AnalyticsPanel";
import { HorizontalBarRow } from "./HorizontalBarRow";
import type { CaseDecisionMixItem } from "@/lib/analytics";

interface Props {
  data: CaseDecisionMixItem[];
}

export function CaseDecisionMixPanel({ data }: Props) {
  if (data.length === 0) {
    return (
      <AnalyticsPanel
        title="Case Decision Mix"
        caption="Answers: how investigations are being resolved across the synthetic case portfolio."
        sourceNote="Source: cases.decision."
      >
        <p className="text-[13px] text-signal-meta">
          No case decisions found in the synthetic seed.
        </p>
      </AnalyticsPanel>
    );
  }

  const maxShare = Math.max(...data.map((d) => d.share));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <AnalyticsPanel
      title="Case Decision Mix"
      caption="Answers: how investigations are being resolved across the synthetic case portfolio."
      sourceNote="Source: cases.decision."
    >
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
          Total cases
        </span>
        <span className="tabular-nums text-[18px] font-semibold text-signal-ink">
          {total}
        </span>
      </div>

      <div className="space-y-4">
        {data.map((row) => (
          <HorizontalBarRow
            key={row.decision}
            label={row.label}
            value={row.count}
            share={row.share}
            maxShare={maxShare}
          />
        ))}
      </div>
    </AnalyticsPanel>
  );
}
