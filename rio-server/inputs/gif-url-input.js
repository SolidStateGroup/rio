var inputWorker = require('../input-worker');
module.exports = (url) => {
    inputWorker('gif-worker', url)
};