"use client";

// Arbiter Phase 1 — Score Explorer (main workspace)
// Wires: sample events → POST /api/arbiter/score → KPI strip + table + drawer

import { useState, useEffect, useCallback } from 'react';
import type { ArbiterEvent, ArbiterScoreResponseItem } from '@/lib/arbiter/contract';
import { ArbiterSyntheticBanner } from './ArbiterSyntheticBanner';
import { ArbiterKpiStrip } from './ArbiterKpiStrip';
import { ArbiterEventTable } from './ArbiterEventTable';
import { ArbiterExplainabilityDrawer } from './ArbiterExplainabilityDrawer';
import { ArbiterScoreExplainer } from './ArbiterScoreExplainer';
import { ArbiterSectionNav } from './ArbiterSectionNav';

interface Props {
  initialEvents: ArbiterEvent[];
}

type LoadState = 'idle' | 'loading' | 'done' | 'error';

export function ArbiterScoreExplorer({ initialEvents }: Props) {
  const [results, setResults] = useState<ArbiterScoreResponseItem[]>([]);
  const [selected, setSelected] = useState<ArbiterScoreResponseItem | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const scoreAll = useCallback(async () => {
    setLoadState('loading');
    setError(null);
    try {
      const res = await fetch('/api/arbiter/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialEvents),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results ?? []);
      setLoadState('done');
    } catch (err) {
      console.error('[ArbiterScoreExplorer] scoring failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoadState('error');
    }
  }, [initialEvents]);

  useEffect(() => {
    if (initialEvents.length > 0) scoreAll();
  }, [scoreAll, initialEvents.length]);

  return (
    <div className="min-h-screen bg-ourox-obsidian">
      <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-8 lg:px-6 lg:py-10">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {/* Arbiter lockup — SVG served from public/arbiter/ */}
            <div className="mb-2 flex items-center gap-3">
              <img
                src="/arbiter/arbiter-lockup-dark.svg"
                alt="Arbiter"
                height={52}
                style={{ height: 52, width: 'auto' }}
              />
              <span className="rounded-full border border-ourox-orange/30 bg-ourox-orange/10 px-2 py-0.5 text-xs font-semibold text-ourox-orange">
                Phase 1 — Scoring Core
              </span>
            </div>
            <p className="mt-1 text-sm text-ourox-ink/60">
              Deterministic fraud scoring and decisioning · GoRules Zen-Engine JDM
            </p>
          </div>

          <button
            onClick={scoreAll}
            disabled={loadState === 'loading'}
            className="flex items-center gap-2 rounded-lg border border-ourox-orange bg-ourox-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-ourox-orangeHover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian"
            aria-busy={loadState === 'loading'}
          >
            {loadState === 'loading' ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                </svg>
                Scoring…
              </>
            ) : (
              <>↻ Re-score</>
            )}
          </button>
        </div>

        {/* Scoring / Tuning section nav */}
        <ArbiterSectionNav />

        {/* Synthetic banner — always above the fold */}
        <ArbiterSyntheticBanner />

        {/* Error */}
        {loadState === 'error' && error && (
          <div
            className="rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            <strong>Scoring error:</strong> {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loadState === 'loading' && (
          <div className="space-y-4" aria-busy="true" aria-label="Loading scored events">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-ourox-obsidianLight" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-lg bg-ourox-obsidianLight" />
          </div>
        )}

        {/* Content */}
        {loadState === 'done' && (
          <>
            {/* KPI strip */}
            <ArbiterKpiStrip results={results} />

            {/* Score explainer */}
            <ArbiterScoreExplainer />

            {/* Event table */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-ourox-ink/80">
                Scored Events
                <span className="ml-2 font-normal text-ourox-ink/40">
                  · click a row for full explainability
                </span>
              </h2>
              <ArbiterEventTable results={results} onRowClick={setSelected} />
            </div>
          </>
        )}

        {/* Idle state */}
        {loadState === 'idle' && (
          <div className="flex h-48 items-center justify-center rounded-lg border border-ourox-obsidianMid text-sm text-ourox-ink/40">
            Waiting to score events…
          </div>
        )}
      </div>

      {/* Explainability drawer */}
      <ArbiterExplainabilityDrawer
        item={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
