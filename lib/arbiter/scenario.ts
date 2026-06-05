// Arbiter Phase 1 — Scenario metadata (UI only)
// Scenario labels are DISPLAY metadata only. They must never influence
// feature computation, scoring, or rule evaluation.

import type { ArbiterScenarioLabel, ArbiterDecision } from './contract';

export interface ScenarioMeta {
  label: ArbiterScenarioLabel;
  displayName: string;
  color: string;       // Ourox palette token-safe hex
  description: string;
}

export const SCENARIO_META: Record<ArbiterScenarioLabel, ScenarioMeta> = {
  onboarding_mule_farm: {
    label: 'onboarding_mule_farm',
    displayName: 'Onboarding Mule Farm',
    color: '#FF8200',
    description: 'Newly onboarded wallets sharing devices and pushing outbound funds.',
  },
  sleeper_activation: {
    label: 'sleeper_activation',
    displayName: 'Sleeper Activation',
    color: '#FFC72C',
    description: 'Long-dormant wallet suddenly making high-value outbound transfers.',
  },
  app_scam_cashout: {
    label: 'app_scam_cashout',
    displayName: 'APP Scam Cash-out',
    color: '#DC2626',
    description: 'Authorised-push-payment scam victim funds routed to high-risk endpoints.',
  },
  background: {
    label: 'background',
    displayName: 'Background',
    color: '#647084',
    description: 'Normal, expected transaction behaviour.',
  },
};

export interface DecisionMeta {
  label: ArbiterDecision;
  displayName: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const DECISION_META: Record<ArbiterDecision, DecisionMeta> = {
  BLOCK: {
    label: 'BLOCK',
    displayName: 'Block',
    icon: '⛔',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-700',
  },
  REVIEW: {
    label: 'REVIEW',
    displayName: 'Review',
    icon: '🔍',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-700',
  },
  STEP_UP: {
    label: 'STEP_UP',
    displayName: 'Step Up',
    icon: '🔐',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
  },
  APPROVE: {
    label: 'APPROVE',
    displayName: 'Approve',
    icon: '✅',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    textClass: 'text-green-700',
  },
};
