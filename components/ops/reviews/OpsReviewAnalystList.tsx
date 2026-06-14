import type { OpsReviewPack } from "@/lib/ops/reviews-types";

interface Props {
  groupLabel: string;
  analysts: OpsReviewPack[];
  getHeadline: (pack: OpsReviewPack) => string;
  onOpenReview: (analystId: string) => void;
}

export function OpsReviewAnalystList({
  groupLabel,
  analysts,
  getHeadline,
  onOpenReview,
}: Props) {
  if (analysts.length === 0) return null;

  return (
    <div className="min-w-0 space-y-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        {groupLabel}
      </h3>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[14%] px-2 py-1.5 font-semibold">Name</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Role</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Streams</th>
              <th className="w-[46%] px-2 py-1.5 font-semibold">Headline</th>
              <th className="w-[12%] px-2 py-1.5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {analysts.map((analyst) => (
              <tr
                key={analyst.analystId}
                className="border-b border-ourox-obsidianMid/60 last:border-b-0"
              >
                <td className="px-2 py-1.5">
                  <span className="block truncate text-[11px] font-medium text-ourox-ink">
                    {analyst.name}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">{analyst.role}</td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">
                  {analyst.streamsCovered.join(", ")}
                </td>
                <td className="px-2 py-1.5 text-[10px] leading-snug text-ourox-ink/60">
                  {getHeadline(analyst)}
                </td>
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenReview(analyst.analystId)}
                    className="rounded border border-ourox-obsidianMid bg-ourox-obsidian/30 px-2 py-1 text-[10px] font-medium text-ourox-ink/75 hover:border-ourox-orange/35 hover:bg-ourox-orange/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
                  >
                    Open review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
