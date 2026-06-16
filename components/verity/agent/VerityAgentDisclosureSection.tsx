"use client";

import type { ReactNode } from "react";

interface VerityAgentDisclosureSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function VerityAgentDisclosureSection({
  title,
  children,
  defaultOpen = false,
}: VerityAgentDisclosureSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle"
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-signal-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span
            aria-hidden
            className="text-xs font-medium text-signal-secondary transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </span>
      </summary>
      <div className="border-t border-signal-borderSubtle px-4 py-3">{children}</div>
    </details>
  );
}
