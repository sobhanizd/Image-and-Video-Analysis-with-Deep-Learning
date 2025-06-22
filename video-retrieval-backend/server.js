const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const videoRoutes = require('./routes/videoRoutes');
const config = require('./config');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


mongoose.connect(config.dbUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/thumbnails', express.static(path.join(__dirname, 'V3C1-100-THUMBNAILS')));

app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.use('/api/videos', videoRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
