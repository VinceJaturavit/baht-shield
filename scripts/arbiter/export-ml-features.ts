/**
 * Arbiter Phase 3 — ML Feature Export
 *
 * Runs the full Arbiter feature pipeline over all labeled Mockingbird events
 * and writes pre-computed feature values + scores to:
 *   data/arbiter/ml/precomputed-features.json
 *
 * The Python training script (train_ml_model.py) reads this file to obtain
 * the exact feature values the app computes, without reimplementing TypeScript
 * feature logic in Python.
 *
 * _scenario_label is captured here for use as the offline training label only.
 * It is stripped before the feature pipeline (IP Gate) and re-attached to the
 * export record as a label column — never as a feature value.
 *
 * Run: tsx scripts/arbiter/export-ml-features.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { stripScenarioLabel } from '../../lib/arbiter/contract';
import { computeArbiterFeatures } from '../../lib/arbiter/features';
import { computeWeightedScore } from '../../lib/arbiter/score';
import { runArbiterRules } from '../../lib/arbiter/rules';
import type { ArbiterEvent } from '../../lib/arbiter/contract';
import mockingbirdRaw from '../../data/arbiter/mockingbird-events.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const OUT_DIR  = path.resolve(__dirname, '../../data/arbiter/ml');
const OUT_FILE = path.join(OUT_DIR, 'precomputed-features.json');

async function main() {
  const events = mockingbirdRaw as ArbiterEvent[];
  const records: Record<string, unknown>[] = [];

  console.log(`Exporting features for ${events.length} events...`);

  for (const event of events) {
    // IP Gate: strip _scenario_label before any pipeline step
    const scenarioLabel = event._scenario_label;
    const safeEvent = stripScenarioLabel(event);

    const featureResults = await computeArbiterFeatures(safeEvent);
    const scoreResult    = computeWeightedScore(featureResults);

    const featureMap: Record<string, number | boolean | string> = {};
    for (const f of featureResults) featureMap[f.key] = f.value;

    const normalizedMap: Record<string, number> = {};
    for (const f of featureResults) normalizedMap[f.key] = f.normalized_value ?? 0;

    const ruleResult = await runArbiterRules({
      event: safeEvent,
      features: featureMap,
      score: scoreResult.score,
    });

    // _scenario_label is attached as label metadata only — it is not part of
    // the feature vector and must not be used as a training feature.
    records.push({
      event_id:             event.event_id,
      wallet_id:            event.wallet_id,
      // Offline label only — stripped before all pipeline steps above
      _scenario_label:      scenarioLabel,
      features:             featureMap,
      normalized_features:  normalizedMap,
      rule_weighted_score:  scoreResult.score,
      rule_final_decision:  ruleResult.action,
      rule_reason_codes:    ruleResult.reason_codes ?? [],
      contributions: scoreResult.contributions.map((c) => ({
        key:    c.key,
        weight: c.weight,
        points: c.points,
      })),
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(records, null, 2), 'utf8');

  console.log(`Wrote ${records.length} records to ${OUT_FILE}`);

  const labels: Record<string, number> = {};
  for (const r of records) {
    const l = String(r._scenario_label ?? 'unknown');
    labels[l] = (labels[l] ?? 0) + 1;
  }
  console.log('\nLabel breakdown:');
  for (const [label, count] of Object.entries(labels)) {
    console.log(`  ${label}: ${count}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
