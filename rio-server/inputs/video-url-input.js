const _ = require('lodash');
const config = require('../config');
const sendImageData = require('../send-data');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('node-uuid');
const fs = require('fs');
// const youtubedl = require('youtube-dl');

function toArrayBuffer (buffer) {
    var view = [];
    for (var i = 0; i < buffer.length; i++) {
        view[i] = buffer[i];
    }
    return view;
}

var frames = [];

var stop = false;

const sendData = function(guid, index = 0) {
  if (index >= frames.length) {
    index = 0;
  }
  sendImageData(guid, frames[index], 200, () => {
    if (stop) {
      stop = false;
      return;
    }
    sendData(guid, index + 1);
  }, () => {
    stop = true;
    return true;
  });
}

module.exports = function (url) {
  var video = youtubedl(url);
  video.on('info', info => {
    console.log('YouTube Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
  });
  video.pipe(fs.createWriteStream('output.mp4'));
  video.on('end', () => {
    var ffstream = ffmpeg('output.mp4')
      .videoCodec('rawvideo')
      .withNoAudio()
      .size(config.matrix.width + 'x' + config.matrix.height)
      .format('rawvideo')
      .fps(5)
      .outputOptions('-pix_fmt rgb24')
      .on('error', function(err, stdout, stderr) {
        console.log('An error occurred: ' + err.message);
        console.log('ffmpeg standard output:\n' + stdout);
        console.log('ffmpeg standard error:\n' + stderr);
      })
      .on('end', function() {
        //console.log('Frame zero is', frames[0].length, 'bytes which is', frames[0].length / 3, 'pixels');
        console.log('Processing finished !', frames.length, 'frames');
        fs.unlink('output.mp4');
        sendData(uuid.v1());
      })
      .pipe();

      var buffer = new Buffer([]);
      const frameSize = config.matrix.width * config.matrix.height * 3;
      ffstream.on('data', function(chunk) {
        console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
        console.log('chunk:', chunk);
        while (chunk.length) {
          var bytesToCopy = buffer.length + chunk.length > frameSize ? frameSize - buffer.length : chunk.length;
          newBuffer = Buffer.allocUnsafe(buffer.length + bytesToCopy);
          newBuffer.fill(buffer, 0, buffer.length);
          buffer = newBuffer;
          console.log('bytes to copy from chunk', bytesToCopy);
          console.log('buffer length', buffer.length);
          chunk.copy(buffer, buffer.length - bytesToCopy, 0, bytesToCopy);
          console.log('copied chunk into buffer', buffer);
          chunk = chunk.slice(bytesToCopy);
          console.log('reduced chunk to ', chunk);
          if (buffer.length === frameSize) {
            console.log('adding frame and resetting buffer');
            frames.push(toArrayBuffer(buffer));
            buffer = new Buffer([]);
          }
        }
      });
  })
};
