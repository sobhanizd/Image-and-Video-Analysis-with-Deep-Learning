"""
this class was used previously to test different approaches
it enables processing only one video
for the final build, ignore this file and just execute the video_processing.py
"""

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

def extract_scenes(video_path, threshold=0.7, seconds_per_frame=1, max_scene_length=400):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_skip = int(fps * seconds_per_frame)
    max_frames_per_scene = int(fps * max_scene_length)

    scenes = []
    prev_hist = None
    start_frame = 0

    # process one frame every second
    for frame_num in range(0, frame_count, frame_skip):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        hist = cv2.calcHist([gray_frame], [0], None, [256], [0, 256])

        if prev_hist is not None:
            hist_diff = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)
            if hist_diff < threshold or (frame_num - start_frame) > max_frames_per_scene:
                scenes.append((start_frame, frame_num))
                start_frame = frame_num

        prev_hist = hist

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
        'scene_features': scene_features
    }

    with open(output_path, 'w') as f:
        json.dump(data, f)

def process_single_video(video_path, output_folder, threshold=0.7, seconds_per_frame=1, max_scene_length=400):
    start_time = time.time()
    print(f"Processing started at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))}")

    video_name = os.path.basename(video_path).split('.')[0]
    scenes = extract_scenes(video_path, threshold, seconds_per_frame, max_scene_length)
    for i, (start_frame, end_frame) in enumerate(scenes):
        output_path = os.path.join(output_folder, f'{video_name}_scene_{i}_{start_frame}_{end_frame}.json')
        process_scene(video_path, start_frame, end_frame, output_path, seconds_per_frame)

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

# python3 single_video_processing.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100/00191/00191.mp4 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED-SINGLE/00191
# python3 single_video_processing.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100/00113/00113.mp4 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED-SINGLE/00113