#!/usr/bin/env python3
"""
Arbiter Phase 3 — Offline ML Training Script

PURPOSE: Trains a logistic-regression model on the labeled synthetic Mockingbird
evaluation dataset. This script is NEVER imported by Next.js, NEVER called
by the API route, and is NOT part of the request path. It is a one-time
offline training tool.

Run: python3 scripts/arbiter/train_ml_model.py
  (or .venv-ml/bin/python3 scripts/arbiter/train_ml_model.py if using the venv)

Prerequisites:
  export-ml-features.ts must have been run first to produce:
    data/arbiter/ml/precomputed-features.json

Outputs (data/arbiter/ml/):
  ml_scores.json            per-event ML probability + rule comparison
  ml_coefficients.json      LR coefficients + intercept per feature
  ml_calibration_bins.json  calibration bins: predicted vs observed fraud rate
  ml_vs_rule_comparison.json  classified disagreement cases
  ml_heldout_metrics.json   precision / recall / AUC / F1 / confusion matrix

IP Gate:
  _scenario_label is used ONLY in this offline training script as the
  supervised synthetic label. It is not used by runtime scoring, rules,
  or /api/arbiter/score.

  _scenario_label is NOT included in the feature vector.

Architecture: offline Python training -> static JSON artifacts -> app imports
No runtime Python. No FastAPI. No model server. No inference at request time.
"""

import json
import os
import sys
import math
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, classification_report
)

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT  = SCRIPT_DIR.parent.parent
ML_DIR     = REPO_ROOT / "data" / "arbiter" / "ml"
IN_FILE    = ML_DIR / "precomputed-features.json"

ML_DIR.mkdir(parents=True, exist_ok=True)

# ── Feature order — must match Arbiter's 12 Phase 1 features ─────────────────
# _scenario_label is NOT in this list. It is the label only.
FEATURE_KEYS = [
    "amt_to_mean_ratio",
    "velocity_1h",
    "account_age_days",
    "is_new_beneficiary",
    "device_account_count",
    "withdrawal_after_deposit",
    "sleeper_velocity_shock",
    "geo_velocity",
    "is_night_transaction",
    "daily_cumulative_thb",
    "beneficiary_risk_tier",
    "pattern_match_count",
]

# Normalization maps used to convert raw feature values to [0,1] numeric
# Matches normalize.ts exactly so the feature vector is comparable to the
# app's internal representation.
BENEFICIARY_TIER_MAP = {
    "clean":      0.0,
    "light_grey": 0.4,
    "dark_grey":  0.8,
    "black":      1.0,
}

def normalize_feature(key: str, value) -> float:
    """Normalize raw feature values to [0,1] using same logic as normalize.ts."""
    if key == "amt_to_mean_ratio":
        return min(max(float(value) / 10.0, 0.0), 1.0)
    elif key == "velocity_1h":
        return min(max(float(value) / 5.0, 0.0), 1.0)
    elif key == "account_age_days":
        return min(max(1.0 - float(value) / 365.0, 0.0), 1.0)
    elif key == "is_new_beneficiary":
        return 1.0 if value else 0.0
    elif key == "device_account_count":
        return min(max((float(value) - 1.0) / 4.0, 0.0), 1.0)
    elif key == "withdrawal_after_deposit":
        return min(max(float(value), 0.0), 1.0)
    elif key == "sleeper_velocity_shock":
        return min(max(float(value) / 5.0, 0.0), 1.0)
    elif key == "geo_velocity":
        return min(max(float(value) / 1000.0, 0.0), 1.0)
    elif key == "is_night_transaction":
        return 1.0 if value else 0.0
    elif key == "daily_cumulative_thb":
        return min(max(float(value) / 100_000.0, 0.0), 1.0)
    elif key == "beneficiary_risk_tier":
        return BENEFICIARY_TIER_MAP.get(str(value), 0.0)
    elif key == "pattern_match_count":
        return min(max(float(value) / 3.0, 0.0), 1.0)
    return 0.0


# ── Training label mapping ─────────────────────────────────────────────────────
#
# _scenario_label is used ONLY here as the supervised synthetic label.
# It is not used by runtime scoring, rules, or /api/arbiter/score.
#
# Positive (fraud = 1):
#   onboarding_mule_farm, sleeper_activation, app_scam_cashout
#   (includes ATO fixture events, labelled app_scam_cashout)
#
# Negative (background = 0):
#   background

