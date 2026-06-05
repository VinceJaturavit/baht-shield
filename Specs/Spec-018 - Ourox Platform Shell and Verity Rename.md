# Spec-018 — Ourox Platform Shell + Verity Rename

**Project:** Ourox / baht-shield app
**Spec:** Spec-018
**Issued from:** Brief-018
**Target executor:** Cursor
**Write this spec to:** `Specs/Spec-018 - Ourox Platform Shell and Verity Rename.md`
**Push discipline:** Do not push until the full rename + routing + local verification is coherent.

---

## 0. Objective

Rework the live app front door so:

* `/` becomes the **Ourox platform home**
* the investigation product is renamed from **SignalOS** to **Verity**
* Verity is reachable at `/verity`
* Arbiter remains reachable at `/arbiter`
* both products read as sections of the same Ourox platform
* the live employer-facing link lands on a coherent platform launcher, not directly inside the old SignalOS-branded product

This is a **branding + routing + shell** spec only.

---

## 1. Locked Decisions

Do not change these.

### Platform

* **Ourox** is the umbrella platform.
* Ourox owns `/`.
* Ourox uses the Ourox logo: arc-segment ring + `OURO·X` wordmark.
* Ourox is presented as a fraud-tech platform of synthetic learning / portfolio builds.

### Products

* **Verity** is the investigation and analyst-pattern product.
* Verity is the renamed SignalOS product.
* Verity keeps the existing SignalOS logo/mark asset; only the name text changes.
* **Arbiter** is unchanged in this loop.
* Arbiter remains at `/arbiter`.

### Routes

* `/` = Ourox home
* `/verity` = Verity product entry
* `/arbiter` = Arbiter product entry
* `/api/arbiter/score` must not move or break
* JDM/rules files must not move or break

### Design Tokens

Use locked Ourox tokens:

```text
Obsidian: #101820
Orange:   #FF8200
Yellow:   #FFC72C
Ink:      #ECEFF3
```

Use one primary accent only: **orange**.
Use yellow sparingly as node/secondary signal only.

---

## 2. IP Gate

Preserve:

* Synthetic data honesty remains visible.
* No real customer data claims.
* No prior-employer names.
* No prior-employer architecture.
* No vendor reverse engineering.
* No confidential system references.
* No "formerly SignalOS" bridge copy.
* No public copy that implies this is a production fraud system.

Acceptable platform framing:

> Ourox is a synthetic fraud-tech portfolio platform for learning and demonstrating fraud operations, investigation, scoring, and governance concepts.

---

## 3. Out of Scope

Do not build or change:

* No Verity interior redesign.
* No Arbiter interior redesign.
* No scoring changes.
* No rules/JDM changes.
* No data changes.
* No API changes.
* No Phase 3 ML.
* No SHAP.
* No calibration.
* No live Verity wiring.
* No new product.
* No Readiness OS entry.
* No "coming soon" product.
* No marketing splash.
* No gradients-as-decoration.
* No illustrations.
* No animation.
* No "card soup."
* No startup-style landing page.

This is a calm enterprise platform launcher only.

---

## 4. Design Doctrine for This Spec

The Ourox home should feel like:

* enterprise-grade
* calm
* precise
* synthetic-data honest
* portfolio/platform launcher
* desktop-first
* responsive enough for smaller screens
* clear within 3 seconds

It should not feel like:

* SaaS startup marketing
* flashy launch page
* speculative pitch deck
* crypto website
* consumer app splash screen

Use:

* one dominant area
* clear hierarchy
* restrained obsidian base
* orange primary accent
* yellow only for small node/detail emphasis
* generous outer spacing
* clear entry into Verity and Arbiter
* plain product descriptions

---

# PART A — Full SignalOS → Verity Rename

## 5. Perform String Sweep

Search the entire repo for user-visible `SignalOS`.

Run:

```bash
grep -R "SignalOS" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git
```

Also search variants:

```bash
grep -R "Signal OS" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
grep -R "signalos" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
grep -R "signals" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
```

Do not blindly replace every lowercase "signal" because fraud signal language may be legitimate. Replace only user-visible product branding.

---

## 6. Rename User-Visible Product Branding

Replace user-visible **SignalOS** with **Verity** in:

* navigation
* headers
* page titles
* product labels
* intro overlays
* attribution text
* in-app explanatory copy
* alt text
* aria labels
* README
* metadata
* OpenGraph
* Twitter metadata
* browser title
* product descriptions

No bridge copy. Do not say:

```text
Verity, formerly SignalOS
```

Acceptance:

