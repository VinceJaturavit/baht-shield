#!/usr/bin/env python3
"""
Mockingbird — Arbiter Phase 2 Synthetic Event Generator

PURPOSE: Offline-only synthetic data generation for Arbiter demo coverage.
This script is NEVER imported by Next.js, NEVER called by the API route,
and is NOT part of the request path. It is a one-time generation tool.

Run: python3 scripts/mockingbird/generate-arbiter-events.py
Output:
  data/arbiter/mockingbird-events.json    (scored events, 353 total)
  data/arbiter/mockingbird-history.json   (prior tx history for rolling windows)

Spec-004 changes:
  - Realistic overlap zone: partial-signal fraud + incidentally elevated background.
  - Geo clustering: mule/sleeper/background use locally clustered Thailand geo so
    geo_velocity does not act as a label proxy. Impossible travel reserved for ATO.
  - Marginal noise on amounts, delays, dormancy, device sharing.
  - Softened feature-label proxies (beneficiary tier, device sharing, velocity).

Scenario counts:
  background:            200
  onboarding_mule_farm:   50
  sleeper_activation:     50
  app_scam_cashout:       50 + 3 ATO = 53

All data is synthetic. No real customer data, no prior-employer logic.
_scenario_label is metadata only; it never enters feature/score/rule pipelines.
"""

import json
import random
import os
from datetime import datetime, timedelta, timezone

# ── Deterministic seed ───────────────────────────────────────────────────────
random.seed(20260602)

BASE_TS = datetime(2026, 5, 30, 12, 0, 0, tzinfo=timezone.utc)

EVENTS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "arbiter", "mockingbird-events.json"
)
HISTORY_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "arbiter", "mockingbird-history.json"
)

# ── Overlap zone configuration (Spec-004) ────────────────────────────────────
FRAUD_PARTIAL_FRACTION = 0.45       # ~45% of fraud events with weaker signals
BACKGROUND_ELEVATED_FRACTION = 0.28  # ~28% of background with one elevated feature
NOISE_PCT = 0.20                     # ±20% marginal noise on numeric values

# Thailand city centers for geo clustering (plausible local movement)
TH_CITIES = [
    {"lat": 13.7563, "lon": 100.5018},   # Bangkok
    {"lat": 18.7883, "lon": 98.9853},    # Chiang Mai
    {"lat": 7.8804,  "lon": 98.3923},    # Phuket
    {"lat": 16.4419, "lon": 102.8360},   # Khon Kaen
    {"lat": 12.9236, "lon": 100.8825},   # Pattaya
    {"lat": 14.9799, "lon": 102.0978},   # Nakhon Ratchasima
]

# Per-wallet geo cluster cache
_wallet_geo_clusters: dict = {}

# ── Helpers ──────────────────────────────────────────────────────────────────

def ts_offset(base: datetime, hours_ago: float) -> str:
    return (base - timedelta(hours=hours_ago)).isoformat().replace("+00:00", "Z")


def add_noise(value: float, pct: float = NOISE_PCT) -> float:
    """Apply modest marginal noise; keeps typology shape."""
    return round(value * random.uniform(1.0 - pct, 1.0 + pct), 2)


def get_wallet_geo_cluster(wallet_id: str) -> dict:
    """Assign each wallet a stable Thailand city-center cluster."""
    if wallet_id not in _wallet_geo_clusters:
        city = random.choice(TH_CITIES)
        _wallet_geo_clusters[wallet_id] = {
            "lat": round(city["lat"] + random.uniform(-0.03, 0.03), 4),
            "lon": round(city["lon"] + random.uniform(-0.03, 0.03), 4),
        }
    return _wallet_geo_clusters[wallet_id]


def geo_near_cluster(wallet_id: str, max_km: float = 20.0) -> dict:
    """Small jitter around wallet cluster — keeps geo_velocity plausible (<100 km/h)."""
    center = get_wallet_geo_cluster(wallet_id)
    jitter_deg = max_km / 111.0
    return {
        "lat": round(center["lat"] + random.uniform(-jitter_deg, jitter_deg), 4),
        "lon": round(center["lon"] + random.uniform(-jitter_deg, jitter_deg), 4),
    }


