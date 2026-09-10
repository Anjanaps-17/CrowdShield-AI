"""
CrowdShield AI - Risk Prediction Module (Member 2)
Week 6: Integrate density data, test risk prediction, improve risk classification.

This upgrades the Week 4/5 model with two new features:
  1. density_change  -> how fast density is rising/falling between frames
  2. zone_type        -> different areas have different safety tolerances
                         (a narrow passage is riskier than an open plaza
                         at the SAME density)

It also defines a clear integration interface (get_people_count_from_detection)
so that Member 1's real detection output can be plugged in later with no
structural changes needed here.
"""

import random
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from risk_prediction import calculate_density


MODEL_PATH = "risk_model_v2.pkl"
ZONE_TYPES = ["open_area", "entrance_exit", "narrow_passage"]


# ----------------------------------------------------------------------
# STEP 1: Improved rule-based labeling (accounts for zone + rate of change)
# ----------------------------------------------------------------------
# Different zones tolerate different densities before becoming risky.
# A narrow passage becomes dangerous at a much lower density than an
# open plaza, because people have less room to move / escape.
ZONE_THRESHOLDS = {
    "open_area":       {"low": 1.5, "medium": 3.5},
    "entrance_exit":    {"low": 1.0, "medium": 2.5},
    "narrow_passage":   {"low": 0.6, "medium": 1.5},
}


def classify_risk(density, density_change, zone_type):
    """
    Rule-based ground-truth labeler used to bootstrap training data.
    Combines: raw density, how fast it's changing, and the zone's tolerance.
    """
    thresholds = ZONE_THRESHOLDS[zone_type]

    if density < thresholds["low"]:
        base_risk = "Low"
    elif density < thresholds["medium"]:
        base_risk = "Medium"
    else:
        base_risk = "High"

    # A rapid increase in density is dangerous even if the absolute
    # density hasn't crossed into "High" yet — bump risk up one level.
    if density_change > 1.0 and base_risk == "Low":
        base_risk = "Medium"
    elif density_change > 1.5 and base_risk == "Medium":
        base_risk = "High"

    return base_risk


# ----------------------------------------------------------------------
# STEP 2: Build a labeled dataset with the new features
# ----------------------------------------------------------------------
def build_dataset_v2(n=800):
    rows = []
    for _ in range(n):
        people_count = random.randint(1, 500)
        area_m2 = random.choice([20, 50, 100, 150, 200])
        density = calculate_density(people_count, area_m2)

        # simulate the previous frame's density to compute a rate of change
        prev_density = max(0, density + random.uniform(-1.5, 1.5))
        density_change = round(density - prev_density, 2)

        zone_type = random.choice(ZONE_TYPES)

        risk = classify_risk(density, density_change, zone_type)

        rows.append({
            "people_count": people_count,
            "area_m2": area_m2,
            "density": density,
            "density_change": density_change,
            "zone_type": zone_type,
            "risk_level": risk
        })
    return pd.DataFrame(rows)


# ----------------------------------------------------------------------
# STEP 3: Train the improved model
# ----------------------------------------------------------------------
def train_model_v2(df):
    # One-hot encode zone_type since it's categorical, not numeric
    df_encoded = pd.get_dummies(df, columns=["zone_type"])

    feature_cols = [c for c in df_encoded.columns if c != "risk_level"]
    X = df_encoded[feature_cols]
    y = df_encoded["risk_level"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)

    return model, X_test, y_test, feature_cols


def evaluate_model_v2(model, X_test, y_test, feature_cols):
    predictions = model.predict(X_test)
    acc = accuracy_score(y_test, predictions)

    print(f"Model Accuracy: {acc * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, predictions))

    print("Feature Importance:")
    for feature, importance in sorted(
        zip(feature_cols, model.feature_importances_), key=lambda x: -x[1]
    ):
        print(f"  {feature}: {importance:.3f}")

    return acc


# ----------------------------------------------------------------------
# STEP 4: Predict using the improved model
# ----------------------------------------------------------------------
def predict_risk_v2(model, feature_cols, people_count, area_m2, density_change, zone_type):
    density = calculate_density(people_count, area_m2)

    row = {col: 0 for col in feature_cols}
    row["people_count"] = people_count
    row["area_m2"] = area_m2
    row["density"] = density
    row["density_change"] = density_change
    zone_col = f"zone_type_{zone_type}"
    if zone_col in row:
        row[zone_col] = 1

    features = pd.DataFrame([row])[feature_cols]
    risk = model.predict(features)[0]
    return risk, density


# ----------------------------------------------------------------------
# STEP 5: Integration interface for Member 1's detection output
# ----------------------------------------------------------------------
# This is the CONTRACT for real integration later. Whatever format
# Member 1's detection model produces, write a small adapter that
# converts it into this shape, and everything above keeps working
# unchanged.
def get_people_count_from_detection(detection_output):
    """
    Adapter function: converts Member 1's detection output into a
    simple people_count integer.

    Expected input formats (either is fine):
      - an int/float: already a count -> returned as-is
      - a list of bounding boxes: e.g. [[x1,y1,x2,y2], ...] -> len() is the count

    Example with a real YOLO result:
        count = get_people_count_from_detection(len(results[0].boxes))
    """
    if isinstance(detection_output, (int, float)):
        return int(detection_output)
    if isinstance(detection_output, (list, tuple)):
        return len(detection_output)
    raise ValueError(
        "Unsupported detection_output format. Expected an int/float count "
        "or a list of bounding boxes."
    )


if __name__ == "__main__":
    print("Building v2 dataset (density_change + zone_type)...")
    df = build_dataset_v2(n=800)
    print(df.head(), "\n")

    print("Training improved model...")
    model, X_test, y_test, feature_cols = train_model_v2(df)

    print("\nEvaluating...\n")
    evaluate_model_v2(model, X_test, y_test, feature_cols)

    joblib.dump({"model": model, "feature_cols": feature_cols}, MODEL_PATH)
    print(f"\nModel saved as {MODEL_PATH}")

    print("\n--- Sample predictions with zone context + rate of change ---")
    test_cases = [
        (100, 100, 0.2, "open_area"),
        (100, 100, 0.2, "narrow_passage"),
        (150, 80, 1.8, "entrance_exit"),
    ]
    for people, area, change, zone in test_cases:
        risk, density = predict_risk_v2(model, feature_cols, people, area, change, zone)
        print(f"People={people}, Area={area}m², Change={change}, Zone={zone} "
              f"-> Density={density}, Risk={risk}")

    print("\n--- Integration interface test ---")
    print("From a raw count:", get_people_count_from_detection(42))
    print("From bounding boxes:", get_people_count_from_detection([[0,0,1,1]] * 15))
