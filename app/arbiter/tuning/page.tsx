// Arbiter Phase 2 — /arbiter/tuning route
//
// Server component: scores all labeled Mockingbird events once and passes
// TunedEvent[] + backtest events to the client workspace. No re-scoring
// happens during threshold/weight adjustments — pure client-side math.
//
// SYNTHETIC DATA ONLY. _scenario_label is stripped before scoring.

import type { ArbiterEvent } from '@/lib/arbiter/contract';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import { computeWeightedScore } from '@/lib/arbiter/score';
import { runArbiterRules } from '@/lib/arbiter/rules';
import { DEFAULT_THRESHOLDS } from '@/lib/arbiter/tuning';
import { applyThresholdsToScore } from '@/lib/arbiter/tuning';
import type { TunedEvent } from '@/lib/arbiter/tuning';
import type { BacktestEvent } from '@/lib/arbiter/rule-backtest';
import ArbiterTuningWorkspace from '@/components/arbiter/tuning/ArbiterTuningWorkspace';
import mockingbirdRaw from '@/data/arbiter/mockingbird-events.json';

async function buildTuningData(): Promise<{ tunedEvents: TunedEvent[]; backtestEvents: BacktestEvent[] }> {
  const rawEvents = mockingbirdRaw as ArbiterEvent[];
  const tunedEvents: TunedEvent[] = [];
  const backtestEvents: BacktestEvent[] = [];

  for (const event of rawEvents) {
    const safeEvent = stripScenarioLabel(event);
    const features  = await computeArbiterFeatures(safeEvent);
    const scoreResult = computeWeightedScore(features);

    const featureMap: Record<string, number | boolean | string> = {};
    for (const f of features) featureMap[f.key] = f.value;

    // Baseline decision: use default threshold bands + Zen-Engine rules
    // (rules fire R3/R4/R5/R6 etc. based on features/score)
    const decisionResult = await runArbiterRules({
      event: safeEvent,
      features: featureMap,
      score: scoreResult.score,
    });

    tunedEvents.push({
      eventId: event.event_id,
      walletId: event.wallet_id,
      scenarioLabel: event._scenario_label,
      features,
      baseScore: scoreResult.score,
    });

    backtestEvents.push({
      eventId: event.event_id,
      scenarioLabel: event._scenario_label,
      features: featureMap,
      baseScore: scoreResult.score,
      baselineDecision: decisionResult.action,
    });
  }

  return { tunedEvents, backtestEvents };
}

export default async function ArbiterTuningPage() {
  const { tunedEvents, backtestEvents } = await buildTuningData();

  return (
    <main className="min-h-screen bg-ourox-obsidian">
      <ArbiterTuningWorkspace
        tunedEvents={tunedEvents}
        backtestEvents={backtestEvents}
      />
    </main>
  );
}
