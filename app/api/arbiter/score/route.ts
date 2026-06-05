// Arbiter Phase 1 — POST /api/arbiter/score
//
// Accepts a single ArbiterEvent or batch ArbiterEvent[].
// Pipeline per event:
//   1. Validate required fields
//   2. Strip _scenario_label   ← IP Gate enforcement point
//   3. Compute features (server-side context only; no client context)
//   4. Compute weighted score
//   5. Run Zen-Engine rules
//   6. Return event (with _scenario_label as display metadata), features, score, decision
//
// _scenario_label is never passed to features, score, or rules.

import { NextRequest, NextResponse } from 'next/server';
import type { ArbiterEvent, ArbiterScoreResponseItem } from '@/lib/arbiter/contract';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import { computeWeightedScore } from '@/lib/arbiter/score';
import { runArbiterRules } from '@/lib/arbiter/rules';

// ---------------------------------------------------------------------------
// Validation — minimal required fields check
// ---------------------------------------------------------------------------
const REQUIRED_FIELDS: Array<keyof ArbiterEvent> = [
  'event_id',
  'wallet_id',
  'timestamp',
  'amount_thb',
  'direction',
  'rail',
  'device_id',
  'ip_country',
];

function validateEvent(raw: unknown): { valid: true; event: ArbiterEvent } | { valid: false; error: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, error: 'Event must be a non-null object.' };
  }
  const obj = raw as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (obj[field] === undefined || obj[field] === null) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  if (typeof obj.amount_thb !== 'number') {
    return { valid: false, error: 'amount_thb must be a number.' };
  }
  if (typeof obj.has_facial_scan !== 'boolean') {
    return { valid: false, error: 'has_facial_scan must be a boolean.' };
  }
  return { valid: true, event: obj as unknown as ArbiterEvent };
}

// ---------------------------------------------------------------------------
// Score one event
// ---------------------------------------------------------------------------
async function scoreEvent(rawEvent: ArbiterEvent): Promise<ArbiterScoreResponseItem> {
  // Step 2: Strip _scenario_label — IP Gate. Safe event never has this field.
  const safeEvent = stripScenarioLabel(rawEvent);

  // Step 3: Compute features — server-side context only
  const features = await computeArbiterFeatures(safeEvent);

  // Step 4: Compute weighted score
  const scoreResult = computeWeightedScore(features);

  // Step 5: Build feature record for Zen-Engine input (key → value)
  const featureRecord: Record<string, number | boolean | string> = {};
  for (const f of features) {
    featureRecord[f.key] = f.value;
  }

  // Step 6: Run Zen-Engine rules (also never receives _scenario_label)
  const decisionResult = await runArbiterRules({
    event: safeEvent,
    features: featureRecord,
    score: scoreResult.score,
  });

  return {
    // Return the original event (including _scenario_label) for UI display only.
    // It was never passed to features, score, or rules.
    event: rawEvent,
    features,
    score: scoreResult,
    fired_rules: decisionResult.reasons,
    final_decision: decisionResult,
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Normalise input to array
  const rawEvents = Array.isArray(body) ? body : [body];

  if (rawEvents.length === 0) {
    return NextResponse.json({ error: 'At least one event required.' }, { status: 400 });
  }

  // Validate all events before scoring
  const validated: ArbiterEvent[] = [];
  for (let i = 0; i < rawEvents.length; i++) {
    const result = validateEvent(rawEvents[i]);
    if (!result.valid) {
      return NextResponse.json(
        { error: `Event[${i}]: ${result.error}` },
        { status: 400 },
      );
    }
    validated.push(result.event);
  }

  // Score all events (preserve order)
  const results: ArbiterScoreResponseItem[] = await Promise.all(
    validated.map((event) => scoreEvent(event)),
  );

  return NextResponse.json({ results });
}
