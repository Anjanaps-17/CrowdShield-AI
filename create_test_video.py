import os
import cv2

image_dir = r"dataset/train/test/images"
output_video_path = "input_crowd.mp4"

valid_exts = ('.jpg', '.png', '.jpeg')
images = [f for f in os.listdir(image_dir) if f.lower().endswith(valid_exts)][:100]

if not images:
    print("Error: No test images found in dataset directory.")
    exit()

first_frame = cv2.imread(os.path.join(image_dir, images[0]))
height, width, _ = first_frame.shape

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_video_path, fourcc, 10.0, (width, height))

print("Stitching test dataset images into a video stream...")

for img_name in images:
    img_path = os.path.join(image_dir, img_name)
    img = cv2.imread(img_path)
    if img is None:
        continue
    resized_img = cv2.resize(img, (width, height))
    for _ in range(3):  # Repeat frames to smooth out playback
        out.write(resized_img)

out.release()
print(f"Test video generated successfully: {output_video_path}")