def geo_travel_plausible(wallet_id: str, hours_apart: float) -> dict:
    """For legitimate traveller background: move to a nearby city over several hours."""
    origin = get_wallet_geo_cluster(wallet_id)
    dest_city = random.choice([c for c in TH_CITIES if c != origin])
    # Blend toward destination proportional to travel time (max ~400 km/h)
    blend = min(hours_apart / 6.0, 0.6)
    return {
        "lat": round(origin["lat"] + (dest_city["lat"] - origin["lat"]) * blend
                     + random.uniform(-0.01, 0.01), 4),
        "lon": round(origin["lon"] + (dest_city["lon"] - origin["lon"]) * blend
                     + random.uniform(-0.01, 0.01), 4),
    }


def rand_geo_abroad():
    return {"lat": round(random.uniform(48.0, 55.0), 4), "lon": round(random.uniform(2.0, 20.0), 4)}


def rand_amount_normal():
    return add_noise(round(random.uniform(200, 8_000), 2))


def rand_amount_mule(partial: bool = False):
    if partial:
        return add_noise(round(random.uniform(5_000, 20_000), 2))
    return add_noise(round(random.uniform(15_000, 75_000), 2))


def rand_amount_sleeper(partial: bool = False):
    if partial:
        return add_noise(round(random.uniform(8_000, 25_000), 2))
    return add_noise(round(random.uniform(20_000, 80_000), 2))


def rand_amount_scam(partial: bool = False):
    if partial:
        return add_noise(round(random.uniform(12_000, 40_000), 2))
    return add_noise(round(random.choice([30_000, 50_000, 75_000, 100_000, 150_000])
                           * random.uniform(0.9, 1.1), 2))


def pick_app_scam_beneficiary(i: int, partial: bool = False) -> str:
    """Softened beneficiary tier distribution — black is predictive, not deterministic."""
    if partial:
        r = random.random()
        if r < 0.45:
            return f"BEN_NEW_{i:03d}"          # new, clean tier
        elif r < 0.75:
            return f"BEN_{(i * 11) % 100:06d}"  # established clean
        else:
            return f"BEN_MEDRISK_{i:03d}"       # dark_grey, not black
    r = random.random()
    if r < 0.52:
        return f"BEN_HIGHRISK_{i:03d}"          # black
    elif r < 0.77:
        return f"BEN_MEDRISK_{i:03d}"           # dark_grey
    elif r < 0.90:
        return f"BEN_NEW_{i:03d}"               # new, clean tier
    else:
        return f"BEN_{(i * 11) % 100:06d}"      # established clean


def is_partial_fraud() -> bool:
    return random.random() < FRAUD_PARTIAL_FRACTION


def add_geo_anchor_history(
    wallet_id: str, device_id: str, cluster_ts: datetime, channel: str, *, recent: bool = True
) -> None:
    """Anchor prior geo near wallet cluster so seed-transaction geo cannot leak velocity."""
    history.append({
        "wallet_id": wallet_id,
        "timestamp": ts_offset(cluster_ts, random.uniform(2.0, 4.0)),
        "amount": add_noise(round(random.uniform(500, 2_000), 2)),
        "direction": "outbound",
        "device_id": device_id,
        "beneficiary_id": f"BEN_{hash(wallet_id) % 200:06d}",
        "geo": geo_near_cluster(wallet_id, max_km=5.0),
        "channel": channel,
    })
    if recent:
        # Recent anchor overrides seed prior-geo lookup (fraud wallets only;
        # skipped for background to avoid inflating withdrawal_after_deposit).
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, random.uniform(0.4, 0.9)),
            "amount": add_noise(round(random.uniform(300, 1_500), 2)),
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(hash(wallet_id) + 1) % 200:06d}",
            "geo": geo_near_cluster(wallet_id, max_km=8.0),
            "channel": channel,
        })


# ── Output lists ─────────────────────────────────────────────────────────────
events = []
history = []

# ────────────────────────────────────────────────────────────────────────────
# 1. ONBOARDING MULE FARM (50 events)
# ────────────────────────────────────────────────────────────────────────────
shared_devices_mf = [f"DEV_SHARED_MF_{i:03d}" for i in range(1, 11)]

