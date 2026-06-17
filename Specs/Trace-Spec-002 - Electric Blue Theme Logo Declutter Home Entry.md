# Trace-Spec-002 — Ourox Trace Electric-Blue Light Theme + Logo + De-Clutter + Home Entry

**Project:** Ourox Trace  
**Spec:** Trace-Spec-002  
**Issued from:** Trace-Brief-002  
**Build mode:** Cursor AUTO mode, one-session scope  
**Status:** Implemented June 17, 2026

---

## Objective

Polish the existing Ourox Trace MVP with:

1. Dedicated `trace-*` light theme tokens using the electric-blue Trace identity.
2. Trace logo asset wired into the landing and case workspace header.
3. De-cluttered Trace presentation, especially the method-comparison panel.
4. Main Ourox home-page entry for Trace.

**Scope:** theme / presentation / navigation only. No workflow, math, AI-assist, audit/review, or boundary logic changes.

---

## Implementation Summary

### Part 1 — Trace light theme tokens

- Added `trace` namespace to `tailwind.config.ts` (primary `#2F7BF0`, cyan `#5BE1F0`, mid-blues, page `#F7FAFD`, card `#FFFFFF`, heading/body/secondary/border, obsidian `#101820`).
- Existing `signal-*` and `ourox-*` tokens unchanged.
- Re-skinned `app/trace/*` and `components/trace/*` from dark `ourox-*` to light `trace-*`.
- Status badges updated for accessible light-surface contrast; text labels always visible.

### Part 2 — Trace logo

- Copied `07 Reference/LOGO/Agentic trace LOGO/ourox-trace-path-electric-blue.svg` → `public/logos/ourox-trace-icon.svg`.
- Wired via `components/trace/TraceLogo.tsx` into `TraceLanding` and `TraceCaseHeader`.

### Part 3 — De-clutter

- `TraceMethodComparison`: same-pool comparison matrix above glance-first method cards; weakness/defensibility/uncertainty in "Why / caveats" disclosure; body text raised off 11px.
- `TraceVendorEvidence`: read-only packet summary first; hops table; notes/import in disclosure.
- `TraceFrozenPoolLedger`: key metrics prominent; caption retained.
- `TraceVictimAttributionTable`: primary columns first (victim, method, attributed, status, gaps); secondary columns quieter.
- `TraceBoundaryPanel`: visible on light background with obsidian/cyan synthetic banner.

### Part 4 — Home entry

- Added Trace to `data/ourox/products.ts` and home page product list.
- Updated platform enumeration to four layers (Ops, Verity, Arbiter, Trace).

### Part 5 — Tests

- `tests/trace/trace-theme.test.ts` — trace token presence; signal/ourox unchanged.
- `tests/trace/trace-methods.test.ts` — same-pool matrix presentation tests via `lib/trace/method-display.ts`.
- `tests/home-trace-entry.test.ts` — Trace entry, href, CTA, label.

---

## Locked IP Gate (confirmed)

- No workflow/math/AI/audit/boundary changes.
- No proof-layer content.
- No forbidden names.
- No real addresses or vendor keys.
- Ops / Verity / Arbiter unchanged (home entry + shared shell nav only).

---

## Done Criteria

All Trace-Spec-002 done criteria met locally. See Build Log for test/build/guardrail results. **Not pushed** — awaiting review.