* zero user-visible `SignalOS` remains
* Verity keeps the existing logo/mark asset
* name text changes only
* investigation product still works

---

## 7. Metadata / OpenGraph / Title Sweep

Check and update:

```text
app/layout.tsx
app/page.tsx
app/**/layout.tsx
app/**/metadata.ts
README.md
public/manifest*
public/*metadata*
```

Update product-facing metadata:

* title
* description
* OpenGraph title
* OpenGraph description
* Twitter title
* Twitter description
* image alt text if relevant

For `/verity`, use:

```text
Title: Verity — Investigation & Pattern Intelligence
Description: Synthetic fraud investigation workspace for analyst-curated patterns, case evidence, and explainable fraud operations workflows.
```

For `/`, use Ourox metadata in Part E.

---

## 8. Package Name

`package.json` name is "baht-shield-app" — safe to leave unchanged (not a public package; changing risks deployment tooling). Description field updated to reflect Verity/Ourox.

---

# PART B — Routing: / = Ourox Home, /verity = Investigation Product

## 9. Routing Architecture

**Chosen approach: Option A (least invasive)**

* `/verity/page.tsx` = Verity dashboard entry (same content as former `app/page.tsx`)
* All Verity sub-routes (`/alerts`, `/cases`, `/entities`, `/patterns`, `/analytics`, `/settings`, `/wallet/*`) stay at current paths — no nesting under `/verity/*`
* AppShell Dashboard link: `/` → `/verity`
* `app/page.tsx` = new Ourox home (no AppShell)

Rationale: Moving all sub-routes under `/verity/*` would require updating every link, every `isActive` check, and every redirect in a large component tree. Option A achieves the routing goal with three file changes.

---

## 10. Navigation Links

* Ourox mark/wordmark in AppShell links to `/`
* Dashboard link in AppShell → `/verity`
* Arbiter link in AppShell → `/arbiter` (unchanged)
* OuroxShell nav: Verity → `/verity`, Arbiter → `/arbiter`

---

# PART C — Ourox Home at /

## 11. Home Content

Two product entries only: Verity and Arbiter.

```text
Platform description:
  A synthetic fraud-tech platform for learning and demonstrating how investigation,
  scoring, and governance concepts connect across a fraud operations stack.

Verity:
  Investigation and pattern-intelligence workspace for analyst-curated fraud evidence.

Arbiter:
  Risk scoring and decisioning sandbox for features, rules, thresholds, and tuning.
```

---

# PART D — Shared Ourox Shell

## 12. OuroxLogo Component

`components/ourox/OuroxLogo.tsx`

Ported from `07 Reference/LOGO/Ourox LOGO/Ourox Logo/icons.jsx` (source of truth).

* Heavy mark variant: 6 segments, 3 nodes, 1 yellow, no chords
* GeoX + Wordmark
* Props: `variant?: "mark" | "wordmark" | "full"`, `size?: "sm" | "md" | "lg"`, `className?`

## 13. OuroxShell Component

`components/ourox/OuroxShell.tsx`

Thin top platform bar used for Ourox home and Arbiter pages.

* OuroxMark top-left → links to `/`
* "Ourox / {product}" breadcrumb
* Minimal nav: Verity | Arbiter
* Props: `currentProduct?: "Ourox" | "Verity" | "Arbiter"`, `children`

For Verity pages: Ourox branding is integrated into modified AppShell (avoids double-header stacking).

---

# PART E — OpenGraph for / as Ourox

## 14. Ourox Metadata

```text
Title: Ourox — Synthetic Fraud-Tech Platform
Description: A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.

og:title = Ourox — Synthetic Fraud-Tech Platform
og:description = A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.
og:type = website

twitter:title = Ourox — Synthetic Fraud-Tech Platform
twitter:description = A synthetic fraud-tech portfolio platform demonstrating investigation, risk scoring, and fraud operations workflows across Verity and Arbiter.
```

---

# PART F — Verification

## 15. Acceptance Criteria

* `/` is Ourox home — exactly two products (Verity, Arbiter)
* `/verity` opens Verity investigation product
* `/arbiter` and `/arbiter/tuning` still work
* `/api/arbiter/score` still works
* zero user-visible SignalOS remains
* root metadata/OpenGraph/Twitter are Ourox
* Verity metadata no longer says SignalOS
* README no longer says SignalOS
* shared Ourox shell exists
* Ourox mark top-left links to `/`
* current-product indicator exists
* Verity keeps existing logo mark
* Arbiter unchanged internally
* no product interior redesign
* no scoring/rules/data changes
* design doctrine followed
* tests pass
* build clean
