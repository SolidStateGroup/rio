var ipc = require('node-ipc')
var channel = null;
ipc.config.id = 'ipc';
ipc.config.socketRoot = '/tmp/';
ipc.config.appspace = 'app.';
ipc.config.silent = true;
ipc.config.rawBuffer = true;
ipc.config.retry= 1500;

var callback = null;

//TODO: this should be put into an init function
ipc.connectTo(
    'main',
    function(){
        ipc.of.main.on(
            'connect',
            function(){
                ipc.log('## connected to main ##', ipc.config.delay);
                channel = ipc.of.main;
            }
        );
        ipc.of.main.on(
            'data',
            function(data) {
                callback && callback();
            }
        )
    }
);

module.exports = {
    connected: function () {
        return channel ? true : false;
    },
    drawFrame: function(frame, cb) {
        callback = cb;
        channel && channel.emit(frame);
    },
    drawText: function (text) {
        console.log('DrawText noop');
    }
};
