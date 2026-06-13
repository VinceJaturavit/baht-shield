import type { OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import { OpsRoleBadge } from "./OpsRoleBadge";
import { OpsAttendanceBadge } from "./OpsAttendanceBadge";
import { OpsRosterLoadBar } from "./OpsRosterLoadBar";

interface Props {
  members: OpsTeamMemberWithLoad[];
  groupLabel: "Fraud Analysts" | "Junior Analysts";
  caption?: string;
}

export function OpsRosterTable({ members, groupLabel, caption }: Props) {
  if (members.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ourox-ink/50">
          {groupLabel}
        </h3>
        {caption && (
          <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
            {caption}
          </p>
        )}
      </div>
      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="w-[22%] px-2.5 py-2 font-semibold">Name</th>
              <th className="w-[18%] px-2.5 py-2 font-semibold">Streams</th>
              <th className="w-[28%] px-2.5 py-2 font-semibold">Load</th>
              <th className="w-[32%] px-2.5 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-2.5 py-2">
                  <span className="block font-medium text-ourox-ink">{member.name}</span>
                  <span className="mt-0.5 block">
                    <OpsRoleBadge role={member.role} />
                  </span>
                </td>
                <td className="px-2.5 py-2">
                  <span className="text-[11px] text-ourox-ink/70">
                    {member.streamsCovered.join(" · ")}
                  </span>
                </td>
                <td className="px-2.5 py-2">
                  <OpsRosterLoadBar member={member} compact />
                </td>
                <td className="px-2.5 py-2">
                  <span className="block text-[11px] text-ourox-ink/70">{member.shift}</span>
                  <span className="mt-0.5 block">
                    <OpsAttendanceBadge attendance={member.attendance} />
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
