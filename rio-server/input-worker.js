const sendImageData = require('./send-data');
const uuid = require('node-uuid');
const Pool = require('threads').Pool;
const pool = new Pool();

var stop = '';

const sendData = function (guid, resizedFrames, delay, index = 0) {
    if (index >= resizedFrames.length) {
        index = 0;
    }
    sendImageData(guid, resizedFrames[index], delay, () => {
        if (stop == guid) {
            stop = '';
            return;
        }
        sendData(guid, resizedFrames, delay, index + 1);
    }, () => {
        stop = guid;
        return true;
    });
}

pool.on('done', (job, message) => {
    if (message.err) {
        console.log('Failed to render GIF', err);
        return;
    }
    // Send resized frames recursively
    sendData(uuid.v1(), message.frames, message.delay);
});

module.exports = (input, data) => {
    // Send URL to worker thread
    pool.run('./inputs/' + input).send(data);
};