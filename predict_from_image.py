"""
CrowdShield AI - Risk Prediction Module (Member 2)
Real image-based risk prediction.

This is the actual integration step: instead of fake/simulated people counts,
this detects people in a REAL image using YOLOv8 (generic pretrained model,
since Member 1's custom-trained WiderPerson weights aren't shared yet), then
feeds that real count into the trained risk prediction model.

Once Member 1 shares her custom-trained weights (models/best.pt), just change
MODEL_WEIGHTS below to point to that file instead of "yolov8n.pt" for more
accurate crowd-specific detection.
"""

import joblib
import pandas as pd
from ultralytics import YOLO

from risk_prediction import calculate_density


MODEL_WEIGHTS = "yolov8n.pt"          # swap for Member 1's trained weights when available
RISK_MODEL_PATH = "risk_model.pkl"    # from train_risk_model.py


def detect_people_count(image_path, weights=MODEL_WEIGHTS, conf=0.25):
    """Run YOLOv8 person detection on a real image and return the count."""
    model = YOLO(weights)
    # class 0 = "person" in the standard COCO classes YOLOv8 is trained on
    results = model.predict(source=image_path, conf=conf, classes=[0], verbose=False)
    people_count = len(results[0].boxes)
    image_height, image_width = results[0].orig_shape
    return people_count, image_width, image_height


def predict_risk_from_image(image_path, area_m2, risk_model_path=RISK_MODEL_PATH):
    """
    Full pipeline: real image -> people count -> density -> risk level.

    area_m2 is the real-world area the camera/photo covers. This must be
    estimated based on the actual physical space (e.g. a known plaza size),
    since it can't be derived from pixel dimensions alone.
    """
    people_count, width, height = detect_people_count(image_path)
    density = calculate_density(people_count, area_m2)

    risk_model = joblib.load(risk_model_path)
    features = pd.DataFrame([{
        "people_count": people_count,
        "area_m2": area_m2,
        "density": density
    }])
    risk = risk_model.predict(features)[0]

    return {
        "image_path": image_path,
        "image_size_px": f"{width}x{height}",
        "people_count": people_count,
        "area_m2": area_m2,
        "density": density,
        "risk_level": risk
    }


if __name__ == "__main__":
    # area_m2 is an ESTIMATE for now — replace with the real measured area
    # of the space shown in the photo once known.
    result = predict_risk_from_image("images/crowd.png", area_m2=50)

    print("--- Real image risk prediction ---")
    for key, value in result.items():
        print(f"{key}: {value}")
