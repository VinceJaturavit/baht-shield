const FLOW_NODES: {
  id: string;
  label: string;
  detail: string;
  highlight?: boolean;
}[] = [
  { id: "deposits", label: "Victim deposits", detail: "Alice 10,000 · Bob 10,000" },
  { id: "fraud", label: "Fraud wallets", detail: "Scammer 5,000" },
  { id: "consolidation", label: "Consolidation", detail: "" },
  { id: "pool", label: "Co-mingled pool", detail: "Pool 25,000" },
  { id: "vasp", label: "VASP freeze", detail: "Frozen 12,000", highlight: true },
  { id: "backtrace", label: "Recovery backtrace", detail: "" },
];

export function TraceMiniFlow() {
  return (
    <figure className="rounded border border-trace-border bg-trace-card px-4 py-3">
      <figcaption className="sr-only">Simplified synthetic trace path</figcaption>
      <ol className="flex flex-col gap-1" aria-label="Simplified trace path">
        {FLOW_NODES.map((node, index) => (
          <li key={node.id} className="flex items-stretch gap-2">
            <div className="flex flex-col items-center w-5 shrink-0">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  node.highlight
                    ? "bg-trace-primary text-white"
                    : "bg-trace-surface border border-trace-border text-trace-secondary"
                }`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              {index < FLOW_NODES.length - 1 && (
                <span className="w-px flex-1 min-h-[8px] bg-trace-border" aria-hidden="true" />
              )}
            </div>
            <div
              className={`flex-1 pb-2 ${
                node.highlight ? "rounded border border-trace-primary/40 bg-trace-primary/5 px-2 py-1" : ""
              }`}
            >
              <span className="text-xs font-medium text-trace-heading">{node.label}</span>
              {node.detail && (
                <span className="ml-2 text-xs text-trace-secondary">{node.detail}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[11px] text-trace-secondary border-t border-trace-border pt-2">
        Simplified synthetic trace path — not a vendor graph.
      </p>
    </figure>
  );
}
