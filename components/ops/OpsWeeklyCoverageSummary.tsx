import type { OpsWeeklyCoverageDay } from "@/lib/ops/weekly-schedule-types";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  days: OpsWeeklyCoverageDay[];
}

export function OpsWeeklyCoverageSummary({ days }: Props) {
  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
        Weekly coverage
      </h4>

      <div className="min-w-0 overflow-hidden border border-ourox-obsidianMid/70 bg-ourox-obsidian/15">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid/80 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[9%] px-2 py-1.5 font-semibold">Day</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Status</th>
              <th className="w-[11%] px-2 py-1.5 font-semibold">Fraud</th>
              <th className="w-[11%] px-2 py-1.5 font-semibold">Junior</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">Handoffs</th>
              <th className="w-[46%] px-2 py-1.5 font-semibold">Authority / Intake</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr
                key={day.day}
                className="border-b border-ourox-obsidianMid/50 last:border-b-0"
              >
                <td className="px-2 py-1.5 text-[11px] font-medium text-ourox-ink/80">
                  {day.day}
                </td>
                <td className="px-2 py-1.5">
                  <OpsIndicatorLabel
                    label={day.status}
                    tone={day.status === "Covered" ? "good" : "risk"}
                    detail={day.gapReason}
                  />
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[10px] text-ourox-ink/55">
                  {day.fraudAnalystCount}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[10px] text-ourox-ink/55">
                  {day.juniorAnalystCount}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[10px] text-ourox-ink/55">
                  {day.handoffCount}
                </td>
                <td className="px-2 py-1.5">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <OpsIndicatorLabel
                      label={day.hasDecisionAuthority ? "Authority" : "No authority"}
                      tone={day.hasDecisionAuthority ? "good" : "risk"}
                    />
                    <OpsIndicatorLabel
                      label={day.hasIntakeCoverage ? "Intake" : "No intake"}
                      tone={day.hasIntakeCoverage ? "good" : "risk"}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
