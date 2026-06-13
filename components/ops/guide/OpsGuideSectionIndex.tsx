import Link from "next/link";
import { OPS_GUIDE_SECTIONS } from "./ops-guide-sections";

export function OpsGuideSectionIndex() {
  return (
    <aside className="shrink-0 lg:w-52 lg:sticky lg:top-8 lg:self-start">
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-ink/40"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Ops Guide
      </p>
      <nav aria-label="Ops guide sections">
        <ol className="space-y-1">
          {OPS_GUIDE_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-baseline gap-2 rounded px-2 py-1 text-xs text-ourox-ink/50 transition-colors hover:bg-ourox-obsidianMid hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
              >
                <span className="shrink-0 font-mono text-ourox-orange/60">{s.number}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-6 border-t border-ourox-obsidianMid pt-5">
        <Link
          href="/ops"
          className="flex items-center gap-1.5 rounded text-xs text-ourox-ink/40 transition-colors hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M11.5 7h-9M6.5 10.5 3 7l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Ops
        </Link>
      </div>
    </aside>
  );
}
