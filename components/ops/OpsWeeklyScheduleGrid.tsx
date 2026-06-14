"use client";

import { useMemo, useState } from "react";
import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import type { OpsWeeklyAssignment } from "@/lib/ops/weekly-schedule-types";
import { OPS_WEEKDAYS } from "@/lib/ops/weekly-schedule-types";
import {
  getWeeklyCoverageByDay,
  getWeeklyGridRows,
} from "@/lib/ops/weekly-schedule";
import { OPS_WEEKLY_ASSIGNMENTS } from "@/data/ops/ops-weekly-schedule";
import { OpsScheduleCell } from "./OpsScheduleCell";
import { OpsWeeklyScheduleLegend } from "./OpsWeeklyScheduleLegend";
import { OpsWeeklyCoverageSummary } from "./OpsWeeklyCoverageSummary";
import { OpsWeeklyCellDetail } from "./OpsWeeklyCellDetail";

interface Props {
  fraudAnalysts: OpsTeamMemberWithLoad[];
  juniorAnalysts: OpsTeamMemberWithLoad[];
  teamWithLoad: OpsTeamMemberWithLoad[];
}

interface SelectedCell {
  member: OpsTeamMemberWithLoad;
  assignment: OpsWeeklyAssignment;
}

function ScheduleGroupTable({
  groupLabel,
  rows,
  onCellClick,
}: {
  groupLabel: string;
  rows: ReturnType<typeof getWeeklyGridRows>;
  onCellClick: (member: OpsTeamMemberWithLoad, assignment: OpsWeeklyAssignment) => void;
}) {
  if (rows.length === 0) return null;

  return (
    <>
      <tr>
        <td
          colSpan={8}
          className="border-y border-ourox-obsidianMid/80 bg-ourox-obsidian/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40"
        >
          {groupLabel}
        </td>
      </tr>
      {rows.map(({ member, assignmentsByDay }) => (
        <tr
          key={member.id}
          className="border-b border-ourox-obsidianMid/50 last:border-b-0"
        >
          <td className="px-2 py-1">
            <span className="block truncate text-[10px] font-medium text-ourox-ink/85">
              {member.name}
            </span>
          </td>
          {OPS_WEEKDAYS.map((day) => {
            const assignment = assignmentsByDay[day];
            if (!assignment) {
              return (
                <td key={day} className="px-0.5 py-0.5 text-center text-[10px] text-ourox-ink/25">
                  —
                </td>
              );
            }
            return (
              <td key={day} className="px-0.5 py-0.5">
                <OpsScheduleCell
                  assignment={assignment}
                  onClick={() => onCellClick(member, assignment)}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

export function OpsWeeklyScheduleGrid({
  fraudAnalysts,
  juniorAnalysts,
  teamWithLoad,
}: Props) {
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  const coverageDays = useMemo(
    () => getWeeklyCoverageByDay(teamWithLoad, OPS_WEEKLY_ASSIGNMENTS),
    [teamWithLoad],
  );

  const fraudRows = useMemo(
    () => getWeeklyGridRows(fraudAnalysts),
    [fraudAnalysts],
  );
  const juniorRows = useMemo(
    () => getWeeklyGridRows(juniorAnalysts),
    [juniorAnalysts],
  );

  const handleCellClick = (
    member: OpsTeamMemberWithLoad,
    assignment: OpsWeeklyAssignment,
  ) => {
    setSelected({ member, assignment });
  };

  return (
    <div className="min-w-0 space-y-3">
      <OpsWeeklyScheduleLegend />

      <div className="min-w-0 overflow-hidden border border-ourox-obsidianMid/70 bg-ourox-obsidian/15">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid/80 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[13%] px-2 py-1.5 font-semibold">Person</th>
              {OPS_WEEKDAYS.map((day) => (
                <th key={day} className="px-0.5 py-1.5 text-center font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ScheduleGroupTable
              groupLabel="Fraud Analysts"
              rows={fraudRows}
              onCellClick={handleCellClick}
            />
            <ScheduleGroupTable
              groupLabel="Junior Analysts"
              rows={juniorRows}
              onCellClick={handleCellClick}
            />
          </tbody>
        </table>
      </div>

      <OpsWeeklyCoverageSummary days={coverageDays} />

      <OpsWeeklyCellDetail
        member={selected?.member ?? null}
        assignment={selected?.assignment ?? null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
