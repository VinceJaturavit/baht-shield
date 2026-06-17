"use client";

import type { TraceTab } from "@/lib/trace/types";

const TABS: { id: TraceTab; label: string; description: string }[] = [
  {
    id: "vendor-evidence",
    label: "Vendor evidence",
    description: "Read-only synthetic vendor export",
  },
  {
    id: "frozen-pool",
    label: "Frozen pool",
    description: "Co-mingled ledger",
  },
  {
    id: "method-comparison",
    label: "Method comparison",
    description: "FIFO / LIFO / LIBR / pro-rata",
  },
  {
    id: "victim-attribution",
    label: "Victim attribution",
    description: "Claimant allocation table",
  },
  {
    id: "evidence-package",
    label: "Evidence package",
    description: "Read-only summary",
  },
  {
    id: "review-audit",
    label: "Review and audit",
    description: "Reviewer gate and trail",
  },
];

interface TraceTabsProps {
  activeTab: TraceTab;
  onTabChange: (tab: TraceTab) => void;
}

export function TraceTabs({ activeTab, onTabChange }: TraceTabsProps) {
  return (
    <nav
      className="flex flex-wrap gap-1 border-b border-ourox-obsidianMid pb-px"
      aria-label="Case workspace sections"
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        const isCentrepiece = tab.id === "method-comparison";
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-current={active ? "page" : undefined}
            className={`rounded-t px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian ${
              active
                ? "bg-ourox-obsidianLight border border-b-0 border-ourox-obsidianMid text-ourox-orange"
                : "text-ourox-ink/60 hover:bg-ourox-obsidianLight/50 hover:text-ourox-ink"
            } ${isCentrepiece && !active ? "font-medium" : ""}`}
          >
            <span className={`block text-xs ${isCentrepiece ? "font-semibold" : "font-medium"}`}>
              {tab.label}
              {isCentrepiece && (
                <span className="ml-1.5 text-[10px] font-normal text-ourox-yellow/80">
                  centrepiece
                </span>
              )}
            </span>
            <span className="block text-[10px] text-ourox-ink/40 mt-0.5">{tab.description}</span>
          </button>
        );
      })}
    </nav>
  );
}

export { TABS as TRACE_TABS };
