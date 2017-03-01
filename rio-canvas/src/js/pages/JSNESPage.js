import React, {Component, PropTypes} from 'react';

import resizeImage from '../utils/resize-image-data';
const sendFrame = require('./send-frame');
var uints = [];

const JSNESPage = class extends Component {
  componentDidMount() {
    var script = document.createElement("script");

    script.src = require('./jsnes/dynamicaudio-min');
    script.async = true;

    document.body.appendChild(script);

    script = document.createElement("script");

    script.src = require('./jsnes/jsnes.min');
    script.async = true;

    document.body.appendChild(script);

    // var marioKart = require('./roms/super-mario-kart.sfc');
    //     marioKart = marioKart.substr(marioKart.indexOf('/build') + 1);

    this.initTimer = setInterval(() => {
      if (window.DynamicAudio && window.JSNES) {
        console.log('Creating JSNES emulator');
        // console.log(marioKart);
        this.nes = new window.JSNES({
          ui: $('#emulator').JSNESUI(/*{
            "Working": [
              ['Super Mario Kart', marioKart],
            ]
          }*/)
        });
        clearInterval(this.initTimer);
      }
    }, 1000);

    setInterval(() => {
      if (this.canvas) {
        var ctx = this.canvas.getContext("2d");

        var imgData = resizeImage(this.canvas, this.canvas.width, this.canvas.height);

        var data = imgData.data;
        uints = [];
        for (var i = 0; i < data.length; i += 4) {
            uints.push(data[i]);
            uints.push(data[i + 1]);
            uints.push(data[i + 2]);
        }
        sendFrame(uints);
      } else {
        this.canvas = $('.nes-screen').length && $('.nes-screen')[0];
        if (this.canvas) {
          $('.nes-status').css('color', 'black');
        }
      }
    }, 10);
  }
  render() {
    return (
      <div>
        <div id="emulator"></div>
        <h2>Controls</h2>
        <table id="controls">
            <thead>
            <tr>
                <th>Button</th>
                <th>Player 1</th>
                <th>Player 2</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Left</td>
                <td>Left</td>
                <td>Num-4</td>
            </tr>
            <tr>
                <td>Right</td>
                <td>Right</td>
                <td>Num-6</td>
            </tr>
            <tr>
                <td>Up</td>
                <td>Up</td>
                <td>Num-8</td>
            </tr>
            <tr>
                <td>Down</td>
                <td>Down</td>
                <td>Num-2</td>
            </tr>
            <tr>
                <td>A</td>
                <td>X</td>
                <td>Num-7</td>
            </tr>
            <tr>
                <td>B</td>
                <td>Z/Y</td>
                <td>Num-9</td>
            </tr>
            <tr>
                <td>Start</td>
                <td>Enter</td>
                <td>Num-1</td>
            </tr>
            <tr>
                <td>Select</td>
                <td>Ctrl</td>
                <td>Num-3</td>
            </tr>
            </tbody>
        </table>
      </div>
    )
  }
}

module.exports = JSNESPage;
