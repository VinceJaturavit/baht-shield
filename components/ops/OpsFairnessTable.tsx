import type { OpsAnalystFairnessRow } from "@/lib/ops/fairness-types";
import { OpsFairnessBar } from "./OpsFairnessBar";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  groupLabel: string;
  rows: OpsAnalystFairnessRow[];
}

function loadTone(tag: OpsAnalystFairnessRow["loadTag"]) {
  switch (tag) {
    case "Over-loaded":
      return "watch" as const;
    case "Under-loaded":
      return "neutral" as const;
    default:
      return "good" as const;
  }
}

function FairnessGroupTable({ groupLabel, rows }: Props) {
  if (rows.length === 0) return null;

  const maxScale = Math.max(...rows.map((r) => r.weeklyWeightedDifficulty), rows[0]?.roleAverage ?? 0);

  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        {groupLabel}
      </h4>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[18%] px-2 py-1.5 font-semibold">Analyst</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Role</th>
              <th className="w-[12%] px-2 py-1.5 font-semibold">Difficulty</th>
              <th className="w-[28%] px-2 py-1.5 font-semibold">Vs role average</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Load tag</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Assigned days</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.memberId}
                className="border-b border-ourox-obsidianMid/60 last:border-b-0"
              >
                <td className="px-2 py-1.5">
                  <span className="block truncate text-[11px] font-medium text-ourox-ink">
                    {row.name}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">{row.role}</td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.weeklyWeightedDifficulty.toFixed(1)}
                </td>
                <td className="px-2 py-1.5">
                  <OpsFairnessBar
                    value={row.weeklyWeightedDifficulty}
                    roleAverage={row.roleAverage}
                    maxScale={maxScale}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <OpsIndicatorLabel label={row.loadTag} tone={loadTone(row.loadTag)} />
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/60">
                  {row.assignedDays}
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
  fraudAnalysts: OpsAnalystFairnessRow[];
  juniorAnalysts: OpsAnalystFairnessRow[];
}

export function OpsFairnessTable({ fraudAnalysts, juniorAnalysts }: TableProps) {
  return (
    <div className="space-y-4">
      <FairnessGroupTable groupLabel="Fraud Analysts" rows={fraudAnalysts} />
      <FairnessGroupTable groupLabel="Junior Analysts" rows={juniorAnalysts} />
    </div>
  );
}
