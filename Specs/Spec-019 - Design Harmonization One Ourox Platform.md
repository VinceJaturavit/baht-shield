# Spec-019 — Design Harmonization: One Ourox Platform

**Project:** Ourox / baht-shield app
**Spec:** Spec-019
**Issued from:** Brief-019
**Target executor:** Cursor
**Write this spec to:** `Specs/Spec-019 - Design Harmonization One Ourox Platform.md`
**Push discipline:** Do not push until local design review, tests, and build are complete. Report before any push.

---

## 0. Objective

Make Ourox feel like one coherent platform after Spec-018.

Current issue:

* Ourox home is dark.
* Verity is light/indigo.
* Arbiter is dark slate.
* The three surfaces work, but do not yet feel like one intentional platform.
* Arbiter tuning default state reads as broken because the score-band matrix starts at 0% while the explorer shows rule-inclusive BLOCK decisions.
* Some IMPOSSIBLE_TRAVEL geo events may appear in mule-farm scenarios, which weakens typology realism.

This spec performs:

1. Design audit first.
2. Smallest high-impact platform coherence changes.
3. Arbiter tuning default-state clarity.
4. Explorer/drawer refinement only.
5. Synthetic-data realism narrowing for geo_velocity.

This is **not** a rebuild.

---

## 1. Locked Decisions

### Chosen Platform Coherence Option

Use **Option B**:

> Shared Ourox shell + design system coherence while keeping Verity light.

Do **not** re-theme Verity dark in this spec.

Light/dark difference becomes intentional:

* Ourox home: dark platform launcher
* Verity: light investigation workspace
* Arbiter: dark scoring workspace

Coherence comes from:

* identical shell chrome
* shared footer
* consistent typography
* consistent spacing
* consistent status/accent language
* clear current-product indicator

### Brand Tokens

Use existing Ourox tokens:

```text
Obsidian: #101820
Orange:   #FF8200
Yellow:   #FFC72C
Ink:      #ECEFF3
```

One primary accent: **orange**.
Yellow is secondary/node only.

### Product Routes

Do not change:

* `/` = Ourox home
* `/verity` = Verity
* `/arbiter` = Arbiter score explorer
* `/arbiter/tuning` = Arbiter tuning workspace
* `/api/arbiter/score` = unchanged

---

## 2. IP Gate

Preserve exactly:

* Synthetic data only.
* Synthetic honesty visible.
* No real customer data.
* No prior-employer names.
* No prior-employer architecture.
* No scoring/rules logic changes.
* No vendor reverse engineering.
* No confidential systems.
* `_scenario_label` remains synthetic evaluation label only.
* `_scenario_label` must not enter scoring, rules, or live decisioning.

This spec may change:

* design
* layout
* copy
* shell
* footer
* UI explanation
* one synthetic-data generation realism issue in Mockingbird

This spec must not change:

* scoring weights
* scoring logic
* rules logic
* Zen-Engine JDM logic
* API behavior
* Phase 3 ML
* production decisioning behavior

---

## 3. Out of Scope

Do not build:

* No Phase 3 ML
* No SHAP
* No calibration
* No scoring-weight changes
* No rules/JDM logic changes
* No new product
* No Verity dark re-theme
* No Verity interior rebuild
* No Arbiter interior rebuild
* No live Verity wiring
* No new signal families
* No API changes
* No startup marketing landing
* No decorative gradients
* No animation
* No illustrations
* No card soup
* No signal-token rename unless trivial; defer if uncertain

---

# PART 0 — Design Review First

## 4. Read Design Doctrine and Logo References

Before coding, read the vault references directly.

Find and review:

* Design Doctrine file in Obsidian vault
* Ourox logo reference/code
* existing `components/ourox/*`
* existing `components/AppShell.tsx`
* existing Verity layout/components
* existing Arbiter layout/components

Do not start changes until the audit is written.

Acceptance:

* Cursor identifies the current shell pattern.
* Cursor identifies current product-specific inconsistencies.
* Cursor confirms Option B will be used.

---

## 5. Audit Current State

Create a short audit note in the repo:

```text
Specs/Spec-019 - Design Audit Notes.md
```

Audit these surfaces:

```text
/
 /verity
 /arbiter
 /arbiter/tuning
```

For each surface, document:

