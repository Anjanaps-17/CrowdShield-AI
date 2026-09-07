"""
CrowdShield AI - Risk Prediction Module (Member 2)
----------------------------------------------------
This is a starter script covering:
- Week 2: sample dataset + feature definition
- Week 3: initial rule-based prediction model + testing
- Week 4/5: density calculation + risk level generation (ready to extend)

Once Member 1's detect.py can return a person count (instead of just
printing), plug that number into `people_count` below instead of the
sample data, and everything downstream keeps working unchanged.
"""

import random

# ----------------------------------------------------------------------
# STEP 1: Feature definitions
# ----------------------------------------------------------------------
# For now we're using two core features:
#   - people_count : number of people detected in a frame (from YOLOv8)
#   - area_m2       : approximate area of the monitored zone in square meters
#
# density = people_count / area_m2   (people per square meter)
#
# Later, once video data is available, we can add:
#   - movement_speed   : average speed of tracked people (m/s)
#   - movement_direction : dominant direction of flow (for congestion prediction)


# ----------------------------------------------------------------------
# STEP 2: Sample / synthetic dataset (stand-in until real detection data exists)
# ----------------------------------------------------------------------
def generate_sample_data(n=10):
    """Generate n synthetic (people_count, area_m2) samples for testing."""
    samples = []
    for _ in range(n):
        people_count = random.randint(5, 400)
        area_m2 = random.choice([20, 50, 100, 150])
        samples.append({"people_count": people_count, "area_m2": area_m2})
    return samples


# ----------------------------------------------------------------------
# STEP 3: Feature engineering
# ----------------------------------------------------------------------
def calculate_density(people_count, area_m2):
    """People per square meter."""
    if area_m2 <= 0:
        raise ValueError("area_m2 must be greater than 0")
    return round(people_count / area_m2, 2)


# ----------------------------------------------------------------------
# STEP 4: Rule-based risk prediction model (baseline)
# ----------------------------------------------------------------------
# Thresholds below are placeholders — adjust based on real-world crowd
# safety guidelines (e.g. Fruin's Level of Service standards) once you
# research them further.
LOW_THRESHOLD = 1.0     # people/m^2
MEDIUM_THRESHOLD = 2.5  # people/m^2


def predict_risk(density):
    """Return a risk level string based on crowd density."""
    if density < LOW_THRESHOLD:
        return "Low"
    elif density < MEDIUM_THRESHOLD:
        return "Medium"
    else:
        return "High"


# ----------------------------------------------------------------------
# STEP 5: Congestion alert logic (Week 5 groundwork)
# ----------------------------------------------------------------------
def generate_alert(risk_level):
    """Return an alert message if risk is high, else None."""
    if risk_level == "High":
        return "⚠️ ALERT: High crowd density detected — possible congestion risk!"
    return None


# ----------------------------------------------------------------------
# STEP 6: Run + test everything together
# ----------------------------------------------------------------------
def run_pipeline(samples):
    results = []
    for sample in samples:
        density = calculate_density(sample["people_count"], sample["area_m2"])
        risk = predict_risk(density)
        alert = generate_alert(risk)

        result = {
            "people_count": sample["people_count"],
            "area_m2": sample["area_m2"],
            "density": density,
            "risk_level": risk,
            "alert": alert,
        }
        results.append(result)
    return results


if __name__ == "__main__":
    print("Generating sample dataset...\n")
    data = generate_sample_data(n=10)

    print("Running risk prediction pipeline...\n")
    results = run_pipeline(data)

    print(f"{'People':<8}{'Area(m2)':<10}{'Density':<10}{'Risk':<8}Alert")
    print("-" * 60)
    for r in results:
        alert_text = r["alert"] if r["alert"] else "-"
        print(f"{r['people_count']:<8}{r['area_m2']:<10}{r['density']:<10}{r['risk_level']:<8}{alert_text}")
