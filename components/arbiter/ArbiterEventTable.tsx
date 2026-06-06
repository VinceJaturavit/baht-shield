"use client";

// Arbiter Phase 1 — Event Table
// Columns: wallet_id, amount_thb, decision, score, top driver, scenario label
// Features: sortable columns, filter by decision, filter by scenario, row click → drawer

import { useState, useMemo } from 'react';
import type { ArbiterScoreResponseItem, ArbiterDecision } from '@/lib/arbiter/contract';
import type { ArbiterScenarioLabel } from '@/lib/arbiter/contract';
import { DECISION_META, SCENARIO_META } from '@/lib/arbiter/scenario';
import { ArbiterDecisionBadge } from './ArbiterDecisionBadge';

interface Props {
  results: ArbiterScoreResponseItem[];
  onRowClick: (item: ArbiterScoreResponseItem) => void;
}

type SortKey = 'wallet_id' | 'amount_thb' | 'score' | 'decision';
type SortDir = 'asc' | 'desc';

const DECISION_OPTIONS: Array<ArbiterDecision | 'ALL'> = ['ALL', 'APPROVE', 'STEP_UP', 'REVIEW', 'BLOCK'];
const SCENARIO_OPTIONS: Array<ArbiterScenarioLabel | 'ALL'> = [
  'ALL',
  'onboarding_mule_farm',
  'sleeper_activation',
  'app_scam_cashout',
  'background',
];

function getTopDriver(item: ArbiterScoreResponseItem): string {
  const namedRule = item.final_decision.reasons.find((r) => r.rule_id !== 'SCORE_BAND');
  if (namedRule) return namedRule.reason_code;
  const top = item.score.contributions[0];
  return top ? top.key : '—';
}


function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? 'bg-ourox-orange' :
    score >= 50 ? 'bg-ourox-yellow' :
    score >= 25 ? 'bg-blue-500' :
    'bg-green-500';

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ourox-obsidianMid">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Score ${score}`}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs font-bold text-ourox-ink tabular-nums">
        {score.toFixed(0)}
      </span>
    </div>
  );
}

export function ArbiterEventTable({ results, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterDecision, setFilterDecision] = useState<ArbiterDecision | 'ALL'>('ALL');
  const [filterScenario, setFilterScenario] = useState<ArbiterScenarioLabel | 'ALL'>('ALL');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = useMemo(() => {
    let data = [...results];

    if (filterDecision !== 'ALL') {
      data = data.filter((r) => r.final_decision.action === filterDecision);
    }
    if (filterScenario !== 'ALL') {
      data = data.filter((r) => r.event._scenario_label === filterScenario);
    }

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'wallet_id') {
        cmp = a.event.wallet_id.localeCompare(b.event.wallet_id);
      } else if (sortKey === 'amount_thb') {
        cmp = a.event.amount_thb - b.event.amount_thb;
      } else if (sortKey === 'score') {
        cmp = a.score.score - b.score.score;
      } else if (sortKey === 'decision') {
        const PREC: Record<ArbiterDecision, number> = { BLOCK: 4, REVIEW: 3, STEP_UP: 2, APPROVE: 1 };
        cmp = PREC[a.final_decision.action] - PREC[b.final_decision.action];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [results, sortKey, sortDir, filterDecision, filterScenario]);

  function SortIcon({ k }: { k: SortKey }) {
    if (k !== sortKey) return <span className="text-ourox-ink/20">↕</span>;
    return <span className="text-ourox-orange">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  function ThBtn({ k, label }: { k: SortKey; label: string }) {
    return (
      <button
        onClick={() => handleSort(k)}
        className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wider text-ourox-ink/60 hover:text-ourox-ink transition-colors focus:outline-none focus-visible:underline"
        aria-sort={k === sortKey ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label} <SortIcon k={k} />
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Decision filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-decision" className="text-xs font-medium text-ourox-ink/60">
            Decision
          </label>
          <select
            id="filter-decision"
            value={filterDecision}
            onChange={(e) => setFilterDecision(e.target.value as ArbiterDecision | 'ALL')}
            className="rounded border border-ourox-obsidianMid bg-ourox-obsidianLight px-2 py-1 text-xs text-ourox-ink focus:outline-none focus:ring-1 focus:ring-ourox-orange"
          >
            {DECISION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All decisions' : DECISION_META[d as ArbiterDecision].displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Scenario filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-scenario" className="text-xs font-medium text-ourox-ink/60">
            Scenario
          </label>
          <select
            id="filter-scenario"
            value={filterScenario}
            onChange={(e) => setFilterScenario(e.target.value as ArbiterScenarioLabel | 'ALL')}
            className="rounded border border-ourox-obsidianMid bg-ourox-obsidianLight px-2 py-1 text-xs text-ourox-ink focus:outline-none focus:ring-1 focus:ring-ourox-orange"
          >
            {SCENARIO_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All scenarios' : (SCENARIO_META[s as ArbiterScenarioLabel]?.displayName ?? s)}
              </option>
            ))}
          </select>
        </div>

        <span className="ml-auto text-xs text-ourox-ink/40">
          {sorted.length} of {results.length} events
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-ourox-obsidianMid">
        <table className="w-full min-w-[700px] text-sm" aria-label="Scored events">
          <thead>
            <tr className="border-b border-ourox-obsidianMid bg-ourox-obsidianLight">
              <th className="px-4 py-3 text-left"><ThBtn k="wallet_id" label="Wallet" /></th>
              <th className="px-4 py-3 text-right"><ThBtn k="amount_thb" label="Amount" /></th>
              <th className="px-4 py-3 text-left"><ThBtn k="decision" label="Decision" /></th>
              <th className="px-4 py-3 text-right"><ThBtn k="score" label="Score" /></th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ourox-ink/60">
                Top Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ourox-ink/60">
                Scenario Label
                <span className="ml-1 text-ourox-ink/30 font-normal normal-case tracking-normal">(UI only)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-ourox-ink/40">
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              sorted.map((item) => {
                const scenMeta = item.event._scenario_label
                  ? SCENARIO_META[item.event._scenario_label]
                  : null;
                return (
                  <tr
                    key={item.event.event_id}
                    onClick={() => onRowClick(item)}
                    className="cursor-pointer border-b border-ourox-obsidianMid/50 transition-colors hover:bg-ourox-obsidianLight/60 focus-within:bg-ourox-obsidianLight/60"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for event ${item.event.event_id}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRowClick(item); }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-ourox-ink">{item.event.wallet_id}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-xs tabular-nums text-ourox-ink">
                        ฿{item.event.amount_thb.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ArbiterDecisionBadge decision={item.final_decision.action} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={item.score.score} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-ourox-obsidianMid px-2 py-0.5 font-mono text-xs text-ourox-yellow">
                        {getTopDriver(item)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {scenMeta ? (
                        <span
                          className="text-xs font-medium"
                          style={{ color: scenMeta.color }}
                          title="Synthetic label — not used in scoring"
                        >
                          {scenMeta.displayName}
                        </span>
                      ) : (
                        <span className="text-xs text-ourox-ink/30">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
