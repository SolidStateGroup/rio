const { sendFrame, canSendFrame, addToQueue } = require('./send-data');
const uuid = require('node-uuid');
const spawn = require('threads').spawn;
const config = require('./config');

var stop = '';

var canStop = true;
var currentGUID;
const sendData = function (guid, resizedFrames, delay, index = 0) {
    if (index >= resizedFrames.length) {
        if (guid == currentGUID && !canStop) {
            canStop = true;
        }
        index = 0;
    }
    sendFrame(guid, resizedFrames[index], delay, () => {
        if (stop == guid) {
            stop = '';
            return;
        }
        sendData(guid, resizedFrames, delay, index + 1);
    }, () => {
        stop = guid;
        return true;
    }, () => canStop);
}

spawnThread = (input, data) => {
    const thread = spawn('./inputs/' + input)
        .send(data)
        .on('progress', progress => {
            console.log(`Processing ${input == 'gif-worker' ? 'GIF' : 'video'} [${data}]: ${progress}%`);
        })
        .on('message', message => {
            if (message.err) {
                console.log('Failed to render GIF', err);
                return;
            }
            // Send resized frames recursively
            currentGUID = uuid.v1();
            sendData(currentGUID, message.frames, message.delay);
        })
        .on('done', () => {
            thread.kill();
        })
}

module.exports = (input, data) => {
    if (config.queueing && !canSendFrame()) {
        addToQueue(input == 'gif-worker' ? 'GIF' : 'video', () => spawnThread(input, data));
        return;
    }
    // Send URL to worker thread
    canStop = false;
    currentGUID = '';
    spawnThread(input, data);
};