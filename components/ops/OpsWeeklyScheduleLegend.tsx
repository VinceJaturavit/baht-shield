import { getShiftCodeLabel, getTaskTagLabel } from "@/lib/ops/weekly-schedule";
import type { OpsShiftCode, OpsWeeklyTaskTag } from "@/lib/ops/weekly-schedule-types";

const SHIFT_CODES: OpsShiftCode[] = ["D", "E", "N", "OFF", "LEAVE"];

const TASK_TAGS: OpsWeeklyTaskTag[] = [
  "RFR",
  "LAR",
  "PRO",
  "DSP",
  "PRF",
  "Urgent",
  "QA",
  "Handoff",
];

export function OpsWeeklyScheduleLegend() {
  return (
    <div className="space-y-2 rounded-lg border border-ourox-obsidianMid/70 bg-ourox-obsidian/20 px-3 py-2.5">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
          Shifts
        </span>
        {SHIFT_CODES.map((code) => (
          <span key={code} className="text-[10px] text-ourox-ink/55">
            <span className="font-medium text-ourox-ink/70">{code}</span>
            {" = "}
            {getShiftCodeLabel(code)}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
          Tasks
        </span>
        {TASK_TAGS.map((tag) => (
          <span key={tag} className="text-[10px] text-ourox-ink/55">
            <span className="font-medium text-ourox-ink/70">{tag}</span>
            {" = "}
            {getTaskTagLabel(tag)}
          </span>
        ))}
      </div>
    </div>
  );
}