for i in range(1, 51):
    wallet_id = f"WAL_MF_{i:03d}"
    partial = is_partial_fraud()

    if partial:
        # Partial: solo or lightly shared device, weaker burst, smaller amounts
        device_id = f"DEV_MF_SOLO_{i:03d}" if random.random() < 0.65 else shared_devices_mf[(i - 1) % len(shared_devices_mf)]
        burst_count = random.randint(0, 1)
        burst_delays = [35][:burst_count]
    else:
        device_id = shared_devices_mf[(i - 1) % len(shared_devices_mf)]
        burst_count = random.randint(2, 3)
        burst_delays = [45, 30, 15][:burst_count]

    hours_ago = random.uniform(1, 47)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    add_geo_anchor_history(wallet_id, device_id, cluster_ts, "promptpay")

    burst_amounts = [rand_amount_mule(partial=partial) for _ in range(burst_count)]
    for j, (delay_min, burst_amt) in enumerate(zip(burst_delays, burst_amounts)):
        ben_id = f"BEN_{(i * 13 + j) % 200:06d}" if partial else f"BEN_AGENT_{((i + j) % 3) + 1:03d}"
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, delay_min / 60),
            "amount": burst_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": ben_id,
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })

    if burst_count > 0 or not partial:
        inbound_amount = add_noise(round(max(sum(burst_amounts), 3000) * random.uniform(0.85, 1.2), 2))
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, 2.0 + random.uniform(0, 0.5)),
            "amount": inbound_amount,
            "direction": "inbound",
            "device_id": device_id,
            "beneficiary_id": None,
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })

    amount = rand_amount_mule(partial=partial)
    has_facial = amount <= 50_000 or random.random() > 0.6
    ben_suffix = f"{(i % 3) + 1:03d}"
    ben_id = f"BEN_{(i * 17) % 200:06d}" if partial else f"BEN_AGENT_{ben_suffix}"

    events.append({
        "event_id": f"EVT_MF_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": amount,
        "direction": "outbound",
        "rail": "promptpay",
        "beneficiary_id": ben_id,
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": has_facial,
        "geo": geo_near_cluster(wallet_id),
        "source": "mockingbird",
        "_scenario_label": "onboarding_mule_farm",
    })

# ────────────────────────────────────────────────────────────────────────────
# 2. SLEEPER ACTIVATION (50 events)
# ────────────────────────────────────────────────────────────────────────────
for i in range(1, 51):
    wallet_id = f"WAL_SM_{i:03d}"
    device_id = f"DEV_SM_{i:03d}"
    partial = is_partial_fraud()

    if partial:
        dormancy_days = random.randint(31, 55)   # shorter dormancy, weaker shock
        burst_delays = [40] if random.random() > 0.45 else []
    else:
        dormancy_days = random.randint(70, 260)
        burst_delays = [50, 30, 10] if random.random() > 0.2 else [40, 20]

    hours_ago = random.uniform(0.5, 12)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    add_geo_anchor_history(wallet_id, device_id, cluster_ts, "bank_transfer")

    old_amounts = [add_noise(round(random.uniform(5_000, 25_000), 2)) for _ in range(5)]
    old_offset_days = random.uniform(150, 200) if not partial else random.uniform(80, 140)
    for j, old_amt in enumerate(old_amounts):
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, (old_offset_days - j * 2) * 24),
            "amount": old_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(i * 7 + j) % 100:06d}",
            "geo": geo_near_cluster(wallet_id),
            "channel": "bank_transfer",
        })

    if burst_delays or not partial:
        inbound_amount = add_noise(round(random.uniform(15_000 if partial else 40_000,
                                                      45_000 if partial else 120_000), 2))
        inbound_delay = random.uniform(2.5, 5.0) if partial else random.uniform(1.8, 2.5)
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, inbound_delay),
            "amount": inbound_amount,
            "direction": "inbound",
            "device_id": device_id,
            "beneficiary_id": None,
            "geo": geo_near_cluster(wallet_id),
            "channel": "bank_transfer",
        })

    for delay_min in burst_delays:
        ben_id = f"BEN_{(i * 19) % 100:06d}" if partial else f"BEN_XBDR_{i:03d}"
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, delay_min / 60),
            "amount": rand_amount_sleeper(partial=partial),
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": ben_id,
            "geo": geo_near_cluster(wallet_id),
            "channel": "bank_transfer",
        })

    amount = rand_amount_sleeper(partial=partial)
    ben_id = f"BEN_{(i * 19) % 100:06d}" if partial else f"BEN_XBDR_{i:03d}"
    events.append({
        "event_id": f"EVT_SM_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": amount,
        "direction": "outbound",
        "rail": "bank_transfer",
        "beneficiary_id": ben_id,
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": random.random() > 0.3,
        "geo": geo_near_cluster(wallet_id),
        "source": "mockingbird",
        "_scenario_label": "sleeper_activation",
    })

