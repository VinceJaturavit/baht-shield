"use client";

// ArbiterSectionNav — secondary nav tab strip within the Arbiter section.
// Connects /arbiter (Scoring) ↔ /arbiter/tuning (Tuning) ↔ /arbiter/model (Model) ↔ /arbiter/feedback (Feedback).
// Placed below the page header, above the synthetic banner.

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/arbiter",
    label: "Scoring",
    description: "Event decisions",
  },
  {
    href: "/arbiter/tuning",
    label: "Tuning",
    description: "Threshold tradeoffs",
  },
  {
    href: "/arbiter/model",
    label: "Model",
    description: "ML vs rules",
  },
  {
    href: "/arbiter/feedback",
    label: "Feedback",
    description: "Closing the loop",
  },
] as const;

export function ArbiterSectionNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 border-b border-ourox-obsidianMid pb-0">
      {TABS.map(({ href, label, description }) => {
        const active =
          href === "/arbiter"
            ? pathname === "/arbiter"
            : pathname?.startsWith(href) ?? false;

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            title={description}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian rounded-t ${
              active
                ? "text-ourox-orange after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-ourox-orange after:rounded-t"
                : "text-ourox-ink/50 hover:text-ourox-ink/80 hover:bg-ourox-obsidianLight"
            }`}
          >
            {label}
            <span
              className={`hidden text-xs sm:inline ${
                active ? "text-ourox-orange/60" : "text-ourox-ink/30"
              }`}
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
