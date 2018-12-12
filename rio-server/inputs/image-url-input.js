const { sendFrame, canSendFrame, addToQueue } = require('../send-data');
const request = require('request').defaults({ encoding: null });
const uuid = require('uuid');

const _ = require('lodash');
const config = require('../config');
const Canvas = require('canvas'),
      Image = Canvas.Image;

var resizeCanvas = new Canvas(config.matrix.width, config.matrix.height);
var canvas;
var ctx;

var canStop = true;
const sendData = function(guid, frame) {
  sendFrame(guid, frame, 0, () => {}, () => true, () => canStop);
  setTimeout(() => {
    canStop = true;
  }, config.imageInputDisplayTime);
}

const sendImage = (url) => {
  if (config.queueing && !canSendFrame()) {
    addToQueue('image', () => sendImage(url));
    return;
  }
  canStop = false;
  // Download image
  request.get(url, function(error, response, body) {
    if (response.statusCode == 200) {
      // Create image
      img = new Image;
      img.src = body;

      // Create canvas to render image at full size
      canvas = new Canvas(img.width, img.height);
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw full size image to LED wall sized canvas and then get image data
      resizeCanvas.getContext('2d').drawImage(canvas, 0, 0, config.matrix.width, config.matrix.height);
      var imageData = resizeCanvas.getContext('2d').getImageData(0, 0, config.matrix.width, config.matrix.height).data;

      // Only want RGB
      var temp = [];
      for (var i = 0; i < imageData.length; i += 4) {
        temp.push(imageData[i], imageData[i+1], imageData[i+2]);
      }

      // Send it through
      sendData(uuid.v1(), temp);
    } else {
      canStop = true;
    }
  });
}

module.exports = sendImage;
