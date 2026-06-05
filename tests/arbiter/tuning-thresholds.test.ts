// Arbiter Phase 2 — Threshold Tuning Tests

import { describe, it, expect } from 'vitest';
import {
  applyThresholdsToScore,
  validateThresholds,
  DEFAULT_THRESHOLDS,
} from '@/lib/arbiter/tuning';

describe('applyThresholdsToScore — default boundaries (25/50/75)', () => {
  it('score < 25 → APPROVE', () => {
    expect(applyThresholdsToScore(0, DEFAULT_THRESHOLDS)).toBe('APPROVE');
    expect(applyThresholdsToScore(24.9, DEFAULT_THRESHOLDS)).toBe('APPROVE');
  });
  it('score 25-49 → STEP_UP', () => {
    expect(applyThresholdsToScore(25, DEFAULT_THRESHOLDS)).toBe('STEP_UP');
    expect(applyThresholdsToScore(49.9, DEFAULT_THRESHOLDS)).toBe('STEP_UP');
  });
  it('score 50-74 → REVIEW', () => {
    expect(applyThresholdsToScore(50, DEFAULT_THRESHOLDS)).toBe('REVIEW');
    expect(applyThresholdsToScore(74.9, DEFAULT_THRESHOLDS)).toBe('REVIEW');
  });
  it('score >= 75 → BLOCK', () => {
    expect(applyThresholdsToScore(75, DEFAULT_THRESHOLDS)).toBe('BLOCK');
    expect(applyThresholdsToScore(100, DEFAULT_THRESHOLDS)).toBe('BLOCK');
  });
});

describe('applyThresholdsToScore — custom boundaries', () => {
  it('lowered REVIEW threshold catches more events', () => {
    const aggressive = { approveStepUp: 20, stepUpReview: 35, reviewBlock: 70 };
    expect(applyThresholdsToScore(40, aggressive)).toBe('REVIEW');
    expect(applyThresholdsToScore(40, DEFAULT_THRESHOLDS)).toBe('STEP_UP');
  });

  it('raised REVIEW threshold reduces reviews', () => {
    const conservative = { approveStepUp: 30, stepUpReview: 60, reviewBlock: 80 };
    expect(applyThresholdsToScore(55, conservative)).toBe('STEP_UP');
    expect(applyThresholdsToScore(55, DEFAULT_THRESHOLDS)).toBe('REVIEW');
  });
});

describe('validateThresholds', () => {
  it('valid ordered thresholds → true', () => {
    expect(validateThresholds({ approveStepUp: 20, stepUpReview: 45, reviewBlock: 70 })).toBe(true);
  });
  it('equal values → false', () => {
    expect(validateThresholds({ approveStepUp: 25, stepUpReview: 25, reviewBlock: 75 })).toBe(false);
  });
  it('reversed middle → false', () => {
    expect(validateThresholds({ approveStepUp: 50, stepUpReview: 25, reviewBlock: 75 })).toBe(false);
  });
});
