"use client";

import type { VerityTracingMethod } from "@/lib/verity/agent-types";
import { TRACING_METHOD_EXPLANATIONS } from "@/lib/verity/onchain-trace";

interface VerityOnChainMethodBadgeProps {
  method: VerityTracingMethod;
  methodNote?: string;
}

export function VerityOnChainMethodBadge({
  method,
  methodNote,
}: VerityOnChainMethodBadgeProps) {
  if (method === "not_applicable") return null;

  const explanation = TRACING_METHOD_EXPLANATIONS[method];

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
      <span className="rounded bg-signal-surfaceSubtle px-1.5 py-0.5 font-medium text-signal-body">
        Co-mingled
      </span>
      <span className="rounded bg-signal-surfaceSubtle px-1.5 py-0.5 font-medium text-signal-indigo">
        Method: {method}
      </span>
      <span className="text-signal-secondary">({explanation})</span>
      <span className="rounded border border-signal-borderSubtle px-1.5 py-0.5 font-medium text-signal-slate">
        Defensible judgment call
      </span>
      {methodNote && (
        <details className="w-full">
          <summary className="cursor-pointer font-medium text-signal-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo">
            Method note
          </summary>
          <p className="mt-1 text-signal-slate">{methodNote}</p>
        </details>
      )}
    </span>
  );
}
