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

// Tradeoff preset: lowers REVIEW and BLOCK thresholds to show recall rising.
// This preset is instructive — it demonstrates how lowering thresholds catches
// more fraud (higher recall) at the cost of more false positives.
// Does not permanently change defaults; user can reset.
const TRADEOFF_PRESET_THRESHOLDS: ArbiterThresholds = {
  approveStepUp: 25,
  stepUpReview: 35,
  reviewBlock: 55,
};

interface Props {
  tunedEvents: TunedEvent[];
  backtestEvents: BacktestEvent[];
}

export default function ArbiterTuningWorkspace({ tunedEvents, backtestEvents }: Props) {
  const [thresholds, setThresholds] = useState<ArbiterThresholds>(DEFAULT_THRESHOLDS);
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);
  const [presetActive, setPresetActive] = useState(false);

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

  // Rule-inclusive BLOCK count from Explorer baseline decisions (Zen-Engine JDM).
  const ruleInclusiveBlockCount = useMemo(
    () => backtestEvents.filter((e) => e.baselineDecision === 'BLOCK').length,
    [backtestEvents],
  );

  // Score-band BLOCK count at current thresholds.
  const scoreBandBlockCount = useMemo(
    () => tuningResult.events.filter((e) => e.decision === 'BLOCK').length,
    [tuningResult],
  );

  function applyTradeoffPreset() {
    setThresholds({ ...TRADEOFF_PRESET_THRESHOLDS });
    setPresetActive(true);
  }

  function resetToDefault() {
    setThresholds({ ...DEFAULT_THRESHOLDS });
    setPresetActive(false);
  }

  const [activeTab, setActiveTab] = useState<'tune' | 'backtest' | 'shadow'>('tune');

  return (
    <div className="flex flex-col">
      <TuningSyntheticBanner />

      {/* Header */}
      <div className="px-6 py-5 border-b border-ourox-obsidianLight bg-ourox-obsidianMid">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold text-ourox-ink tracking-tight">
              Arbiter — Tuning Workspace
            </h1>
            <p className="text-ourox-ink/40 text-sm mt-1">
              Adjust thresholds and weights to explore precision/recall trade-offs.
              Scoring is precomputed — no API calls during slider movement.
            </p>
          </div>
          <div className="flex items-start gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs text-ourox-ink/30">Evaluation set</div>
              <div className="text-sm font-semibold text-ourox-ink">
                {tunedEvents.length} labeled events
              </div>
            </div>
            {/* Tradeoff preset button — Spec-019 instructive default */}
            {!presetActive ? (
              <button
                onClick={applyTradeoffPreset}
                className="rounded border border-ourox-orange/60 px-3 py-1.5 text-xs font-semibold text-ourox-orange hover:bg-ourox-orange hover:text-ourox-obsidian transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidianMid"
              >
                Show tradeoff preset
              </button>
            ) : (
              <button
                onClick={resetToDefault}
                className="rounded border border-ourox-ink/20 px-3 py-1.5 text-xs font-semibold text-ourox-ink/50 hover:border-ourox-ink/40 hover:text-ourox-ink/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidianMid"
              >
                Reset defaults
              </button>
            )}
          </div>
        </div>

        {/* Preset active callout */}
        {presetActive && (
          <div className="max-w-7xl mx-auto mt-3">
            <p className="text-xs text-ourox-orange/80 bg-ourox-orange/10 border border-ourox-orange/20 rounded px-3 py-2">
              <span className="font-semibold">Tradeoff preset active</span> — REVIEW threshold lowered to 35, BLOCK to 55. Recall rises; false positives rise. This is a sandbox illustration of threshold movement, not a production recommendation. Reset to restore defaults.
            </p>
          </div>
        )}
      </div>

      {/* Score-band layer explainer — Spec-019 */}
      <div className="border-b border-ourox-obsidianLight bg-ourox-obsidian px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <ScoreBandExplainer
            scoreBandBlock={scoreBandBlockCount}
            ruleInclusiveBlock={ruleInclusiveBlockCount}
          />
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
    </div>
  );
}

// ScoreBandExplainer — Spec-019: explains the score-band layer vs rule-inclusive context.
// Placed above the tab bar so it is always visible regardless of active tab.
function ScoreBandExplainer({
  scoreBandBlock,
  ruleInclusiveBlock,
}: {
  scoreBandBlock: number;
  ruleInclusiveBlock: number;
}) {
  const ruleOverrides = Math.max(0, ruleInclusiveBlock - scoreBandBlock);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
      {/* Explainer text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ourox-ink/50 leading-relaxed">
          <span className="text-ourox-ink/70 font-medium">Score-band layer only.</span>{' '}
          This matrix evaluates the score-band thresholds in isolation — REVIEW and BLOCK count
          as positive interventions; APPROVE and STEP_UP as negative. A low default recall does
          not mean Arbiter is failing: the score-band threshold is conservative and the
          Zen-Engine rules carry additional interventions separately.
        </p>
      </div>

      {/* Rule-inclusive comparison strip */}
      <div className="flex-shrink-0 rounded border border-ourox-obsidianLight bg-ourox-obsidianMid px-4 py-2.5 text-xs">
        <div className="text-[10px] text-ourox-ink/30 uppercase tracking-wider mb-1.5">
          BLOCK comparison
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-ourox-ink/50">Score-band BLOCK (current thresholds)</span>
            <span className="font-mono font-semibold tabular-nums text-ourox-ink">{scoreBandBlock}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-ourox-ink/50">Rule-inclusive BLOCK (Explorer)</span>
            <span className="font-mono font-semibold tabular-nums text-ourox-orange">{ruleInclusiveBlock}</span>
          </div>
          <div className="border-t border-ourox-obsidianLight pt-1 flex items-center justify-between gap-6">
            <span className="text-ourox-ink/40">Rule overrides</span>
            <span className="font-mono tabular-nums text-ourox-ink/60">+{ruleOverrides}</span>
          </div>
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
      <p className="text-ourox-ink/40 text-xs">Score-band decisions at current thresholds.</p>
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
