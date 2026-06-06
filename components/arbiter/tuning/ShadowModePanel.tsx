'use client';

import { useState, useMemo } from 'react';
import { runRuleBacktest, PRESET_RULES, type BacktestEvent, type CandidateRule } from '@/lib/arbiter/rule-backtest';
import { DEFAULT_THRESHOLDS } from '@/lib/arbiter/tuning';
import BacktestSampleTable from './BacktestSampleTable';

interface Props {
  backtestEvents: BacktestEvent[];
}

export default function ShadowModePanel({ backtestEvents }: Props) {
  const [selectedRuleId, setSelectedRuleId] = useState(PRESET_RULES[0].id);
  const [customThreshold, setCustomThreshold] = useState<string>('');
  const [active, setActive] = useState(false);

  const preset = PRESET_RULES.find((r) => r.id === selectedRuleId) ?? PRESET_RULES[0];
  const candidateThreshold = (() => {
    const parsed = parseFloat(customThreshold);
    return isNaN(parsed) ? preset.defaultThreshold : parsed;
  })();

  const candidateRule: CandidateRule = {
    ...preset.rule,
    name: `[SHADOW] ${preset.rule.name} (threshold: ${candidateThreshold})`,
    condition: { ...preset.rule.condition, threshold: candidateThreshold },
  };

  const shadowResult = useMemo(() => {
    if (!active) return null;
    return runRuleBacktest(backtestEvents, candidateRule, DEFAULT_THRESHOLDS);
  }, [active, backtestEvents, candidateRule]);  // eslint-disable-line react-hooks/exhaustive-deps

  const hits     = shadowResult?.shadowHits ?? [];
  const tpHits   = hits.filter((h) => h.scenarioLabel !== 'background');
  const fpHits   = hits.filter((h) => h.scenarioLabel === 'background');

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidian p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Shadow Mode</h3>
          <p className="text-ourox-ink/40 text-xs mt-1">
            Logging only — not affecting decision. Candidate rule fires hypothetically.
            Live decisions remain unchanged.
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${active ? 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20' : 'text-ourox-ink/30 border-ourox-obsidianLight'}`}>
          {active ? '● ACTIVE' : '○ INACTIVE'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-ourox-ink/50">Candidate rule</label>
          <select
            value={selectedRuleId}
            onChange={(e) => { setSelectedRuleId(e.target.value); setCustomThreshold(''); setActive(false); }}
            className="w-full bg-ourox-obsidian border border-ourox-obsidianLight rounded px-2 py-1.5 text-xs text-ourox-ink focus:outline-none focus:border-ourox-orange/50"
          >
            {PRESET_RULES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-ourox-ink/50">Threshold</label>
          <input
            type="number"
            step="any"
            placeholder={String(preset.defaultThreshold)}
            value={customThreshold}
            onChange={(e) => { setCustomThreshold(e.target.value); setActive(false); }}
            className="w-full bg-ourox-obsidian border border-ourox-obsidianLight rounded px-2 py-1.5 text-xs text-ourox-ink font-mono focus:outline-none focus:border-ourox-orange/50"
          />
        </div>
      </div>

      <button
        onClick={() => setActive((v) => !v)}
        className={`w-full text-xs font-semibold py-2 rounded-signalSm transition-colors ${
          active
            ? 'bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/30'
            : 'bg-ourox-orange hover:bg-ourox-orangeHover text-white'
        }`}
      >
        {active ? 'Deactivate Shadow Mode' : 'Activate Shadow Mode'}
      </button>

      {active && shadowResult && (
        <div className="space-y-3 pt-2 border-t border-ourox-obsidianLight">
          <div className="grid grid-cols-3 gap-3">
            <ShadowStat label="Total shadow hits" value={hits.length} color="text-yellow-400" />
            <ShadowStat label="Would be TP" value={tpHits.length} color="text-emerald-400" />
            <ShadowStat label="Would be FP" value={fpHits.length} color="text-red-400" />
          </div>

          <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-signalSm px-3 py-2">
            <p className="text-[11px] text-yellow-400/80 font-semibold">
              Note: Logging only — not affecting decision
            </p>
            <p className="text-[10px] text-ourox-ink/40 mt-0.5">
              The {hits.length} shadow hit(s) above show what the candidate rule WOULD have done.
              The live decision pipeline is unchanged.
            </p>
          </div>

          <BacktestSampleTable
            title="Shadow hit events (sample)"
            samples={hits}
            empty="No shadow hits"
          />
        </div>
      )}
    </div>
  );
}

function ShadowStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-ourox-obsidianLight/30 rounded-signalSm p-3 text-center space-y-1">
      <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[10px] text-ourox-ink/40">{label}</div>
    </div>
  );
}
