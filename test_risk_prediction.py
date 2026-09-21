"""
CrowdShield AI - Risk Prediction Module (Member 2)
Week 5: Test risk prediction, calculate crowd density, generate congestion alerts.

This builds on train_risk_model.py (Week 4). It:
1. Loads the trained model and tests it against a range of realistic scenarios
2. Calculates density for a sequence of "frames" (simulating a video feed)
3. Adds congestion alert logic that considers SUSTAINED high density
   over multiple frames, not just a single reading (more realistic than
   a one-shot alert, and closer to what Member 1's video testing will feed in)
"""

import random
import joblib
import pandas as pd

from risk_prediction import calculate_density


MODEL_PATH = "risk_model.pkl"


# ----------------------------------------------------------------------
# STEP 1: Load the trained model (from Week 4)
# ----------------------------------------------------------------------
def load_model(path=MODEL_PATH):
    return joblib.load(path)


# ----------------------------------------------------------------------
# STEP 2: Predict risk for a single reading
# ----------------------------------------------------------------------
def predict_risk_ml(model, people_count, area_m2):
    density = calculate_density(people_count, area_m2)
    features = pd.DataFrame([{
        "people_count": people_count,
        "area_m2": area_m2,
        "density": density
    }])
    risk = model.predict(features)[0]
    return risk, density


# ----------------------------------------------------------------------
# STEP 3: Test the model against fixed, realistic scenarios
# ----------------------------------------------------------------------
# Rather than only random synthetic testing (Week 4), Week 5 tests against
# specific, labeled real-world-style scenarios to sanity-check the model's
# behavior at edge cases (very sparse, borderline, and packed crowds).
def run_test_scenarios(model):
    scenarios = [
        {"label": "Empty plaza", "people_count": 3, "area_m2": 200},
        {"label": "Light foot traffic", "people_count": 40, "area_m2": 150},
        {"label": "Busy market", "people_count": 120, "area_m2": 100},
        {"label": "Borderline dense", "people_count": 180, "area_m2": 100},
        {"label": "Packed entrance", "people_count": 300, "area_m2": 50},
        {"label": "Stampede-risk crowd", "people_count": 480, "area_m2": 40},
    ]

    print("--- Testing risk prediction on realistic scenarios ---\n")
    print(f"{'Scenario':<22}{'People':<8}{'Area':<8}{'Density':<10}Risk")
    print("-" * 60)
    for s in scenarios:
        risk, density = predict_risk_ml(model, s["people_count"], s["area_m2"])
        print(f"{s['label']:<22}{s['people_count']:<8}{s['area_m2']:<8}{density:<10}{risk}")
    print()
    return scenarios


# ----------------------------------------------------------------------
# STEP 4: Simulate a video feed (sequence of frames over time)
# ----------------------------------------------------------------------
# Member 1 plans to test YOLOv8 on video next. Video means we get a density
# reading per frame over time, not just one number. We simulate that here
# so the congestion alert logic is ready before real video data arrives.
def simulate_video_feed(n_frames=15, area_m2=60):
    """Simulate crowd count rising over time, like people entering a space."""
    frames = []
    count = random.randint(10, 30)
    for _ in range(n_frames):
        count += random.randint(-5, 25)  # crowd generally grows, with noise
        count = max(count, 0)
        frames.append({"people_count": count, "area_m2": area_m2})
    return frames


# ----------------------------------------------------------------------
# STEP 5: Sustained congestion alert logic
# ----------------------------------------------------------------------
# A single "High" reading could be a momentary blip (e.g. a group passing
# through). A real congestion alert should trigger only when risk stays
# High for several consecutive frames, which is far more useful for
# emergency response than a one-off alert.
def generate_congestion_alerts(model, frames, sustained_threshold=3):
    results = []
    consecutive_high = 0

    for i, frame in enumerate(frames):
        risk, density = predict_risk_ml(model, frame["people_count"], frame["area_m2"])

        if risk == "High":
            consecutive_high += 1
        else:
            consecutive_high = 0

        alert = consecutive_high >= sustained_threshold

        results.append({
            "frame": i + 1,
            "people_count": frame["people_count"],
            "density": density,
            "risk": risk,
            "consecutive_high": consecutive_high,
            "congestion_alert": alert
        })

    return results


if __name__ == "__main__":
    model = load_model()

    # Test against fixed realistic scenarios
    run_test_scenarios(model)

    # Simulate a video feed and test sustained congestion alerting
    print("--- Simulated video feed: congestion alert test ---\n")
    frames = simulate_video_feed(n_frames=15, area_m2=60)
    results = generate_congestion_alerts(model, frames, sustained_threshold=3)

    print(f"{'Frame':<7}{'People':<8}{'Density':<10}{'Risk':<8}{'Streak':<8}Alert")
    print("-" * 55)
    for r in results:
        alert_text = "!! CONGESTION ALERT !!" if r["congestion_alert"] else "-"
        print(f"{r['frame']:<7}{r['people_count']:<8}{r['density']:<10}{r['risk']:<8}{r['consecutive_high']:<8}{alert_text}")
