## frame-finder - GETTING STARTED

### prepare the project
- create a folder 'videos' in the video-retreival-backend and add the 'V3C1-100' folder (containing all 100 videos) to that directory.
- edit outputFolderPath in video-retreival-backend/config.js

### load node_modules
#### run from frame-finder(frontend) and from video-retreival-backend(backend)
```bash
npm install
```

### Starting MongoDB

```bash
brew services start mongodb-community
```
```bash
mongosh
use videoDB
```

#### (stop MongoDB later)
```bash
brew services stop mongodb-community
```

### Preprocessing Video

#### create venv for python

```bash
python3 -m venv venv
```

#### activate venv

```bash
source venv/bin/activate
```

#### (deactivate venv later)
```bash
source venv/bin/deactivate
```

#### install all required libraries inside venv

```bash
pip install opencv-python 
pip install torch torchvision 
pip install pillow 
pip install clip-by-openai
pip install git+https://github.com/openai/CLIP.git
pip install opencv-python-headless pillow torch
pip install scenedetect

```

### execute (creates V3C1-100-PROCESSED folder)
### takes around 120 minutes!!!

```bash
python3 video_processing.py /path/to/V3C1-100 /path/to/output_folder

### in my case
python3 video_processing.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED
```

### extract thumbnails for every second

run from the preprocessing folder:

```bash
python3 extract_thumbnails.py /path/to/V3C1-100 /path-/to/Project/video-retrieval-backend/V3C1-100-THUMBNAILS

### in my case
python3 extract_thumbnails.py /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100 /Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-THUMBNAILS
```

### store feature vectors to mongoDB
#### start from video-retreival-backend !!with venv activated!!
```bash
### starts node server and mongodb
node server.js
```
#### in another terminal window from video-retreival-backend !!with venv activated!!
```bash
node populateDatabase.js
```

### start frontend (from 'frame-finder' folder)
```bash
ng serve
```


