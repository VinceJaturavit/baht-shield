"use client";

import { useState } from "react";
import type { GeneratedClosureNote } from "@/lib/types";
import { formatClosureNoteForCopy } from "@/lib/closure-note";

interface ClosureNotePreviewProps {
  note: GeneratedClosureNote;
}

const SECTION_LABELS: Array<{ key: keyof GeneratedClosureNote; title: string }> = [
  { key: "caseReference", title: "Case Reference" },
  { key: "decision", title: "Decision" },
  { key: "evidenceSummary", title: "Evidence Summary" },
  { key: "patternBasis", title: "Pattern Basis" },
  { key: "recommendedAction", title: "Recommended Action" },
  { key: "auditControlNote", title: "Audit / Control Note" },
];

export function ClosureNotePreview({ note }: ClosureNotePreviewProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatClosureNoteForCopy(note));
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 4000);
    }
  }

  return (
    <div className="space-y-3">
      {/* Section previews */}
      <div className="rounded-signalSm border border-signal-border bg-signal-surface divide-y divide-signal-borderSubtle overflow-hidden">
        {SECTION_LABELS.map(({ key, title }) => {
          const rawText = note[key] as string;
          // Strip the "SectionTitle:\n" prefix for display since we render the title separately
          const bodyText = rawText.includes(":\n") ? rawText.split(":\n").slice(1).join(":\n") : rawText;
          return (
            <div key={key} className="px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-signal-faint mb-1">
                {title}
              </p>
              <p className="text-xs text-signal-body whitespace-pre-wrap leading-relaxed">{bodyText}</p>
            </div>
          );
        })}
      </div>

      {/* Copy button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 rounded-signalSm px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-signal-accent focus:ring-offset-1 ${
            copyState === "copied"
              ? "bg-signal-accent text-white"
              : copyState === "failed"
              ? "bg-signal-muted text-severity-critical border border-signal-border"
              : "bg-signal-accent text-white hover:bg-signal-accentHover"
          }`}
        >
          {copyState === "copied" ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : copyState === "failed" ? (
            "Copy failed — select and copy manually."
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy note
            </>
          )}
        </button>

        {copyState === "copied" && (
          <span className="text-xs text-signal-accent font-medium">
            Full structured note copied to clipboard.
          </span>
        )}
      </div>
    </div>
  );
}
