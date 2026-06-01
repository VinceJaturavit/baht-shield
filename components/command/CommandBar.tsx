"use client";

import { useEffect, useState } from "react";
import { CommandModal } from "./CommandModal";

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Search affordance button shown in nav */}
      <button
        type="button"
        aria-label="Open command search"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-signalSm border border-signal-border bg-signal-muted px-3 py-1.5 text-xs text-signal-secondary transition-colors hover:border-signal-accent/40 hover:bg-signal-accentSubtle hover:text-signal-accent"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-signal-border bg-white px-1 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <CommandModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
