global.fetch = require('node-fetch'); // polyfil
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;
const app = express();

//Setup web server
app.server = http.createServer(app);
app.server.listen(PORT);

const api = require('./clients/web-client');
var colors = require('colors');


const slackClient = require('./clients/slack-client');
const wsClient = require('./clients/websocket-client');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({limit: '50mb'}));

app.use('/', api());

//Start clients
slackClient.init();
wsClient.init(app);


// Startup GIF

const getImageData = require('./inputs/gif-url-input');
const getVideoData = require('./inputs/video-url-input');

getImageData('https://media.giphy.com/media/3o7buekWPtAWpscQCY/giphy.gif'); 
module.exports = app;
