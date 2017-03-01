// Establish websocket connection to API for button events
var config = require('../config');
var ws = new WebSocket(config.ws);

module.exports = (frame) => {
    if (ws.readyState == 1) {
      ws.send(JSON.stringify(frame));
    }
};
