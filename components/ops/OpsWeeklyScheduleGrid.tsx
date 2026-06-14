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
      <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidian/50">
        <td
          colSpan={8}
          className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45"
        >
          {groupLabel}
        </td>
      </tr>
      {rows.map(({ member, assignmentsByDay }) => (
        <tr
          key={member.id}
          className="border-b border-ourox-obsidianMid/70 last:border-b-0"
        >
          <td className="px-2 py-2">
            <span className="block truncate text-[11px] font-medium text-ourox-ink">
              {member.name}
            </span>
          </td>
          {OPS_WEEKDAYS.map((day) => {
            const assignment = assignmentsByDay[day];
            if (!assignment) {
              return (
                <td key={day} className="px-0.5 py-1 text-center text-[10px] text-ourox-ink/30">
                  —
                </td>
              );
            }
            return (
              <td key={day} className="px-0.5 py-1">
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
    <div className="min-w-0 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Weekly schedule</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
          Planned shift and queue assignment for the week. Click a cell for full detail.
        </p>
      </div>

      <OpsWeeklyScheduleLegend />

      <div className="min-w-0 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="w-[14%] px-2 py-2 font-semibold">Person</th>
              {OPS_WEEKDAYS.map((day) => (
                <th key={day} className="px-0.5 py-2 text-center font-semibold">
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
