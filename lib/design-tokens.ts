// SignalOS shared class maps (Spec-012).
// This file contains class-name strings ONLY — no logic, no data, no computation.
// It exists so screens can share a single source of surface/type treatments.

export const surface = {
  card: "rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle",
  cardPadded:
    "rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle",
  subtle:
    "rounded-signal border border-signal-borderSubtle bg-signal-surfaceSubtle",
  soft: "rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSoft",
};

export const text = {
  pageTitle: "text-[30px] leading-[38px] font-semibold tracking-tight text-signal-ink",
  pageSubtitle: "text-[15px] leading-6 text-signal-slate",
  sectionTitle: "text-lg font-semibold text-signal-ink",
  cardTitle: "text-[15px] font-semibold text-signal-ink",
  body: "text-sm leading-[22px] text-signal-body",
  meta: "text-[13px] text-signal-meta",
  label: "text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta",
  figure: "text-3xl font-semibold tabular-nums text-signal-ink",
};

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2";
