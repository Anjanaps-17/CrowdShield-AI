import os
import time
import torch
import cv2
import numpy as np
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F
from torchmetrics.detection.mean_ap import MeanAveragePrecision

# 1. Device Setup
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Evaluating Faster R-CNN on device: {device}")

# 2. Initialize Model Architecture (4 classes: background + 3 target classes)
model = fasterrcnn_resnet50_fpn(num_classes=4)
checkpoint = torch.load('crowdshield_fasterrcnn_epoch_2.pth', map_location=device, weights_only=False)
model.load_state_dict(checkpoint)
model.to(device)
model.eval()

# 3. Path Configuration
test_img_dir = r"dataset/train/test/images"
test_ann_dir = r"dataset/train/test/annotations"

if not os.path.exists(test_ann_dir):
    test_ann_dir = test_img_dir

valid_exts = ('.jpg', '.png', '.jpeg')
image_files = [f for f in os.listdir(test_img_dir) if f.lower().endswith(valid_exts)]

# Set to evaluate a quick subset (e.g. 100) or set to None for all images
MAX_IMAGES = 100
if MAX_IMAGES:
    image_files = image_files[:MAX_IMAGES]

total_files = len(image_files)
print(f"Found {total_files} images to evaluate. Starting evaluation...")

metric = MeanAveragePrecision(box_format="xyxy", iou_type="bbox")
total_inference_time = 0.0
processed_count = 0

with torch.no_grad():
    for idx, img_name in enumerate(image_files, 1):
        img_path = os.path.join(test_img_dir, img_name)
        ann_name = os.path.splitext(img_name)[0] + ".txt"
        ann_path = os.path.join(test_ann_dir, ann_name)

        img = cv2.imread(img_path)
        if img is None:
            continue

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_tensor = F.to_tensor(img_rgb).unsqueeze(0).to(device)

        start_time = time.time()
        outputs = model(img_tensor)
        inference_time = time.time() - start_time

        total_inference_time += inference_time
        processed_count += 1

        # Prediction Extraction
        preds = [{
            'boxes': outputs[0]['boxes'].cpu(),
            'scores': outputs[0]['scores'].cpu(),
            'labels': outputs[0]['labels'].cpu()
        }]

        # Ground Truth Extraction
        gt_boxes, gt_labels = [], []
        if os.path.exists(ann_path):
            with open(ann_path, 'r') as f:
                lines = f.readlines()
                start_idx = 1 if len(lines) > 0 and len(lines[0].strip().split()) == 1 else 0
                for line in lines[start_idx:]:
                    parts = line.strip().split()
                    if len(parts) >= 5:
                        cls_id, x1, y1, x2, y2 = map(float, parts[:5])
                        if int(cls_id) in [1, 2, 3]:
                            gt_boxes.append([x1, y1, x2, y2])
                            gt_labels.append(int(cls_id))

        targets = [{
            'boxes': torch.tensor(gt_boxes, dtype=torch.float32),
            'labels': torch.tensor(gt_labels, dtype=torch.int64)
        }]

        metric.update(preds, targets)

        if idx % 10 == 0 or idx == total_files:
            print(f"Processed [{idx}/{total_files}] images...")

# 4. Results
results = metric.compute()
avg_fps = processed_count / total_inference_time if total_inference_time > 0 else 0

print("\n" + "="*40)
print("     FASTER R-CNN EVALUATION RESULTS     ")
print("="*40)
print(f"Total Images Processed      : {processed_count}")
print(f"mAP @ [0.5:0.95]            : {results['map'].item():.4f}")
print(f"mAP @ 0.50                   : {results['map_50'].item():.4f}")
print(f"Average Speed (FPS)         : {avg_fps:.2f} frames/sec")
print("="*40)