// Ourox platform home — / (Spec-022: attribution tightened, guide entry added)
// Calm enterprise launcher. One dominant area. Three products + guide. Orange accent only.
// No gradients-as-decoration, no illustrations, no animation, no card soup.

import Link from "next/link";
import { OuroxMark, OuroxWordmark } from "@/components/ourox/OuroxLogo";
import { OuroxShell } from "@/components/ourox/OuroxShell";

const LINKEDIN_URL = "https://www.linkedin.com/in/jaturavit-chaovalit/";
const GITHUB_URL = "https://github.com/VinceJaturavit/baht-shield";

const PRODUCTS = [
  {
    key: "ops",
    name: "Ops",
    href: "/ops",
    label: "Fraud Operations Management",
    description:
      "Case management, queues, SLA, roster, and KPI control — the operations layer after an alert becomes a case.",
    cta: "Enter Ops",
  },
  {
    key: "verity",
    name: "Verity",
    href: "/verity",
    label: "Investigation & Pattern Intelligence",
    description:
      "Investigation and pattern-intelligence workspace for analyst-curated fraud evidence.",
    cta: "Enter Verity",
  },
  {
    key: "arbiter",
    name: "Arbiter",
    href: "/arbiter",
    label: "Risk Scoring & Decisioning",
    description:
      "Risk scoring and decisioning sandbox for features, rules, thresholds, and tuning.",
    cta: "Enter Arbiter",
  },
] as const;

export default function OuroxHomePage() {
  return (
    <OuroxShell currentProduct="Ourox">
      {/* Main — generous outer spacing, one dominant area */}
      <main
        className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {/* Platform intro */}
        <div className="mb-12 max-w-2xl">
          {/* Large wordmark */}
          <div className="mb-8 flex items-center gap-4">
            <span style={{ display: "inline-flex", width: 52, height: 52 }}>
              <OuroxMark s={52} />
            </span>
            <OuroxWordmark size={36} />
          </div>

          <h1 className="mb-4 text-[28px] font-semibold leading-tight tracking-tight text-ourox-ink lg:text-[32px]">
            Ourox
          </h1>

          {/* Purpose paragraph */}
          <p className="mb-5 text-base leading-7 text-ourox-ink/70 max-w-xl">
            Ourox shows the fraud-operations lifecycle end to end: Ops runs the case operation,
            Verity investigates and captures patterns, and Arbiter scores, tunes, and tests
            decisioning logic.
          </p>

          {/* Metadata line */}
          <p
            className="mb-8 text-xs text-ourox-ink/40 tracking-wide"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Fraud operations
            portfolio&nbsp;&nbsp;·&nbsp;&nbsp;Built for learning and demonstration
          </p>

          {/* Builder attribution — project-led, separation-compliant */}
          <div className="border-t border-ourox-obsidianMid pt-6 space-y-3">
            <p className="text-sm leading-relaxed text-ourox-ink/70">
              Built by{" "}
              <span className="font-medium text-ourox-ink/90">
                Jaturavit &ldquo;Vince&rdquo; Chaovalit
              </span>{" "}
              — seven years in crypto fraud operations. Chainalysis Reactor certified.
            </p>
            <p className="text-sm leading-relaxed text-ourox-ink/60">
              Ourox is an argument for treating analyst-curated intelligence as a first-class
              fraud-detection layer. The fraud that actually costs money — mule farms,
              sleeper-account activation, scam cash-out rings — rarely trips a vendor&rsquo;s
              transaction score. It shows up in casework: the device shared across forty
              &ldquo;clean&rdquo; accounts, the dormant wallet that wakes up and fans out, the
              beneficiary every scam victim was told to pay. Analysts see the cluster; isolated
              scoring doesn&rsquo;t.
            </p>
            <p className="text-sm leading-relaxed text-ourox-ink/60">
              Ops is the operations layer — case management, queues, SLA, roster, and KPI after an
              alert becomes a case. Verity is the investigation and pattern-intelligence side.
              Arbiter is the scoring-and-decisioning side — features, rules, thresholds, and the
              precision/recall tradeoffs a fraud strategy team works with.
            </p>
            <p className="text-xs text-ourox-ink/40 tracking-wide">
              Everything here is synthetic. The thinking is real.
            </p>
            <div className="flex gap-4 text-sm pt-1">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ourox-orange/80 underline underline-offset-2 transition-colors hover:text-ourox-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian rounded-sm"
              >
                LinkedIn
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ourox-orange/80 underline underline-offset-2 transition-colors hover:text-ourox-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian rounded-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Guide entry — calm, prominent, one click from landing */}
        <div className="mb-6 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-3">
                <span className="text-base font-semibold text-ourox-ink">How Ourox works</span>
              </div>
              <p className="text-sm leading-6 text-ourox-ink/60">
                A structured guide to the platform, its three products, the synthetic data
                boundary, and the roadmap.
              </p>
            </div>
            <Link
              href="/guide"
              className="inline-flex shrink-0 items-center gap-2 rounded border border-ourox-obsidianMid px-5 py-2 text-sm font-medium text-ourox-ink/70 transition-colors hover:border-ourox-orange/60 hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidianLight"
            >
              Read the guide
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product entries — three rows, no card soup */}
        <div className="space-y-px border border-ourox-obsidianMid rounded-lg overflow-hidden">
          {PRODUCTS.map((p) => (
            <div
              key={p.key}
              className="flex flex-col gap-4 bg-ourox-obsidianLight px-8 py-8 sm:flex-row sm:items-center sm:gap-8 first:rounded-t-lg last:rounded-b-lg"
            >
              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-3">
                  <span className="text-lg font-semibold text-ourox-ink">{p.name}</span>
                  <span
                    className="text-xs text-ourox-ink/40 tracking-wide"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {p.label}
                  </span>
                </div>
                <p className="text-sm leading-6 text-ourox-ink/60">{p.description}</p>
              </div>

              {/* CTA */}
              <Link
                href={p.href}
                className="inline-flex shrink-0 items-center gap-2 rounded border border-ourox-orange px-5 py-2 text-sm font-semibold text-ourox-orange transition-colors hover:bg-ourox-orange hover:text-ourox-obsidian focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidianLight"
              >
                {p.cta}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7h9M7.5 3.5 11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </OuroxShell>
  );
}
