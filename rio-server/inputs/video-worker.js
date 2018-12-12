const _ = require('lodash');
const config = require('../config');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const youtubedl = require('youtube-dl');

function toArrayBuffer(buffer) {
    var view = [];
    for (var i = 0; i < buffer.length; i++) {
        view[i] = buffer[i];
    }
    return view;
}

var frames = [];

module.exports = (url, done) => {

    var video = youtubedl(url, ['--format=17']); // 176 x 144 @ 12fps
    video.on('info', info => {
        console.log('YouTube Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });
    video.pipe(fs.createWriteStream('output.mp4'));
    video.on('end', () => {
        var ffstream = ffmpeg('output.mp4')
            .videoCodec('rawvideo')
            .withNoAudio()
            .size(config.matrix.width + 'x' + config.matrix.height)
            .format('rawvideo')
            .fps(12)
            .outputOptions('-pix_fmt rgb24')
            .on('error', function (err, stdout, stderr) {
                console.log('An error occurred: ' + err.message);
                console.log('ffmpeg standard output:\n' + stdout);
                console.log('ffmpeg standard error:\n' + stderr);
            })
            .on('end', () => {
                //console.log('Frame zero is', frames[0].length, 'bytes which is', frames[0].length / 3, 'pixels');
                console.log('Processing finished !', frames.length, 'frames');
                fs.unlink('output.mp4');
                done({
                    frames,
                    delay: 1000/12
                });
            })
            .pipe();

        var buffer = new Buffer([]);
        const frameSize = config.matrix.width * config.matrix.height * 3;
        ffstream.on('data', function (chunk) {
            while (chunk.length) {
                var bytesToCopy = buffer.length + chunk.length > frameSize ? frameSize - buffer.length : chunk.length;
                newBuffer = Buffer.allocUnsafe(buffer.length + bytesToCopy);
                newBuffer.fill(buffer, 0, buffer.length);
                buffer = newBuffer;
                chunk.copy(buffer, buffer.length - bytesToCopy, 0, bytesToCopy);
                chunk = chunk.slice(bytesToCopy);
                if (buffer.length === frameSize) {
                    frames.push(toArrayBuffer(buffer));
                    buffer = new Buffer([]);
                }
            }
        });
    })
};
