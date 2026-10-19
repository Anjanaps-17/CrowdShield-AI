import os
import torch
from PIL import Image
from torch.utils.data import Dataset
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor


# ==========================================
# 1. Dataset paths
# ==========================================

DATASET_DIR = "dataset"

TRAIN_IMAGES = os.path.join(
    DATASET_DIR,
    "train",
    "images"
)

TRAIN_LABELS = os.path.join(
    DATASET_DIR,
    "train",
    "labels"
)


# ==========================================
# 2. CrowdShield Dataset
# ==========================================

class CrowdDataset(Dataset):

    def __init__(self, image_dir, label_dir):

        self.image_dir = image_dir
        self.label_dir = label_dir

        self.images = [
            file
            for file in os.listdir(image_dir)
            if file.lower().endswith(
                (".jpg", ".jpeg", ".png")
            )
        ]

        self.images.sort()

        print(
            "Images found:",
            len(self.images)
        )


    def __len__(self):

        return len(self.images)


    def __getitem__(self, index):

        image_name = self.images[index]

        image_path = os.path.join(
            self.image_dir,
            image_name
        )

        label_name = (
            os.path.splitext(image_name)[0]
            + ".txt"
        )

        label_path = os.path.join(
            self.label_dir,
            label_name
        )


        # Load image

        image = Image.open(
            image_path
        ).convert("RGB")

        width, height = image.size


        boxes = []
        labels = []


        # Read YOLO labels

        if os.path.exists(label_path):

            with open(
                label_path,
                "r"
            ) as file:

                for line in file:

                    values = line.strip().split()

                    if len(values) != 5:
                        continue


                    class_id = int(values[0])


                    x_center = (
                        float(values[1])
                        * width
                    )

                    y_center = (
                        float(values[2])
                        * height
                    )

                    box_width = (
                        float(values[3])
                        * width
                    )

                    box_height = (
                        float(values[4])
                        * height
                    )


                    # YOLO → Faster R-CNN

                    x_min = (
                        x_center
                        - box_width / 2
                    )

                    y_min = (
                        y_center
                        - box_height / 2
                    )

                    x_max = (
                        x_center
                        + box_width / 2
                    )

                    y_max = (
                        y_center
                        + box_height / 2
                    )


                    boxes.append([
                        x_min,
                        y_min,
                        x_max,
                        y_max
                    ])


                    # Background = 0
                    # Actual classes = 1,2,3

                    labels.append(
                        class_id + 1
                    )


        boxes = torch.tensor(
            boxes,
            dtype=torch.float32
        )

        labels = torch.tensor(
            labels,
            dtype=torch.int64
        )


        target = {
            "boxes": boxes,
            "labels": labels
        }


        # Convert image to tensor

        image = torchvision.transforms.functional.to_tensor(
            image
        )


        return image, target


# ==========================================
# 3. Create dataset
# ==========================================

dataset = CrowdDataset(
    TRAIN_IMAGES,
    TRAIN_LABELS
)


print(
    "Total dataset size:",
    len(dataset)
)


# ==========================================
# 4. Test dataset
# ==========================================

image, target = dataset[0]


print(
    "Image tensor shape:",
    image.shape
)

print(
    "Number of boxes:",
    len(target["boxes"])
)

print(
    "Labels:",
    target["labels"]
)


# ==========================================
# 5. Create Faster R-CNN
# ==========================================

print(
    "Loading Faster R-CNN..."
)


model = torchvision.models.detection.fasterrcnn_resnet50_fpn(
    weights="DEFAULT"
)


print(
    "Pretrained Faster R-CNN loaded!"
)


# ==========================================
# 6. Change classifier for 3 classes
# ==========================================

NUM_CLASSES = 4

# 3 classes + background

in_features = (
    model.roi_heads
    .box_predictor
    .cls_score
    .in_features
)


model.roi_heads.box_predictor = (
    FastRCNNPredictor(
        in_features,
        NUM_CLASSES
    )
)


print(
    "Classifier changed for 3 CrowdShield classes!"
)


# ==========================================
# 7. Move model to device
# ==========================================

DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


model.to(DEVICE)


print(
    "Device:",
    DEVICE
)


# ==========================================
# 8. Test one image
# ==========================================

print(
    "Testing Faster R-CNN..."
)


model.eval()


with torch.no_grad():

    prediction = model(
        [image.to(DEVICE)]
    )


print(
    "Prediction completed!"
)


print(
    "Predicted boxes:",
    len(prediction[0]["boxes"])
)

print(
    "Predicted labels:",
    prediction[0]["labels"]
)

print(
    "Predicted scores:",
    prediction[0]["scores"]
)