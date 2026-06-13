import type { OpsTeamKpiSummary } from "@/lib/ops/kpi-types";

interface Props {
  summary: OpsTeamKpiSummary;
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <tr className="border-b border-ourox-obsidianMid/70 last:border-b-0">
      <td className="px-2.5 py-2 text-ourox-ink/70">{label}</td>
      <td className="px-2.5 py-2 text-right tabular-nums font-medium text-ourox-ink">{value}</td>
    </tr>
  );
}

export function OpsKpiTeamView({ summary }: Props) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full border-collapse text-left text-xs">
          <tbody>
            <MetricRow label="Total active backlog" value={summary.totalOpenCases} />
            <MetricRow label="Closed / handled cases" value={summary.totalClosedCases} />
            <MetricRow
              label="Complexity-weighted throughput"
              value={summary.weightedThroughput}
            />
            <MetricRow label="SLA compliance" value={`${summary.slaComplianceRate}%`} />
            <MetricRow label="Breach rate" value={`${summary.breachRate}%`} />
            <MetricRow label="At-risk count" value={summary.atRiskCount} />
            <MetricRow label="Overloaded team members" value={summary.overloadedPeopleCount} />
          </tbody>
        </table>
      </div>
      <p className="text-[11px] leading-relaxed text-ourox-ink/50">
        RFR and LAR carry higher weight than DSP and PRF intake because they involve
        decision-bearing, deadline-sensitive work.
      </p>
    </div>
  );
}
