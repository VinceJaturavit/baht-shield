"use client";

import Link from "next/link";
import {
  TRACING_METHODOLOGY_GUIDE_ANCHOR,
  TRACING_METHODOLOGY_PANEL,
  TRACING_METHODOLOGY_SECTIONS,
} from "@/lib/verity/onchain-methodology-copy";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";

export function VerityOnChainTracingMethodologyPanel() {
  return (
    <VerityAgentDisclosureSection title={TRACING_METHODOLOGY_PANEL.title} defaultOpen={false}>
      <p className="mb-4 text-xs text-signal-secondary">{TRACING_METHODOLOGY_PANEL.caption}</p>
      <p className="mb-5 text-sm leading-relaxed text-signal-slate">
        {TRACING_METHODOLOGY_PANEL.intro}
      </p>

      <div className="divide-y divide-signal-borderSubtle">
        {TRACING_METHODOLOGY_SECTIONS.map((section) => (
          <section key={section.id} className="py-4 first:pt-0 last:pb-0">
            <h5 className="text-sm font-semibold text-signal-ink">{section.heading}</h5>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-signal-slate">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            {"methods" in section && section.methods ? (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-signal-slate">
                {section.methods.map((method) => (
                  <li key={method.label}>
                    <span className="font-medium text-signal-body">{method.label}</span>
                    {" — "}
                    {method.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <p className="mt-4 border-t border-signal-borderSubtle pt-4 text-xs text-signal-secondary">
        <Link
          href={`/guide#${TRACING_METHODOLOGY_GUIDE_ANCHOR.id}`}
          className="text-signal-indigo underline underline-offset-2 hover:text-signal-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo"
        >
          Read tracing methodology
        </Link>
        {" — "}
        short summary in the Ourox reviewer guide.
      </p>
    </VerityAgentDisclosureSection>
  );
}
