import type { OpsPerformanceRow } from "@/lib/ops/performance-types";
import { OpsIndicatorLabel, type OpsIndicatorTone } from "./OpsIndicatorLabel";

interface Props {
  groupLabel: string;
  rows: OpsPerformanceRow[];
}

function performanceTone(status: OpsPerformanceRow["status"]): OpsIndicatorTone {
  switch (status) {
    case "Needs review":
      return "risk";
    case "Watch":
      return "watch";
    default:
      return "good";
  }
}

function PerformanceGroupTable({ groupLabel, rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        {groupLabel}
      </h4>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[14%] px-2 py-1.5 font-semibold">Analyst</th>
              <th className="w-[12%] px-2 py-1.5 font-semibold">Role</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">Raw vol.</th>
              <th className="w-[10%] px-2 py-1.5 font-semibold">Weighted</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">QA qual.</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">SLA</th>
              <th className="w-[13%] px-2 py-1.5 font-semibold">{rows[0]?.roleMetricOneLabel}</th>
              <th className="w-[13%] px-2 py-1.5 font-semibold">{rows[0]?.roleMetricTwoLabel}</th>
              <th className="w-[11%] px-2 py-1.5 font-semibold">Read</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.analystId}
                className="border-b border-ourox-obsidianMid/60 last:border-b-0"
              >
                <td className="px-2 py-1.5">
                  <span className="block truncate text-[11px] font-medium text-ourox-ink">
                    {row.analystName}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">{row.role}</td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.rawHandledCases}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.weightedThroughput.toFixed(1)}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.qaQualityScore.toFixed(1)}%
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.slaComplianceRate.toFixed(1)}%
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.roleMetricOneValue}%
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.roleMetricTwoValue}%
                </td>
                <td className="px-2 py-1.5">
                  <OpsIndicatorLabel
                    label={row.status}
                    tone={performanceTone(row.status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TableProps {
  fraudAnalysts: OpsPerformanceRow[];
  juniorAnalysts: OpsPerformanceRow[];
}

export function OpsPerformanceTable({ fraudAnalysts, juniorAnalysts }: TableProps) {
  return (
    <div className="space-y-4">
      <PerformanceGroupTable groupLabel="Fraud Analysts" rows={fraudAnalysts} />
      <PerformanceGroupTable groupLabel="Junior Analysts" rows={juniorAnalysts} />
    </div>
  );
}
