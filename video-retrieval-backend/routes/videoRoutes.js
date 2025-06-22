const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Scene = require('../models/Scene');
const { encodeText } = require('../utils/clipUtils');
const path = require('path');

const SIMILARITY_THRESHOLD = 0.25;

const flattenVector = (vector) => {
    return Array.isArray(vector[0]) ? vector.flat() : vector;
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA * magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

async function findSimilarScenes(queryVector) {
    const scenes = await Scene.find().populate('video').lean();

    const results = scenes.map(scene => {
        const keyframeSimilarities = scene.sceneFeatures.map((feature, index) => {
            const similarity = cosineSimilarity(queryVector, feature.featureVector);
            return {
                frameNumber: scene.sceneStartFrame + index,
                similarity
            };
        });

        return {
            video: scene.video.title,
            scene: scene,
            keyframeSimilarities: keyframeSimilarities
        };
    });

    const filteredResults = results.map(result => ({
        video: result.video,
        fps: result.scene.video.fps,
        scenes: [{
            ...result.scene,
            keyframeSimilarities: result.keyframeSimilarities
                .filter(k => k.similarity >= SIMILARITY_THRESHOLD && !isNaN(k.similarity))
                .sort((a, b) => b.similarity - a.similarity)
        }].filter(scene => scene.keyframeSimilarities.length > 0)
    })).filter(result => result.scenes.length > 0);

    filteredResults.sort((a, b) => b.scenes[0].keyframeSimilarities[0].similarity - a.scenes[0].keyframeSimilarities[0].similarity);

    return filteredResults;
}

// POST /api/videos/search
router.post('/search', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        let queryVector = await encodeText(query);
        queryVector = flattenVector(queryVector);
        const results = await findSimilarScenes(queryVector);

        res.status(200).json(results);
    } catch (err) {
        console.error('Error during search:', err);
        res.status(500).json({ message: 'Error during search' });
    }
});

// POST /api/videos/videos/store
router.post('/videos/store', async (req, res) => {
    const { title, fps } = req.body;
    try {
        let video = await Video.findOne({ title: title });
        if (!video) {
            video = new Video({ title, fps });
            await video.save();
        }
        res.status(200).json(video);
    } catch (err) {
        console.error('Error storing video:', err);
        res.status(500).json({ message: 'Error storing video' });
    }
});

// POST /api/videos/scenes/store
router.post('/scenes/store', async (req, res) => {
    const data = req.body;
    try {
        const newScene = new Scene(data);
        await newScene.save();
        res.status(200).json({ message: 'Scene stored successfully' });
    } catch (err) {
        console.error('Error storing scene:', err);
        res.status(500).json({ message: 'Error storing scene' });
    }
});

module.exports = router;
