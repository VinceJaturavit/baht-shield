import { TRACE_BOUNDARY } from "@/lib/trace/boundary";

export function TraceBoundaryBanner() {
  return (
    <div className="rounded border border-trace-border bg-trace-surface px-3 py-2">
      <p className="text-xs text-trace-body leading-relaxed">{TRACE_BOUNDARY.compactBanner}</p>
    </div>
  );
}
