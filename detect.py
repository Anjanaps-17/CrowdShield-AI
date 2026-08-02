# from ultralytics import YOLO

# # Load your trained model
# model = YOLO("models/best.pt")

# # Predict on an image
# results = model.predict(
#     source="images/crowd.png",   # Change this to your image name
#     conf=0.25,
#     save=True,
#     show=True
# )

# print("Detection completed!")


from ultralytics import YOLO
import os

print("Current folder:", os.getcwd())

print("Loading model...")
model = YOLO("models/best.pt")
print("Model loaded!")

image_path = "images/crowd.png"

print("Image exists:", os.path.exists(image_path))

print("Running prediction...")
results = model.predict(
    source=image_path,
    conf=0.25,
    save=True,
    verbose=True
)

print("Prediction completed!")