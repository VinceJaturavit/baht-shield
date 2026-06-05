"use client";

import { useMemo, useState } from "react";
import type { EnrichedCase, WalletProfileData } from "@/lib/wallet-profile";
import {
  buildClosureNoteInput,
  deriveEvidenceToggleOptions,
  generateClosureNote,
} from "@/lib/closure-note";
import { EvidenceToggleGroup } from "./EvidenceToggleGroup";
import { ClosureNotePreview } from "./ClosureNotePreview";

interface ClosureNoteBuilderProps {
  caseData: EnrichedCase;
  walletProfile: WalletProfileData;
}

export function ClosureNoteBuilder({ caseData, walletProfile }: ClosureNoteBuilderProps) {
  // Derive all toggle options once from case + wallet context
  const allOptions = useMemo(
    () => deriveEvidenceToggleOptions({ caseData, walletProfile }),
    [caseData, walletProfile]
  );

  // Initialize selected state from defaultSelected
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    allOptions.filter((o) => o.defaultSelected).map((o) => o.id)
  );

  const [activeTab, setActiveTab] = useState<"toggles" | "preview">("toggles");

  function handleToggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Derive selected evidence options for note input
  const selectedEvidence = useMemo(
    () => allOptions.filter((o) => selectedIds.includes(o.id)),
    [allOptions, selectedIds]
  );

  // Generate note deterministically from selected evidence
  const closureNoteInput = useMemo(
    () => buildClosureNoteInput(caseData, walletProfile, selectedEvidence),
    [caseData, walletProfile, selectedEvidence]
  );

  const generatedNote = useMemo(
    () => generateClosureNote(closureNoteInput),
    [closureNoteInput]
  );

  const selectedCount = selectedIds.length;
  const totalCount = allOptions.length;

  return (
    <div className="mt-3 rounded-signal border border-signal-accentBorder bg-signal-accentSubtle/40 overflow-hidden">
      {/* Builder header */}
      <div className="px-6 py-3.5 bg-signal-accentSubtle border-b border-signal-accentBorder flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-signal-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-semibold text-signal-heading">Closure Note Builder</span>
          <span className="text-xs text-signal-accent font-mono">{caseData.case_id}</span>
        </div>
        <span className="text-[11px] text-signal-secondary font-medium tabular-nums">
          {selectedCount} of {totalCount} evidence indicators selected
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-signal-accentBorder bg-signal-surface">
        <button
          onClick={() => setActiveTab("toggles")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "toggles"
              ? "border-signal-accent text-signal-accent"
              : "border-transparent text-signal-secondary hover:text-signal-heading"
          }`}
        >
          Evidence toggles
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preview"
              ? "border-signal-accent text-signal-accent"
              : "border-transparent text-signal-secondary hover:text-signal-heading"
          }`}
        >
          Generated note
          {selectedCount > 0 && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-signal-accentSubtle px-1.5 py-0 text-[10px] font-medium text-signal-accent">
              ready
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="px-6 py-4">
        {activeTab === "toggles" ? (
          <div>
            <p className="text-xs text-signal-secondary mb-4 leading-relaxed">
              Select the evidence indicators that apply to this case. The closure note will update
              live as you toggle options. All logic is deterministic — no AI or API call is made.
            </p>
            <EvidenceToggleGroup
              options={allOptions}
              selectedIds={selectedIds}
              onToggle={handleToggle}
            />
            {totalCount > 0 && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setSelectedIds(allOptions.map((o) => o.id))}
                  className="text-xs text-signal-accent hover:underline"
                >
                  Select all
                </button>
                <span className="text-xs text-signal-border">|</span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-signal-secondary hover:underline"
                >
                  Clear all
                </button>
                <span className="text-xs text-signal-border">|</span>
                <button
                  onClick={() =>
                    setSelectedIds(allOptions.filter((o) => o.defaultSelected).map((o) => o.id))
                  }
                  className="text-xs text-signal-secondary hover:underline"
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs text-signal-secondary mb-4 leading-relaxed">
              Structured closure note assembled from{" "}
              <span className="font-medium text-signal-heading">{selectedCount}</span> selected evidence
              indicator{selectedCount !== 1 ? "s" : ""}. Deterministic — same selection always
              produces the same note.
            </p>
            <ClosureNotePreview note={generatedNote} />
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="px-6 py-2.5 bg-signal-muted border-t border-signal-borderSubtle">
        <p className="text-[10px] text-signal-faint leading-relaxed">
          This note is assembled from synthetic demo data for audit and control review purposes
          only. It is not a legal filing and does not constitute legal advice. No regulatory text is
          reproduced verbatim.
        </p>
      </div>
    </div>
  );
}
