const config = {
    development: {
        dbUrl: 'mongodb://localhost:27017/videoDB',
        outputFolderPath: '/Users/lukaskofler/UniProjects/ImageAndVideoAnalysis/V3C1-100-PROCESSED'
        //outputFolderPath: '/Users/romangraf/WebstormProjects/frame-finder/video-retrieval-backend/V3C1-100-PROCESSED'
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