def is_fraud(scenario_label: str) -> int:
    return 1 if scenario_label in (
        "onboarding_mule_farm",
        "sleeper_activation",
        "app_scam_cashout",
    ) else 0


def safe_divide(n: float, d: float, default: float = 0.0) -> float:
    return n / d if d != 0.0 else default


# ── Load pre-computed features ─────────────────────────────────────────────────
print(f"Loading pre-computed features from {IN_FILE}...")
if not IN_FILE.exists():
    print(f"ERROR: {IN_FILE} not found.")
    print("Run first:  npx tsx scripts/arbiter/export-ml-features.ts")
    sys.exit(1)

with open(IN_FILE, encoding="utf-8") as f:
    records = json.load(f)

print(f"Loaded {len(records)} records.")

# ── Build feature matrix and labels ──────────────────────────────────────────
X_raw   = []
y       = []
meta    = []  # event_id, wallet_id, scenario_label, rule_score, rule_decision, rule_reason_codes, contributions

for rec in records:
    label = rec.get("_scenario_label", "background")
    feats = rec.get("features", {})

    # Build normalized feature vector — 12 features only, no _scenario_label
    row = [normalize_feature(k, feats.get(k, 0)) for k in FEATURE_KEYS]
    X_raw.append(row)
    y.append(is_fraud(label))

    meta.append({
        "event_id":         rec["event_id"],
        "wallet_id":        rec["wallet_id"],
        "scenario_label":   label,
        "rule_weighted_score": rec.get("rule_weighted_score", 0),
        "rule_final_decision": rec.get("rule_final_decision", "APPROVE"),
        "rule_reason_codes": rec.get("rule_reason_codes", []),
        "contributions":    rec.get("contributions", []),
        "raw_features":     feats,
    })

X_raw = np.array(X_raw, dtype=float)
y     = np.array(y, dtype=int)

n_total    = len(y)
n_fraud    = int(y.sum())
n_bg       = n_total - n_fraud
print(f"\nDataset: {n_total} events | {n_fraud} fraud | {n_bg} background")

label_counts: dict = {}
for m in meta:
    sl = m["scenario_label"]
    label_counts[sl] = label_counts.get(sl, 0) + 1
print("Label breakdown:")
for lbl, cnt in sorted(label_counts.items()):
    print(f"  {lbl}: {cnt}")

# ── Train / test split ────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test, meta_train, meta_test = train_test_split(
    X_raw, y, meta, test_size=0.25, random_state=42, stratify=y
)
print(f"\nTrain: {len(y_train)} | Test: {len(y_test)}")

# ── Pipeline: StandardScaler + LogisticRegression ────────────────────────────
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("lr",     LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight="balanced",  # handles class imbalance
        solver="lbfgs",
        C=1.0,
    )),
])

pipe.fit(X_train, y_train)
print("Logistic regression trained.")

# ── Held-out metrics ──────────────────────────────────────────────────────────
y_proba_test = pipe.predict_proba(X_test)[:, 1]
y_pred_test  = (y_proba_test >= 0.5).astype(int)

precision    = precision_score(y_test, y_pred_test, zero_division=0)
recall       = recall_score(y_test, y_pred_test, zero_division=0)
f1           = f1_score(y_test, y_pred_test, zero_division=0)
roc_auc      = roc_auc_score(y_test, y_proba_test) if len(np.unique(y_test)) > 1 else 0.0
cm           = confusion_matrix(y_test, y_pred_test).tolist()

print(f"\nHeld-out metrics:")
print(f"  Precision:  {precision:.4f}")
print(f"  Recall:     {recall:.4f}")
print(f"  F1:         {f1:.4f}")
print(f"  ROC AUC:    {roc_auc:.4f}")
print(f"  Confusion:  {cm}")

# Per-typology recall on test set
typology_recall: dict = {}
for typology in ["onboarding_mule_farm", "sleeper_activation", "app_scam_cashout"]:
    test_typology_mask = np.array([m["scenario_label"] == typology for m in meta_test])
    if test_typology_mask.sum() > 0:
        y_true_typ = y_test[test_typology_mask]
        y_pred_typ = y_pred_test[test_typology_mask]
        typology_recall[typology] = {
            "support": int(test_typology_mask.sum()),
            "recall":  round(float(recall_score(y_true_typ, y_pred_typ, zero_division=0)), 4),
        }

