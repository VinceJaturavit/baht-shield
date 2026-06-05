"use client";

// Arbiter Phase 1 — "How the Score Works" Expander

import { useState } from 'react';

export function ArbiterScoreExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ourox-orange"
        aria-expanded={open}
        aria-controls="score-explainer-body"
      >
        <span className="text-sm font-semibold text-ourox-ink">
          How the score works
        </span>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
          className={`text-ourox-ink/50 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M8 10.707l-4.354-4.353a1 1 0 00-1.414 1.414l5.061 5.061a1 1 0 001.414 0l5.061-5.06a1 1 0 00-1.414-1.415L8 10.707z" />
        </svg>
      </button>

      {open && (
        <div
          id="score-explainer-body"
          className="border-t border-ourox-obsidianMid px-4 pb-4 pt-3"
        >
          <div className="space-y-3 text-sm leading-relaxed text-ourox-ink/70">
            <p>
              Arbiter Phase 1 uses a <strong className="text-ourox-ink">transparent weighted score</strong>.
              Each event is converted into 12 fraud features. Each feature contributes
              weighted points, and the total is normalised to 0–100. A{' '}
              <strong className="text-ourox-ink">GoRules Zen-Engine JDM</strong> then
              applies explicit decision rules and score-band routing.
            </p>

            <p>
              Rules can override score bands based on precedence:{' '}
              <span className="font-mono text-ourox-orange font-medium">BLOCK</span>{' '}
              {' >'}{' '}
              <span className="font-mono text-ourox-yellow font-medium">REVIEW</span>{' '}
              {' >'}{' '}
              <span className="font-mono text-blue-400 font-medium">STEP_UP</span>{' '}
              {' >'}{' '}
              score-band fallback.
            </p>

            <ul className="space-y-1.5 text-xs">
              {[
                ['No ML in Phase 1', 'Scores are deterministic and fully auditable.'],
                ['No real-time scoring', 'Events are scored on-demand from the UI.'],
                ['No production decisions', 'This prototype never controls real transactions.'],
                ['Synthetic data only', 'All events are generated from public typologies.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-ourox-orange" aria-hidden="true">—</span>
                  <span>
                    <strong className="text-ourox-ink">{title}.</strong>{' '}
                    {desc}
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded border border-ourox-obsidianMid bg-ourox-obsidian p-3">
              <p className="mb-1 text-xs font-semibold text-ourox-orange">12 Phase 1 Features</p>
              <p className="font-mono text-xs text-ourox-ink/50 leading-loose">
                amt_to_mean_ratio · velocity_1h · account_age_days · is_new_beneficiary ·
                device_account_count · withdrawal_after_deposit · sleeper_velocity_shock ·
                geo_velocity · is_night_transaction · daily_cumulative_thb ·
                beneficiary_risk_tier · pattern_match_count
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
