"use client";

import type { OpsAgingGroupBy } from "@/lib/ops/aging";

const OPTIONS: { value: OpsAgingGroupBy; label: string }[] = [
  { value: "queue", label: "By queue" },
  { value: "owner", label: "By owner" },
  { value: "caseType", label: "By case type" },
];

interface Props {
  value: OpsAgingGroupBy;
  onChange: (value: OpsAgingGroupBy) => void;
}

export function OpsAgingGroupToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Group aging by">
      {OPTIONS.map(({ value: opt, label }) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              active
                ? "border-ourox-orange/40 bg-ourox-orange/10 text-ourox-orange"
                : "border-ourox-obsidianMid text-ourox-ink/60 hover:border-ourox-obsidianMid hover:bg-ourox-obsidianLight/50 hover:text-ourox-ink"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
