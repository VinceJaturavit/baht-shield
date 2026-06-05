// Ourox platform home — / (Spec-020: attribution + purpose added)
// Calm enterprise launcher. One dominant area. Two products. Orange accent only.
// No gradients-as-decoration, no illustrations, no animation, no card soup.

import Link from "next/link";
import { OuroxMark, OuroxWordmark } from "@/components/ourox/OuroxLogo";
import { OuroxShell } from "@/components/ourox/OuroxShell";

const LINKEDIN_URL = "https://www.linkedin.com/in/jaturavit-chaovalit/";
const GITHUB_URL = "https://github.com/VinceJaturavit/baht-shield";

const PRODUCTS = [
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
        <div className="mb-16 max-w-2xl">
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
            Ourox is a synthetic learning and portfolio platform showing how analyst-curated
            pattern intelligence in Verity and risk scoring/decisioning in Arbiter connect
            across a fraud operations stack.
          </p>

          {/* Metadata line */}
          <p
            className="mb-8 text-xs text-ourox-ink/40 tracking-wide"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Fraud operations
            portfolio&nbsp;&nbsp;·&nbsp;&nbsp;Built for learning and demonstration
          </p>

          {/* Builder attribution */}
          <div className="border-t border-ourox-obsidianMid pt-6">
            <p className="mb-1 text-sm text-ourox-ink/50">
              Built by{" "}
              <span className="font-medium text-ourox-ink/80">
                Jaturavit &ldquo;Vince&rdquo; Chaovalit
              </span>
            </p>
            <p className="mb-3 text-sm text-ourox-ink/40">
              fraud operations professional — founding APAC fraud-team member; Chainalysis Reactor certified
            </p>
            <div className="flex gap-4 text-sm">
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

        {/* Product entries — two rows, no card soup */}
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