heldout_metrics = {
    "precision":         round(float(precision), 4),
    "recall":            round(float(recall), 4),
    "f1":                round(float(f1), 4),
    "roc_auc":           round(float(roc_auc), 4),
    "threshold":         0.5,
    "confusion_matrix":  {
        "tn": int(cm[0][0]),
        "fp": int(cm[0][1]),
        "fn": int(cm[1][0]),
        "tp": int(cm[1][1]),
    },
    "support": {
        "total_test": int(len(y_test)),
        "fraud_test": int(y_test.sum()),
        "background_test": int((y_test == 0).sum()),
    },
    "train_test_split": {
        "total": int(n_total),
        "train": int(len(y_train)),
        "test":  int(len(y_test)),
        "test_fraction": 0.25,
        "random_seed": 42,
    },
    "per_typology_recall": typology_recall,
    "model": "logistic_regression",
    "label_source": "_scenario_label (offline synthetic label only)",
}

# ── Coefficients ─────────────────────────────────────────────────────────────
scaler_mean = pipe.named_steps["scaler"].mean_.tolist()
scaler_std  = pipe.named_steps["scaler"].scale_.tolist()
lr_coef     = pipe.named_steps["lr"].coef_[0].tolist()
lr_intercept = float(pipe.named_steps["lr"].intercept_[0])

# Rank features by absolute coefficient magnitude
coef_ranked = sorted(
    enumerate(lr_coef), key=lambda x: abs(x[1]), reverse=True
)

ml_coefficients = {
    "model":        "logistic_regression",
    "label_source": "_scenario_label (offline synthetic label only — not a runtime feature)",
    "intercept":    round(lr_intercept, 6),
    "features":     [
        {
            "feature":         FEATURE_KEYS[i],
            "coefficient":     round(c, 6),
            "abs_coefficient": round(abs(c), 6),
            "rank":            rank + 1,
            "direction":       "fraud_positive" if c > 0 else "fraud_negative",
            "scaler_mean":     round(scaler_mean[i], 6),
            "scaler_std":      round(scaler_std[i], 6),
        }
        for rank, (i, c) in enumerate(coef_ranked)
    ],
    "feature_order": FEATURE_KEYS,
}

print("\nTop feature coefficients (by abs value):")
for item in ml_coefficients["features"][:6]:
    print(f"  {item['rank']:2d}. {item['feature']:30s}  coef={item['coefficient']:+.4f}")

# ── Calibration bins ──────────────────────────────────────────────────────────
y_proba_all = pipe.predict_proba(X_raw)[:, 1]

n_bins = 10
bins   = []
edges  = [i / n_bins for i in range(n_bins + 1)]

for b in range(n_bins):
    lo, hi = edges[b], edges[b + 1]
    mask = (y_proba_all >= lo) & (y_proba_all < hi)
    if b == n_bins - 1:
        mask = (y_proba_all >= lo) & (y_proba_all <= hi)
    cnt = int(mask.sum())
    if cnt > 0:
        mean_pred = float(y_proba_all[mask].mean())
        obs_rate  = float(y[mask].mean())
    else:
        mean_pred = (lo + hi) / 2
        obs_rate  = 0.0
    bins.append({
        "bin_start":                round(lo, 2),
        "bin_end":                  round(hi, 2),
        "count":                    cnt,
        "mean_predicted_probability": round(mean_pred, 4),
        "observed_fraud_rate":       round(obs_rate, 4),
    })

ml_calibration_bins = {"bins": bins}

# ── Per-event ML scores ───────────────────────────────────────────────────────
# Compute LR contributions: coef_i * (x_i - mean_i) / std_i
# This is the contribution of each feature to the log-odds in the scaled space
lr_coef_arr   = np.array(lr_coef)

ml_scores = []
for idx, (rec, m) in enumerate(zip(records, meta)):
    prob = float(y_proba_all[idx])
    ml_score_100 = round(prob * 100, 1)

    # Feature contributions to LR decision (coefficient × scaled value)
    raw_row = X_raw[idx]
    scaled_row = (raw_row - np.array(scaler_mean)) / np.array(scaler_std)
    contribs = lr_coef_arr * scaled_row
    top_ml_drivers = sorted(
        [{"feature": FEATURE_KEYS[i], "contribution": round(float(contribs[i]), 4)}
         for i in range(len(FEATURE_KEYS))],
        key=lambda x: abs(x["contribution"]),
        reverse=True
    )[:3]

    # Top rule drivers (from precomputed contributions, sorted by abs points)
    rule_contribs = sorted(
        m["contributions"],
        key=lambda c: abs(c.get("points", 0)),
        reverse=True
    )
    top_rule_drivers = [c["key"] for c in rule_contribs[:3]]

    ml_scores.append({
        "event_id":            m["event_id"],
        "wallet_id":           m["wallet_id"],
        "scenario_label":      m["scenario_label"],
        "ground_truth_label":  "fraud" if is_fraud(m["scenario_label"]) else "background",
        "ml_probability":      round(prob, 4),
        "ml_score":            ml_score_100,
        "rule_weighted_score": round(float(m["rule_weighted_score"]), 1),
        "rule_final_decision": m["rule_final_decision"],
        "rule_reason_codes":   m["rule_reason_codes"],
        "top_ml_drivers":      top_ml_drivers,
        "top_rule_drivers":    top_rule_drivers,
        "features": {
            k: m["raw_features"].get(k, 0) for k in FEATURE_KEYS
        },
    })

