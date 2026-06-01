"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { searchSignalOS, groupSearchResults } from "@/lib/search-index";
import type { SearchResult, SearchResultType } from "@/lib/types";
import { CommandResultItem } from "./CommandResultItem";

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROUP_LABELS: Record<SearchResultType, string> = {
  command: "Commands",
  wallet: "Wallets",
  alert: "Alerts",
  case: "Cases",
  pattern: "Patterns",
  device: "Devices",
  endpoint: "Endpoints",
};

export function CommandModal({ isOpen, onClose }: CommandModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSignalOS(query), [query]);
  const grouped = useMemo(() => groupSearchResults(results), [results]);

  // Flatten results preserving group order for keyboard nav
  const flatResults: SearchResult[] = useMemo(
    () => Object.values(grouped).flat(),
    [grouped]
  );

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.route);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) handleSelect(selected);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [flatResults, selectedIndex, handleSelect, onClose]
  );

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        aria-hidden="true"
        onMouseDown={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command search"
        className="fixed left-1/2 top-[15vh] z-50 w-full max-w-xl -translate-x-1/2 rounded-signal border border-signal-border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center border-b border-signal-border px-4 py-3">
          <svg
            className="mr-3 h-4 w-4 shrink-0 text-signal-secondary"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-label="Search SignalOS"
            placeholder="Search wallet, alert, case, pattern, device, endpoint…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-signal-heading placeholder:text-signal-secondary/60 focus:outline-none"
          />
          <kbd className="ml-2 rounded border border-signal-border px-1.5 py-0.5 text-[10px] font-medium text-signal-secondary">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div
          role="listbox"
          aria-label="Search results"
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {flatResults.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm font-medium text-signal-heading">
                No results found.
              </p>
              <p className="mt-1 text-xs text-signal-secondary">
                Try a wallet ID, alert ID, case ID, pattern name, device ID, or
                endpoint.
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => {
              if (!items?.length) return null;
              return (
                <div key={type} className="mb-3 last:mb-0">
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-signal-secondary">
                    {GROUP_LABELS[type as SearchResultType]}
                  </p>
                  {items.map((result) => {
                    const currentIndex = flatIndex++;
                    return (
                      <CommandResultItem
                        key={result.id}
                        result={result}
                        isSelected={currentIndex === selectedIndex}
                        onSelect={() => handleSelect(result)}
                      />
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        {flatResults.length > 0 && (
          <div className="flex items-center gap-3 border-t border-signal-border px-4 py-2">
            <span className="text-[10px] text-signal-secondary/70">
              <kbd className="rounded border border-signal-border px-1 py-0.5 font-mono">↑</kbd>{" "}
              <kbd className="rounded border border-signal-border px-1 py-0.5 font-mono">↓</kbd>{" "}
              navigate
            </span>
            <span className="text-[10px] text-signal-secondary/70">
              <kbd className="rounded border border-signal-border px-1 py-0.5 font-mono">↵</kbd>{" "}
              open
            </span>
          </div>
        )}
      </div>
    </>
  );
}
