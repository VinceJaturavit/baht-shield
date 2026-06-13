import type { OpsIndividualKpi } from "@/lib/ops/kpi-types";
import { OpsRoleBadge } from "./OpsRoleBadge";
import { OpsKpiMetricBadge } from "./OpsKpiMetricBadge";

interface Props {
  kpis: OpsIndividualKpi[];
}

function RoleSection({
  label,
  rows,
}: {
  label: string;
  rows: OpsIndividualKpi[];
}) {
  if (rows.length === 0) return null;

  return (
    <>
      <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight/20">
        <td
          colSpan={8}
          className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45"
        >
          {label}
        </td>
      </tr>
      {rows.map((kpi) => (
        <tr key={kpi.memberId} className="border-b border-ourox-obsidianMid/70 last:border-b-0">
          <td className="px-2.5 py-2">
            <span className="block font-medium text-ourox-ink">{kpi.name}</span>
            <span className="mt-0.5 block">
              <OpsRoleBadge role={kpi.role} />
            </span>
          </td>
          <td className="px-2.5 py-2 text-[11px] text-ourox-ink/65">
            {kpi.streamsCovered.join(" · ")}
          </td>
          <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
            {kpi.rawHandledCases}
          </td>
          <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
            {kpi.weightedThroughput}
          </td>
          <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
            {kpi.slaComplianceRate}%
          </td>
          <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
            <span className="block text-[10px] text-ourox-ink/45">
              {kpi.primaryQualityMetricLabel}
            </span>
            {kpi.primaryQualityMetricValue}%
          </td>
          <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/80">
            <span className="block text-[10px] text-ourox-ink/45">
              {kpi.secondaryMetricLabel}
            </span>
            {kpi.secondaryMetricValue}%
          </td>
          <td className="px-2.5 py-2">
            <OpsKpiMetricBadge status={kpi.status} />
          </td>
        </tr>
      ))}
    </>
  );
}

export function OpsKpiIndividualView({ kpis }: Props) {
  const officers = kpis.filter((k) => k.role === "Officer");
  const contractors = kpis.filter((k) => k.role === "Contractor");

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
            <th className="w-[16%] px-2.5 py-2 font-semibold">Name / role</th>
            <th className="w-[10%] px-2.5 py-2 font-semibold">Streams</th>
            <th className="w-[8%] px-2.5 py-2 text-right font-semibold">Raw</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">Weighted</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">SLA</th>
            <th className="w-[14%] px-2.5 py-2 text-right font-semibold">Primary</th>
            <th className="w-[14%] px-2.5 py-2 text-right font-semibold">Secondary</th>
            <th className="w-[18%] px-2.5 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <RoleSection label="Officers — decision-bearing metrics" rows={officers} />
          <RoleSection label="Contractors — intake metrics" rows={contractors} />
        </tbody>
      </table>
    </div>
  );
}
