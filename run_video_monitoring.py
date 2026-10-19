import os
import cv2
from ultralytics import YOLO

# 1. Load Trained YOLOv8 Weights (Located in models/ directory)
model_path = os.path.join("models", "best.pt")
if not os.path.exists(model_path):
    print(f"Error: {model_path} not found.")
    exit()

model = YOLO(model_path)

# 2. Risk Level Thresholds
LOW_RISK_LIMIT = 10
MEDIUM_RISK_LIMIT = 25

def classify_risk(count):
    if count < LOW_RISK_LIMIT:
        return "LOW RISK", (0, 255, 0)       # Green
    elif count < MEDIUM_RISK_LIMIT:
        return "MEDIUM RISK", (0, 255, 255)  # Yellow
    else:
        return "HIGH RISK", (0, 0, 255)      # Red

# 3. Process Input Video
input_video = "input_crowd.mp4"
cap = cv2.VideoCapture(input_video)
if not cap.isOpened():
    print(f"Error: Could not open video file {input_video}")
    exit()

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

os.makedirs("runs", exist_ok=True)
output_path = os.path.join("runs", "crowdshield_monitored.mp4")
out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

print("Processing video frames with YOLOv8...")

frame_idx = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_idx += 1
    results = model.predict(frame, conf=0.35, verbose=False)[0]
    boxes = results.boxes

    person_count = len(boxes)
    status_text, status_color = classify_risk(person_count)

    # Draw Bounding Boxes
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

    # Render Dashboard Overlay
    cv2.rectangle(frame, (10, 10), (370, 95), (0, 0, 0), -1)
    cv2.putText(frame, f"People Count: {person_count}", (20, 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(frame, f"Status: {status_text}", (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

    out.write(frame)
    if frame_idx % 30 == 0:
        print(f"Processed {frame_idx} frames...")

cap.release()
out.release()

print("\nVideo processing complete!")
print(f"Monitored output saved to: {output_path}")