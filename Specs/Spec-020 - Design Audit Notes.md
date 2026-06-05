# Spec-020 — Design Audit Notes

**Spec:** Spec-020 — Ourox Design Revamp  
**Auditor:** Cursor Build node  
**Audit date:** 2026-06-05  
**Status:** Pre-implementation audit

---

## Route `/` — Ourox Home

| Check | Finding |
|---|---|
| Shell / header | OuroxShell with dark top bar. Consistent with Arbiter. ✓ |
| Logo state | 6-segment D2-C Heavy mark (wrong variant). Needs 10-segment replacement. ✗ |
| Favicon / browser title | `app/icon.svg` is a Verity waveform mark (not Ourox mark). ✗ |
| Theme / color | Dark `ourox-*` tokens throughout. ✓ |
| Typography / spacing | Generous outer spacing. Montserrat wordmark present. ✓ |
| Primary task within 3s | Two product CTAs visible. Clear. ✓ |
| Status indicator | N/A |
| Synthetic-data visibility | Space-mono meta line present. ✓ |
| Builder attribution | **Missing.** LinkedIn/GitHub/attribution only in IntroOverlay (Verity-only overlay). ✗ |
| Purpose clarity | Generic "learning and demonstration" — understates the portfolio case. Should-fix. |
| SignalOS regression | None found. ✓ |
| Dark re-theme risk | Already dark. None. ✓ |
| Obvious friction | Attribution and purpose buried. Products are clear. |

**Highest-impact changes:** Add attribution block + purpose paragraph below platform intro. Replace logo mark.

---

## Route `/verity` (and all Verity sub-routes)

| Check | Finding |
|---|---|
| Shell / header | AppShell — white header on light gray background. Mismatches home and Arbiter. ✗ |
| Logo state | 6-segment mark in nav (inherits OuroxMark). Needs 10-segment. ✗ |
| Favicon / browser title | `app/icon.svg` is Verity waveform. Browser favicon mismatches Ourox. ✗ |
| Theme / color | **LIGHT** — `signal-*` tokens mapped to white/light-gray palette. Full mismatch with home and Arbiter. ✗ |
| Typography / spacing | Good hierarchy, readable density. ✓ |
| Primary task within 3s | Dashboard landing loads metric cards immediately. ✓ |
| Status indicator | Color-based severity bars only — no text labels on bar chart. Should-fix (a11y). |
| Synthetic-data visibility | SyntheticDataLabel bar below header. ✓ |
| SignalOS regression | None found. ✓ |
| Dark re-theme risk | **MEDIUM** — see theming assessment below. |
| Obvious friction | Theme mismatch creates visual context switch between home → Verity. |

---

## Route `/arbiter`

| Check | Finding |
|---|---|
| Shell / header | OuroxShell dark. ✓ |
| Logo state | 6-segment mark (wrong). ✗ |
| Favicon / browser title | Same as above. ✗ |
| Theme / color | Dark `ourox-*` tokens. ✓ |
| Typography / spacing | Clean. Phase badge clear. ✓ |
| Primary task within 3s | "Re-score" button above fold. ✓ |
| Status indicator | Decision badges (APPROVE/REVIEW/BLOCK) use color only in table. Should-fix. |
| Synthetic-data visibility | ArbiterSyntheticBanner present. ✓ |
| Scoring / Tuning nav | **Missing.** No visible path from `/arbiter` → `/arbiter/tuning`. ✗ |
| SignalOS regression | None found. ✓ |
| Dark re-theme risk | Already dark. None. ✓ |
| Obvious friction | Tuning workspace completely hidden from Scoring explorer. |

---

## Route `/arbiter/tuning`

| Check | Finding |
|---|---|
| Shell / header | OuroxShell dark. ✓ |
| Logo state | 6-segment mark (wrong). ✗ |
| Theme / color | Dark `ourox-*` tokens. ✓ |
| Primary task within 3s | Tuning purpose not immediately described — just sliders and matrix load. Should-fix. |
| Status indicator | Decision labels in matrix use text. ✓ |
| Scoring / Tuning nav | **Missing.** No way back to `/arbiter` from tuning. ✗ |
| SignalOS regression | None found. ✓ |
| Dark re-theme risk | Already dark. None. ✓ |
| Obvious friction | Feels isolated; purpose of tuning vs scoring distinction unclear at first glance. |

---

## Verity Theming Assessment (Pre-Part 3)

**Verdict: MIXED — token-driven primary, with targeted hardcoded instances.**

### Token-driven (`signal-*` tokens):
All Verity components use `signal-*` Tailwind tokens (bg-signal-surface, text-signal-ink, border-signal-border, etc.). Current token values map to a **light palette**. The cleanest re-theme path is **token remap in `tailwind.config.ts`** + **CSS var update in `globals.css`**.

