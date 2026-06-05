'use client';

import { useState, useMemo } from 'react';
import { runRuleBacktest, PRESET_RULES, type BacktestEvent, type CandidateRule } from '@/lib/arbiter/rule-backtest';
import { DEFAULT_THRESHOLDS, type ArbiterThresholds } from '@/lib/arbiter/tuning';
import BacktestSampleTable from './BacktestSampleTable';

interface Props {
  backtestEvents: BacktestEvent[];
  thresholds: ArbiterThresholds;
}

export default function RuleBacktestPanel({ backtestEvents, thresholds }: Props) {
  const [selectedRuleId, setSelectedRuleId] = useState(PRESET_RULES[1].id);  // R6 default
  const [customThreshold, setCustomThreshold] = useState<string>('');
  const [ran, setRan] = useState(false);

  const preset = PRESET_RULES.find((r) => r.id === selectedRuleId) ?? PRESET_RULES[0];

  const candidateThreshold = (() => {
    const parsed = parseFloat(customThreshold);
    return isNaN(parsed) ? preset.defaultThreshold : parsed;
  })();

  const candidateRule: CandidateRule = {
    ...preset.rule,
    name: `${preset.rule.name} (threshold: ${candidateThreshold})`,
    condition: { ...preset.rule.condition, threshold: candidateThreshold },
  };

  const result = useMemo(() => {
    if (!ran) return null;
    return runRuleBacktest(backtestEvents, candidateRule, thresholds);
  }, [ran, backtestEvents, candidateRule, thresholds]);  // eslint-disable-line react-hooks/exhaustive-deps

  function pct(v: number) { return `${(v * 100).toFixed(1)}%`; }
  function deltaStr(v: number, isPctFloat = false) {
    const s = isPctFloat ? pct(Math.abs(v)) : String(Math.abs(v));
    return v > 0 ? `+${s}` : v < 0 ? `-${s}` : '0';
  }

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-5">
      <div>
        <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Rule Back-Test</h3>
        <p className="text-ourox-ink/40 text-xs mt-1">
          Sandbox only — does not modify the live JDM. Simulate threshold changes before deployment.
        </p>
      </div>

      {/* Rule selector */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-ourox-ink/50">Rule to adjust</label>
          <select
            value={selectedRuleId}
            onChange={(e) => { setSelectedRuleId(e.target.value); setCustomThreshold(''); setRan(false); }}
            className="w-full bg-ourox-obsidian border border-ourox-obsidianLight rounded px-2 py-1.5 text-xs text-ourox-ink focus:outline-none focus:border-ourox-orange/50"
          >
            {PRESET_RULES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-ourox-ink/50">
            Threshold
            <span className="ml-1 text-ourox-ink/30">(default: {preset.defaultThreshold})</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder={String(preset.defaultThreshold)}
            value={customThreshold}
            onChange={(e) => { setCustomThreshold(e.target.value); setRan(false); }}
            className="w-full bg-ourox-obsidian border border-ourox-obsidianLight rounded px-2 py-1.5 text-xs text-ourox-ink font-mono focus:outline-none focus:border-ourox-orange/50"
          />
        </div>
      </div>

      <button
        onClick={() => setRan(true)}
        className="w-full bg-ourox-orange hover:bg-ourox-orangeHover text-white text-xs font-semibold py-2 rounded-signalSm transition-colors"
      >
        Run Back-Test
      </button>

      {result && (
        <div className="space-y-4 pt-2 border-t border-ourox-obsidianLight">
          {/* Metrics comparison */}
          <div className="grid grid-cols-2 gap-4">
            <MetricBlock label="Baseline" metrics={result.baselineMetrics} pct={pct} />
            <MetricBlock label="Candidate" metrics={result.candidateMetrics} pct={pct} />
          </div>

          {/* Delta */}
          <div className="bg-ourox-obsidianLight/30 rounded-signalSm p-3 space-y-1">
            <p className="text-xs text-ourox-ink/50 font-semibold mb-2">Impact (candidate − baseline)</p>
            {[
              ['TP', result.delta.tp, false],
              ['FP', result.delta.fp, false],
              ['FN', result.delta.fn, false],
              ['Precision', result.delta.precision, true],
              ['Recall', result.delta.recall, true],
              ['FPR', result.delta.falsePositiveRate, true],
              ['F1', result.delta.f1, true],
            ].map(([label, val, isPct]) => {
              const v = val as number;
              const isBad = (label === 'FP' || label === 'FPR') ? v > 0 : v < 0;
              const color = v === 0 ? 'text-ourox-ink/30' : isBad ? 'text-red-400' : 'text-emerald-400';
              return (
                <div key={String(label)} className="flex justify-between text-xs">
                  <span className="text-ourox-ink/50">{label}</span>
                  <span className={`font-mono font-semibold ${color}`}>
                    {deltaStr(v, isPct as boolean)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sample tables */}
          <BacktestSampleTable
            title={`Newly flagged (${result.newlyFlaggedEvents.length})`}
            samples={result.newlyFlaggedEvents}
            empty="No newly flagged events"
          />
          <BacktestSampleTable
            title={`No longer flagged (${result.noLongerFlaggedEvents.length})`}
            samples={result.noLongerFlaggedEvents}
            empty="No events un-flagged"
          />
        </div>
      )}
    </div>
  );
}

function MetricBlock({ label, metrics, pct }: { label: string; metrics: ReturnType<typeof runRuleBacktest>['baselineMetrics']; pct: (v: number) => string }) {
  return (
    <div className="bg-ourox-obsidianLight/30 rounded-signalSm p-3 space-y-1">
      <p className="text-xs font-semibold text-ourox-ink/60 mb-2">{label}</p>
      {[
        ['Precision', metrics.precision],
        ['Recall', metrics.recall],
        ['FPR', metrics.falsePositiveRate],
        ['F1', metrics.f1],
      ].map(([k, v]) => (
        <div key={String(k)} className="flex justify-between text-xs">
          <span className="text-ourox-ink/40">{k}</span>
          <span className="font-mono text-ourox-ink tabular-nums">{pct(v as number)}</span>
        </div>
      ))}
    </div>
  );
}
