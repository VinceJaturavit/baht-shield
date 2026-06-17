"use client";

import type { TraceCase, TraceMethod } from "@/lib/trace/types";
import type { TraceAiAssistOutput } from "@/lib/trace/ai-assist";
import {
  buildSamePoolMatrix,
  TRACE_METHOD_DISPLAY_ORDER,
} from "@/lib/trace/method-display";
import { TraceAmount } from "./TraceAmount";
import { TraceAiAssistPanel } from "./TraceAiAssistPanel";
import { TraceLearningNote } from "./TraceLearningNote";

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

function MethodCard({
  comparison,
  asset,
  selected,
}: {
  comparison: TraceCase["methodComparisons"][number];
  asset: string;
  selected: boolean;
}) {
  const beneficiaries = comparison.allocations.filter((a) => a.allocatedAmount > 0 && a.role === "victim");
  const losers = comparison.allocations.filter((a) => a.allocatedAmount === 0 && a.role === "victim");

  return (
    <div
      className={`border rounded-lg overflow-hidden bg-trace-card ${
        selected ? "border-trace-primary ring-1 ring-trace-primary/30" : "border-trace-border"
      }`}
    >
      <div className="px-4 py-3 border-b border-trace-border bg-trace-surface">
        <h3 className="text-sm font-semibold text-trace-heading">{comparison.method}</h3>
      </div>
      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-trace-secondary">
              <th className="text-left py-1 font-medium">Party</th>
              <th className="text-right py-1 font-medium">Allocated</th>
            </tr>
          </thead>
          <tbody>
            {comparison.allocations.map((a) => (
              <tr key={a.victimId} className="border-t border-trace-border/60">
                <td className="py-1.5 text-trace-body">{a.victimNameSynthetic}</td>
                <td className="py-1.5 text-right">
                  <TraceAmount
                    amount={a.allocatedAmount}
                    asset={asset}
                    className="text-trace-heading font-medium"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-trace-body leading-relaxed">{comparison.assumption}</p>
      </div>
      <details className="border-t border-trace-border group">
        <summary className="px-4 py-2 text-xs font-medium text-trace-primary cursor-pointer hover:bg-trace-muted transition-colors">
          Defensibility review
        </summary>
        <div className="px-4 pb-3 space-y-2 text-xs text-trace-body">
          <p>
            <span className="font-medium text-trace-secondary">Why defensible: </span>
            {comparison.defensibility}
          </p>
          <p>
            <span className="font-medium text-trace-secondary">Who benefits: </span>
            {beneficiaries.length > 0
              ? beneficiaries.map((b) => `${b.victimNameSynthetic} (${b.allocatedAmount.toLocaleString()})`).join(", ")
              : "No supported victims fully allocated"}
          </p>
          <p>
            <span className="font-medium text-trace-secondary">Who loses: </span>
            {losers.length > 0
              ? losers.map((l) => l.victimNameSynthetic).join(", ")
              : "All supported victims receive allocation"}
          </p>
          <p>
            <span className="font-medium text-trace-secondary">Evidence required: </span>
            Supported deposit records and pool ledger chronology.
          </p>
          <p>
            <span className="font-medium text-trace-secondary">Reviewer challenge: </span>
            {comparison.weakness} {comparison.uncertainty}
          </p>
        </div>
      </details>
    </div>
  );
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
  const matrix = buildSamePoolMatrix(traceCase.methodComparisons);

  return (
    <section>
      <h2 className="text-sm font-semibold text-trace-heading mb-1">
        Choose a defensible recovery method
      </h2>
      <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
        The same frozen pool produces different victim outcomes depending on the accounting method,
        so the investigator must justify the selected method.
      </p>

      <div className="mb-4">
        <TraceLearningNote title="Why can't AI choose the method?">
          Method choice affects victim outcomes and may face reviewer or legal scrutiny. AI can
          compare methods and draft a rationale, but the investigator must make and justify the
          choice.
        </TraceLearningNote>
      </div>

      <h3 className="mb-2 text-xs font-semibold text-trace-heading">
        Same pool, different outcomes
      </h3>
      <div className="mb-6 overflow-hidden rounded-lg border border-trace-border bg-trace-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-trace-border bg-trace-surface text-left">
              <th className="px-4 py-2.5 font-medium text-trace-secondary w-[100px]"></th>
              {TRACE_METHOD_DISPLAY_ORDER.map((method) => (
                <th
                  key={method}
                  className={`px-4 py-2.5 font-semibold text-right ${
                    selectedMethod === method ? "text-trace-primary" : "text-trace-heading"
                  }`}
                >
                  {method}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.party} className="border-b border-trace-border/60 last:border-0">
                <td className="px-4 py-2.5 font-medium text-trace-body">{row.party}</td>
                {TRACE_METHOD_DISPLAY_ORDER.map((method) => {
                  const amount = row.allocations[method];
                  const highlight =
                    row.party === "Alice" && method === "FIFO" && amount === 10_000;
                  const highlightLifo =
                    row.party === "Alice" && method === "LIFO" && amount === 0;
                  return (
                    <td
                      key={method}
                      className={`px-4 py-2.5 text-right font-mono tabular-nums ${
                        highlight || highlightLifo
                          ? "font-semibold text-trace-primary bg-trace-primary/5"
                          : "text-trace-heading"
                      }`}
                    >
                      {amount.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        {traceCase.methodComparisons.map((comparison) => (
          <MethodCard
            key={comparison.method}
            comparison={comparison}
            asset={traceCase.asset}
            selected={selectedMethod === comparison.method}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-trace-border rounded-lg p-4 bg-trace-card">
          <h3 className="text-sm font-semibold text-trace-heading mb-3">
            Human method selection
          </h3>
          <p className="text-xs text-trace-secondary mb-4">
            No method is pre-selected. The investigator must choose and justify the method.
          </p>

          <fieldset className="mb-4">
            <legend className="text-xs font-medium text-trace-body mb-2">Selected method</legend>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((method) => (
                <label
                  key={method}
                  className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-xs cursor-pointer transition-colors ${
                    selectedMethod === method
                      ? "border-trace-primary bg-trace-primary/10 text-trace-primary"
                      : "border-trace-border text-trace-body hover:border-trace-primary/40"
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
            <label htmlFor="method-rationale" className="block text-xs font-medium text-trace-body mb-2">
              Rationale
            </label>
            <textarea
              id="method-rationale"
              value={methodRationale}
              onChange={(e) => onRationaleChange(e.target.value)}
              rows={4}
              placeholder="Explain why this method is defensible for this co-mingled pool..."
              className="w-full rounded border border-trace-border bg-trace-card px-3 py-2 text-xs text-trace-heading placeholder:text-trace-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
            />
            <button
              type="button"
              onClick={onUseRationaleStarter}
              className="mt-2 text-xs text-trace-secondary hover:text-trace-primary transition-colors"
            >
              Insert AI rationale starter (draft only — edit before saving)
            </button>
          </div>

          {saveError && (
            <p className="mb-3 text-xs text-red-700" role="alert">
              {saveError}
            </p>
          )}

          {methodSaved && (
            <p className="mb-3 text-xs text-emerald-700">
              Method selection saved. Attribution table updated. Audit events recorded.
            </p>
          )}

          <button
            type="button"
            onClick={onSave}
            className="rounded bg-trace-primary px-4 py-2 text-xs font-semibold text-white hover:bg-trace-blue1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary focus-visible:ring-offset-2 focus-visible:ring-offset-trace-card"
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
