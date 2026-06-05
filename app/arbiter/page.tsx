// Arbiter Phase 1 — /arbiter route
// Server component: loads sample events, passes to client explorer.
// OuroxShell provides the platform top bar.

import { getArbiterSampleEvents } from '@/lib/arbiter/sample-events';
import { ArbiterScoreExplorer } from '@/components/arbiter/ArbiterScoreExplorer';
import { OuroxShell } from '@/components/ourox/OuroxShell';

export const metadata = {
  title: 'Arbiter — Fraud Scoring & Decisioning · Ourox',
  description:
    'Arbiter Phase 1: transparent weighted fraud scoring and GoRules JDM decisioning. Synthetic data only.',
};

export default async function ArbiterPage() {
  const events = await getArbiterSampleEvents();
  return (
    <OuroxShell currentProduct="Arbiter">
      <ArbiterScoreExplorer initialEvents={events} />
    </OuroxShell>
  );
}
