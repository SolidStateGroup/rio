const sendImageData = require('../send-data');
const request = require('request').defaults({ encoding: null });
const uuid = require('node-uuid');

const _ = require('lodash');
const config = require('../config');
const Canvas = require('canvas'),
      Image = Canvas.Image,
      ImageData = Canvas.ImageData;

var resizeCanvas = new Canvas(config.matrix.width, config.matrix.height);
var canvas;
var ctx;

var stop = '';

const sendData = function(guid, frame) {
  sendImageData(guid, frame, 0, () => {
    if (stop == guid) {
      stop = '';
      return;
    }
  }, () => {
    stop = guid;
    return true;
  });
}

module.exports = function (url) {
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
      }
    });
};
