
import os
import torch
from PIL import Image, ImageDraw
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms.functional import to_tensor

# Checkpoint and test image
CHECKPOINT = "crowdshield_fasterrcnn_epoch_2.pth"
IMAGE_PATH = "images/crowd.png"
OUTPUT_PATH = "runs/fasterrcnn_local_prediction.jpg"

# CrowdShield class names (0 is background)
CLASS_NAMES = {
    1: "Partially-visible person",
    2: "Pedestrian",
    3: "Rider"
}

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Device:", device)

if not os.path.exists(CHECKPOINT):
    raise FileNotFoundError(f"Checkpoint not found: {CHECKPOINT}")

if not os.path.exists(IMAGE_PATH):
    raise FileNotFoundError(f"Test image not found: {IMAGE_PATH}")

print("Loading Faster R-CNN architecture...")

# Create the same architecture without downloading pretrained weights.
model = fasterrcnn_resnet50_fpn(
    weights=None,
    weights_backbone=None,
    num_classes=4
)

checkpoint = torch.load(
    CHECKPOINT,
    map_location="cpu",
    weights_only=True
)

model.load_state_dict(checkpoint)
model.to(device)
model.eval()

print("Trained checkpoint loaded successfully!")

# Load image
image = Image.open(IMAGE_PATH).convert("RGB")
image_tensor = to_tensor(image).to(device)

# Run detection
print("Detecting people...")
with torch.no_grad():
    prediction = model([image_tensor])[0]

# Draw predictions with confidence >= 0.50
draw = ImageDraw.Draw(image)
threshold = 0.50
counts = {name: 0 for name in CLASS_NAMES.values()}

for box, label, score in zip(
    prediction["boxes"].cpu(),
    prediction["labels"].cpu(),
    prediction["scores"].cpu()
):
    label = int(label)
    score = float(score)

    if score < threshold or label not in CLASS_NAMES:
        continue

    x1, y1, x2, y2 = map(float, box.tolist())
    name = CLASS_NAMES[label]
    counts[name] += 1

    draw.rectangle((x1, y1, x2, y2), outline="red", width=2)
    draw.text(
        (x1, max(0, y1 - 15)),
        f"{name} {score:.2f}",
        fill="red"
    )

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
image.save(OUTPUT_PATH)

print("\nDetection counts:")
for name, count in counts.items():
    print(f"{name}: {count}")

print("Total detected:", sum(counts.values()))
print("Saved result to:", OUTPUT_PATH)
