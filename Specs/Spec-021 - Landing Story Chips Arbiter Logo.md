# Spec-021 — Landing Story, Verity Dark Chips, Arbiter Logo + De-Emoji

**Project:** Ourox / baht-shield app
**Spec:** Spec-021
**Issued from:** Brief-021
**Target executor:** Cursor
**Write this spec to:** `Specs/Spec-021 - Landing Story Chips Arbiter Logo.md`
**Reference assets:** `07 Reference/LOGO/Arbiter Logo/`
**Reference doctrine:** `07 Reference/Design Doctrine/Design Doctrine — Google-Inspired Enterprise UX for AI-Built Products.md`
**Push discipline:** Execute locally, run build/tests, report before push. Do not push without approval.

---

## 0. Objective

Polish the live Ourox platform after Spec-020.

This loop does three things:

1. Replace the landing attribution with a story-driven builder explanation.
2. Restyle Verity chips/pills so they fit the dark Ourox theme.
3. Remove all emoji from Arbiter and adopt the Arbiter dial logo.

This is **copy, styling, and branding only**.

---

## 1. Locked IP Gate

This spec may change only:

* landing copy
* attribution copy
* chip styling
* visual hierarchy
* icons
* logo usage
* spacing
* typography
* non-functional UI labels

This spec must not change:

* scoring logic
* feature logic
* rule logic
* JDM
* weights
* synthetic data
* Mockingbird data
* `/api/arbiter/score`
* Phase 3 ML
* SHAP
* calibration
* geo-realism
* Verity functionality
* Arbiter functionality

Landing copy must remain separation-compliant:

* no named employer projects
* no named internal programs
* no prior-employer system names
* no confidential workflows
* generic crypto-fraud-ops framing only
* synthetic-data honesty stays visible

---

## 2. Out of Scope

Do not build:

* no scoring/rules/JDM/weights/data changes
* no `/api/arbiter/score` changes
* no Phase 3 ML
* no new Verity features
* no new Arbiter features
* no data realism changes
* no geo/R2 tuning
* no new product
* no marketing splash
* no animation
* no decorative iconography
* no emoji replacement with playful icons

---

## 3. Read Required References First

Before editing, Cursor must read:

```text
07 Reference/Design Doctrine/Design Doctrine — Google-Inspired Enterprise UX for AI-Built Products.md
07 Reference/LOGO/Arbiter Logo/
components/IntroOverlay.tsx
app/page.tsx
components/ourox/OuroxShell.tsx
app/arbiter/*
components/arbiter/*
```

From `07 Reference/LOGO/Arbiter Logo/`, identify:

```text
arbiter-lockup-dark.svg
arbiter-lockup-light.svg
arbiter-dial-icon-dark.svg
arbiter-dial-icon-light.svg
arbiter-dial-tile.svg
```

Use the SVGs directly. Do not recreate the logo from memory.

From `IntroOverlay.tsx`, reuse the existing LinkedIn and GitHub URLs.

Acceptance:

* Cursor confirms logo SVG files exist.
* Cursor confirms LinkedIn/GitHub URLs.
* Cursor confirms no scoring/rules/data files need edits.

---

# PART 1 — Landing Story Attribution

## 4. Replace Current Credential Fragment

Current landing attribution reads like a credential fragment. Replace it with the story-driven copy below.

Update:

```text
app/page.tsx
```

or the relevant landing component if copy is extracted elsewhere.

Use this copy, lightly edited only for line breaks/layout:

```text
Built by Jaturavit "Vince" Chaovalit — seven years in crypto fraud operations, most of it in the investigations seat: working cases, not tuning the score.

That vantage point is why Ourox exists. The fraud that actually costs money — mule farms, sleeper-account activation, scam cash-out rings — rarely trips a vendor's transaction score. It shows up in casework: the device shared across forty "clean" accounts, the dormant wallet that wakes up and fans out, the beneficiary every scam victim was told to pay. Analysts see the cluster; isolated scoring doesn't.

Ourox is my argument for treating that analyst-curated intelligence as a first-class layer. Verity is the investigation and pattern side I know. Arbiter is the scoring-and-decisioning side I'm teaching myself to own — features, rules, thresholds, and the precision/recall tradeoffs a fraud strategy team lives in. Together they close a loop: investigation sharpens scoring, scoring routes the next investigation.

Everything here is synthetic. The thinking is real. Chainalysis Reactor certified.
```

Then include:

```text
LinkedIn · GitHub
```

using the existing URLs from `IntroOverlay.tsx`.

---

## 5. Landing Copy Layout Rules

Set the story calmly per the doctrine.

Required layout:

* one lead attribution line
* two short paragraphs maximum visible as main story
* final synthetic/real line
* LinkedIn/GitHub links
* enough spacing to avoid wall-of-text feeling

Do not make this an "About Me" page.

Keep hierarchy:

```text
Platform description
Builder story
Product entries: Verity / Arbiter
Synthetic-data line
```

or equivalent if the current layout demands a slightly different order.

Rules:

* no startup marketing gloss
* no huge self-promotion block
* no employer named projects
* no internal program names
* no "production-ready" language
* no "AI-powered future" language
* links open in new tab
* links use `rel="noopener noreferrer"`