* shell/header state
* footer state
* product indicator state
* type scale
* spacing rhythm
* accent usage
* status indicators
* synthetic-data line visibility
* any "SignalOS" regression
* major friction/polish issues

Also document:

* where Verity intentionally remains light
* where Arbiter intentionally remains dark
* what minimal shared elements will make them feel unified

Acceptance:

* Audit exists before implementation.
* Audit favors smallest high-impact changes.
* No rebuild plan is introduced.

---

# PART 1 — Platform Coherence

## 6. Create or Refine Shared Ourox Shell Pattern

Review existing:

```text
components/ourox/OuroxShell.tsx
components/ourox/OuroxLogo.tsx
components/AppShell.tsx
```

Goal:
One shared shell pattern across:

* Ourox home
* Verity
* Arbiter
* Arbiter tuning

Shell must include:

* Ourox mark + wordmark top-left
* top-left links to `/`
* separator `/`
* current product mark + product name
* consistent right-side affordances
* minimal nav to Verity and Arbiter
* current product state
* consistent spacing and typography

Recommended product indicator format:

```text
OURO·X / Verity
OURO·X / Arbiter
OURO·X / Platform
```

Do not overbuild.

Acceptance:

* Same shell pattern appears on all three surfaces.
* Product identity is clear.
* Ourox is always the platform parent.
* Verity and Arbiter feel like sections, not unrelated apps.

---

## 7. Add Consistent Footer

Create or refine:

```text
components/ourox/OuroxFooter.tsx
```

Footer must appear on:

* Ourox home
* Verity
* Arbiter
* Arbiter tuning

Footer copy should be plain:

```text
Synthetic data only · Fraud-tech learning and portfolio platform · No real customer data
```

Keep it calm and small.

Footer requirements:

* consistent placement
* consistent typography
* no marketing CTA
* no external clutter
* no employer/confidential references

Acceptance:

* Footer appears consistently.
* Synthetic-data honesty is visible everywhere.
* Footer does not dominate the workspace.

---

## 8. Standardize Typography and Spacing

Implement shared type/spacing primitives where least invasive.

Check:

* wordmark uses Montserrat 700 where available
* metadata labels use Space Mono where already available
* body stack remains clean and legible
* page outer margins are consistent
* section headers have consistent size/weight
* product labels use consistent treatment

Do not rewrite all components.

Acceptance:

* Shell/header/footer typography consistent.
* Main surfaces feel related.
* Verity remains light but no longer feels unrelated.

---

## 9. Standardize Accent and Status Language

Review status badges/buttons across:

* Ourox home
* Verity
* Arbiter
* Arbiter tuning

Rules:

* orange = primary accent
* yellow = sparing node/secondary signal
* status must not be color-only
* add text/icon/shape where needed
* avoid introducing new unrelated accent colors
* do not remove existing Verity readability just to force dark styling

Acceptance:

* Status labels include text, not color alone.
* Accents feel intentional.
* No random indigo/orange conflict in shell-level chrome.

---

# PART 2 — Arbiter Tuning Default-State Fix

## 10. Audit Tuning Default State

Open:

```text
/arbiter/tuning
```

Document:

* default thresholds
* confusion matrix state
* precision/recall/F1
* whether Review/Block are empty
* whether it reads as broken
* how explorer shows ~148 BLOCK while tuning matrix shows 0 BLOCK

Root explanation:

* Explorer is rule-inclusive.
* Tuning matrix measures score-band layer.
* Rules add additional interventions.
* Default score-band thresholds may place fraud in STEP_UP until REVIEW threshold is lowered.

Do not change scoring/rules logic.

---

## 11. Add Calm Score-Band Matrix Explainer

Update the tuning workspace copy.

Add an explainer near the confusion matrix:

```text
This matrix evaluates the score-band layer only. REVIEW and BLOCK count as positive interventions. APPROVE and STEP_UP count as negative for this tuning view. Rule overrides are shown separately because this workspace is teaching threshold movement, not rule coverage.
```

Also state:

```text
A low default recall here does not mean Arbiter is failing. It means the score-band threshold is conservative and rules are carrying some blocks separately.
```

Keep copy concise.

Acceptance:

* User understands why matrix may start low/empty.
* No implication that the production decisioning is broken.
* No ML/calibration language.

