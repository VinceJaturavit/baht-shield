import type { OpsLoadStatus, OpsTeamMemberWithLoad } from "@/lib/ops/roster-types";
import { getLoadStatus } from "@/lib/ops/roster";

const LOAD_STATUS_STYLES: Record<
  OpsLoadStatus,
  { text: string; indicator: string }
> = {
  "On track": {
    text: "text-ourox-ink/70",
    indicator: "bg-ourox-yellow/70",
  },
  "Near capacity": {
    text: "text-ourox-orange",
    indicator: "bg-ourox-orange",
  },
  Overloaded: {
    text: "text-red-300/90",
    indicator: "bg-red-500",
  },
  "Off shift": {
    text: "text-ourox-ink/45",
    indicator: "bg-ourox-ink/25",
  },
};

interface Props {
  member: OpsTeamMemberWithLoad;
}

export function OpsRosterLoadBar({ member }: Props) {
  const loadStatus = getLoadStatus(member, member.currentLoad);
  const statusStyles = LOAD_STATUS_STYLES[loadStatus];
  const isOfficer = member.role === "Officer";
  const protectedReserve = member.protectedCapacityReserve ?? 0;
  const totalCapacity = member.capacity;
  const assignmentCapacity = member.assignmentCapacity;
  const currentLoad = member.currentLoad;

  const assignedPct =
    totalCapacity > 0 ? Math.min((currentLoad / totalCapacity) * 100, 100) : 0;
  const protectedPct =
    totalCapacity > 0 ? (protectedReserve / totalCapacity) * 100 : 0;
  const overloadPct =
    isOfficer && currentLoad > assignmentCapacity
      ? Math.min(((currentLoad - assignmentCapacity) / totalCapacity) * 100, 20)
      : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] tabular-nums">
        <span className="font-medium text-ourox-ink/85">
          {currentLoad} / {isOfficer ? `${assignmentCapacity} assignment` : totalCapacity}
        </span>
        {isOfficer && (
          <span className="text-ourox-ink/45">
            {totalCapacity} total · {protectedReserve} protected
          </span>
        )}
      </div>

      <div
        className="flex h-2 w-full max-w-[10rem] overflow-hidden rounded-sm bg-ourox-obsidianLight/50"
        role="img"
        aria-label={
          isOfficer
            ? `Load ${currentLoad} of ${assignmentCapacity} assignment capacity, ${protectedReserve} protected reserve`
            : `Load ${currentLoad} of ${totalCapacity} capacity`
        }
      >
        {assignedPct > 0 && (
          <div
            className={`h-full shrink-0 ${
              member.isOverloaded ? "bg-red-500/80" : "bg-ourox-yellow/70"
            }`}
            style={{ width: `${assignedPct}%` }}
          />
        )}
        {isOfficer && protectedPct > 0 && (
          <div
            className="h-full shrink-0 border-l border-ourox-obsidianMid/80 bg-ourox-orange/25"
            style={{ width: `${protectedPct}%` }}
            title="Protected reserve"
          />
        )}
        {overloadPct > 0 && (
          <div
            className="h-full shrink-0 bg-red-500"
            style={{ width: `${overloadPct}%` }}
          />
        )}
      </div>

      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${statusStyles.text}`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyles.indicator}`}
          aria-hidden="true"
        />
        {loadStatus}
      </span>
    </div>
  );
}