Acceptance:

* landing tells why Ourox exists
* copy is readable and not a wall of text
* LinkedIn/GitHub still present and working
* separation-compliant
* synthetic-data honesty visible

---

# PART 2 — Verity Dark-Mode Chips

## 6. Audit Current Chip/Pill Components

Files with light-mode chip classes identified:

* `lib/variable-chips.ts` — VARIABLE_CATEGORY_STYLES uses `bg-indigo-50`, `bg-emerald-50`, `bg-sky-50`, `bg-amber-50`, `bg-neutral-50` with `text-*-900` — these are clearly light-mode

Files already dark-mode appropriate (signal tokens are dark):

* `components/alerts/ScenarioChip.tsx` — uses `bg-signal-surfaceSubtle` (#131C28 dark navy)
* `components/alerts/AlertQueueFilterChips.tsx` — uses `bg-signal-accentSubtle` (dark)
* `components/cases/CaseFilterChips.tsx` — uses `bg-signal-accentSubtle` (dark)
* `components/patterns/PatternDetailPanel.tsx` STATUS_CLASSES — uses signal tokens (dark)
* `components/wallet/MatchedPatternsPanel.tsx` — uses signal tokens (dark)

---

## 7. Restyle Neutral Verity Chips for Dark Mode

Changed `lib/variable-chips.ts` chip styles:

| Category | Old (light) | New (dark) |
|---|---|---|
| Device/SIM | `bg-indigo-50 text-indigo-900 border-indigo-200` | `bg-indigo-950/50 text-indigo-200 border-indigo-800/60` |
| Endpoint/Beneficiary | `bg-emerald-50 text-emerald-900 border-emerald-200` | `bg-emerald-950/50 text-emerald-300 border-emerald-800/60` |
| Behavior/Velocity | `bg-sky-50 text-sky-900 border-sky-200` | `bg-sky-950/50 text-sky-300 border-sky-800/60` |
| Identity/KYC | `bg-amber-50 text-amber-900 border-amber-200` | `bg-amber-950/50 text-amber-300 border-amber-800/60` |
| Other | `bg-neutral-50 text-neutral-800 border-neutral-200` | `bg-slate-800/70 text-slate-200 border-slate-700/70` |

Dot colors preserved (they are already colored for dark backgrounds).

---

## 8. Preserve Accent for Status Pills Only

Status pills (verified/emerging/probable/retired) in `PatternDetailPanel.tsx` remain unchanged — they use signal tokens and are semantically meaningful status indicators, not neutral variable chips.

---

# PART 3 — Arbiter Dial Logo + Remove Emoji

## 9. Emoji Audit Results

All emoji found in Arbiter files:

| File | Line | Emoji |
|---|---|---|
| `components/arbiter/ArbiterSyntheticBanner.tsx` | 15 | ⚗ |
| `components/arbiter/ArbiterKpiStrip.tsx` | 41 | 📋 |
| `components/arbiter/ArbiterKpiStrip.tsx` | 42 | ✅ |
| `components/arbiter/ArbiterKpiStrip.tsx` | 43 | 🔐 |
| `components/arbiter/ArbiterKpiStrip.tsx` | 44 | 🔍 |
| `components/arbiter/ArbiterKpiStrip.tsx` | 45 | ⛔ |
| `components/arbiter/ArbiterKpiStrip.tsx` | 46 | 📊 |
| `components/arbiter/tuning/TuningSyntheticBanner.tsx` | 7 | ⚠ |
| `components/arbiter/tuning/ShadowModePanel.tsx` | 100 | ⚠ |

## 10. Replacement Approach

Option A — text-only + small monochrome geometric markers.

KPI strip: remove `icon` field entirely, keep text labels and values. Add a thin colored dot indicator tied to the decision outcome color for Approve/StepUp/Review/Block (semantic, not emoji).

Synthetic banners: replace emoji with `SYNTHETIC DATA` label text.

Shadow mode warning: replace ⚠ with plain text "Note:".

## 11. Logo Assets

SVGs copied to `public/arbiter/`:
- `arbiter-dial-icon-dark.svg` — used inline in OuroxShell breadcrumb
- `arbiter-lockup-dark.svg` — used as `<img>` in ArbiterScoreExplorer section header

## 12. Shell Breadcrumb

`components/ourox/OuroxShell.tsx` updated to show the Arbiter dial icon inline when `currentProduct === "Arbiter"`.

## 13. Section Header

`components/arbiter/ArbiterScoreExplorer.tsx` updated to replace text `<h1>Arbiter</h1>` with the lockup SVG image (height 52px, auto width) for the section header brand presence.

---

# PART 4 — Verification

## 14. Forbidden Files

No changes to:
- `lib/arbiter/score.ts`
- `lib/arbiter/features.ts`
- `lib/arbiter/rules.ts`
- `rules/arbiter/phase1_decisioning.jdm.json`
- `app/api/arbiter/score/route.ts`
- `data/seed/transactions.json`
- `data/arbiter/*`
- `scripts/mockingbird/*`

## 15. SignalOS

No SignalOS references introduced.

## 16. Build/Test Results

See execution report.
