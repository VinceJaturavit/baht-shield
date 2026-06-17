"use client";

import type { TraceCase, TraceMethod } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import type { TraceAiAssistOutput } from "@/lib/trace/ai-assist";
import { TraceAmount } from "./TraceAmount";
import { TraceAiAssistPanel } from "./TraceAiAssistPanel";

const METHODS: TraceMethod[] = ["FIFO", "LIFO", "LIBR", "pro-rata"];

interface TraceMethodComparisonProps {
  traceCase: TraceCase;
  selectedMethod: TraceMethod | null;
  methodRationale: string;
  saveError: string | null;
  methodSaved: boolean;
  aiOutput: TraceAiAssistOutput;
  aiSummaryLogged: boolean;
  onSelectMethod: (method: TraceMethod) => void;
  onRationaleChange: (value: string) => void;
  onSave: () => void;
  onLogAiSummary: () => void;
  onUseRationaleStarter: () => void;
}

export function TraceMethodComparison({
  traceCase,
  selectedMethod,
  methodRationale,
  saveError,
  methodSaved,
  aiOutput,
  aiSummaryLogged,
  onSelectMethod,
  onRationaleChange,
  onSave,
  onLogAiSummary,
  onUseRationaleStarter,
}: TraceMethodComparisonProps) {
  return (
    <section>
      <p className="mb-2 text-xs text-ourox-yellow/90 font-medium">
        Same pool, different outcomes
      </p>
      <p className="mb-6 text-xs text-ourox-ink/60 leading-relaxed">
        {TRACE_BOUNDARY.methodComparisonCaption}
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        {traceCase.methodComparisons.map((comparison) => (
          <div
            key={comparison.method}
            className={`border rounded-lg overflow-hidden ${
              selectedMethod === comparison.method
                ? "border-ourox-orange"
                : "border-ourox-obsidianMid"
            }`}
          >
            <div className="px-3 py-2 border-b border-ourox-obsidianMid bg-ourox-obsidianLight">
              <h3 className="text-sm font-semibold text-ourox-ink">{comparison.method}</h3>
              <p className="mt-1 text-[11px] text-ourox-ink/60 leading-relaxed">
                {comparison.assumption}
              </p>
            </div>
            <div className="px-3 py-2">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-ourox-ink/40">
                    <th className="text-left py-1 font-medium">Party</th>
                    <th className="text-right py-1 font-medium">Allocated</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.allocations.map((a) => (
                    <tr key={a.victimId} className="border-t border-ourox-obsidianMid/30">
                      <td className="py-1.5 text-ourox-ink/80">{a.victimNameSynthetic}</td>
                      <td className="py-1.5 text-right">
                        <TraceAmount
                          amount={a.allocatedAmount}
                          asset={traceCase.asset}
                          className="text-ourox-ink/90"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 border-t border-ourox-obsidianMid space-y-2 text-[11px]">
              <p>
                <span className="text-ourox-ink/40">Weakness: </span>
                <span className="text-ourox-ink/70">{comparison.weakness}</span>
              </p>
              <p>
                <span className="text-ourox-ink/40">Defensibility: </span>
                <span className="text-ourox-ink/70">{comparison.defensibility}</span>
              </p>
              <p>
                <span className="text-ourox-ink/40">Uncertainty: </span>
                <span className="text-ourox-ink/70">{comparison.uncertainty}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-ourox-obsidianMid rounded-lg p-4">
          <h3 className="text-sm font-semibold text-ourox-ink mb-3">
            Human method selection
          </h3>
          <p className="text-xs text-ourox-ink/50 mb-4">
            No method is pre-selected. The investigator must choose and justify the method.
          </p>

          <fieldset className="mb-4">
            <legend className="text-xs font-medium text-ourox-ink/70 mb-2">Selected method</legend>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((method) => (
                <label
                  key={method}
                  className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-xs cursor-pointer transition-colors ${
                    selectedMethod === method
                      ? "border-ourox-orange bg-ourox-orange/10 text-ourox-orange"
                      : "border-ourox-obsidianMid text-ourox-ink/70 hover:border-ourox-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="trace-method"
                    value={method}
                    checked={selectedMethod === method}
                    onChange={() => onSelectMethod(method)}
                    className="sr-only"
                  />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mb-4">
            <label htmlFor="method-rationale" className="block text-xs font-medium text-ourox-ink/70 mb-2">
              Rationale
            </label>
            <textarea
              id="method-rationale"
              value={methodRationale}
              onChange={(e) => onRationaleChange(e.target.value)}
              rows={4}
              placeholder="Explain why this method is defensible for this co-mingled pool..."
              className="w-full rounded border border-ourox-obsidianMid bg-ourox-obsidian px-3 py-2 text-xs text-ourox-ink placeholder:text-ourox-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
            />
            <button
              type="button"
              onClick={onUseRationaleStarter}
              className="mt-2 text-[11px] text-ourox-ink/50 hover:text-ourox-orange transition-colors"
            >
              Insert AI rationale starter (draft only — edit before saving)
            </button>
          </div>

          {saveError && (
            <p className="mb-3 text-xs text-red-400" role="alert">
              {saveError}
            </p>
          )}

          {methodSaved && (
            <p className="mb-3 text-xs text-emerald-400">
              Method selection saved. Attribution table updated. Audit events recorded.
            </p>
          )}

          <button
            type="button"
            onClick={onSave}
            className="rounded bg-ourox-orange px-4 py-2 text-xs font-semibold text-ourox-obsidian hover:bg-ourox-orangeHover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian"
          >
            Save method selection
          </button>
        </div>

        <TraceAiAssistPanel
          output={aiOutput}
          onGenerateSummary={onLogAiSummary}
          summaryGenerated={aiSummaryLogged}
        />
      </div>
    </section>
  );
}
