/**
 * Arbiter Phase 2 — Score Distribution Analysis & Part 0 Checkpoint
 *
 * Runs the full scoring pipeline over all labeled Mockingbird events and
 * asserts separation criteria for the Part 0 checkpoint.
 *
 * _scenario_label is used here ONLY as evaluation ground truth (in the
 * after-scoring analysis). It is stripped before the pipeline.
 */

import { describe, it, expect } from 'vitest';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import { computeWeightedScore } from '@/lib/arbiter/score';
import type { ArbiterEvent } from '@/lib/arbiter/contract';
import mockingbirdRaw from '@/data/arbiter/mockingbird-events.json';

const events = mockingbirdRaw as ArbiterEvent[];

type ScenarioStats = {
  count: number;
  scores: number[];
  velocity1h: number[];
  withdrawalAfterDeposit: number[];
  dailyCumulativeThb: number[];
  amtToMeanRatio: number[];
};

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

function avg(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Score all events once (vitest timeout is generous enough for 353 events)
async function scoreAll() {
  const labels = ['background', 'onboarding_mule_farm', 'sleeper_activation', 'app_scam_cashout'] as const;
  const stats: Record<string, ScenarioStats> = {};
  for (const l of labels) {
    stats[l] = { count: 0, scores: [], velocity1h: [], withdrawalAfterDeposit: [], dailyCumulativeThb: [], amtToMeanRatio: [] };
  }

  for (const event of events) {
    const label = event._scenario_label ?? 'background';
    const bucket = stats[label];
    if (!bucket) continue;

    const safeEvent = stripScenarioLabel(event);
    const features = await computeArbiterFeatures(safeEvent);
    const scoreResult = computeWeightedScore(features);

    const fm: Record<string, number | boolean | string> = {};
    for (const f of features) fm[f.key] = f.value;

    bucket.count++;
    bucket.scores.push(scoreResult.score);
    bucket.velocity1h.push(Number(fm['velocity_1h'] ?? 0));
    bucket.withdrawalAfterDeposit.push(Number(fm['withdrawal_after_deposit'] ?? 0));
    bucket.dailyCumulativeThb.push(Number(fm['daily_cumulative_thb'] ?? 0));
    bucket.amtToMeanRatio.push(Number(fm['amt_to_mean_ratio'] ?? 0));
  }
  return stats;
}

describe('Part 0 — Score distribution checkpoint', () => {
  it('dataset has required minimum counts', () => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const l = e._scenario_label ?? 'background';
      counts[l] = (counts[l] ?? 0) + 1;
    }
    expect(counts['background']).toBeGreaterThanOrEqual(200);
    expect(counts['onboarding_mule_farm']).toBeGreaterThanOrEqual(50);
    expect(counts['sleeper_activation']).toBeGreaterThanOrEqual(50);
    expect(counts['app_scam_cashout']).toBeGreaterThanOrEqual(50);
  });

  it('all events have _scenario_label', () => {
    for (const e of events) {
      expect(e._scenario_label).toBeDefined();
    }
  });

  it('checkpoint — fraud burst features separate from background', async () => {
    const stats = await scoreAll();
    const bg  = stats['background'];
    const mf  = stats['onboarding_mule_farm'];
    const sm  = stats['sleeper_activation'];
    const app = stats['app_scam_cashout'];

    // Print distribution for Build Log
    const print = (label: string, s: ScenarioStats) => {
      console.log(`\n--- ${label} (n=${s.count}) ---`);
      console.log(`  Score: min=${percentile(s.scores,0).toFixed(1)} p25=${percentile(s.scores,25).toFixed(1)} median=${percentile(s.scores,50).toFixed(1)} p75=${percentile(s.scores,75).toFixed(1)} max=${percentile(s.scores,100).toFixed(1)} avg=${avg(s.scores).toFixed(1)}`);
      console.log(`  avg velocity_1h:              ${avg(s.velocity1h).toFixed(2)}`);
      console.log(`  avg withdrawal_after_deposit: ${avg(s.withdrawalAfterDeposit).toFixed(3)}`);
      console.log(`  avg daily_cumulative_thb:     ${avg(s.dailyCumulativeThb).toFixed(0)} THB`);
      console.log(`  avg amt_to_mean_ratio:        ${avg(s.amtToMeanRatio).toFixed(2)}`);
    };
    print('background', bg);
    print('onboarding_mule_farm', mf);
    print('sleeper_activation', sm);
    print('app_scam_cashout', app);

    // ── Checkpoint assertions ──────────────────────────────────────────────

    // 1. velocity_1h higher for fraud bursts than background
    expect(avg(mf.velocity1h)).toBeGreaterThan(avg(bg.velocity1h) + 1);
    expect(avg(sm.velocity1h)).toBeGreaterThan(avg(bg.velocity1h) + 1);

    // 2. withdrawal_after_deposit higher for app scam than background
    expect(avg(app.withdrawalAfterDeposit)).toBeGreaterThan(avg(bg.withdrawalAfterDeposit) + 0.1);

    // 3. daily_cumulative_thb higher for burst scenarios than background
    expect(avg(mf.dailyCumulativeThb)).toBeGreaterThan(avg(bg.dailyCumulativeThb) + 5_000);
    expect(avg(sm.dailyCumulativeThb)).toBeGreaterThan(avg(bg.dailyCumulativeThb) + 5_000);

    // 4. amt_to_mean_ratio not pinned at max for cold wallets
    // After cold-start guard: ratio = 1.0 neutral → background events have amtToMeanRatio ≤ 2
    const bgMaxRatio = Math.max(...bg.amtToMeanRatio);
    expect(bgMaxRatio).toBeLessThan(200);  // no longer pinned at raw amount (e.g. 5000)

    // 5-6. Score range not compressed around 7-20 — fraud p75 > 20
    const fraudMaxP75 = Math.max(
      percentile(mf.scores, 75),
      percentile(sm.scores, 75),
      percentile(app.scores, 75),
    );
    expect(fraudMaxP75).toBeGreaterThan(20);

    // 7. Background median lower than fraud medians
    const bgMedian = percentile(bg.scores, 50);
    expect(percentile(mf.scores, 50)).toBeGreaterThan(bgMedian);
    expect(percentile(sm.scores, 50)).toBeGreaterThan(bgMedian);
    expect(percentile(app.scores, 50)).toBeGreaterThan(bgMedian);
  }, 300_000); // generous timeout for 353 events × pipeline
});
