const mongoose = require('mongoose');

const keyframeSchema = new mongoose.Schema({
    frameNumber: Number,
    featureVector: [Number]
});

const sceneSchema = new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    sceneStartFrame: Number,
    sceneEndFrame: Number,
    sceneFeatures: [keyframeSchema],
    thumbnailPath: String
});

module.exports = mongoose.model('Scene', sceneSchema);