---

## 12. Make Default State Instructive

Choose one of two approaches. Prefer the least invasive.

### Option 1 — One-click "Show tradeoff" preset

Add a button:

```text
Show tradeoff preset
```

When clicked:

* moves REVIEW threshold into fraud cluster
* matrix becomes non-empty
* recall rises
* false positives may rise
* "what changed" summary updates

Do not permanently change default thresholds.

### Option 2 — Start Review slider at instructive value

Only do this if it does not distort Phase 2 acceptance or confuse the baseline.

Recommended: **Option 1** because it preserves default baseline and teaches the tradeoff clearly.

Acceptance:

* In one click, user can see threshold tradeoff.
* Matrix no longer feels inert.
* Change is clearly labeled as sandbox/preset.
* No scoring weights changed.

---

## 13. Reconcile Explorer vs Tuning BLOCK Difference

Problem:

* Explorer shows rule-inclusive decisions, around ~148 BLOCK.
* Tuning matrix may show 0 BLOCK because it evaluates score-band only.

Fix with labeling, not logic change.

Add two clearly labeled baselines in tuning workspace:

1. **Score-band baseline**

   * based on score thresholds only
   * used for tuning matrix

2. **Rule-inclusive live decision baseline**

   * includes Zen-Engine rule overrides
   * explains why explorer has more BLOCK decisions

Suggested copy:

```text
Explorer decisions are rule-inclusive. This tuning matrix isolates the score-band layer so threshold movement is visible. Rule-inclusive BLOCK counts are shown separately for context.
```

Add a compact comparison strip:

```text
Score-band BLOCK: X
Rule-inclusive BLOCK: Y
Rule overrides: Y - X
```

Acceptance:

* Explorer and tuning no longer appear contradictory.
* Difference is explained in product language.
* No rule/scoring logic changes.

---

## 14. Ensure Tuning Matrix Uses Correct Labels

Verify:

* predicted positive = REVIEW/BLOCK in score-band matrix
* predicted negative = APPROVE/STEP_UP
* ground truth positive = fraud scenarios
* ground truth negative = background
* `_scenario_label` used only for evaluation

Do not change this mapping unless broken.

Acceptance:

* Existing metrics tests still pass.
* `scenario-exclusion.test.ts` still passes.

---

# PART 3 — Arbiter Explorer and Drawer Refinement Only

## 15. Audit Explorer and Drawer

Review:

```text
/arbiter
```

Focus only on:

* hierarchy
* spacing
* shell consistency
* status text/icon clarity
* drawer readability
* precedence explanation readability
* synthetic-data label visibility
* top-driver clarity

Do not rebuild the explorer.

---

## 16. Refine Explorer Hierarchy

Allowed changes:

* spacing
* section headers
* status badge clarity
* top driver readability
* shell/footer consistency
* small copy fixes

Not allowed:

* changing score logic
* changing rule logic
* changing API response
* changing data model
* redesigning the entire workspace

Acceptance:

* Explorer reads calmer and clearer.
* Status is not color-only.
* Synthetic banner/footer remains visible.

---

## 17. Refine Drawer Copy and Spacing

Fix small copy defects if present, such as:

* missing spaces like `Blockedby`
* missing spaces like `outboundtransaction(s)`

Improve drawer sections:

* final decision
* score-band result
* rule override
* feature contributions
* fired rules

Suggested precedence copy:

```text
Blocked by R3 MULE_TARGET_PROHIBITED despite the score band suggesting APPROVE. BLOCK rules override lower-precedence outcomes.
```

Acceptance:

* Drawer explanation is readable.
* Rule precedence is clear.
* No logic changes.

---

# PART 4 — Geo-Realism Narrowing

## 18. Audit Mockingbird Geo Scenario Placement

Review:

```text
scripts/mockingbird/generate-arbiter-events.py
data/arbiter/mockingbird-events.json
data/arbiter/mockingbird-history.json
```

Check whether:

```text
geo_velocity > 900
```

appears in:

* onboarding_mule_farm
* sleeper_activation
* app_scam_cashout
* background
* any ATO-style deliberate events

Problem:
`IMPOSSIBLE_TRAVEL` should not appear as top driver on mule-farm wallets unless intentionally designed.

Acceptance:

