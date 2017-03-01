const WebSocket = require('ws');

module.exports = {
    drawFrame: function (frame, cb) {
        if (global.wss) {
            global.wss.clients.forEach(function each (client) {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('sending to client')
                    client.send(frame);
                } else {
                    console.log("ERR")
                }
            });
        }

        cb && cb();
    },
    drawText: function (text) {
        console.log('DrawText socket noop');
    }
};
