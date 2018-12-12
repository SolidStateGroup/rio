const colors = require('colors');
const colorsV2 = require('ansi-256-colors');
const config = require('../config');
const char = '▣'; //character to send to terminal

const _ = require('lodash');
module.exports = {
    drawFrame: function (frame) { //a frame is an array of rows which is an array of pixels
        var consoleOutput = '';
        _.each(frame, (row) => {
            _.each(row, (pixel) => {
                if (config.use8bitColors) {
                    var red = Math.floor(pixel[0] * 6 / 256);
                    var green = Math.floor(pixel[1] * 6 / 256);
                    var blue = Math.floor(pixel[2] * 6 / 256);
                    consoleOutput += colorsV2.fg.getRgb(red, green, blue) + colorsV2.bg.getRgb(red, green, blue) + char + ' ' + colorsV2.reset;
                } else {
                    var maxColor = require('../lib/max-index')(pixel);
                    var ret;
                    switch (maxColor) {
                        case 1: {
                            ret = char.red;
                            break;
                        }
                        case 2: {
                            ret = char.green;
                            break;
                        }
                        default: {
                            ret = char.blue;
                        }
                    }

                    consoleOutput += ret + ' ';
                }
            });
            //at the end of every row
            consoleOutput += '\n';
        });
        //output rows
        console.log(consoleOutput);
    }
}