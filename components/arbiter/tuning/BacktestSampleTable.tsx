'use client';

import type { ArbiterBacktestSample } from '@/lib/arbiter/rule-backtest';
import type { ArbiterDecision } from '@/lib/arbiter/contract';

interface Props {
  title: string;
  samples: ArbiterBacktestSample[];
  empty?: string;
}

const DECISION_COLORS: Record<ArbiterDecision, string> = {
  BLOCK:   'bg-red-900/30 text-red-400 border-red-500/30',
  REVIEW:  'bg-orange-900/30 text-orange-400 border-orange-500/30',
  STEP_UP: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  APPROVE: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20',
};

const SCENARIO_SHORT: Record<string, string> = {
  onboarding_mule_farm: 'mule_farm',
  sleeper_activation:   'sleeper',
  app_scam_cashout:     'app_scam',
  background:           'background',
};

function DecisionBadge({ decision }: { decision: ArbiterDecision }) {
  return (
    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border ${DECISION_COLORS[decision]}`}>
      {decision}
    </span>
  );
}

export default function BacktestSampleTable({ title, samples, empty = 'No events' }: Props) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-ourox-ink/60 uppercase tracking-wider">{title}</h4>
      {samples.length === 0 ? (
        <p className="text-xs text-ourox-ink/30 italic">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ourox-obsidianLight">
                <th className="text-left text-ourox-ink/40 font-medium py-1.5 pr-3">Event ID</th>
                <th className="text-left text-ourox-ink/40 font-medium py-1.5 pr-3">Scenario</th>
                <th className="text-right text-ourox-ink/40 font-medium py-1.5 pr-3">Score</th>
                <th className="text-center text-ourox-ink/40 font-medium py-1.5 pr-3">Baseline</th>
                <th className="text-center text-ourox-ink/40 font-medium py-1.5">Candidate</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((s) => (
                <tr key={s.eventId} className="border-b border-ourox-obsidianLight/30">
                  <td className="py-1.5 pr-3 font-mono text-ourox-ink/60">{s.eventId}</td>
                  <td className="py-1.5 pr-3 text-ourox-ink/60">
                    {SCENARIO_SHORT[s.scenarioLabel ?? ''] ?? s.scenarioLabel ?? '—'}
                  </td>
                  <td className="py-1.5 pr-3 text-right font-mono text-ourox-ink/80 tabular-nums">
                    {s.score.toFixed(1)}
                  </td>
                  <td className="py-1.5 pr-3 text-center">
                    <DecisionBadge decision={s.baselineDecision} />
                  </td>
                  <td className="py-1.5 text-center">
                    <DecisionBadge decision={s.candidateDecision} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {samples.length >= 20 && (
            <p className="text-[10px] text-ourox-ink/30 mt-1">Showing first 20 samples.</p>
          )}
        </div>
      )}
    </div>
  );
}
