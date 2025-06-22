import os
import subprocess
import re

def extract_thumbnails(video_path, thumbnail_folder, thumbnail_size='160x90'):
    os.makedirs(thumbnail_folder, exist_ok=True)
    video_basename = os.path.basename(video_path).split('.')[0]  # to avoid issues with extensions

    # extracting frame rate of the video
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'default=noprint_wrappers=1:nokey=1', video_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    frame_rate_str = result.stdout.decode('utf-8').strip()
    num, denom = map(float, frame_rate_str.split('/'))
    frame_rate = num / denom

    # extracting total number of frames for the video
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'default=noprint_wrappers=1:nokey=1', video_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    total_frames_output = result.stdout.decode('utf-8').strip()
    total_frames = int(re.search(r'\d+', total_frames_output).group())
    total_seconds = total_frames / frame_rate

    # extracting and resizing frames
    command = [
        'ffmpeg',
        '-i', video_path,
        '-vf', f'fps=1,scale={thumbnail_size}',  # Extract one frame per second
        os.path.join(thumbnail_folder, f'{video_basename}_frame_%04d.jpg')
    ]

    try:
        subprocess.run(command, check=True)
        print(f"Thumbnails extracted for {video_basename} and saved in {thumbnail_folder}")
    except subprocess.CalledProcessError as e:
        print(f"Error extracting thumbnails: {e}")

# similar to video_preprocessing.py
def process_videos_in_folder(video_folder, thumbnail_folder):
    for subfolder in os.listdir(video_folder):
        subfolder_path = os.path.join(video_folder, subfolder)
        if os.path.isdir(subfolder_path):
            for file in os.listdir(subfolder_path):
                if file.endswith('.mp4') or file.endswith('.mov'):
                    video_path = os.path.join(subfolder_path, file)
                    extract_thumbnails(video_path, thumbnail_folder)

if __name__ == "__main__":
    import sys
    video_folder = sys.argv[1]
    thumbnail_folder = sys.argv[2]
    os.makedirs(thumbnail_folder, exist_ok=True)
    process_videos_in_folder(video_folder, thumbnail_folder)

# python3 extract_thumbnails.py /path/to/V3C1-100 /path/to/thumbnail_folder
# python3 extract_thumbnails.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-THUMBNAILS

