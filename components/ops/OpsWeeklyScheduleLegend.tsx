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
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ourox-obsidianMid/50 pb-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/35">
        Shifts
      </span>
      {SHIFT_CODES.map((code) => (
        <span key={code} className="text-[10px] text-ourox-ink/45">
          <span className="font-medium text-ourox-ink/60">{code}</span>
          {" · "}
          {getShiftCodeLabel(code)}
        </span>
      ))}
      <span className="mx-1 hidden h-3 w-px bg-ourox-obsidianMid sm:inline" aria-hidden="true" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/35">
        Tasks
      </span>
      {TASK_TAGS.map((tag) => (
        <span key={tag} className="text-[10px] text-ourox-ink/45">
          <span className="font-medium text-ourox-ink/60">{tag}</span>
          {" · "}
          {getTaskTagLabel(tag)}
        </span>
      ))}
    </div>
  );
}
