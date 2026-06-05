/**
 * Arbiter Phase 2 — Score Distribution Analysis
 *
 * Runs the full scoring pipeline over all labeled Mockingbird events and
 * outputs per-scenario statistics for the Part 0 checkpoint.
 *
 * _scenario_label is used here ONLY as evaluation ground truth.
 * It is NEVER passed to the feature/score/rule pipeline.
 *
 * Run: tsx scripts/arbiter/analyze-score-distribution.ts
 */

import { stripScenarioLabel } from '../../lib/arbiter/contract';
import { computeArbiterFeatures } from '../../lib/arbiter/features';
import { computeWeightedScore } from '../../lib/arbiter/score';
import { runArbiterRules } from '../../lib/arbiter/rules';
import type { ArbiterEvent, ArbiterScenarioLabel } from '../../lib/arbiter/contract';
import mockingbirdRaw from '../../data/arbiter/mockingbird-events.json';

const events = mockingbirdRaw as ArbiterEvent[];

type ScenarioStats = {
  count: number;
  scores: number[];
  decisions: Record<string, number>;
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
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

async function main() {
  const allScenarios: ArbiterScenarioLabel[] = [
    'background',
    'onboarding_mule_farm',
    'sleeper_activation',
    'app_scam_cashout',
  ];

  const stats: Record<string, ScenarioStats> = {};
  for (const s of allScenarios) {
    stats[s] = { count: 0, scores: [], decisions: {}, velocity1h: [], withdrawalAfterDeposit: [], dailyCumulativeThb: [], amtToMeanRatio: [] };
  }

  console.log(`\nScoring ${events.length} events...`);

  let processed = 0;
  for (const event of events) {
    const label = event._scenario_label ?? 'background';
    const bucket = stats[label];
    if (!bucket) continue;

    // IP Gate: strip _scenario_label before any pipeline step
    const safeEvent = stripScenarioLabel(event);
    const features = await computeArbiterFeatures(safeEvent);
    const scoreResult = computeWeightedScore(features);

    const featureMap: Record<string, number | boolean | string> = {};
    for (const f of features) featureMap[f.key] = f.value;

    const decision = await runArbiterRules({
      event: safeEvent,
      features: featureMap,
      score: scoreResult.score,
    });

    bucket.count++;
    bucket.scores.push(scoreResult.score);
    bucket.decisions[decision.action] = (bucket.decisions[decision.action] ?? 0) + 1;
    bucket.velocity1h.push(Number(featureMap['velocity_1h'] ?? 0));
    bucket.withdrawalAfterDeposit.push(Number(featureMap['withdrawal_after_deposit'] ?? 0));
    bucket.dailyCumulativeThb.push(Number(featureMap['daily_cumulative_thb'] ?? 0));
    bucket.amtToMeanRatio.push(Number(featureMap['amt_to_mean_ratio'] ?? 0));

    processed++;
    if (processed % 50 === 0) process.stdout.write(`  ${processed}/${events.length}\r`);
  }

  console.log(`\nDone scoring ${processed} events.\n`);
  console.log('='.repeat(70));
  console.log('SCORE DISTRIBUTION BY SCENARIO');
  console.log('='.repeat(70));

  for (const scenario of allScenarios) {
    const s = stats[scenario];
    if (s.count === 0) continue;

    console.log(`\n--- ${scenario.toUpperCase()} (n=${s.count}) ---`);
    console.log(`  Score:  min=${percentile(s.scores,0).toFixed(1)}  p25=${percentile(s.scores,25).toFixed(1)}  median=${percentile(s.scores,50).toFixed(1)}  p75=${percentile(s.scores,75).toFixed(1)}  max=${percentile(s.scores,100).toFixed(1)}  avg=${avg(s.scores).toFixed(1)}`);
    console.log(`  Decisions: ${JSON.stringify(s.decisions)}`);
    console.log(`  avg velocity_1h:              ${avg(s.velocity1h).toFixed(2)}`);
    console.log(`  avg withdrawal_after_deposit: ${avg(s.withdrawalAfterDeposit).toFixed(3)}`);
    console.log(`  avg daily_cumulative_thb:     ${avg(s.dailyCumulativeThb).toFixed(0)} THB`);
    console.log(`  avg amt_to_mean_ratio:        ${avg(s.amtToMeanRatio).toFixed(2)}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('CHECKPOINT CHECKS');
  console.log('='.repeat(70));

  const bg = stats['background'];
  const mf = stats['onboarding_mule_farm'];
  const sm = stats['sleeper_activation'];
  const app = stats['app_scam_cashout'];

  const check = (label: string, pass: boolean) => {
    console.log(`  ${pass ? '✅' : '❌'} ${label}`);
    return pass;
  };

  const results = [
    check('velocity_1h: mule farm > background',
      avg(mf.velocity1h) > avg(bg.velocity1h) + 1),
    check('velocity_1h: sleeper activation > background',
      avg(sm.velocity1h) > avg(bg.velocity1h) + 1),
    check('withdrawal_after_deposit: app scam > background',
      avg(app.withdrawalAfterDeposit) > avg(bg.withdrawalAfterDeposit) + 0.1),
    check('daily_cumulative_thb: mule farm > background',
      avg(mf.dailyCumulativeThb) > avg(bg.dailyCumulativeThb) + 5000),
    check('daily_cumulative_thb: sleeper > background',
      avg(sm.dailyCumulativeThb) > avg(bg.dailyCumulativeThb) + 5000),
    check('amt_to_mean_ratio not pinned at max (all background < 100)',
      bg.amtToMeanRatio.every((v) => v < 100)),
    check('background median score < 15',
      percentile(bg.scores, 50) < 15),
    check('fraud median score > background median + 5',
      Math.min(
        percentile(mf.scores, 50),
        percentile(sm.scores, 50),
        percentile(app.scores, 50),
      ) > percentile(bg.scores, 50) + 5),
    check('not all scores compressed in 7-20 range (fraud p75 > 20)',
      Math.max(
        percentile(mf.scores, 75),
        percentile(sm.scores, 75),
        percentile(app.scores, 75),
      ) > 20),
  ];

  const passed = results.filter(Boolean).length;
  console.log(`\n  ${passed}/${results.length} checks passed`);
  console.log(passed === results.length ? '\n  ✅ PART 0 CHECKPOINT: PASSED' : '\n  ❌ PART 0 CHECKPOINT: FAILED — do not proceed to Parts 1-3');
}

main().catch((e) => { console.error(e); process.exit(1); });
