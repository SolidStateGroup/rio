import React, {Component, PropTypes} from 'react';
import {SketchPicker} from 'react-color';
import resizeImage from '../utils/resize-image-data';
import {width,height} from '../config';
const sendFrame = require('./send-frame');

var mouseDown;
window.log = console.log
var _data = require('../_data');
var _ = require('lodash');
var penSize = 10;
var INC_W = 60 * penSize;
var INC_H = 34 * penSize;
var uints = [];
var isLeft = false;
// var SERVER = 'https://pixelwall.herokuapp.com/';
var SERVER = 'http://localhost:3001/';

const TheComponent = class extends Component {
  displayName:
  'TheComponent'

  constructor(props, context) {
    super(props, context);
    this.state = {color: [0, 255, 0]};
  }

  handleChangeComplete = (color) => {
    this.setState({color: [color.rgb.r, color.rgb.g, color.rgb.b]});
  }

  clearCanvas() {
    var ctx = $('canvas')[0].getContext("2d");
    ctx.clearRect(0, 0, INC_W, INC_H);

    var imgData = resizeImage($('canvas')[0], INC_W, INC_H);
    var data = imgData.data;
    uints = [];
    for (var i = 0; i < data.length; i += 4) {
        uints.push(data[i]);
        uints.push(data[i + 1]);
        uints.push(data[i + 2]);
    }

    sendFrame(uints);
  }

  draw(x, y) {
    var {color} = this.state;
    console.log(x, y);


    x = Math.floor(x / penSize) * penSize;
    y = Math.floor(y / penSize) * penSize;

    var ctx = $('canvas')[0].getContext("2d");
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},255)`;

    var currentColor = ctx.getImageData(x, y, 1, 1);

    console.log(currentColor.data);

    if (currentColor.data[0] == color[0] && currentColor.data[1] == color[1] && currentColor.data[2] == color[2]) {
      console.log("Matching color, skipping");
      return
    }
    ctx.fillRect(x, y, penSize, penSize);

    var imgData = resizeImage($('canvas')[0], INC_W, INC_H, INC_W / penSize, INC_H / penSize);
    var data = imgData.data;
    uints = [];
    for (var i = 0; i < data.length; i += 4) {
        uints.push(data[i]);
        uints.push(data[i + 1]);
        uints.push(data[i + 2]);
    }

    sendFrame(uints);

    // console.log(uints);

  }

  componentDidMount() {
    $("canvas").mousedown(_.throttle(function (e) {
      mouseDown = true;
      var parentOffset = $(e.currentTarget).parent().offset();
      //or $(this).offset(); if you really just want the current element's offset
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      switch (e.which) {
        case 1:
          isLeft = true
          break;
        default:
          isLeft = false;
      }
      this.draw(relX, relY);
      e.preventDefault();
    }.bind(this), 20));
    $('canvas')
      .mouseup(()=>mouseDown = false)
    $('canvas')
      .mousemove(function (e) {

        var parentOffset = $(e.currentTarget).parent().offset();
        //or $(this).offset(); if you really just want the current element's offset
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        if (mouseDown) {
          this.draw(relX, relY);
        }
      }.bind(this))
  }

  render() {

    var {color} = this.state;
    return (
      <div>
        <div className="container m-t-3">
          <div className="row">
            <div className="col-md-8">
              <canvas
                width={INC_W} height={INC_H} style={{ border: '1px solid', backgroundColor: 'black' }}
              >
              </canvas>

            </div>
            <div className="col-md-4">

              <SketchPicker
                width={325}
                color={  `rgba(${color[0]},${color[1]},${color[2]},255)` }
                onChangeComplete={this.handleChangeComplete}/>

              <button className="btn btn-primary btn-block m-t-3" onClick={this.clearCanvas}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

TheComponent.propTypes = {};

module.exports = TheComponent;
