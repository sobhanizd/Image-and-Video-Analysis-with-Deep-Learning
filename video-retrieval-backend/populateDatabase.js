const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

function flattenFeatureVector(features) {
    return features.flat();
}

async function populateDatabase(outputFolder) {
    const jsonFiles = fs.readdirSync(outputFolder).filter(file => file.endsWith('.json'));
    //let counter = 0;
    for (const file of jsonFiles) {
        //if(file.startsWith('00113')) {
        const filePath = path.join(outputFolder, file);
        console.log(`Processing file: ${filePath}`);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));


        if (data.scene_features) {
            data.scene_features = data.scene_features.map(features => flattenFeatureVector(features));
        }

        // extracting scene details from the filename
        const match = file.match(/(\d+)_scene_(\d+)_(\d+)_(\d+)\.json$/);
        if (!match) {
            console.error(`Filename ${file} does not match the expected pattern`);
            continue;
        }

        const [_, videoNumber, sceneIndex, startFrameStr, endFrameStr] = match;
        const startFrame = parseInt(startFrameStr, 10);
        const endFrame = parseInt(endFrameStr, 10);
        const videoBasename = path.basename(data.video_path, path.extname(data.video_path));

        const fps = data.fps;
        if (!fps) {
            console.error(`FPS for ${videoBasename} not found in ${file}`);
            continue;
        }

        data.thumbnail_path = `/thumbnails/${videoBasename}_frame_${String(Math.max(1, Math.floor((startFrame + endFrame) / 2 / fps))).padStart(4, '0')}.jpg`;

        try {
            //console.log(`Attempting to store video with title: ${videoBasename} and fps: ${fps}`);
            let videoResponse = await axios.post('http://localhost:5001/api/videos/videos/store', { title: videoBasename, fps: fps });
            const videoId = videoResponse.data._id;

            const sceneData = {
                video: videoId,
                sceneStartFrame: startFrame,
                sceneEndFrame: endFrame,
                sceneFeatures: data.scene_features.map((features, index) => ({
                    frameNumber: startFrame + (index * ((endFrame - startFrame) / data.scene_features.length)),
                    featureVector: features.map(f => parseFloat(f))
                })),
                thumbnailPath: data.thumbnail_path
            };

            //console.log(`Attempting to store scene for video ID: ${videoId}`);
            const sceneResponse = await axios.post('http://localhost:5001/api/videos/scenes/store', sceneData);
            console.log(sceneResponse.data);
        } catch (error) {
            console.error('Error populating database:', error.message);
            console.error('Error details:', error.response ? error.response.data : 'No response data');
        }

        /* if (counter++ > 2) {
             break
         }*/
        //}
    }
}

populateDatabase(config.outputFolderPath).then(r => console.log("populateDatabase success"));
