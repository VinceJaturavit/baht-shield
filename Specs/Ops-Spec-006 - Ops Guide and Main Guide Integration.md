# Ops-Spec-006 — Ops Guide Page + Main Guide Integration

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-006  
**Issued from:** Ops-Brief-006  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Status:** Implemented locally — pending review before push

---

## 0. Objective

Add public-facing documentation for the Ourox Ops layer.

This loop builds:

1. A comprehensive `/ops/guide` page.
2. A Guide item/link inside the existing Ops side-nav.
3. An Ops section in the main `/guide`.
4. Main guide copy updates from “two products” to “three pillars/products.”
5. Roadmap update noting Ops MVP shipped.

This is **public guide content and navigation only**. No Ops functional screen changes.

---

## 1. Locked IP Gate

**Allowed:** `/ops/guide` route, guide copy, guide layout, guide navigation, sticky section index, main `/guide` content update, main guide sticky index update, public-safe product framing, Ops side-nav Guide item/link.

**Forbidden:** real data, customer/employer data, TrueMoney/Kraken/Payward names, prototype lineage on public surfaces, scoring logic, ML, Arbiter JDM/API changes, Ops functional screen changes, new Ops data model, live wiring, emoji, card soup, horizontal page scroll.

Use only non-identifying stream labels: RFR, DSP, LAR, PRO, PRF.  
Use current Ops role names: Fraud Analyst, Junior Analyst.

---

## 2. Out of Scope

Queue Board, Aging/SLA, Roster, KPI functionality, case data, roster data, scoring, ML, guide charts, simulations, exports, interactive workflow, Verity integration, Arbiter integration.

---

## 3. Deliverables

### `/ops/guide`

- Eight sections with sticky section index:
  1. What Ops is
  2. The five intake streams
  3. Queues & priority
  4. SLA & aging
  5. Roster, capacity & shifts
  6. Fair KPIs
  7. How it connects
  8. Synthetic boundary

### Ops navigation

- Guide item in Ops side-nav linking to `/ops/guide`.

### Main `/guide`

- Ops section in sticky index and body.
- Link to `/ops/guide`.
- Three-pillar framing (Ops, Verity, Arbiter).
- Roadmap notes Ops MVP shipped.

---

## 4. Files

**Created**

- `app/ops/guide/page.tsx`
- `components/ops/guide/OpsGuidePage.tsx`
- `components/ops/guide/OpsGuideSectionIndex.tsx`
- `components/ops/guide/OpsGuideSection.tsx`
- `components/ops/guide/ops-guide-sections.ts`
- `tests/ops/ops-guide.test.ts`
- `Specs/Ops-Spec-006 - Ops Guide and Main Guide Integration.md`

**Modified**

- `components/ops/OpsSideNav.tsx` — Guide nav item only
- `app/guide/page.tsx` — Ops section, three pillars, roadmap

**Unchanged (functional)**

- Queue Board, Aging & SLA, Roster, KPI workspaces and lib/ops logic

---

## 5. Verification

Run before push:

```bash
npm test
npm run build
npm run test:slow
```

Guardrail greps for forbidden names, prototype lineage, legacy roles, emoji.  
Confirm no functional Ops screen or Arbiter scoring/ML diffs.

Do not push without approval.
