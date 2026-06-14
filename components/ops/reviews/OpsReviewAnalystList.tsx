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
      <h3 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-xs font-semibold uppercase tracking-wide text-ourox-ink/60">
        {groupLabel}
      </h3>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[11px] font-semibold uppercase tracking-wide text-ourox-ink/45">
              <th className="w-[14%] px-3 py-2 font-semibold">Name</th>
              <th className="w-[14%] px-3 py-2 font-semibold">Role</th>
              <th className="w-[14%] px-3 py-2 font-semibold">Streams</th>
              <th className="w-[46%] px-3 py-2 font-semibold">Headline</th>
              <th className="w-[12%] px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {analysts.map((analyst) => (
              <tr
                key={analyst.analystId}
                className="border-b border-ourox-obsidianMid/60 last:border-b-0"
              >
                <td className="px-3 py-2">
                  <span className="block truncate text-xs font-medium text-ourox-ink">
                    {analyst.name}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-ourox-ink/60">{analyst.role}</td>
                <td className="px-3 py-2 text-xs text-ourox-ink/60">
                  {analyst.streamsCovered.join(", ")}
                </td>
                <td className="px-3 py-2 text-xs leading-snug text-ourox-ink/70">
                  {getHeadline(analyst)}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onOpenReview(analyst.analystId)}
                    className="rounded border border-ourox-orange/40 bg-ourox-orange/[0.08] px-2.5 py-1 text-xs font-medium text-ourox-ink hover:bg-ourox-orange/[0.14] focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
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
