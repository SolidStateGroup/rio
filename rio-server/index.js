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

getImageData('http://en.bloggif.com/tmp/6b84db8afee6e34259321142f9b0623a/text.gif?1488370466'); // 50fps 50x30 RGB rect
//getImageData('http://i.giphy.com/3oz8xEMwRxFQV21ntC.gif'); // 5s 6x5 stripey GIF
// getImageData('http://i.giphy.com/l0MYE0GTUJFY5PWcU.gif'); // 30x1 5s 2 frame GIF
// getImageData('http://i.giphy.com/3oz8xwDZ6N4vt2D6so.gif'); // 5s 12x10 stripey GIF

//getVideoData('https://www.youtube.com/watch?v=wS8ZC271eMQ');


module.exports = app;
