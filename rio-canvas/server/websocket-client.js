const WebSocket = require('ws');
//Assign wss to global scope
var express = require('express');
var http = require('http')
var app = express();
var server = http.createServer(app)
var wss = new WebSocket.Server({ server });
server.listen(8080, function listening() {
  console.log('WSS listening on %d', server.address().port);
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
