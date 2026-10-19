import os
import cv2
from ultralytics import YOLO

class CrowdDetector:
    def __init__(self, model_path="models/best.pt", conf_thresh=0.35):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        self.model = YOLO(model_path)
        self.conf_thresh = conf_thresh

    def classify_risk(self, count):
        if count < 10:
            return "LOW RISK", (0, 255, 0)
        elif count < 25:
            return "MEDIUM RISK", (0, 255, 255)
        else:
            return "HIGH RISK", (0, 0, 255)

    def process_frame(self, frame):
        results = self.model.predict(frame, conf=self.conf_thresh, verbose=False)[0]
        boxes = results.boxes
        person_count = len(boxes)
        risk_level, _ = self.classify_risk(person_count)

        bounding_boxes = []
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            bounding_boxes.append([x1, y1, x2, y2])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

        return {
            "person_count": person_count,
            "risk_level": risk_level,
            "bounding_boxes": bounding_boxes,
            "annotated_frame": frame
        }

if __name__ == "__main__":
    detector = CrowdDetector()
    print("CrowdDetector API Wrapper ready for backend integration!")