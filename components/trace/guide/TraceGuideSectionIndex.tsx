import Link from "next/link";
import { TRACE_GUIDE_NAV, TRACE_GUIDE_SECTIONS } from "@/lib/trace/trace-guide-content";

export function TraceGuideSectionIndex() {
  return (
    <aside className="shrink-0 lg:w-52 lg:sticky lg:top-8 lg:self-start">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-trace-secondary">
        Reviewer guide
      </p>
      <nav aria-label="Trace guide sections">
        <ol className="space-y-1">
          {TRACE_GUIDE_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded px-2 py-1 text-xs text-trace-secondary transition-colors hover:bg-trace-muted hover:text-trace-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-6 space-y-2 border-t border-trace-border pt-5">
        <Link
          href={TRACE_GUIDE_NAV.backToTrace.href}
          className="block text-xs text-trace-secondary transition-colors hover:text-trace-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
        >
          {TRACE_GUIDE_NAV.backToTrace.label}
        </Link>
        <Link
          href={TRACE_GUIDE_NAV.openCaseWorkflow.href}
          className="block text-xs text-trace-secondary transition-colors hover:text-trace-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
        >
          {TRACE_GUIDE_NAV.openCaseWorkflow.label}
        </Link>
      </div>
    </aside>
  );
}
