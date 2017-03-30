const _ = require('lodash');
const dgram = require('dgram');
const config = require('./config');
const uuid = require('node-uuid');
const consoleOutput = require('./outputs/console-output');
const piOutput = require('./outputs/pi-output');
const websocketOutput = require('./outputs/websocket-output');

var sent = true;
var sender;


const prepareFrame = function (raw, pixelsPerRow, zigzag = true) {
    var groupBypPixel = _.chunk(raw, 3);
    var groupByRow = _.chunk(groupBypPixel, pixelsPerRow);

    if (zigzag) {
        _.each(groupByRow, function (row, i) {
            if (i % 2) { //row is even, reverse the pixels
                groupByRow[i] = groupByRow[i].reverse();
            }
        });
    }

    return groupByRow;
};

const prepareFrameBuffer = function (raw, pixelsPerRow, zigzag = true, alpha = false) {
    var buffer = new Buffer(raw.length + (alpha ? raw.length / 3 : 0));
    var groupBypPixel = _.chunk(raw, 3);
    var groupByRow = _.chunk(groupBypPixel, pixelsPerRow);
    var x = 0;


    _.each(groupByRow, function (row, i) { //for each group of rows
        var loop = i % 2 ? zigzag ? _.eachRight: _.each : _.each;
        loop(row, (pixel) => { //each row, in reverse for even rows
            _.each(pixel, (rgb)=>{ //Every pixel array
                buffer.writeUInt8(rgb, x++);
            });
            if (alpha) {
                buffer.writeUInt8(255, x++);
            }
        });

    });

    return buffer;
};

var start;
function sendFrame (guid, frame, delay, cb, stopCb) {
    //STEP 1: register sender as current, if there is an existing sender callback telling it to stop sending data
    if (!sender) {
        console.log('Sending', guid);
        sender = { guid, stopCb };
    }
    else if (sender.guid != guid) {
        if (sender.stopCb && sender.stopCb()) {
            console.log('Stopping', sender.guid);
            console.log('Sending', guid);
            sender = { guid, stopCb };
        }
        else {
            // ignore it, unable to stop the current sender
            return;
        }
    }

    //Step 2: chunk frame per row and reverse every other frame
    if (!config.sendToWebsockets && !config.sendToConsole && !config.sendToPi) {
        setTimeout(cb, delay);
        return;
    }
    start = Date.now();
    if (config.sendToWebsockets) {
        // Send to websocket clients such as the mobile app
        //TODO: REVERT THIS WHEN https://github.com/facebook/react-vr/issues/78 is sorted
        // var preparedFrame = prepareFrameBuffer(frame, config.matrix.width, false, true);
        websocketOutput.drawFrame(JSON.stringify(frame), (config.sendToPi || config.sendToConsole) ? false : () => {
            setTimeout(cb, delay - (Date.now() - start));
        });
    }
    if (config.sendToConsole) {
        //Option 1 draw to log
        console.log('\x1Bc');
        frame = prepareFrame(frame, config.matrix.width, false);
        consoleOutput.drawFrame(frame);
        setTimeout(cb, delay - (Date.now() - start));
    }
    else if (config.sendToPi) {
        //Option 2 draw to pixel wall and/or any websocket client
        frame = prepareFrameBuffer(frame, config.matrix.width, true);
        piOutput.drawFrame(frame, () => {
            setTimeout(cb, delay - (Date.now() - start))
        });
    }

};

//For each frame send image to the device, use (frame rate - previous frame duration) to animate smoothly
module.exports = sendFrame;
