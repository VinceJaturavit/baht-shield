#!/usr/bin/env node
/**
 * Arbiter Rules Integration Harness — Spec-001b
 *
 * Executes the real GoRules Zen-Engine JDM directly in a plain Node.js process.
 * This is Path B: a dedicated integration harness that can run independently
 * of the Vitest test runner.
 *
 * Usage:
 *   node tests/arbiter/rules.integration.mjs
 *   npm run test:arbiter-rules
 *
 * This harness FAILS (non-zero exit code) if:
 *   - @gorules/zen-engine fails to load
 *   - The JDM file cannot be read
 *   - Any R1–R6 test assertion fails
 *   - The precedence test fails
 *
 * It does NOT fall back to score-band logic. A load failure is a hard failure.
 *
 * Why this exists alongside Vitest (Path A):
 *   - Provides a CI-friendly command that runs outside the full Vitest suite
 *   - Can be triggered independently for rules verification
 *   - Serves as documentation that the real JDM is exercised
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const root = path.resolve(__dirname, '../..');

// ---------------------------------------------------------------------------
// Load Zen-Engine — hard failure if this throws
// ---------------------------------------------------------------------------
let ZenEngine;
try {
  const zenModule = require('@gorules/zen-engine');
  ZenEngine = zenModule.ZenEngine;
} catch (err) {
  console.error('[FAIL] @gorules/zen-engine failed to load:');
  console.error(err.message);
  console.error('\nThis is a hard failure. Options for Tower:');
  console.error('  1. Use a wasm build of Zen-Engine if supported');
  console.error('  2. Use a small dedicated rules service');
  console.error('  3. Use server-side pre-evaluation in a supported runtime');
  console.error('  4. Reassess whether GoRules remains the right Phase 1 dependency');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load JDM — hard failure if this throws
// ---------------------------------------------------------------------------
let jdm;
try {
  jdm = readFileSync(path.join(root, 'rules/arbiter/phase1_decisioning.jdm.json'));
} catch (err) {
  console.error('[FAIL] JDM file not found at rules/arbiter/phase1_decisioning.jdm.json');
  console.error(err.message);
  process.exit(1);
}

const engine = new ZenEngine();
const decision = engine.createDecision(jdm);

// ---------------------------------------------------------------------------
// Test runner (minimal, no dependencies)
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ---------------------------------------------------------------------------
// Base context: no named rules trigger at score = 10
// ---------------------------------------------------------------------------
const BASE = {
  amount_thb: 10_000,
  has_facial_scan: true,
  geo_velocity: 0,
  beneficiary_risk_tier: 'clean',
  account_age_days: 365,
  daily_cumulative_thb: 1000,
  withdrawal_after_deposit: 0,
  device_account_count: 1,
  score: 10,
};

async function evaluate(ctx) {
  const result = await decision.evaluate(ctx);
  const rows = Array.isArray(result?.result) ? result.result : [];
  // Apply precedence: BLOCK > REVIEW > STEP_UP > APPROVE
  const PREC = { BLOCK: 4, REVIEW: 3, STEP_UP: 2, APPROVE: 1 };
  const sorted = [...rows].sort((a, b) => (PREC[b.action] ?? 0) - (PREC[a.action] ?? 0));
  const action = sorted[0]?.action ?? 'APPROVE';
  return { action, rows };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
console.log('\n=== Arbiter Rules Integration Harness ===\n');

console.log('R1–R6 Named Rule Tests (score = 10, APPROVE band):');

await test('R1: amount > 50000 + no facial scan → STEP_UP / TH_FACIAL_SCAN_REQUIRED', async () => {
  const { action, rows } = await evaluate({ ...BASE, amount_thb: 60_000, has_facial_scan: false });
  assert(action === 'STEP_UP', `Expected STEP_UP, got ${action}`);
  const r1 = rows.find((r) => r.rule_id === 'R1');
  assert(r1 != null, 'R1 not found in fired rules');
  assert(r1.reason_code === 'TH_FACIAL_SCAN_REQUIRED', `Expected TH_FACIAL_SCAN_REQUIRED, got ${r1.reason_code}`);
});

await test('R2: geo_velocity > 900 → BLOCK / IMPOSSIBLE_TRAVEL', async () => {
  const { action, rows } = await evaluate({ ...BASE, geo_velocity: 9200 });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action}`);
  const r2 = rows.find((r) => r.rule_id === 'R2');
  assert(r2 != null, 'R2 not found in fired rules');
  assert(r2.reason_code === 'IMPOSSIBLE_TRAVEL', `Expected IMPOSSIBLE_TRAVEL, got ${r2.reason_code}`);
});

await test('R3: beneficiary_risk_tier = black → BLOCK / MULE_TARGET_PROHIBITED', async () => {
  const { action, rows } = await evaluate({ ...BASE, beneficiary_risk_tier: 'black' });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action}`);
  const r3 = rows.find((r) => r.rule_id === 'R3');
  assert(r3 != null, 'R3 not found in fired rules');
  assert(r3.reason_code === 'MULE_TARGET_PROHIBITED', `Expected MULE_TARGET_PROHIBITED, got ${r3.reason_code}`);
});

await test('R3: beneficiary_risk_tier = dark_grey → BLOCK / MULE_TARGET_PROHIBITED', async () => {
  const { action, rows } = await evaluate({ ...BASE, beneficiary_risk_tier: 'dark_grey' });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action}`);
  const r3 = rows.find((r) => r.rule_id === 'R3');
  assert(r3 != null, 'R3 not found in fired rules');
  assert(r3.reason_code === 'MULE_TARGET_PROHIBITED', `Expected MULE_TARGET_PROHIBITED, got ${r3.reason_code}`);
});

await test('R4: account_age_days < 7 + daily_cumulative_thb > 50000 → BLOCK / NEW_USER_DAILY_CAP', async () => {
  const { action, rows } = await evaluate({ ...BASE, account_age_days: 3, daily_cumulative_thb: 60_000 });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action}`);
  const r4 = rows.find((r) => r.rule_id === 'R4');
  assert(r4 != null, 'R4 not found in fired rules');
  assert(r4.reason_code === 'NEW_USER_DAILY_CAP', `Expected NEW_USER_DAILY_CAP, got ${r4.reason_code}`);
});

await test('R5: withdrawal_after_deposit > 0.9 + account_age_days < 30 → REVIEW / RAPID_PASS_THROUGH', async () => {
  const { action, rows } = await evaluate({ ...BASE, withdrawal_after_deposit: 0.95, account_age_days: 15 });
  assert(action === 'REVIEW', `Expected REVIEW, got ${action}`);
  const r5 = rows.find((r) => r.rule_id === 'R5');
  assert(r5 != null, 'R5 not found in fired rules');
  assert(r5.reason_code === 'RAPID_PASS_THROUGH', `Expected RAPID_PASS_THROUGH, got ${r5.reason_code}`);
});

await test('R6: device_account_count > 3 → REVIEW / DEVICE_SHARING', async () => {
  const { action, rows } = await evaluate({ ...BASE, device_account_count: 5 });
  assert(action === 'REVIEW', `Expected REVIEW, got ${action}`);
  const r6 = rows.find((r) => r.rule_id === 'R6');
  assert(r6 != null, 'R6 not found in fired rules');
  assert(r6.reason_code === 'DEVICE_SHARING', `Expected DEVICE_SHARING, got ${r6.reason_code}`);
});

console.log('\nPrecedence Test:');

await test('score = 10 + black-tier → BLOCK / MULE_TARGET_PROHIBITED (not APPROVE)', async () => {
  const { action, rows } = await evaluate({ ...BASE, beneficiary_risk_tier: 'black', score: 10 });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action} — BLOCK must override APPROVE score band`);
  assert(action !== 'APPROVE', 'Must not return APPROVE when R3 is active');
  const r3 = rows.find((r) => r.rule_id === 'R3');
  assert(r3?.reason_code === 'MULE_TARGET_PROHIBITED', `Expected MULE_TARGET_PROHIBITED`);
});

console.log('\nScore-Band Fallback Tests (no named rules active):');

await test('score 80 → BLOCK', async () => {
  const { action } = await evaluate({ ...BASE, score: 80 });
  assert(action === 'BLOCK', `Expected BLOCK, got ${action}`);
});

await test('score 60 → REVIEW', async () => {
  const { action } = await evaluate({ ...BASE, score: 60 });
  assert(action === 'REVIEW', `Expected REVIEW, got ${action}`);
});

await test('score 30 → STEP_UP', async () => {
  const { action } = await evaluate({ ...BASE, score: 30 });
  assert(action === 'STEP_UP', `Expected STEP_UP, got ${action}`);
});

await test('score 10 → APPROVE', async () => {
  const { action } = await evaluate({ ...BASE, score: 10 });
  assert(action === 'APPROVE', `Expected APPROVE, got ${action}`);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n=== ${passed + failed} tests: ${passed} passed, ${failed} failed ===`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed. Real GoRules JDM verified.\n');
}
