'use client';

import { DEFAULT_WEIGHTS } from '@/lib/arbiter/tuning';

interface Props {
  weights: Record<string, number>;
  onChange: (weights: Record<string, number>) => void;
}

const FEATURE_LABELS: Record<string, string> = {
  amt_to_mean_ratio:        'Amount / 30d Mean',
  velocity_1h:              'Velocity (1h)',
  account_age_days:         'Account Age (days)',
  is_new_beneficiary:       'New Beneficiary',
  device_account_count:     'Device Account Count',
  withdrawal_after_deposit: 'Withdrawal After Deposit',
  sleeper_velocity_shock:   'Sleeper Velocity Shock',
  geo_velocity:             'Geo Velocity (km/h)',
  is_night_transaction:     'Night Transaction',
  daily_cumulative_thb:     'Daily Cumulative (THB)',
  beneficiary_risk_tier:    'Beneficiary Risk Tier',
  pattern_match_count:      'Pattern Match Count',
};

export default function FeatureWeightEditor({ weights, onChange }: Props) {
  function update(key: string, value: string) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onChange({ ...weights, [key]: num });
    }
  }

  function resetAll() {
    onChange({ ...DEFAULT_WEIGHTS });
  }

  function resetOne(key: string) {
    onChange({ ...weights, [key]: DEFAULT_WEIGHTS[key] ?? 0 });
  }

  return (
    <div className="bg-ourox-obsidianMid rounded-signal border border-ourox-obsidianLight p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-ourox-ink text-sm font-semibold tracking-wide">Feature Weights</h3>
          <p className="text-ourox-ink/40 text-xs mt-0.5">
            Sandbox only — production config unchanged.
          </p>
        </div>
        <button
          onClick={resetAll}
          className="text-xs text-ourox-orange hover:text-ourox-orangeHover transition-colors"
        >
          Reset all
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {Object.entries(DEFAULT_WEIGHTS).map(([key, defaultVal]) => {
          const current = weights[key] ?? defaultVal;
          const changed = current !== defaultVal;
          return (
            <div key={key} className={`flex items-center gap-3 px-3 py-2 rounded-signalSm ${changed ? 'bg-ourox-orange/5 border border-ourox-orange/20' : 'bg-ourox-obsidianLight/30'}`}>
              <span className="flex-1 text-xs text-ourox-ink/70 truncate" title={key}>
                {FEATURE_LABELS[key] ?? key}
                {defaultVal < 0 && (
                  <span className="ml-1 text-[10px] text-ourox-ink/30">(inverted)</span>
                )}
              </span>
              <input
                type="number"
                step={1}
                value={current}
                onChange={(e) => update(key, e.target.value)}
                className="w-16 bg-ourox-obsidian border border-ourox-obsidianLight rounded px-2 py-0.5 text-xs text-ourox-ink font-mono text-right focus:outline-none focus:border-ourox-orange/50"
              />
              {changed && (
                <button
                  onClick={() => resetOne(key)}
                  className="text-[10px] text-ourox-ink/30 hover:text-ourox-orange transition-colors"
                  title={`Reset to ${defaultVal}`}
                >
                  ↩ {defaultVal}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
