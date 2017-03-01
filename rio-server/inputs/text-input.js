const _ = require('lodash');
const sendImageData = require('../send-data');
const config = require('../config');
const uuid = require('node-uuid');
const Canvas = require('canvas');

const canvas = new Canvas(config.matrix.width, config.matrix.height);
const ctx = canvas.getContext('2d');
var frames = [];

var stop = '';
const sendData = function(guid, delay, index = 0) {
  if (index >= frames.length) {
    index = 0;
  }
  sendImageData(guid, frames[index], delay, () => {
    if (stop == guid) {
      stop = '';
      return;
    }
    sendData(guid, delay, index + 1);
  }, () => {
    stop = guid;
    return true;
  });
}

module.exports = function (text) {
  frames = [];
  ctx.font = '24px Impact';
  var width = ctx.measureText(text).width;
  var num_frames = width;
  for (var i = 0; i < num_frames; i++) {
    var x = config.matrix.width - ((config.matrix.width + width) * (i / (num_frames - 1)));
    ctx.clearRect(0, 0, config.matrix.width, config.matrix.height);
    ctx.fillText(text, x, 26);
    ctx.fillStyle = 'white';
    var imageData = ctx.getImageData(0, 0, config.matrix.width, config.matrix.height).data;

    // Only want RGB
    var temp = [];
    for (var j = 0; j < imageData.length; j += 4) {
      temp.push(imageData[j], imageData[j+1], imageData[j+2]);
    }
    frames.push(temp);
  }

  sendData(uuid.v1(), 20);
}
