"use client";

import { useState } from "react";
import type { VerityHumanDecision } from "@/lib/verity/agent-types";

interface VerityAgentHumanGateProps {
  stageLabel: string;
  canAct: boolean;
  currentDecision?: VerityHumanDecision;
  humanEdited?: boolean;
  editableContent?: string;
  onApprove: () => void;
  onDeny: () => void;
  onSaveEdit: (edited: string) => void;
}

export function VerityAgentHumanGate({
  stageLabel,
  canAct,
  currentDecision,
  humanEdited,
  editableContent = "",
  onApprove,
  onDeny,
  onSaveEdit,
}: VerityAgentHumanGateProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(editableContent);

  const approved = currentDecision === "approved" || currentDecision === "edited";
  const denied = currentDecision === "denied";

  function startEdit() {
    setEditText(editableContent);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditText(editableContent);
  }

  function saveEdit() {
    onSaveEdit(editText);
    setEditing(false);
  }

  return (
    <div className="mt-6 border-t border-signal-borderSubtle pt-5">
      <h3 className="text-sm font-semibold text-signal-ink">Human gate — {stageLabel}</h3>
      <p className="mt-1 text-[13px] text-signal-slate">
        The agent proposes output below. Approve, deny, or edit before the next
        stage unlocks. No auto-advance.
      </p>

      {approved && (
        <p className="mt-2 text-sm text-signal-indigo">
          Stage approved{humanEdited ? " (with human edits)" : ""}.
        </p>
      )}
      {denied && (
        <p className="mt-2 text-sm text-signal-amber">
          Stage denied — remain on this stage to revise or re-approve.
        </p>
      )}

      {editing && (
        <div className="mt-3">
          <label className="block text-xs font-medium text-signal-secondary">
            Edit agent output
          </label>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-signalSm border border-signal-border bg-signal-surface px-3 py-2 text-sm text-signal-body focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-signalSm bg-signal-indigo px-3 py-1.5 text-sm font-medium text-white hover:bg-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
            >
              Save edit
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-signalSm border border-signal-border px-3 py-1.5 text-sm font-medium text-signal-slate hover:bg-signal-surfaceSubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
            >
              Cancel edit
            </button>
          </div>
        </div>
      )}

      {canAct && !approved && !editing && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="rounded-signalSm bg-signal-indigo px-4 py-2 text-sm font-semibold text-white hover:bg-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={onDeny}
            className="rounded-signalSm border border-signal-amberBorder bg-signal-amberSubtle px-4 py-2 text-sm font-semibold text-signal-amber hover:bg-signal-amberSubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={startEdit}
            className="rounded-signalSm border border-signal-border px-4 py-2 text-sm font-semibold text-signal-slate hover:bg-signal-surfaceSubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
