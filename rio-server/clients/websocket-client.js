const WebSocket = require('ws');
const { sendFrame, canSendFrame } = require('../send-data');
const config = require('../config');
//Assign wss to global scope
var wss = null;
var sent = true;
var lastSent;
var idleTimer;

const canStop = () => lastSent ? (Date.now() - lastSent > 5000) : true;

module.exports = {
    init: (app) => {
        wss = new WebSocket.Server({ server: app.server });
        global.wss = wss;
        wss.on('connection', function connection (ws) {
            console.log('Client connection established');

            //WebSocket server
            ws.on('message', function connection (frame) {
                //todo: websocket should give id
                if (config.queueing && !canSendFrame('websocket-client')) {
                    // TODO: notify the canvas that rio-server is busy.
                    return;
                }
                if (!sent) {
                    return;
                }
                sent = false;
                clearTimeout(idleTimer);
                sendFrame('websocket-client', JSON.parse(frame), 0, () => {
                    sent = true;
                    lastSent = Date.now();
                    idleTimer = setTimeout(() => {
                        // Re-send last frame if no frame has been sent for 6 seconds, this will kick off any other inputs that have been queued up
                        sent = false;
                        sendFrame('websocket-client', JSON.parse(frame), 0, () => {
                            sent = true;
                        }, () => true, () => true);
                    }, 6000);
                }, () => {
                    if (canStop()) {
                        clearTimeout(idleTimer);
                        return true;
                    }
                    return false;
                }, canStop);
            });
        });
    }
};
