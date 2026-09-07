"""
CrowdShield AI - Risk Prediction Module (Member 2)
Week 4: Train the risk prediction model, test crowd density features,
generate risk levels using a real trained ML model (not just rules).

This builds on risk_prediction.py. It:
1. Generates a larger labeled synthetic dataset (density -> risk level)
2. Trains a classifier (Random Forest) on it
3. Evaluates accuracy on a held-out test set
4. Saves the trained model so it can be reused for predictions later
"""

import random
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from risk_prediction import calculate_density, predict_risk  # reuse Week 2/3 logic


# ----------------------------------------------------------------------
# STEP 1: Build a larger labeled dataset
# ----------------------------------------------------------------------
# We use the same rule-based logic from risk_prediction.py to LABEL the
# synthetic data (this is a common bootstrapping technique when you don't
# yet have real labeled crowd data). The ML model then learns to
# reproduce and generalize this pattern from raw features.
def build_dataset(n=500):
    rows = []
    for _ in range(n):
        people_count = random.randint(1, 500)
        area_m2 = random.choice([20, 50, 100, 150, 200])
        density = calculate_density(people_count, area_m2)
        risk = predict_risk(density)  # ground-truth label (rule-based for now)

        rows.append({
            "people_count": people_count,
            "area_m2": area_m2,
            "density": density,
            "risk_level": risk
        })
    return pd.DataFrame(rows)


# ----------------------------------------------------------------------
# STEP 2: Train the model
# ----------------------------------------------------------------------
def train_model(df):
    # Features: what the model learns from. We test both people_count/area_m2
    # AND the derived density feature to see which representation works best.
    X = df[["people_count", "area_m2", "density"]]
    y = df["risk_level"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    return model, X_test, y_test


# ----------------------------------------------------------------------
# STEP 3: Evaluate the model (Week 4 "test crowd density features")
# ----------------------------------------------------------------------
def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)
    acc = accuracy_score(y_test, predictions)

    print(f"Model Accuracy: {acc * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, predictions))

    # Feature importance shows which density-related feature matters most
    print("Feature Importance:")
    for feature, importance in zip(X_test.columns, model.feature_importances_):
        print(f"  {feature}: {importance:.3f}")

    return acc


# ----------------------------------------------------------------------
# STEP 4: Generate risk level using the TRAINED model (not just rules)
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


if __name__ == "__main__":
    print("Building labeled dataset...")
    df = build_dataset(n=500)
    print(f"Dataset shape: {df.shape}\n")
    print(df.head(), "\n")

    print("Training model...")
    model, X_test, y_test = train_model(df)

    print("\nEvaluating model...\n")
    evaluate_model(model, X_test, y_test)

    # Save the trained model for reuse (e.g. in an API or dashboard later)
    joblib.dump(model, "risk_model.pkl")
    print("\nModel saved as risk_model.pkl")

    # Quick manual test with a few example scenarios
    print("\n--- Sample predictions using trained model ---")
    test_cases = [(20, 100), (150, 100), (450, 50)]
    for people, area in test_cases:
        risk, density = predict_risk_ml(model, people, area)
        print(f"People: {people}, Area: {area}m², Density: {density} -> Risk: {risk}")
