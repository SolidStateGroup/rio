var inputWorker = require('../input-worker');
module.exports = (url) => {
    inputWorker('video-worker', url)
};