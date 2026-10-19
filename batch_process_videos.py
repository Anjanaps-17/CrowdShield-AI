import os
import cv2
import time
from ultralytics import YOLO

# 1. Load trained YOLOv8 model
model_path = os.path.join("models", "best.pt")
if not os.path.exists(model_path):
    print(f"Error: Model weights not found at {model_path}")
    exit()

model = YOLO(model_path)

# 2. Get all videos from the 'videos' folder
video_dir = "videos"
if not os.path.exists(video_dir):
    print(f"Error: Directory '{video_dir}' not found.")
    exit()

video_files = [f for f in os.listdir(video_dir) if f.endswith(('.mp4', '.avi', '.mov', '.mkv'))]

if not video_files:
    print(f"No video files found in '{video_dir}' folder.")
    exit()

os.makedirs("runs", exist_ok=True)

# Extended Risk & Emergency Mapper (Aligns with Abstract)
def classify_risk_and_emergency(count):
    if count < 10:
        return "LOW RISK", "Normal Monitoring - No Emergency", (0, 255, 0)
    elif count < 25:
        return "MEDIUM RISK", "Alert Ground Staff / Monitor Flow", (0, 255, 255)
    else:
        return "HIGH RISK", "EMERGENCY: Dispatch Security & Medical", (0, 0, 255)

# SPEED & DENSE DETECTION TUNING
FRAME_SKIP = 3      # Process 1 out of 3 frames (3x faster speed)
CONF_THRESH = 0.10  # Low confidence threshold to pick up occluded heads/bodies

print(f"Found {len(video_files)} video(s) in '{video_dir}/'. Starting fast batch processing...\n")

for idx, vid_name in enumerate(video_files, 1):
    input_path = os.path.join(video_dir, vid_name)
    output_path = os.path.join("runs", f"monitored_video_{idx}.mp4")

    cap = cv2.VideoCapture(input_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

    frame_count = 0
    processed_frames = 0
    total_persons = 0
    start_time = time.time()

    last_boxes = []
    last_person_count = 0

    print(f"[{idx}/{len(video_files)}] Processing: {vid_name}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Process inference every FRAME_SKIP frames
        if frame_count % FRAME_SKIP == 0 or frame_count == 1:
            processed_frames += 1
            # Use max frame dimension (width) to prevent downscaling small heads
            results = model.predict(frame, conf=CONF_THRESH, imgsz=max(width, 1280), verbose=False)[0]
            last_boxes = results.boxes
            last_person_count = len(last_boxes)
            total_persons += last_person_count

        status_text, emergency_text, status_color = classify_risk_and_emergency(last_person_count)

        # Draw bounding boxes
        for box in last_boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

        # Draw HUD Overlay (Risk + Emergency Action)
        cv2.rectangle(frame, (10, 10), (520, 120), (0, 0, 0), -1)
        cv2.putText(frame, f"Frame: {frame_count}", (20, 35),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, f"Detected People: {last_person_count}", (20, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, f"Risk Status: {status_text}", (20, 85),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)
        cv2.putText(frame, f"Action: {emergency_text}", (20, 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

        out.write(frame)

    cap.release()
    out.release()

    elapsed_time = time.time() - start_time
    avg_fps = frame_count / elapsed_time if elapsed_time > 0 else 0
    avg_people = total_persons / processed_frames if processed_frames > 0 else 0

    print(f" Done! Frames: {frame_count} | Effective Speed: {avg_fps:.2f} FPS | Avg Count: {avg_people:.1f} people/frame")
    print(f" Saved to: {output_path}\n")

print("All videos processed successfully!")