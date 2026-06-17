import { TRACE_BOUNDARY } from "@/lib/trace/boundary";

export function TraceBoundaryDrawer() {
  return (
    <details className="rounded border border-trace-border bg-trace-card">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-trace-primary hover:bg-trace-muted transition-colors">
        What Ourox Trace is / is not
      </summary>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-trace-border border-t border-trace-border">
        <div className="px-3 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-trace-primary mb-2">
            Ourox Trace is
          </h3>
          <ul className="space-y-1">
            {TRACE_BOUNDARY.isList.map((item) => (
              <li key={item} className="text-xs text-trace-body leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-3 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-trace-secondary mb-2">
            Ourox Trace is not
          </h3>
          <ul className="space-y-1">
            {TRACE_BOUNDARY.isNotList.map((item) => (
              <li key={item} className="text-xs text-trace-secondary leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-trace-border px-3 py-2 bg-trace-muted">
        <p className="text-xs text-trace-body">{TRACE_BOUNDARY.syntheticNotice}</p>
      </div>
    </details>
  );
}