# ── ML-vs-rule comparison ─────────────────────────────────────────────────────
ML_HIGH_THRESHOLD   = 0.5
RULE_HIGH_DECISIONS = {"REVIEW", "BLOCK"}
RULE_LOW_DECISIONS  = {"APPROVE", "STEP_UP"}

ml_vs_rule_comparison = []
agree_high = agree_low = ml_high_rule_low = ml_low_rule_high = 0

for s in ml_scores:
    ml_high   = s["ml_probability"] >= ML_HIGH_THRESHOLD
    rule_high = s["rule_final_decision"] in RULE_HIGH_DECISIONS

    if ml_high and rule_high:
        ctype = "AGREE_HIGH"
        agree_high += 1
    elif (not ml_high) and (not rule_high):
        ctype = "AGREE_LOW"
        agree_low += 1
    elif ml_high and (not rule_high):
        ctype = "ML_HIGH_RULE_LOW"
        ml_high_rule_low += 1
    else:
        ctype = "ML_LOW_RULE_HIGH"
        ml_low_rule_high += 1

    ml_vs_rule_comparison.append({
        "event_id":          s["event_id"],
        "wallet_id":         s["wallet_id"],
        "scenario_label":    s["scenario_label"],
        "ground_truth_label": s["ground_truth_label"],
        "comparison_type":   ctype,
        "ml_probability":    s["ml_probability"],
        "ml_score":          s["ml_score"],
        "rule_decision":     s["rule_final_decision"],
        "rule_weighted_score": s["rule_weighted_score"],
        "rule_reason_codes": s["rule_reason_codes"],
        "top_ml_drivers":    s["top_ml_drivers"],
        "top_rule_drivers":  s["top_rule_drivers"],
        "features":          s["features"],
    })

print(f"\nML-vs-rule comparison:")
print(f"  AGREE_HIGH:       {agree_high}")
print(f"  AGREE_LOW:        {agree_low}")
print(f"  ML_HIGH_RULE_LOW: {ml_high_rule_low}")
print(f"  ML_LOW_RULE_HIGH: {ml_low_rule_high}")

# ── Write artifacts ───────────────────────────────────────────────────────────
def write_json(name: str, data) -> None:
    out = ML_DIR / name
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  Wrote {out.name}  ({len(json.dumps(data))} bytes)")

print(f"\nWriting artifacts to {ML_DIR}/")
write_json("ml_scores.json",             ml_scores)
write_json("ml_coefficients.json",       ml_coefficients)
write_json("ml_calibration_bins.json",   ml_calibration_bins)
write_json("ml_vs_rule_comparison.json", ml_vs_rule_comparison)
write_json("ml_heldout_metrics.json",    heldout_metrics)

# ── README ────────────────────────────────────────────────────────────────────
readme = """# data/arbiter/ml — Offline ML Artifacts

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
"""

readme_path = ML_DIR / "README.md"
with open(readme_path, "w", encoding="utf-8") as f:
    f.write(readme)
print(f"  Wrote README.md")

print(f"\nSpec-003 offline training complete.")
print(f"  Model:       Logistic Regression")
print(f"  Features:    {len(FEATURE_KEYS)}")
print(f"  Dataset:     {n_total} events ({n_fraud} fraud / {n_bg} background)")
print(f"  Precision:   {precision:.4f}")
print(f"  Recall:      {recall:.4f}")
print(f"  ROC AUC:     {roc_auc:.4f}")
print(f"  F1:          {f1:.4f}")
print(f"  Disagreements (ML_HIGH_RULE_LOW + ML_LOW_RULE_HIGH): {ml_high_rule_low + ml_low_rule_high}")
