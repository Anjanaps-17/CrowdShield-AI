from ultralytics import YOLO

# Load pretrained YOLOv8 Nano model
model = YOLO("yolov8n.pt")

# Train the model
model.train(
    data="dataset/data.yaml",
    epochs=50,
    imgsz=640,
    batch=8,
    workers=2,
    name="CrowdShieldAI"
)

print("Training Completed!")