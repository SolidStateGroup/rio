import React, {Component, PropTypes} from 'react';
import reactCSS from 'reactcss';
window.log = console.log
var _data = require('../_data');
var _ = require('lodash');
var uints = [];
// var SERVER = 'https://pixelwall.herokuapp.com/';
var SERVER = 'http://localhost:3001/';
import resizeImage from '../utils/resize-image-data';
import { initialState, defaultProps } from './pong-vars';
const sendFrame = require('./send-frame');
const config = require('../config');

var clearedFrame = false;
const TheComponent = class extends Component {
  static displayName = 'PongPage';

  constructor(props, context) {
    super(props, context);
    this.state = initialState;
    this._keystate = {};
    this._canvas = undefined;
    this._context =  undefined;
    this._ball= require('./ball.jsx');
    this._player= require('./player.jsx');
    this._ai= require('./ai.jsx');
    this._loop= null;
    this._canvasStyle= {
      display: 'block',
      position: 'absolute',
      margin: 'auto',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0'
    };
    this.ticks = 0;
    this.ws = null;
  }

  handleInput(data) {
    switch(data) {
      case 'RELEASE':
        this._keystate[this.props.upArrow] = false;
        this._keystate[this.props.downArrow] = false;
        return
      case 'UP':
        this._keystate[this.props.upArrow] = true;
        this._keystate[this.props.downArrow] = false;
        return
      case 'DOWN':
        this._keystate[this.props.downArrow] = true;
        this._keystate[this.props.upArrow] = false;
        return
    }
  }

  _draw = () => {

    if (clearedFrame) {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        clearedFrame = false;
    }

    // draw background
    const state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#fff";

    // draw scoreboard
    this._context.font = '10px Arial';
    // this._context.fillText('Player: ' + state.playerScore , 10, 10 );
    // this._context.fillText('CPU: ' + state.aiScore , this.props.width - 60, 10  );

    //draw ball
    this._ball().draw();

    //draw paddles
    this._context.fillStyle = this.props.player1Color;
    this._player().draw();
    this._context.fillStyle = this.props.player2Color;
    this._ai().draw();
    this._context.fillStyle = "#fff";
    // draw the net
    /*const w = 4;
    const x = (this.props.width - w)*0.5;
    let y = 0;
    const step = this.props.height/20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }*/

    this._context.restore();

    if (this.ticks % 10 == 0) {
      this.postImageData();

      //console.log(uints);
    }
    this.ticks++;
  }

  postImageData = () => {
      var imgData = resizeImage(this._canvas, this.props.width, this.props.height);
      var data = imgData.data;
      uints = [];
      for (var i = 0; i < data.length; i += 4) {
          uints.push(data[i]);
          uints.push(data[i + 1]);
          uints.push(data[i + 2]);
      }

      sendFrame(uints);
  }


  _startGame = () => {

    if(this._loop){
      return;
    }

    const keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      delete keystate[evt.keyCode];
    });
    document.addEventListener('ontouchstart', function(e) {e.preventDefault()}, false);
    document.addEventListener('ontouchmove', function(e) {e.preventDefault()}, false);

    this._loop = setInterval( () => {
      this._update();
      this._draw();
    },1);
    this._ball().serve(1);
  }
  _stopGame= (scorer) => {
    clearInterval(this._loop);
    this._loop = null;
    setTimeout(()=>{
      this._context.fillStyle = scorer == 'ai' ?  "#0000ff" : '#ff00ff';
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      this.postImageData();
      clearedFrame = true;
    }, 0);

  }
  _setupCanvas= () => {
    this._canvas = $('canvas')[0];
    this._context = this._canvas.getContext('2d');
  }
  _score= (name) => {
    const state = this.state;
    const scorer = {player: 'ai', ai: 'player'}[name];
    this.setState({
      [scorer+'Score']: state[scorer+'Score'] + 1
    });
    this._stopGame(scorer);
    setTimeout(()=>{
      this._context.font = '30px Arial';
      this._context.fillText(scorer + ' score!',
        this.props.width/2,
        this.props.height/2 );
      this._context.restore();
    }, 0);

    setTimeout(()=>{
      this._setupCanvas();
      this._startGame();
    }, 1000);
  }
  _update= () =>{
    this._player().update();
    this._ai().update();
    this._ball().update();
  }
  _touch= (evt) => {
    console.log( evt );
    var yPos = evt.touches[0].pageY - evt.touches[0].target.offsetTop - this.props.paddleHeight/2;
    this._player().position(yPos);
  }

  onMessage = (data) => {
    const event = JSON.parse(data.data);
    console.log(event);
    if (event.event == 'button') {
      var keyCode;
      switch(event.index) {
        case 1:
          keyCode = this.props.upArrow;
          break;

        case 2:
          keyCode = this.props.downArrow;
          break;
      }
      if (!keyCode) {
        return;
      }
      if (event.pressed) {
        this._keystate[keyCode] = true;
      } else {
        delete this._keystate[keyCode];
      }
    }
  }

  componentDidMount() {

    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Starting Game',
      this.props.width/2,
      this.props.height/2 );

    setTimeout(this._startGame, 1000);

  }

  componentWillUnmount() {
    this._stopGame();
  }

  render() {
    return (
        <canvas
          onTouchStart={this._touch}
          onTouchMove={this._touch}
          width={this.props.width}
          height={this.props.height} style={this._canvasStyle}
        >
        </canvas>
    );
  }
};

TheComponent.propTypes = {};

TheComponent.defaultProps = defaultProps;

module.exports = TheComponent;
