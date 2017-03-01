import React, {Component, PropTypes} from 'react';

import resizeImage from '../utils/resize-image-data';
const sendFrame = require('./send-frame');
var uints = [];
var mario;
const MARIO_X_OFFSET = 12;
const MARIO_Y_OFFSET = 32;

/*HEAPU8 - Uint8 Array

***** SUPER MARIO BROS DELUXE GBC *****

Index 13069093 is the lo-byte of the Timer
Index 13069094 is the hi-byte of the Timer

24-bit score

Index 13069092 is the hi-byte of the score .. setting 1 gives 655360
Index 13069091 is the mid-byte of the score .. setting 1 gives 2560
Index 13069090 is the low-byte of score .. setting 5 gives 50 points

Index 13069257 appears to be how far Mario has travelled in the level


Index 13084993 is Marios x position on the screen. Index 1306737 and 1306741 also seems related to Marios x position on screen.

Index 13068736 & 13068740 both appear to be Marios y position on screen

Index 13068739 is direction Mario is facing. 44 is left, 12 is right

***** SUPER MARIO KART SNES *****



*/

const roms = [
  {
    name: 'Mario Kart (SNES)',
    path: require('./roms/super-mario-kart.smc')
  },
  {
    name: 'Super Mario Bros Deluxe (GBC)',
    path: require('./roms/super-mario-bros.gbc')
  },
  {
    name: 'Legend of Zelda (NES)',
    path: require('./roms/legend-of-zelda.nes')
  }
]

const NesboxPage = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: false,
      pause: false,
      rom: ''
    };
  }
  onMute = () => {
    window._SDL_PauseAudio(!this.state.mute);
    this.setState({mute: !this.state.mute});
  }
  onPause = () => {
    if (this.state.pause) {
      Module.resumeMainLoop();
    } else {
      Module.pauseMainLoop();
    }
    this.setState({pause: !this.state.pause});
  }
  loadROM = (e) => {
    this.setState({rom: e.target.value});
    _SDL_CloseAudio();
    Module.pauseMainLoop();
    window.Module =
    {
      canvas: document.getElementById('nesbox-canvas'),
      rom: e.target.value
    };

    document.getElementById('nesbox-script').remove();
    this.loadNesbox();
  }
  loadNesbox() {
    var script = document.createElement("script");

    script.id = 'nesbox-script';
    script.src = require('./nesbox/nesbox');
    script.async = true;

    document.body.appendChild(script);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    _SDL_CloseAudio();
    Module.pauseMainLoop();
    delete window.Module;
    document.getElementById('nesbox-script').remove();
  }
  componentDidMount() {
    var canvas = document.getElementById("nesbox-canvas");
    var context = canvas.getContext("2d");
    context.rect(0,0,300,150);
    context.fillStyle = "black";
    context.fill();
    context.fillStyle = "white";
    context.fillText("Loading emulator, please wait...", 10, 20);

    window.Module =
    {
      canvas: document.getElementById('nesbox-canvas'),
      rom: require('./roms/super-mario-bros.gbc')
    };

    this.loadNesbox();

    this.timer = setInterval(() => {
      if (this.canvas) {
        var ctx = canvas.getContext("2d");

        if (!Module.HEAPU8 || Module.rom.indexOf('super-mario-bros.gbc') == -1) {
          var imgData = resizeImage(canvas, canvas.width, canvas.height);
        } else {
          // Mario zoom
          var imgData;
          if (Module.HEAPU8[13084993] > canvas.width || Module.HEAPU8[13068736] > canvas.height) {
            if (mario) {
              imgData = resizeImage(canvas, canvas.width / 4, canvas.height / 4, mario.x - MARIO_X_OFFSET, mario.y - MARIO_Y_OFFSET);
            } else {
              return;
            }
          } else {
            imgData = resizeImage(canvas, canvas.width / 4, canvas.height / 4, Module.HEAPU8[13084993] - MARIO_X_OFFSET, Module.HEAPU8[13068736] - MARIO_Y_OFFSET);
            mario = {x: Module.HEAPU8[13084993], y: Module.HEAPU8[13068736]};
          }
        }

        var data = imgData.data;
        uints = [];
        for (var i = 0; i < data.length; i += 4) {
            uints.push(data[i]);
            uints.push(data[i + 1]);
            uints.push(data[i + 2]);
        }
        sendFrame(uints);
      } else {
        this.canvas = $('#nesbox-canvas').length && $('#nesbox-canvas')[0];
      }
    }, 10);
  }
  render() {
    return (
      <div>
        <canvas id="nesbox-canvas"></canvas>
        <div>
          <select value={this.state.rom} onChange={this.loadROM}>
            <option disabled={true} value=''>Select a ROM</option>
            {_.map(roms, rom => (
              <option value={rom.path}>{rom.name}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={this.onMute}>{this.state.mute ? 'Unmute' : 'Mute'} audio</button>
          <button onClick={() => Module.requestFullScreen()}>Fullscreen</button>
          <button onClick={this.onPause}>{this.state.pause ? 'Resume' : 'Pause'}</button>
        </div>
      </div>
    )
  }
}

module.exports = NesboxPage;
