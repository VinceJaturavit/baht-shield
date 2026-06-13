import { OPS_STREAM_COMPLEXITY_WEIGHTS } from "@/lib/ops/kpi";

export function OpsKpiWeightingNote() {
  return (
    <div className="space-y-2 border-t border-ourox-obsidianMid pt-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        Complexity weighting
      </p>
      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="px-2.5 py-2 font-semibold">Stream</th>
              <th className="px-2.5 py-2 font-semibold">Weight</th>
              <th className="px-2.5 py-2 font-semibold">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {OPS_STREAM_COMPLEXITY_WEIGHTS.map(({ stream, weight, rationale }) => (
              <tr
                key={stream}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-2.5 py-2 font-mono text-[11px] font-bold text-ourox-orange">
                  {stream}
                </td>
                <td className="px-2.5 py-2 tabular-nums text-ourox-ink/80">x{weight}</td>
                <td className="px-2.5 py-2 text-[11px] text-ourox-ink/60">{rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] leading-relaxed text-ourox-ink/50">
        Weights are illustrative and synthetic. They make visible that a complex decision-bearing
        case should not be counted the same as routine intake.
      </p>
    </div>
  );
}
