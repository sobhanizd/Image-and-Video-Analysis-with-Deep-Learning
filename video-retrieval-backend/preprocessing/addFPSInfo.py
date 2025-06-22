"""
this class was used previously to add the fps from a log file to the preprocessed scene-json_files
since we forgot to add it initially and wanted to save another preprocessing run (takes ~2 hours on our machines)
for the final build, ignore this file and just execute the video_processing.py
"""
import os
import json

# FPS-Values from log
fps_values = {
    "00120.mp4": 25.0,
    "00118.mp4": 29.97002997002997,
    "00127.mp4": 25.0,
    "00111.mp4": 30.0,
    "00129.mp4": 25.0,
    "00116.mp4": 25.0,
    "00142.mp4": 30.0,
    "00189.mp4": 29.97002997002997,
    "00145.mp4": 23.976,
    "00173.mp4": 25.0,
    "00187.mp4": 29.97002997002997,
    "00180.mp4": 25.0,
    "00174.mp4": 23.976023976023978,
    "00128.mp4": 29.97002997002997,
    "00117.mp4": 29.97002997002997,
    "00110.mp4": 25.0,
    "00119.mp4": 25.0,
    "00126.mp4": 23.976023976023978,
    "00121.mp4": 25.0,
    "00175.mp4": 25.0,
    "00181.mp4": 23.976,
    "00186.mp4": 25.0,
    "00172.mp4": 25.0,
    "00144.mp4": 25.0,
    "00143.mp4": 23.976023976023978,
    "00188.mp4": 25.0,
    "00161.mp4": 29.97,
    "00195.mp4": 29.97002997002997,
    "00159.mp4": 25.0,
    "00192.mp4": 30.0,
    "00166.mp4": 30.0,
    "00150.mp4": 29.97002997002997,
    "00168.mp4": 30.0,
    "00157.mp4": 23.976023976023978,
    "00103.mp4": 29.97002997002997,
    "00104.mp4": 29.97002997002997,
    "00132.mp4": 24.0,
    "00135.mp4": 24.0,
    "00169.mp4": 25.0,
    "00156.mp4": 25.0,
    "00151.mp4": 29.97002997002997,
    "00158.mp4": 25.0,
    "00167.mp4": 29.97002997002997,
    "00193.mp4": 25.0,
    "00194.mp4": 30.0,
    "00160.mp4": 24.0,
    "00134.mp4": 25.0,
    "00133.mp4": 25.0,
    "00105.mp4": 25.0,
    "00102.mp4": 29.97002997002997,
    "00146.mp4": 23.976023976023978,
    "00179.mp4": 24.0,
    "00141.mp4": 23.976023976023978,
    "00183.mp4": 25.0,
    "00177.mp4": 23.976023976023978,
    "00148.mp4": 23.976023976023978,
    "00170.mp4": 29.97002997002997,
    "00184.mp4": 25.0,
    "00124.mp4": 25.0,
    "00123.mp4": 23.976023976023978,
    "00115.mp4": 25.0,
    "00112.mp4": 23.976023976023978,
    "00185.mp4": 23.976023976023978,
    "00171.mp4": 25.0,
    "00176.mp4": 30.0,
    "00182.mov": 24.0,
    "00149.mp4": 24.0,
    "00140.mp4": 25.0,
    "00147.mp4": 25.0,
    "00178.mp4": 29.97002997002997,
    "00113.mp4": 29.97002997002997,
    "00114.mp4": 29.97002997002997,
    "00122.mp4": 25.0,
    "00125.mp4": 15.0,
    "00107.mp4": 29.97002997002997,
    "00138.mp4": 30.0,
    "00100.mp4": 23.976,
    "00136.mp4": 25.0,
    "00109.mp4": 25.0,
    "00131.mp4": 25.0,
    "00191.mp4": 24.0,
    "00165.mp4": 23.976023976023978,
    "00162.mp4": 23.976023976023978,
    "00196.mp4": 23.000687757909215,
    "00154.mp4": 30.0,
    "00198.mp4": 29.97002997002997,
    "00153.mp4": 30.0,
    "00130.mp4": 25.0,
    "00137.mp4": 29.97002997002997,
    "00108.mp4": 29.97002997002997,
    "00101.mp4": 29.97002997002997,
    "00106.mp4": 25.0,
    "00139.mp4": 25.0,
    "00199.mp4": 25.0,
    "00152.mp4": 25.0,
    "00155.mp4": 23.976023976023978,
    "00197.mp4": 23.976023976023978,
    "00163.mp4": 25.0,
    "00164.mp4": 23.976023976023978,
    "00190.mp4": 30.0,
}

def update_json_files(output_folder, fps_values):
    json_files = [f for f in os.listdir(output_folder) if f.endswith('.json')]

    for file in json_files:
        file_path = os.path.join(output_folder, file)
        with open(file_path, 'r') as f:
            data = json.load(f)

        video_basename = os.path.basename(data['video_path'])
        fps = fps_values.get(video_basename)

        if fps:
            data['fps'] = fps
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=4)
            print(f"Updated {file} with fps: {fps}")
        else:
            print(f"FPS for {video_basename} not found")


output_folder = '/Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED'

update_json_files(output_folder, fps_values)
