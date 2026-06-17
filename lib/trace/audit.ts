import type { TraceAuditEvent, TraceMethod, TraceReviewStatus } from "./types";

let eventCounter = 0;

function nextId(): string {
  eventCounter += 1;
  return `TRACE-AUDIT-${String(eventCounter).padStart(4, "0")}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createAiAssistEvent(summary: string): TraceAuditEvent {
  return {
    id: nextId(),
    timestamp: nowIso(),
    actor: "AI assist",
    action: "AI assist summary generated (decision-support only)",
    detail: summary,
  };
}

export function createMethodSelectedEvent(
  method: TraceMethod,
  rationale: string,
): TraceAuditEvent[] {
  return [
    {
      id: nextId(),
      timestamp: nowIso(),
      actor: "Investigator",
      action: "Method selected",
      detail: `Investigator selected ${method} as the co-mingling attribution method.`,
    },
    {
      id: nextId(),
      timestamp: nowIso(),
      actor: "Investigator",
      action: "Method rationale saved",
      detail: rationale,
    },
    {
      id: nextId(),
      timestamp: nowIso(),
      actor: "Investigator",
      action: "Attribution table generated from selected method",
      detail: `Victim attribution rows populated using ${method} allocations on the seized 12,000 USDT pool.`,
    },
    {
      id: nextId(),
      timestamp: nowIso(),
      actor: "Investigator",
      action: "Evidence package assembled",
      detail:
        "Evidence package summary updated with selected method, rationale, and attribution table.",
    },
  ];
}

export function validateMethodSave(
  method: TraceMethod | null,
  rationale: string,
): { ok: true } | { ok: false; error: string } {
  if (!method) {
    return { ok: false, error: "A co-mingling method must be selected before saving." };
  }
  if (!rationale.trim()) {
    return { ok: false, error: "Rationale is required before saving method selection." };
  }
  return { ok: true };
}

export function createReviewApprovedEvent(note: string): TraceAuditEvent {
  return {
    id: nextId(),
    timestamp: nowIso(),
    actor: "Senior reviewer",
    action: "Review approved",
    detail: note.trim() || "Attribution package approved by senior reviewer.",
  };
}

export function createReviewRejectedEvent(note: string): TraceAuditEvent {
  return {
    id: nextId(),
    timestamp: nowIso(),
    actor: "Senior reviewer",
    action: "Review rejected",
    detail: note,
  };
}

export function validateReviewReject(note: string): { ok: true } | { ok: false; error: string } {
  if (!note.trim()) {
    return { ok: false, error: "Reviewer note is required when rejecting the attribution package." };
  }
  return { ok: true };
}

export function validateReviewApprove(
  selectedMethod: TraceMethod | null,
  rationale: string,
): { ok: true } | { ok: false; error: string } {
  const methodCheck = validateMethodSave(selectedMethod, rationale);
  if (!methodCheck.ok) {
    return {
      ok: false,
      error: "Method and rationale must be saved before review approval.",
    };
  }
  return { ok: true };
}

export function reviewStatusFromDecision(
  decision: "approve" | "reject",
): TraceReviewStatus {
  return decision === "approve" ? "approved" : "rejected";
}

/** Reset counter for deterministic tests */
export function resetAuditCounter(): void {
  eventCounter = 0;
}
