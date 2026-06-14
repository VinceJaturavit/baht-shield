"use client";

import type { OpsWeeklyAssignment } from "@/lib/ops/weekly-schedule-types";
import { formatCellDisplay, isWorkingShift } from "@/lib/ops/weekly-schedule";

interface Props {
  assignment: OpsWeeklyAssignment;
  onClick: () => void;
}

export function OpsScheduleCell({ assignment, onClick }: Props) {
  const display = formatCellDisplay(assignment);
  const isOff = !isWorkingShift(assignment.shiftCode);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-sm px-0.5 py-1 text-center text-[10px] font-medium leading-tight transition hover:bg-ourox-obsidianMid/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-ourox-yellow/50 ${
        isOff
          ? "text-ourox-ink/35"
          : assignment.shiftCode === "N"
            ? "text-ourox-orange/90"
            : "text-ourox-ink/75"
      }`}
      aria-label={`${assignment.day}: ${display}`}
    >
      {display}
    </button>
  );
}
