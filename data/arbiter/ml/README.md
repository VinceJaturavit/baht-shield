# data/arbiter/ml — Offline ML Artifacts

These artifacts are generated offline from synthetic Mockingbird data.
They are imported by the app for display only.
No Python or model inference runs in the app runtime.

## How they are generated

1. `npx tsx scripts/arbiter/export-ml-features.ts`
   Runs the TypeScript Arbiter feature pipeline on all 353 labeled Mockingbird
   events. Writes precomputed-features.json with exact feature values + rule
   scores. _scenario_label is captured as label metadata only — stripped
   before the feature pipeline (IP Gate).

2. `python3 scripts/arbiter/train_ml_model.py`
   Reads precomputed-features.json. Converts _scenario_label to fraud/
   background binary label. Builds 12-feature vector (no _scenario_label).
   Trains logistic regression with StandardScaler. Emits all artifacts below.

## Architecture boundary

This is an OFFLINE training and analysis pipeline.
_scenario_label is the supervised offline label only — it never enters the
runtime feature/rule/scoring path (/api/arbiter/score unchanged).
The app reads these JSON files as static imports via lib/arbiter/ml-artifacts.ts.
No Python runtime. No model server. No inference at request time.

## Files

- precomputed-features.json   TypeScript-computed features for all events
- ml_scores.json              Per-event ML probability + rule comparison
- ml_coefficients.json        LR coefficients + intercept per feature
- ml_calibration_bins.json    Predicted probability vs observed fraud rate
- ml_vs_rule_comparison.json  Classified agreement/disagreement cases
- ml_heldout_metrics.json     Precision / recall / ROC AUC / F1

## Model

Model:         Logistic Regression (scikit-learn)
Label source:  _scenario_label (fraud/background binary)
Features:      12 Phase 1 Arbiter features (no _scenario_label)
Split:         75% train / 25% test, random_seed=42, stratified
Class weight:  balanced (handles imbalance between fraud/background)
This is a learning-grade model on synthetic data.
Rules remain the decisioning authority.
