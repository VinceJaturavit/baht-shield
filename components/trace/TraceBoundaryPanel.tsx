import { TRACE_BOUNDARY } from "@/lib/trace/boundary";

export function TraceBoundaryPanel() {
  return (
    <section className="border border-ourox-obsidianMid rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-ourox-obsidianMid bg-ourox-obsidianLight">
        <h2 className="text-sm font-semibold text-ourox-ink">Product boundary</h2>
        <p className="mt-1 text-xs text-ourox-ink/60">{TRACE_BOUNDARY.tagline}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ourox-obsidianMid">
        <div className="px-4 py-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ourox-orange mb-2">
            Ourox Trace is
          </h3>
          <ul className="space-y-1.5">
            {TRACE_BOUNDARY.isList.map((item) => (
              <li key={item} className="text-xs text-ourox-ink/80 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ourox-ink/50 mb-2">
            Ourox Trace is not
          </h3>
          <ul className="space-y-1.5">
            {TRACE_BOUNDARY.isNotList.map((item) => (
              <li key={item} className="text-xs text-ourox-ink/60 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-ourox-obsidianMid bg-ourox-obsidianLight/50">
        <p className="text-xs text-ourox-yellow/90">{TRACE_BOUNDARY.syntheticNotice}</p>
        <p className="mt-2 text-xs text-ourox-ink/60">{TRACE_BOUNDARY.aiRoleStatement}</p>
      </div>
    </section>
  );
}
