from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model(
    source="dataset/test/images",
    classes=[0],      # Only detect persons
    conf=0.5,
    save=True
)

print("Detection completed!")