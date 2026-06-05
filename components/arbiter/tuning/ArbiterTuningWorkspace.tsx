'use client';

import { useState, useMemo } from 'react';
import type { TunedEvent, ArbiterThresholds } from '@/lib/arbiter/tuning';
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_WEIGHTS,
  computeTuningResults,
  applyThresholdsToScore,
} from '@/lib/arbiter/tuning';
import type { BacktestEvent } from '@/lib/arbiter/rule-backtest';
import TuningSyntheticBanner from './TuningSyntheticBanner';
import ThresholdSliderPanel from './ThresholdSliderPanel';
import ConfusionMatrixPanel from './ConfusionMatrixPanel';
import MetricsPanel from './MetricsPanel';
import TypologyMetricsPanel from './TypologyMetricsPanel';
import FeatureWeightEditor from './FeatureWeightEditor';
import WhatChangedSummary from './WhatChangedSummary';
import RuleBacktestPanel from './RuleBacktestPanel';
import ShadowModePanel from './ShadowModePanel';

interface Props {
  tunedEvents: TunedEvent[];
  backtestEvents: BacktestEvent[];
}

export default function ArbiterTuningWorkspace({ tunedEvents, backtestEvents }: Props) {
  const [thresholds, setThresholds] = useState<ArbiterThresholds>(DEFAULT_THRESHOLDS);
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);

  const tuningResult = useMemo(
    () => computeTuningResults(tunedEvents, thresholds, weights),
    [tunedEvents, thresholds, weights],
  );

  const reviewBlockVolume = useMemo(
    () => tuningResult.events.filter(
      (e) => e.decision === 'BLOCK' || e.decision === 'REVIEW'
    ).length,
    [tuningResult],
  );

  const baselineReviewBlockVolume = useMemo(
    () => tunedEvents.filter((e) => {
      const d = applyThresholdsToScore(e.baseScore, DEFAULT_THRESHOLDS);
      return d === 'BLOCK' || d === 'REVIEW';
    }).length,
    [tunedEvents],
  );

  const [activeTab, setActiveTab] = useState<'tune' | 'backtest' | 'shadow'>('tune');

  return (
    <div className="flex flex-col min-h-screen">
      <TuningSyntheticBanner />

      {/* Header */}
      <div className="px-6 py-5 border-b border-ourox-obsidianLight bg-ourox-obsidianMid">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-ourox-ink tracking-tight">
              Arbiter — Tuning Workspace
            </h1>
            <p className="text-ourox-ink/40 text-sm mt-1">
              Adjust thresholds and weights to explore precision/recall trade-offs.
              Scoring is precomputed — no API calls during slider movement.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-ourox-ink/30">Evaluation set</div>
            <div className="text-sm font-semibold text-ourox-ink">
              {tunedEvents.length} labeled events
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-ourox-obsidianLight bg-ourox-obsidianMid px-6">
        <div className="max-w-7xl mx-auto flex gap-0">
          {([ ['tune', 'Thresholds & Weights'], ['backtest', 'Rule Back-Test'], ['shadow', 'Shadow Mode'] ] as const).map(
            ([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-ourox-orange text-ourox-orange'
                    : 'border-transparent text-ourox-ink/40 hover:text-ourox-ink/70'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">

          {activeTab === 'tune' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left column: controls */}
              <div className="space-y-5">
                <ThresholdSliderPanel thresholds={thresholds} onChange={setThresholds} />
                <FeatureWeightEditor weights={weights} onChange={setWeights} />
              </div>

              {/* Middle column: matrix + metrics */}
              <div className="space-y-5">
                <ConfusionMatrixPanel matrix={tuningResult.overallMetrics.confusionMatrix} />
                <MetricsPanel metrics={tuningResult.overallMetrics} />
                <WhatChangedSummary
                  currentMetrics={tuningResult.overallMetrics}
                  baselineMetrics={tuningResult.baselineMetrics}
                  reviewBlockVolume={reviewBlockVolume}
                  baselineReviewBlockVolume={baselineReviewBlockVolume}
                />
              </div>

              {/* Right column: typology + event summary */}
              <div className="space-y-5">
                <TypologyMetricsPanel typologyMetrics={tuningResult.typologyMetrics} />
                <EventSummaryCard events={tuningResult.events} />
              </div>
            </div>
          )}

          {activeTab === 'backtest' && (
            <div className="max-w-3xl">
              <RuleBacktestPanel backtestEvents={backtestEvents} thresholds={thresholds} />
            </div>
          )}

          {activeTab === 'shadow' && (
            <div className="max-w-3xl">
              <ShadowModePanel backtestEvents={backtestEvents} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-ourox-obsidianLight bg-ourox-obsidianMid px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-ourox-ink/25">
          <span>Arbiter Phase 2 — Tuning Sandbox · Synthetic data only · No ML / No SHAP / No live Verity</span>
          <span>Phase 3 (ML Score) pending Tower review</span>
        </div>
      </div>
    </div>
  );
}

function EventSummaryCard({ events }: { events: ReturnType<typeof computeTuningResults>['events'] }) {
  const counts: Record<string, number> = { APPROVE: 0, STEP_UP: 0, REVIEW: 0, BLOCK: 0 };
  for (const e of events) counts[e.decision] = (counts[e.decision] ?? 0) + 1;

  const COLORS = {
    APPROVE: 'text-emerald-400',
    STEP_UP: 'text-yellow-400',
    REVIEW:  'text-orange-400',
    BLOCK:   'text-red-400',
  };

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-3">
      <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Decision Distribution</h3>
      <div className="space-y-2">
        {(Object.entries(counts) as [keyof typeof COLORS, number][]).map(([dec, count]) => (
          <div key={dec} className="flex items-center gap-3">
            <span className={`text-xs font-semibold w-16 ${COLORS[dec]}`}>{dec}</span>
            <div className="flex-1 h-2 bg-ourox-obsidianLight rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  dec === 'BLOCK' ? 'bg-red-500' :
                  dec === 'REVIEW' ? 'bg-orange-400' :
                  dec === 'STEP_UP' ? 'bg-yellow-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${events.length > 0 ? (count / events.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-ourox-ink/60 w-8 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
