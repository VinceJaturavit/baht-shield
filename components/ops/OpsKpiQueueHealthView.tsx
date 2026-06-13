import type { OpsQueueHealthKpi } from "@/lib/ops/kpi-types";
import { OpsKpiMetricBadge } from "./OpsKpiMetricBadge";

interface Props {
  kpis: OpsQueueHealthKpi[];
}

export function OpsKpiQueueHealthView({ kpis }: Props) {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
            <th className="w-[10%] px-2.5 py-2 font-semibold">Stream</th>
            <th className="w-[12%] px-2.5 py-2 text-right font-semibold">Open</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">At-risk</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">Breached</th>
            <th className="w-[14%] px-2.5 py-2 text-right font-semibold">SLA</th>
            <th className="w-[12%] px-2.5 py-2 text-right font-semibold">Breach rate</th>
            <th className="w-[14%] px-2.5 py-2 text-right font-semibold">Weighted backlog</th>
            <th className="w-[18%] px-2.5 py-2 font-semibold">Queue status</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.stream} className="border-b border-ourox-obsidianMid/70 last:border-b-0">
              <td className="px-2.5 py-2 font-mono text-[11px] font-bold text-ourox-orange">
                {kpi.stream}
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.openBacklog}
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.atRiskCount}
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.breachedCount}
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.slaComplianceRate}%
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.breachRate}%
              </td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
                {kpi.weightedBacklog}
              </td>
              <td className="px-2.5 py-2">
                <OpsKpiMetricBadge status={kpi.queueStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
