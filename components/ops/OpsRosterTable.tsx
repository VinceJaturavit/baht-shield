import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import { OpsRoleBadge } from "./OpsRoleBadge";
import { OpsAttendanceBadge } from "./OpsAttendanceBadge";
import { OpsRosterLoadBar } from "./OpsRosterLoadBar";

interface Props {
  members: OpsTeamMemberWithLoad[];
  groupLabel: "Officers" | "Contractors";
}

export function OpsRosterTable({ members, groupLabel }: Props) {
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ourox-ink/50">
        {groupLabel}
      </h3>
      <div className="overflow-x-auto rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Role</th>
              <th className="px-3 py-2 font-semibold">Streams</th>
              <th className="px-3 py-2 font-semibold">Load / capacity</th>
              <th className="px-3 py-2 font-semibold">Shift</th>
              <th className="px-3 py-2 font-semibold">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-3 py-2.5 font-medium text-ourox-ink">{member.name}</td>
                <td className="px-3 py-2.5">
                  <OpsRoleBadge role={member.role} />
                </td>
                <td className="px-3 py-2.5 text-ourox-ink/70">
                  {member.streamsCovered.join(" · ")}
                </td>
                <td className="px-3 py-2.5">
                  <OpsRosterLoadBar member={member} />
                </td>
                <td className="px-3 py-2.5 text-ourox-ink/70">{member.shift}</td>
                <td className="px-3 py-2.5">
                  <OpsAttendanceBadge attendance={member.attendance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
