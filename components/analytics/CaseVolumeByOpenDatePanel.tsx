import { AnalyticsPanel } from "./AnalyticsPanel";
import type { CaseOpenDateBucket } from "@/lib/analytics";

interface Props {
  data: CaseOpenDateBucket[];
}

export function CaseVolumeByOpenDatePanel({ data }: Props) {
  if (data.length === 0) {
    return (
      <AnalyticsPanel
        title="Case Volume by Open Date"
        caption="Answers: how synthetic case intake changes over the case-open period."
        sourceNote="Source: cases.opened_at. Transactions do not contain timestamps in this synthetic seed."
      >
        <p className="text-[13px] text-signal-meta">
          No valid case.opened_at values found.
        </p>
      </AnalyticsPanel>
    );
  }

  const maxCount = Math.max(...data.map((b) => b.count), 1);

  return (
    <AnalyticsPanel
      title="Case Volume by Open Date"
      caption="Answers: how synthetic case intake changes over the case-open period."
      sourceNote="Source: cases.opened_at. Transactions do not contain timestamps in this synthetic seed."
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
        Cases opened over the synthetic period — by case open date
      </p>

      <div className="space-y-2">
        {data.map((bucket) => {
          const pct = Math.round((bucket.count / maxCount) * 100);
          return (
            <div key={bucket.start_date} className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="shrink-0 tabular-nums text-[12px] text-signal-slate w-24">
                  {bucket.label}
                </span>
                <span className="tabular-nums text-[13px] font-medium text-signal-ink">
                  {bucket.count}
                </span>
              </div>
              <div
                className="h-1.5 w-full rounded-full bg-signal-borderSubtle"
                role="presentation"
                aria-hidden="true"
              >
                <div
                  className="h-1.5 rounded-full bg-signal-indigo"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsPanel>
  );
}
