"use client";

import { useEffect, useRef } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/jaturavit-chaovalit/";

interface IntroOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function IntroOverlay({ open, onClose }: IntroOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus the close button when the overlay opens
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Trap focus within the dialog
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = dialog!.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="intro-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-signal-ink/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-2xl rounded-signalLg bg-white shadow-signal border border-signal-border"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-signalSm p-1.5 text-signal-secondary transition-colors hover:bg-signal-surfaceSubtle hover:text-signal-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>

        <div className="px-8 pb-8 pt-7">
          {/* Synthetic data notice — first thing read */}
          <div className="mb-5 flex items-center gap-2 rounded-signalSm border border-signal-amberBorder bg-signal-amberSubtle px-3 py-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-signal-amber" aria-hidden="true" />
            <span className="text-signal-meta font-semibold uppercase tracking-wide text-signal-amber">
              Synthetic Demo · No Real Customer or Employer Data
            </span>
          </div>

          {/* Title */}
          <h2
            id="intro-title"
            className="mb-3 text-signal-section font-semibold text-signal-ink"
          >
            SignalOS — Analyst-Curated Fraud Intelligence
          </h2>

          {/* Description */}
          <p className="mb-5 text-signal-body text-signal-body leading-relaxed text-signal-slate">
            A synthetic prototype demonstrating how analyst-curated pattern intelligence surfaces
            mule, scam, and cash-out clusters that standalone risk scores miss, and turns an
            investigation into an auditable case closure. All wallets, alerts, cases, and patterns
            are illustrative and synthetic.
          </p>

          {/* What to look at */}
          <div className="mb-5">
            <p className="mb-2.5 text-signal-meta font-semibold uppercase tracking-wide text-signal-secondary">
              What to look at
            </p>
            <ul className="space-y-2">
              {[
                {
                  label: "Pattern Intelligence",
                  desc: "the analyst-curated signal layer — the core idea",
                },
                {
                  label: "Alert Queue → Wallet Profile",
                  desc: "triage to investigation workflow",
                },
                {
                  label: "Cases",
                  desc: "case detail with AI Copilot (synthetic, human-in-the-loop)",
                },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-2 text-signal-body text-signal-slate">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-indigo"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-medium text-signal-ink">{label}</span>
                    {" — "}
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="mb-5 h-px bg-signal-borderSubtle" />

          {/* Attribution */}
          <div className="mb-6">
            <p className="mb-2 text-signal-body text-signal-slate">
              Built by{" "}
              <span className="font-medium text-signal-ink">Vince Chaovalit</span> — fraud &amp;
              financial-crime operations, ex-Kraken. Chainalysis Reactor certified.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-signal-body">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-indigo underline underline-offset-2 transition-colors hover:text-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-sm"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/VinceJaturavit/baht-shield"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-indigo underline underline-offset-2 transition-colors hover:text-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-sm"
              >
                GitHub
              </a>
              <a
                href="https://project-z7w5d-jet.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal-indigo underline underline-offset-2 transition-colors hover:text-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-sm"
              >
                Live app
              </a>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full rounded-signalSm bg-signal-indigo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2"
          >
            Explore the prototype
          </button>
        </div>
      </div>
    </div>
  );
}