* Cursor reports where impossible-travel events currently appear.

---

## 19. Narrow Impossible Travel to ATO-Style Events

If `geo_velocity > 900` currently fires on mule-farm wallets, update Mockingbird generation only.

Rules:

* Do not change `geo_velocity` feature logic.
* Do not change R2 rule.
* Do not change weights.
* Do not remove synthetic labels.
* Do not add new scoring features.

Preferred data behavior:

* Mule farm wallets: Thailand-centered, plausible location behavior.
* Sleeper activation: plausible location unless explicitly ATO-like.
* APP scam cash-out: plausible location unless explicitly ATO-like.
* Deliberate ATO-style events: prior/current geo creates `geo_velocity > 900`.

If adding a new `_scenario_label` creates contract churn, do not add it. Use an existing scenario label plus a clearly named fixture/comment, or generate a small deliberate test fixture.

Acceptance:

* `IMPOSSIBLE_TRAVEL` fires only where intended.
* Mule-farm top drivers no longer misleadingly show impossible travel unless deliberately documented.
* Tests remain valid.

---

## 20. Regenerate Synthetic Data if Needed

If generator changes require data regeneration:

Run the existing Mockingbird script.

Do not manually edit large generated files unless that is the existing project pattern.

After regeneration:

* verify event count remains stable enough
* verify tuning dataset still passes Part 0 separation
* verify scenario labels remain
* verify `scenario-exclusion.test.ts` still passes

Acceptance:

* Data realism improved.
* No scoring/rules logic changed.

---

# PART 5 — Verification

## 21. SignalOS Regression Check

Run:

```bash
grep -R "SignalOS" . \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git
```

Acceptance:

* no user-visible SignalOS references reintroduced
* if historical specs/build logs contain SignalOS, report but do not rewrite unless public-facing

---

## 22. Local Route QA

Run:

```bash
npm run dev
```

Check:

```text
/
 /verity
 /arbiter
 /arbiter/tuning
```

Verify:

### `/`

* Ourox home loads
* exactly Verity and Arbiter shown
* shell/header/footer coherent

### `/verity`

* Verity loads
* light theme remains intentional
* shared shell/header/footer present
* no SignalOS

### `/arbiter`

* Explorer loads
* drawer works
* shared shell/footer present
* no logic regression

### `/arbiter/tuning`

* tuning workspace loads
* explainer present
* tradeoff preset or instructive default works
* score-band vs rule-inclusive baseline is clear

---

## 23. Test and Build

Run:

```bash
npm test
```

Then:

```bash
npm run build
```

Acceptance:

* tests pass
* build clean
* no API break
* no JDM break
* no scenario-exclusion failure
* no SignalOS reintroduced

---

## 24. Git Review Before Commit

Run:

```bash
git status
git diff --stat
git log --oneline -3
```

Report:

* changed files
* whether changes are only design/routing/copy/Mockingbird geo-realism
* test result
* build result
* remaining SignalOS references
* whether safe to commit

Do not push.

---

## 25. Commit Locally Only

If verification passes, commit locally.

Suggested message:

```text
Harmonize Ourox platform design and tuning clarity
```

Then run:

```bash
git status
git log --oneline -1
```

Report commit hash.

Do not push until approved.

---

# Done Criteria

Spec-019 is complete only when all are true:

* Design audit note created first.
* Option B used: shared shell/system, Verity remains light.
* `/`, `/verity`, `/arbiter`, `/arbiter/tuning` share one Ourox shell pattern.
* Consistent footer appears across all surfaces.
* Synthetic-data line visible everywhere.
* Typography, spacing, and accent language are more consistent.
* Status is not color-only.
* Tuning workspace explains score-band-only matrix.
* Default state no longer reads as broken.
* One-click tradeoff preset or equivalent instructive state exists.
* Explorer-vs-tuning BLOCK discrepancy is reconciled/labeled.
* Explorer/drawer refined only, not rebuilt.
* Geo realism narrowed so IMPOSSIBLE_TRAVEL fires only where intended.
* No scoring logic changed.
* No rule logic changed.
* No weights changed.
* No Phase 3 ML added.
* No new product added.
* No Verity dark re-theme.
* No SignalOS user-visible reference reintroduced.
* Tests pass.
* Build clean.
* Cursor reports before any push.
