"use client";

import { RECOVERY_BACKTRACE_ROADMAP_COPY } from "@/lib/verity/onchain-trace";

export function VerityOnChainRoadmapPanel() {
  const { title, body, caption, recoveryChain } = RECOVERY_BACKTRACE_ROADMAP_COPY;

  return (
    <section
      aria-label={title}
      className="rounded-signalSm border border-dashed border-signal-border bg-signal-surfaceSubtle px-4 py-3"
    >
      <h4 className="text-sm font-semibold text-signal-ink">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-signal-slate">{body}</p>
      <p className="mt-2 text-xs font-medium text-signal-body">
        Recovery chain: {recoveryChain}
      </p>
      <p className="mt-3 border-t border-signal-borderSubtle pt-3 text-xs italic text-signal-secondary">
        {caption}
      </p>
    </section>
  );
}
