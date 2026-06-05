// Arbiter Phase 1 — /arbiter route
// Server component: loads sample events, passes to client explorer.
// Ourox palette applied via bg-ourox-obsidian on the explorer wrapper.

import { getArbiterSampleEvents } from '@/lib/arbiter/sample-events';
import { ArbiterScoreExplorer } from '@/components/arbiter/ArbiterScoreExplorer';

export const metadata = {
  title: 'Arbiter — Fraud Scoring & Decisioning · Ourox',
  description:
    'Arbiter Phase 1: transparent weighted fraud scoring and GoRules JDM decisioning. Synthetic data only.',
};

export default async function ArbiterPage() {
  const events = await getArbiterSampleEvents();
  return <ArbiterScoreExplorer initialEvents={events} />;
}
