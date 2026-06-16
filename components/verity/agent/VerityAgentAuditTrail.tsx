"use client";

import type { VerityAgentAuditEvent } from "@/lib/verity/agent-types";
import { AGENT_STAGES } from "@/lib/verity/agent-types";

interface VerityAgentAuditTrailProps {
  events: VerityAgentAuditEvent[];
}

function stageLabel(stage: VerityAgentAuditEvent["stage"]): string {
  return AGENT_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function VerityAgentAuditTrail({ events }: VerityAgentAuditTrailProps) {
  return (
    <section className="rounded-signal border border-signal-border bg-signal-surface p-5 shadow-signalSubtle">
      <h2 className="text-lg font-semibold text-signal-ink">Audit trail</h2>
      <p className="mt-1 text-[13px] text-signal-slate">
        Exam-ready log of every stage input, agent output, and human decision.
      </p>

      {events.length === 0 ? (
        <p className="mt-4 text-sm text-signal-secondary">
          No events yet. Select a case and interact with a stage gate to begin.
        </p>
      ) : (
        <ol className="mt-4 space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="border-l-2 border-signal-indigo pl-4 text-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-semibold text-signal-ink">
                  {stageLabel(event.stage)}
                </span>
                <span className="text-xs text-signal-secondary">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
              <dl className="mt-2 space-y-1 text-xs text-signal-slate">
                <div>
                  <dt className="inline font-medium text-signal-body">Input: </dt>
                  <dd className="inline">{event.inputSummary}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-signal-body">Agent output: </dt>
                  <dd className="inline">{event.agentOutputSummary}</dd>
                </div>
                {event.humanDecision && (
                  <div>
                    <dt className="inline font-medium text-signal-body">Human decision: </dt>
                    <dd className="inline capitalize">
                      {event.humanDecision}
                      {event.humanEdited ? " (edited)" : ""}
                    </dd>
                  </div>
                )}
                {event.notes && (
                  <div>
                    <dt className="inline font-medium text-signal-body">Notes: </dt>
                    <dd className="inline">{event.notes}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