# ────────────────────────────────────────────────────────────────────────────
# 3. APP SCAM CASH-OUT (50 events)
# ────────────────────────────────────────────────────────────────────────────
for i in range(1, 51):
    wallet_id = f"WAL_APP_{i:03d}"
    device_id = f"DEV_APP_{i:03d}"
    partial = is_partial_fraud()
    hours_ago = random.uniform(0.5, 24)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    scam_amount = rand_amount_scam(partial=partial)
    add_geo_anchor_history(wallet_id, device_id, cluster_ts, "promptpay")

    if partial:
        # Delayed outbound: inbound 3–6 h before, less perfect pass-through
        inbound_delay_h = random.uniform(3.0, 6.0)
        inbound_amount = add_noise(round(scam_amount * random.uniform(0.55, 0.85), 2))
    else:
        inbound_delay_h = random.uniform(0.5, 1.2)
        inbound_amount = add_noise(round(scam_amount * random.uniform(0.90, 1.05), 2))

    if not partial or random.random() > 0.25:
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, inbound_delay_h),
            "amount": inbound_amount,
            "direction": "inbound",
            "device_id": device_id,
            "beneficiary_id": None,
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })

    prior_normal_amounts = [add_noise(round(random.uniform(1_000, 8_000), 2)) for _ in range(3)]
    for j, prior_amt in enumerate(prior_normal_amounts):
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, (10 + j * 5) * 24),
            "amount": prior_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(i * 11 + j) % 100:06d}",
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })

    ben_id = pick_app_scam_beneficiary(i, partial=partial)
    events.append({
        "event_id": f"EVT_APP_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": scam_amount,
        "direction": "outbound",
        "rail": "promptpay",
        "beneficiary_id": ben_id,
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": random.random() > 0.4,
        "geo": geo_near_cluster(wallet_id),
        "source": "mockingbird",
        "_scenario_label": "app_scam_cashout",
    })

# ────────────────────────────────────────────────────────────────────────────
# 4. BACKGROUND (200 events)
# ────────────────────────────────────────────────────────────────────────────
rails = ["promptpay", "bank_transfer", "internal"]

# Pre-select which background events get elevated features (~15%)
elevated_bg_indices = set(
    random.sample(range(1, 201), k=int(200 * BACKGROUND_ELEVATED_FRACTION))
)

for i in range(1, 201):
    wallet_id = f"WAL_BG_{i:03d}"
    device_id = f"DEV_BG_{i:03d}"
    hours_ago = random.uniform(1, 168)
    event_ts = BASE_TS - timedelta(hours=hours_ago)
    event_iso = event_ts.isoformat().replace("+00:00", "Z")
    elevated = i in elevated_bg_indices
    elevated_type = random.choice(["traveller", "large_transfer", "new_beneficiary", "high_activity"]) if elevated else None

    add_geo_anchor_history(wallet_id, device_id, event_ts, random.choice(rails), recent=False)

    if i <= 100:
        num_prior = random.randint(3, 8)
        for j in range(num_prior):
            # Keep priors outside 48h window so withdrawal_after_deposit stays near 0
            prior_hours = random.uniform(48, 720)
            history.append({
                "wallet_id": wallet_id,
                "timestamp": ts_offset(event_ts, prior_hours),
                "amount": rand_amount_normal(),
                "direction": "outbound",
                "device_id": device_id,
                "beneficiary_id": f"BEN_{(i * 13 + j) % 200:06d}",
                "geo": geo_near_cluster(wallet_id),
                "channel": random.choice(rails),
            })

    # Elevated-feature history injections
    if elevated_type == "traveller":
        if random.random() < 0.35:
            device_id = f"DEV_BG_SHARED_{(i % 8) + 1:02d}"
        travel_hours = random.uniform(4.0, 8.0)
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(event_ts, travel_hours),
            "amount": rand_amount_normal(),
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(i * 7) % 200:06d}",
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })
    elif elevated_type == "high_activity":
        # Modest inbound well before burst keeps withdrawal_after_deposit plausible
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(event_ts, random.uniform(6.0, 12.0)),
            "amount": add_noise(round(random.uniform(3_000, 8_000), 2)),
            "direction": "inbound",
            "device_id": device_id,
            "beneficiary_id": None,
            "geo": geo_near_cluster(wallet_id),
            "channel": "promptpay",
        })
        for delay_min in [55, 40]:
            history.append({
                "wallet_id": wallet_id,
                "timestamp": ts_offset(event_ts, delay_min / 60),
                "amount": add_noise(round(random.uniform(1_000, 4_000), 2)),
                "direction": "outbound",
                "device_id": device_id,
                "beneficiary_id": f"BEN_{(i * 5) % 200:06d}",
                "geo": geo_near_cluster(wallet_id),
                "channel": "promptpay",
            })
    elif elevated_type == "large_transfer":
        for j in range(3):
            history.append({
                "wallet_id": wallet_id,
                "timestamp": ts_offset(event_ts, random.uniform(24, 168)),
                "amount": add_noise(round(random.uniform(2_000, 6_000), 2)),
                "direction": "outbound",
                "device_id": device_id,
                "beneficiary_id": f"BEN_{(i * 11 + j) % 200:06d}",
                "geo": geo_near_cluster(wallet_id),
                "channel": "bank_transfer",
            })

    # Event-level properties
    if elevated_type == "large_transfer":
        amount = add_noise(round(random.uniform(55_000, 95_000), 2))
        direction = "outbound"
        beneficiary_id = f"BEN_{i:06d}"
    elif elevated_type == "new_beneficiary":
        amount = add_noise(round(random.uniform(15_000, 45_000), 2))
        direction = "outbound"
        beneficiary_id = f"BEN_NEW_BG_{i:03d}"
    else:
        amount = rand_amount_normal()
        direction = random.choice(["outbound", "inbound"])
        beneficiary_id = f"BEN_{i:06d}"

    if elevated_type == "traveller":
        event_geo = geo_travel_plausible(wallet_id, random.uniform(3.0, 6.0))
    else:
        event_geo = geo_near_cluster(wallet_id)

    events.append({
        "event_id": f"EVT_BG_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": event_iso,
        "amount_thb": amount,
        "direction": direction,
        "rail": random.choice(rails),
        "beneficiary_id": beneficiary_id,
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": True,
        "geo": event_geo,
        "source": "mockingbird",
        "_scenario_label": "background",
    })

