import cv2
import numpy as np
import torch
from PIL import Image
from clip import load
import os
import json
import time

# loading CLIP model
model, preprocess = load("ViT-B/32")

def detect_edges(frame):
    edges = cv2.Canny(frame, 100, 200)
    return edges

def extract_scenes(video_path, threshold=0.2, edge_threshold=0.5):
    epsilon=1e-10
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_skip = int(fps)
    #max_scene_frames = int(fps * max_scene_length)

    scenes = []
    prev_hist = None
    prev_edges = None
    start_frame = 0

    # process one frame every second
    for frame_num in range(0, frame_count, frame_skip):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        hist = cv2.calcHist([gray_frame], [0], None, [256], [0, 256])
        edges = detect_edges(gray_frame)

        if prev_hist is not None and prev_edges is not None:
            hist_diff = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)
            edge_diff = np.sum((edges - prev_edges) ** 2) / (np.sum(prev_edges ** 2) + epsilon)
            if hist_diff < threshold or edge_diff > edge_threshold:
                scenes.append((start_frame, frame_num))
                start_frame = frame_num

        prev_hist = hist
        prev_edges = edges

    # filling the scenes array with start and end frames of each scene
    scenes.append((start_frame, frame_count - 1))
    cap.release()
    return scenes

def extract_features(image, model, preprocess):
    image = preprocess(Image.fromarray(image)).unsqueeze(0)
    with torch.no_grad():
        features = model.encode_image(image).numpy()
    return features.flatten()

def process_scene(video_path, start_frame, end_frame, output_path, seconds_per_frame=1):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_skip = int(fps * seconds_per_frame)

    keyframes = []
    for frame_num in range(start_frame, end_frame, frame_skip):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if not ret:
            break
        keyframes.append(frame)

    cap.release()

    scene_features = [extract_features(frame, model, preprocess).tolist() for frame in keyframes]

    data = {
        'video_path': video_path,
        'scene_start_frame': start_frame,
        'scene_end_frame': end_frame,
        'scene_features': scene_features,
        'fps': fps
    }

    with open(output_path, 'w') as f:
        json.dump(data, f)

def process_videos_in_folder(video_folder, output_folder):
    video_count = 0
    start_time = time.time()
    print(f"Processing started at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")

    for subfolder in os.listdir(video_folder):
        subfolder_path = os.path.join(video_folder, subfolder)
        if os.path.isdir(subfolder_path):
            for file in os.listdir(subfolder_path):
                if file.endswith('.mp4') or file.endswith('.mov'):
                    video_count += 1
                    print(f"Processing video {video_count}: {file}")
                    video_path = os.path.join(subfolder_path, file)
                    scenes = extract_scenes(video_path, threshold=0.2, edge_threshold=0.5)
                    for i, (start_frame, end_frame) in enumerate(scenes):
                        output_path = os.path.join(output_folder, f'{subfolder}_scene_{i}_{start_frame}_{end_frame}.json')
                        process_scene(video_path, start_frame, end_frame, output_path, seconds_per_frame=1)

    end_time = time.time()
    print(f"Processing ended at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))}")
    duration = end_time - start_time
    print(f"Total processing time: {duration // 60} minutes and {duration % 60:.2f} seconds")
    print(f"Processed {video_count} videos in total.")

if __name__ == "__main__":
    import sys
    video_folder = sys.argv[1]
    output_folder = sys.argv[2]
    os.makedirs(output_folder, exist_ok=True)
    process_videos_in_folder(video_folder, output_folder)

# python3 video_processing.py /path/to/V3C1-100 /path/to/output_folder
# python3 video_processing.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED
