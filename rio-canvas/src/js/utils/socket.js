var ws = new WebSocket("ws://localhost:8080/");
var cb;
ws.onmessage = function incoming(message) {
  cb && cb(message.data)
};

module.exports = (newCallback) =>{
  cb = newCallback;
};
