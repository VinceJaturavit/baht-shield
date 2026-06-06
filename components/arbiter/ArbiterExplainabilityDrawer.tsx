"use client";

// Arbiter Phase 1 — Explainability Drawer
// Shows event summary, decision, score contributions, fired rules, and precedence.

import { useEffect, useRef } from 'react';
import type { ArbiterScoreResponseItem } from '@/lib/arbiter/contract';
import { SCENARIO_META } from '@/lib/arbiter/scenario';
import { ArbiterDecisionBadge } from './ArbiterDecisionBadge';

interface Props {
  item: ArbiterScoreResponseItem | null;
  onClose: () => void;
}

const MAX_BAR = 100;


export function ArbiterExplainabilityDrawer({ item, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    drawerRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const { event, features, score, final_decision } = item;
  const maxAbsContrib = Math.max(...score.contributions.map((c) => Math.abs(c.points)), 1);
  const scenarioMeta = event._scenario_label ? SCENARIO_META[event._scenario_label] : null;

  const namedRules = final_decision.reasons.filter((r) => r.rule_id !== 'SCORE_BAND');

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Event explainability"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-ourox-obsidian shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-ourox-obsidianMid px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ourox-ink/50">Arbiter Decision</p>
            <h2 className="mt-0.5 font-mono text-sm font-bold text-ourox-ink">{event.event_id}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-ourox-ink/50 transition hover:bg-ourox-obsidianMid hover:text-ourox-ink"
            aria-label="Close drawer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.207 3.793a1 1 0 010 1.414L9.414 8l2.793 2.793a1 1 0 01-1.414 1.414L8 9.414l-2.793 2.793a1 1 0 01-1.414-1.414L6.586 8 3.793 5.207a1 1 0 011.414-1.414L8 6.586l2.793-2.793a1 1 0 011.414 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          {/* Event summary */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Event Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Wallet', event.wallet_id],
                ['Amount', `฿${event.amount_thb.toLocaleString()}`],
                ['Direction', event.direction],
                ['Rail', event.rail],
                ['Device', event.device_id],
                ['Country', event.ip_country],
                ['Facial Scan', event.has_facial_scan ? 'Yes' : 'No'],
                ['Source', event.source],
              ].map(([k, v]) => (
                <div key={k} className="rounded bg-ourox-obsidianLight px-3 py-2">
                  <div className="text-xs text-ourox-ink/50">{k}</div>
                  <div className="font-medium text-ourox-ink">{v}</div>
                </div>
              ))}
              {scenarioMeta && (
                <div className="col-span-2 rounded bg-ourox-obsidianLight px-3 py-2">
                  <div className="text-xs text-ourox-ink/50">Scenario Label (display only)</div>
                  <div className="font-medium" style={{ color: scenarioMeta.color }}>
                    {scenarioMeta.displayName}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Decision + score */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Decision
            </h3>
            <div className="flex items-center gap-4 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-4">
              <ArbiterDecisionBadge decision={final_decision.action} size="md" />
              <div>
                <div className="text-3xl font-bold tabular-nums text-ourox-ink">
                  {score.score.toFixed(1)}
                  <span className="ml-1 text-sm font-normal text-ourox-ink/50">/ 100</span>
                </div>
                <div className="text-xs text-ourox-ink/50">Composite fraud score</div>
              </div>
            </div>
            {/* Precedence explanation */}
            <p className="mt-3 rounded bg-ourox-obsidianMid px-3 py-2 text-xs leading-relaxed text-ourox-ink/70">
              {final_decision.precedence_explanation}
            </p>
          </section>

          {/* Feature contributions */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Feature Contributions
            </h3>
            <div className="space-y-3">
              {score.contributions.map((contrib) => {
                const pct = Math.abs((contrib.points / maxAbsContrib) * MAX_BAR);
                const isNeg = contrib.points < 0;
                return (
                  <div key={contrib.key}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium text-ourox-ink">
                        {contrib.key}
                      </span>
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          isNeg ? 'text-green-400' : 'text-ourox-orange'
                        }`}
                      >
                        {contrib.points > 0 ? '+' : ''}{contrib.points.toFixed(2)} pts
                        <span className="ml-1 font-normal text-ourox-ink/40">
                          (w={contrib.weight})
                        </span>
                      </span>
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-ourox-obsidianMid">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                          isNeg ? 'bg-green-500' : 'bg-ourox-orange'
                        }`}
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${contrib.key} contribution`}
                      />
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between">
                      <span className="text-xs text-ourox-ink/40">
                        Value: {String(contrib.value)}
                      </span>
                      <span className="text-xs text-ourox-ink/40 text-right max-w-[60%] truncate">
                        {contrib.explanation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Fired rules */}
          {final_decision.reasons.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
                Fired Rules
              </h3>
              <div className="space-y-2">
                {final_decision.reasons.map((rule, idx) => {
                  return (
                    <div
                      key={`${rule.rule_id}-${idx}`}
                      className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-ourox-ink">
                          {rule.rule_id}
                        </span>
                        <ArbiterDecisionBadge decision={rule.action} />
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold text-ourox-yellow">
                        {rule.reason_code}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ourox-ink/60">
                        {rule.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {namedRules.length > 0 && (
                <p className="mt-3 text-xs text-ourox-ink/40">
                  Named rules (R1–R6) override score-band decisions based on precedence:
                  BLOCK {'>'} REVIEW {'>'} STEP_UP {'>'} score-band fallback.
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