### Hardcoded `bg-white` instances (11 total, 10 files):
- `components/AppShell.tsx` — lines 54, 128 (header + synthetic bar)
- `components/IntroOverlay.tsx` — line 82 (dialog card)
- `components/AlertQueueTable.tsx` — line 127 (pagination/row state)
- `components/command/CommandBar.tsx` — line 40 (kbd shortcut chip)
- `components/wallet/DeviceSimPanel.tsx` — lines 47, 78 (chip badges)
- `components/wallet/WalletSummaryPanel.tsx` — line 78 (tab state)
- `components/patterns/PatternDetailPanel.tsx` — line 12 (probable status class)
- `components/patterns/PatternLibraryList.tsx` — line 13 (probable status class)
- `components/wallet/ClosureNotePreview.tsx` — line 37 (note container)
- `components/wallet/EvidenceToggleGroup.tsx` — line 69 (toggle inactive state)
- `components/wallet/ClosureNoteBuilder.tsx` — line 85 (tab bar)

### Additional hardcoded light classes (3 instances, 2 files):
- `components/cases/CaseHeader.tsx` — `bg-indigo-500`, `bg-slate-400` (investigation status dot)
- `components/patterns/PatternLibraryList.tsx` — `bg-gray-100 text-gray-600` (unknown status fallback)

### Special fix required:
- `IntroOverlay.tsx` line 75: `bg-signal-ink/40` backdrop — after remap `signal.ink` becomes `#ECEFF3` (light), so this backdrop would become a white flash. Must change to `bg-black/60`.

**Safest re-theme path:**
1. Remap `signal.*` tokens in `tailwind.config.ts` to Ourox dark equivalents (orange replaces indigo as accent).
2. Update `globals.css` CSS vars.
3. Replace all `bg-white` → `bg-signal-surface`.
4. Fix IntroOverlay backdrop.
5. Fix 3 isolated hardcoded instances.

**Risk level: LOW** (all hardcoded instances found, finite scope, no layout changes needed).

---

## Smallest High-Impact Changes (Priority Order)

1. **Must fix:** Logo mark → 10-segment (all surfaces)
2. **Must fix:** Favicon → Ourox mark
3. **Must fix:** Landing attribution (missing entirely from home)
4. **Must fix:** Arbiter Scoring/Tuning nav (tuning is invisible)
5. **Must fix:** Verity dark re-theme (visual coherence across platform)
6. **Should fix:** Landing purpose paragraph (clearer context)
7. **Should fix:** Arbiter decision labels — add text alongside color
8. **Should fix:** Tuning page purpose header
9. **Nice to have:** Naming line on landing (if calm)
10. **Defer:** Full a11y audit of status colors

---

## No Scoring / Rules / Data Changes Needed
Confirmed: all changes are design, branding, copy, and visual theme only. No scoring, rules, JDM, weights, data, or API changes required.

---

## Implementation Outcome

- **logo corrected:** Yes — `OuroxMark` replaced with exact 10-segment SVG (400×400 viewBox, 10 arc segments, 5 nodes, chord lines hidden ≤32px). Used in `OuroxShell` nav (22px), `AppShell` nav (22px), and landing hero (52px). Old 6-segment D2-C Heavy mark removed.
- **favicon corrected:** Yes — `app/icon.svg` updated to corrected Ourox mark (no wordmark, 400×400). Old Verity waveform favicon replaced.
- **landing attribution:** Yes — `app/page.tsx` updated with purpose paragraph, builder attribution block, LinkedIn + GitHub links (URLs copied exactly from `IntroOverlay.tsx` constants). Attribution is calm, below the hero, above product entries.
- **Verity dark re-theme approach:** Token remap (primary) + targeted hardcoded fixes. `signal.*` tokens in `tailwind.config.ts` remapped to dark equivalents (indigo → orange as primary accent). CSS vars in `globals.css` updated. All 11 `bg-white` instances replaced with `bg-signal-surface`. IntroOverlay backdrop changed from `bg-signal-ink/40` to `bg-black/60`. 3 isolated raw Tailwind classes fixed (`bg-indigo-500` → `bg-signal-indigo`, `bg-slate-400` → `bg-signal-faintSlate`, `bg-gray-100 text-gray-600` → `bg-signal-surfaceSubtle text-signal-meta`). Additional `text-slate-500`/`text-slate-400`/`text-ink` instances fixed.
- **Verity dark checkpoint:** PASS — all Verity screens (dashboard, alert queue, cases, wallets/entities, pattern intelligence, analytics, settings, wallet detail) use `signal-*` tokens which now resolve to dark. No half-dark state. No light panels floating. IntroOverlay overlay modal is dark. Build passed. Tests passed.
- **Arbiter scoring/tuning nav:** Yes — new `ArbiterSectionNav` component created. Integrated into `ArbiterScoreExplorer` (below header, above synthetic banner) and `ArbiterTuningWorkspace` (below header section, above score-band explainer). Active tab underline in orange. Scoring tab active on `/arbiter`, Tuning tab active on `/arbiter/tuning`.
- **doctrine pass:** Landing: hierarchy clean (logo → purpose → attribution → products), synthetic line visible, attribution calm. Arbiter tuning header updated to consistent page title format with phase badge. Decision chips in event table already have text + icon (not color-only). No decorative gradients, no animation, no card soup.
- **tests:** `npm test` — 153/153 passed. `npm run test:slow` — 3/3 passed (score-distribution). No regressions.
- **build:** `npm run build` — passed. All 15 routes compiled. No TypeScript or linting errors.
- **open risks:** None identified. All Verity screens render dark. No scoring/rules/data changes made. No SignalOS reintroduced.
