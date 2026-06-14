"use client";

import { useEffect, useRef } from "react";
import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import type { OpsWeeklyAssignment } from "@/lib/ops/weekly-schedule-types";
import {
  formatCellDisplay,
  getQueueOwnershipStatus,
  getShiftCodeLabel,
  getTaskTagLabel,
} from "@/lib/ops/weekly-schedule";
import { OpsRoleBadge } from "./OpsRoleBadge";

interface Props {
  member: OpsTeamMemberWithLoad | null;
  assignment: OpsWeeklyAssignment | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ourox-obsidianMid/60 py-2 last:border-b-0">
      <span className="shrink-0 text-[11px] text-ourox-ink/50">{label}</span>
      <span className="text-right text-[11px] font-medium text-ourox-ink">{value}</span>
    </div>
  );
}

export function OpsWeeklyCellDetail({ member, assignment, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!assignment || !member) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [assignment, member, onClose]);

  if (!assignment || !member) return null;

  const ownershipStatus = getQueueOwnershipStatus(member.name, assignment.taskTag);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Weekly assignment for ${member.name} on ${assignment.day}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-ourox-obsidian shadow-2xl focus:outline-none"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ourox-obsidianMid px-5 py-3.5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-ourox-ink/50">
              Weekly assignment
            </p>
            <h2 className="mt-0.5 text-sm font-semibold text-ourox-ink">{member.name}</h2>
            <div className="mt-1">
              <OpsRoleBadge role={member.role} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-ourox-ink/50 transition hover:bg-ourox-obsidianMid hover:text-ourox-ink"
            aria-label="Close detail"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.207 3.793a1 1 0 010 1.414L9.414 8l2.793 2.793a1 1 0 01-1.414 1.414L8 9.414l-2.793 2.793a1 1 0 01-1.414-1.414L6.586 8 3.793 5.207a1 1 0 011.414-1.414L8 6.586l2.793-2.793a1 1 0 011.414 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-5 py-4">
          <DetailRow label="Day" value={assignment.day} />
          <DetailRow label="Shift" value={assignment.shiftName} />
          <DetailRow label="Shift code" value={getShiftCodeLabel(assignment.shiftCode)} />
          <DetailRow label="Cell display" value={formatCellDisplay(assignment)} />
          <DetailRow
            label="Assigned queue / task"
            value={`${assignment.taskTag} — ${getTaskTagLabel(assignment.taskTag)}`}
          />
          <DetailRow label="Ownership" value={ownershipStatus} />
          {assignment.note && <DetailRow label="Note" value={assignment.note} />}
        </div>
      </div>
    </>
  );
}
