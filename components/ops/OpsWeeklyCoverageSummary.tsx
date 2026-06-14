import type { OpsWeeklyCoverageDay } from "@/lib/ops/weekly-schedule-types";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  days: OpsWeeklyCoverageDay[];
}

export function OpsWeeklyCoverageSummary({ days }: Props) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Weekly coverage</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
          The schedule&apos;s job is to keep decision authority and intake capacity present every
          day. Tight-SLA streams such as RFR, LAR, and PRO need clean coverage and explicit
          handoffs so work does not stall across shift boundaries.
        </p>
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="w-[10%] px-2 py-2 font-semibold">Day</th>
              <th className="w-[16%] px-2 py-2 font-semibold">Status</th>
              <th className="w-[12%] px-2 py-2 font-semibold">Fraud Analysts</th>
              <th className="w-[12%] px-2 py-2 font-semibold">Junior Analysts</th>
              <th className="w-[10%] px-2 py-2 font-semibold">Handoffs</th>
              <th className="w-[40%] px-2 py-2 font-semibold">Authority / Intake</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr
                key={day.day}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-2 py-2 font-medium text-ourox-ink">{day.day}</td>
                <td className="px-2 py-2">
                  <OpsIndicatorLabel
                    label={day.status}
                    tone={day.status === "Covered" ? "good" : "risk"}
                    detail={day.gapReason}
                  />
                </td>
                <td className="px-2 py-2 text-[11px] text-ourox-ink/70">
                  {day.fraudAnalystCount}
                </td>
                <td className="px-2 py-2 text-[11px] text-ourox-ink/70">
                  {day.juniorAnalystCount}
                </td>
                <td className="px-2 py-2 text-[11px] text-ourox-ink/70">
                  {day.handoffCount}
                </td>
                <td className="px-2 py-2">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
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
