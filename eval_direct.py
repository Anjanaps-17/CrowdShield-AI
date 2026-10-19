import os
import time
import torch
import cv2
import numpy as np
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Evaluating Faster R-CNN on device: {device}")

model = fasterrcnn_resnet50_fpn(num_classes=4)
checkpoint = torch.load('crowdshield_fasterrcnn_epoch_2.pth', map_location=device, weights_only=False)
model.load_state_dict(checkpoint)
model.to(device)
model.eval()

test_img_dir = r"dataset/train/test/images"
test_ann_dir = r"dataset/train/test/annotations"

if not os.path.exists(test_ann_dir):
    test_ann_dir = test_img_dir

def compute_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    return interArea / float(boxAArea + boxBArea - interArea + 1e-6)

valid_exts = ('.jpg', '.png', '.jpeg')
image_files = [f for f in os.listdir(test_img_dir) if f.lower().endswith(valid_exts)][:100]
total_files = len(image_files)

total_tp, total_fp, total_gt = 0, 0, 0
total_time = 0.0

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

        start = time.time()
        outputs = model(img_tensor)[0]
        total_time += (time.time() - start)

        boxes = outputs['boxes'].cpu().numpy()
        scores = outputs['scores'].cpu().numpy()
        pred_boxes = boxes[scores >= 0.50]

        gt_boxes = []
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

        total_gt += len(gt_boxes)
        matched_gt = set()

        for p_box in pred_boxes:
            best_iou = 0.0
            best_gt_idx = -1
            for g_idx, g_box in enumerate(gt_boxes):
                iou = compute_iou(p_box, g_box)
                if iou > best_iou:
                    best_iou = iou
                    best_gt_idx = g_idx

            if best_iou >= 0.50 and best_gt_idx not in matched_gt:
                total_tp += 1
                matched_gt.add(best_gt_idx)
            else:
                total_fp += 1

        if idx % 20 == 0 or idx == total_files:
            print(f"Evaluated [{idx}/{total_files}] images...")

precision = total_tp / (total_tp + total_fp + 1e-6)
recall = total_tp / (total_gt + 1e-6)
map50 = precision * recall  # Approximation for IoU=0.5 AP
fps = total_files / total_time if total_time > 0 else 0

print("\n" + "="*45)
print("     FASTER R-CNN DIRECT EVALUATION     ")
print("="*45)
print(f"Total Test Images Processed : {total_files}")
print(f"Precision @ IoU=0.5         : {precision:.4f}")
print(f"Recall @ IoU=0.5            : {recall:.4f}")
print(f"Estimated mAP @ 0.50        : {map50:.4f}")
print(f"Inference Speed (FPS)       : {fps:.2f} frames/sec")
print("="*45)