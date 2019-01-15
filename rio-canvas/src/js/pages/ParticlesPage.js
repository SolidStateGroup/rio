import React, {Component, PropTypes} from 'react';
import resizeImage from '../utils/resize-image-data';

// var SERVER = 'https://pixelwall.herokuapp.com/';
var SERVER = 'http://localhost:3001/';

var _data = require('../_data');
var _ = require('lodash');
var uints = [];

var canvas = document.getElementById('canvas');
var particles = [];
var tick = 0;
var ticks = 0;

const sendFrame = require('./send-frame');

const ParticlesPage = class extends Component {
  static displayName = 'ParticlesPage';

  clearCanvas() {
    var ctx = $('canvas')[0].getContext("2d");
    ctx.clearRect(0, 0, INC_W, INC_H);
  }

  loop = () => {
    if (this.stop) {
      this.stop = false;
      return;
    }
    window.requestAnimationFrame(this.loop);
    this.createParticles();
    this.updateParticles();
    this.killParticles();
    this.drawParticles();
  }

  componentWillUnmount() {
    this.stop = true;
  }

  componentDidMount() {
    window.requestAnimationFrame(this.loop);
  }

   createParticles() {
    //check on every 10th tick check
    if(tick % 10 == 0) {
      //add particle if fewer than 100
      if(particles.length < 20) {
        particles.push({
          x: Math.random()*300, //between 0 and canvas width
          y: 0,
          speed: 2+Math.random()*3, //between 2 and 5
          radius: 5+Math.random()*5, //between 5 and 10
          color: "white",
        });
      }
    }
  }

  updateParticles() {
    for(var i in particles) {
      var part = particles[i];
      part.y += part.speed;
    }
  }

  killParticles() {
    for(var i in particles) {
      var part = particles[i];
      if(part.y > 300) {
        part.y = 0;
      }
    }
  }

  drawParticles() {
    var c = $('canvas')[0].getContext("2d");
    c.fillStyle = "black";
    c.fillRect(0,0,300,300);
    for(var i in particles) {
      var part = particles[i];
      c.beginPath();
      c.arc(part.x,part.y, part.radius, 0, Math.PI*2);
      c.closePath();
      c.fillStyle = part.color;
      c.fill();
    }

    if (ticks % 50 == 0) {
      var imgData = resizeImage($('canvas')[0], 300, 300);
      var data = imgData.data;
      uints = [];
      for (var i = 0; i < data.length; i += 4) {
        uints.push(data[i]);
        uints.push(data[i + 1]);
        uints.push(data[i + 2]);
      }

      sendFrame(uints);

      //console.log(uints);
    }

    ticks++;
  }


    render () {

      return (
        <div>
          <div className="container m-t-3">
            <div className="row">
              <div className="col-md-8">
                <canvas
                  width={300} height={300} style={{ border: '1px solid' }}
                >
                </canvas>

              </div>
            </div>
          </div>
        </div>
      );
    }
};

module.exports = ParticlesPage;