# ────────────────────────────────────────────────────────────────────────────
# 5. ATO-STYLE GEO VELOCITY EVENTS (3 events — R2 test coverage)
# ────────────────────────────────────────────────────────────────────────────
ATO_ANCHORS = [
    ("WAL_000001", "2026-05-30T09:30:00.000Z", "2026-05-30T10:00:00.000Z",
     {"lat": 35.6762, "lon": 139.6503}, "EVT_ATO_0001", "BEN_HIGHRISK_ATO1"),
    ("WAL_000003", "2026-05-30T09:00:00.000Z", "2026-05-30T09:30:00.000Z",
     {"lat": -33.8688, "lon": 151.2093}, "EVT_ATO_0002", "BEN_HIGHRISK_ATO2"),
    ("WAL_000004", "2026-05-30T08:45:00.000Z", "2026-05-30T09:15:00.000Z",
     {"lat": 52.5200, "lon": 13.4050}, "EVT_ATO_0003", "BEN_MEDRISK_ATO3"),
]

for (wallet_id, _anchor_ts, ato_ts, geo_abroad, event_id, ben_id) in ATO_ANCHORS:
    events.append({
        "event_id": event_id,
        "wallet_id": wallet_id,
        "timestamp": ato_ts,
        "amount_thb": add_noise(round(random.uniform(20_000, 50_000), 2)),
        "direction": "outbound",
        "rail": "bank_transfer",
        "beneficiary_id": ben_id,
        "device_id": f"DEV_{wallet_id}",
        "ip_country": "TH",
        "has_facial_scan": False,
        "geo": geo_abroad,
        "source": "mockingbird",
        "_scenario_label": "app_scam_cashout",
    })

# ── Write outputs ─────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(EVENTS_PATH), exist_ok=True)

with open(EVENTS_PATH, "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

with open(HISTORY_PATH, "w", encoding="utf-8") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)

print(f"Mockingbird Phase 2 (Spec-004): wrote {len(events)} events to {EVENTS_PATH}")
print(f"Mockingbird Phase 2 (Spec-004): wrote {len(history)} history records to {HISTORY_PATH}")

breakdown = {}
for e in events:
    label = e["_scenario_label"]
    breakdown[label] = breakdown.get(label, 0) + 1
print("\nEvent breakdown:")
for label, count in sorted(breakdown.items()):
    print(f"  {label}: {count} events")

print(f"\nTotal history records: {len(history)}")
print("\nATO events:")
for e in events:
    if e["event_id"].startswith("EVT_ATO_"):
        print(f"  {e['event_id']}  wallet={e['wallet_id']}  ts={e['timestamp']}  geo={e['geo']}")
