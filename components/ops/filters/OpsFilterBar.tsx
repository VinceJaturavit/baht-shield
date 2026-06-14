"use client";

import type { ReactNode } from "react";
import { hasAnyActiveFilter } from "@/lib/ops/filters";
import { OpsSearchInput } from "./OpsSearchInput";

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchId?: string;
  resultCount: number;
  resultLabel?: string;
  filterValues: Record<string, string>;
  onClearAll: () => void;
  children?: ReactNode;
}

export function OpsFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  searchId,
  resultCount,
  resultLabel = "results",
  filterValues,
  onClearAll,
  children,
}: Props) {
  const hasActive = hasAnyActiveFilter({
    ...filterValues,
    text: searchValue,
  });

  return (
    <div
      className="space-y-2 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/20 px-3 py-2.5"
      role="search"
      aria-label="Filter results"
    >
      <div className="flex flex-wrap items-end gap-3">
        <OpsSearchInput
          id={searchId}
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          label={searchLabel}
        />
        {children}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <span className="text-[11px] tabular-nums text-ourox-ink/50">
            {resultCount} {resultLabel}
          </span>
          {hasActive && (
            <button
              type="button"
              onClick={onClearAll}
              className="rounded border border-ourox-obsidianMid px-2 py-1 text-[11px] font-medium text-ourox-ink/60 transition-colors hover:border-ourox-orange/30 hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
