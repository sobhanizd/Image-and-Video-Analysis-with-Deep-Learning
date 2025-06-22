const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: String,
    fps: Number
});

module.exports = mongoose.model('Video', videoSchema);
