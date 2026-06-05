// Arbiter Phase 2 — Tuning Dataset Safety Tests
//
// Verifies that _scenario_label is present in the event file for evaluation
// but is excluded before scoring — complementary to scenario-exclusion.test.ts.

import { describe, it, expect } from 'vitest';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import type { ArbiterEvent } from '@/lib/arbiter/contract';
import mockingbirdRaw from '@/data/arbiter/mockingbird-events.json';

const events = mockingbirdRaw as ArbiterEvent[];

describe('Tuning dataset — counts and labels', () => {
  it('has at least 200 background events', () => {
    const count = events.filter((e) => e._scenario_label === 'background').length;
    expect(count).toBeGreaterThanOrEqual(200);
  });
  it('has at least 50 onboarding_mule_farm events', () => {
    const count = events.filter((e) => e._scenario_label === 'onboarding_mule_farm').length;
    expect(count).toBeGreaterThanOrEqual(50);
  });
  it('has at least 50 sleeper_activation events', () => {
    const count = events.filter((e) => e._scenario_label === 'sleeper_activation').length;
    expect(count).toBeGreaterThanOrEqual(50);
  });
  it('has at least 50 app_scam_cashout events', () => {
    const count = events.filter((e) => e._scenario_label === 'app_scam_cashout').length;
    expect(count).toBeGreaterThanOrEqual(50);
  });
  it('every event has a _scenario_label', () => {
    for (const e of events) {
      expect(e._scenario_label).toBeDefined();
    }
  });
});

describe('Tuning dataset — _scenario_label exclusion', () => {
  it('stripScenarioLabel removes _scenario_label from all events', () => {
    for (const e of events) {
      const safe = stripScenarioLabel(e);
      expect('_scenario_label' in safe).toBe(false);
    }
  });

  it('safe event is type-compatible with feature input (no label field)', () => {
    const event = events[0];
    const safe = stripScenarioLabel(event);
    // TypeScript: safe is Omit<ArbiterEvent, '_scenario_label'>
    // No _scenario_label key — ensure it's truly absent
    const keys = Object.keys(safe);
    expect(keys).not.toContain('_scenario_label');
  });
});
