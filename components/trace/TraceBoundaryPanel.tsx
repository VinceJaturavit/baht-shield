import { TRACE_BOUNDARY } from "@/lib/trace/boundary";

export function TraceBoundaryPanel() {
  return (
    <section className="border border-trace-border rounded-lg overflow-hidden bg-trace-card">
      <div className="px-4 py-3 border-b border-trace-border bg-trace-surface">
        <h2 className="text-sm font-semibold text-trace-heading">Product boundary</h2>
        <p className="mt-1 text-xs text-trace-secondary">{TRACE_BOUNDARY.tagline}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-trace-border">
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-trace-primary mb-2">
            Ourox Trace is
          </h3>
          <ul className="space-y-1.5">
            {TRACE_BOUNDARY.isList.map((item) => (
              <li key={item} className="text-xs text-trace-body leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-trace-secondary mb-2">
            Ourox Trace is not
          </h3>
          <ul className="space-y-1.5">
            {TRACE_BOUNDARY.isNotList.map((item) => (
              <li key={item} className="text-xs text-trace-secondary leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-trace-border bg-trace-muted">
        <p className="text-xs font-medium text-trace-obsidian">{TRACE_BOUNDARY.syntheticNotice}</p>
        <p className="mt-2 text-xs text-trace-body">{TRACE_BOUNDARY.aiRoleStatement}</p>
      </div>
    </section>
  );
}
