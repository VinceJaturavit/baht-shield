"use client";

import { useEffect, useRef, useState } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/jaturavit-chaovalit/";

interface IntroOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function IntroOverlay({ open, onClose }: IntroOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [showThesis, setShowThesis] = useState(false);

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
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-2xl rounded-signalLg bg-signal-surface shadow-signal border border-signal-border"
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
            Verity — Analyst-Curated Fraud Intelligence
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

          {/* Collapsible thesis explainer */}
          <div className="border-t border-signal-borderSubtle pt-4 mb-5">
            <button
              type="button"
              aria-expanded={showThesis}
              onClick={() => setShowThesis((v) => !v)}
              className="flex w-full items-center justify-between gap-2 text-left text-signal-body font-medium text-signal-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-signalSm"
            >
              <span>What is analyst-curated pattern intelligence?</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                className={`shrink-0 text-signal-secondary transition-transform duration-200 ${showThesis ? "rotate-180" : "rotate-0"}`}
              >
                <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>

            {showThesis && (
              <div className="mt-4 border-l-2 border-signal-indigo pl-4 space-y-3">
                <p className="text-signal-body text-signal-slate leading-relaxed">
                  Most fraud systems score each account, transaction, or device on its own. A mule
                  account in a coordinated farm often looks clean in isolation — it passes KYC, its
                  device risk is low, its transaction sizes sit below alert thresholds. The fraud is
                  only visible in the relationships between accounts, not in any single one.
                </p>
                <p className="text-signal-body text-signal-slate leading-relaxed">
                  Analyst-curated pattern intelligence captures the judgment an experienced
                  investigator applies when they recognise one of these clusters — the combination
                  of shared devices, repeated onboarding windows, reused cash-out endpoints, and
                  dormant-then-active behaviour that together signal a coordinated ring. Each pattern
                  is a reusable, named signature with the evidence and reasoning attached, so the
                  same judgment is applied consistently across every analyst and every case.
                </p>
                <p className="text-signal-body text-signal-slate leading-relaxed">
                  Verity demonstrates this as a layer that sits alongside scores and rules — not
                  replacing them. The example scenarios (onboarding mule farms, sleeper-mule
                  activation, APP-scam cash-out rings) are built so a naive standalone score
                  under-flags them, while the curated pattern catches the cluster. Every output is
                  human-in-the-loop: the analyst decides.
                </p>
              </div>
            )}
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
