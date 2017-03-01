const WebSocket = require('ws');
const sendFrame = require('../send-data');
//Assign wss to global scope
var wss = null;
var sent = true;
var lastSent;

module.exports = {
    init: (app) => {
        wss = new WebSocket.Server({ server: app.server });
        global.wss = wss;
        wss.on('connection', function connection (ws) {
            console.log('Client connection established');

            //WebSocket server
            ws.on('message', function connection (frame) {
                //todo: websocket should give id
                if (!sent) {
                    console.log('DROPPING PAINT-PIXEL FRAME');
                    return;
                }
                sent = false;
                sendFrame('paint-pixel', JSON.parse(frame), 0, () => {
                    sent = true;
                    lastSent = Date.now();
                }, () => {
                    return lastSent ? (Date.now() - lastSent > 5000) : true;
                });
            });
        });
    }
};
