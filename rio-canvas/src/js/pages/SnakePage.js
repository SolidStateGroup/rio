var BODY = 1, FOOD = 2;
var KEYS = { left: 37, up: 38, right: 39, down: 40 };
var DIRS = { 37: true, 38: true, 39: true, 40: true };
import resizeImage from '../utils/resize-image-data';
const { width, height } = require('../config').matrix;
import React from 'react';
import _data from '../_data';
var SERVER = 'http://localhost:3001/';
const sendFrame = require('./send-frame');

var penSize = 25;

var snake,
  size = penSize,
  initialSpeed = 5,
  speed = initialSpeed,
  dir,
  game_loop,
  over = 0,
  score = 0,
  hitType;

var length = 2;

var start, loading, canvas, ctx;

var w = width * penSize,
  h = height * penSize;

var scoreText, menu, reMenu, score = 0;

var Food = function () {
  this.x = Math.round(Math.random() * (w - size) / size);
  this.y = Math.round(Math.random() * (h - size) / size);

  this.draw = function () {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x * size, this.y * size, size, size);
  }
}

function showButton () {
  start.style.top = "30%";
  loading.style.top = "100%";
}

var f = new Food();

var reset = function () {
  initSnake();
  f = new Food();
  reMenu.style.zIndex = "-1"
  dir = "right";
  over = 0;
  speed = initialSpeed;
  if (typeof game_loop != "undefined") clearInterval(game_loop);
  game_loop = setInterval(draw, 1000 / speed);


  score = 0;
  scoreText.innerHTML = "Score: " + score;

  return;

};

function startMenu () {
  menu = document.getElementById("menu");
  reMenu = document.getElementById("reMenu");
  scoreText = document.getElementById("score");
  reMenu.style.zIndex = "-1"
}

//Initialize the snake
function initSnake () {
  snake = [];
  for (var i = length - 1; i >= 0; i--) {
    snake.push({ x: i, y: 0 });
  }
}

function paintSnake () {
  for (var i = 0; i < snake.length; i++) {
    var s = snake[i];

    ctx.fillStyle = "#66CC66";
    ctx.fillRect(s.x * size, s.y * size, size, size);
  }
}

function updateSnake () {
  //Update the position of the snake
  var head_x = snake[0].x;
  var head_y = snake[0].y;

  //Get the directions
  document.onkeydown = function (e) {
    var key = e.keyCode;
    //console.log(key);

    if (key == 37 && dir != "right") setTimeout(function () {
      dir = "left";
    }, 30);
    else if (key == 38 && dir != "down") setTimeout(function () {
      dir = "up";
    }, 30);
    else if (key == 39 && dir != "left") setTimeout(function () {
      dir = "right";
    }, 30);
    else if (key == 40 && dir != "up") setTimeout(function () {
      dir = "down";
    }, 30);

    if (key) e.preventDefault();

  }

  //Directions
  if (dir == "right") head_x++;
  else if (dir == "left") head_x--;
  else if (dir == "up") head_y--;
  else if (dir == "down") head_y++;

  //Move snake
  var tail = snake.pop();
  tail.x = head_x;
  tail.y = head_y;
  snake.unshift(tail);

  //Wall Collision
  if (head_x >= w / size || head_x <= -1 || head_y >= h / size || head_y <= -1) {
    if (over == 0) {
      hitType = "wall";
      gameover();
    }
    over++
  }

  //Food collision
  if (head_x == f.x && head_y == f.y) {
    // coll = 1;
    f = new Food();
    var tail = { x: head_x, y: head_y };
    snake.unshift(tail);
    score += 10;
    scoreText.innerHTML = "Score: " + score;

    //Increase speed
    if (speed <= 45) speed++;
    clearInterval(game_loop);
    game_loop = setInterval(draw, 1000 / speed);
  }

  else {
    //Check collision between snake parts
    for (var j = 1; j < snake.length; j++) {
      var s = snake[j];
      if (head_x == s.x && head_y == s.y) {
        if (over == 0) {
          hitType = "self";
          gameover();
        }
        over++;
      }
    }
  }
}
var ticks = 0;
function draw () {
  paintCanvas();
  paintSnake();
  updateSnake();

  //Draw food
  f.draw();

  if (ticks % 10 == 0) {
    var imgData = resizeImage(canvas, w, h);
    var data = imgData.data;
    var uints = [];
    for (var i = 0; i < data.length; i += 4) {
      uints.push(data[i]);
      uints.push(data[i + 1]);
      uints.push(data[i + 2]);
    }

    sendFrame(uints);
  }
  this.ticks++;
}

function paintCanvas () {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
}


//Custom funny gameover messages
var msgsSelf = [];
msgsSelf[0] = "There's plenty of food. Don't eat yourself!";
msgsSelf[1] = "Is your body tastier than the food?";
msgsSelf[2] = "AArrgghhh!! I bit myself!!";
msgsSelf[3] = "Do you have Autophagia?";

var msgsWall = [];
msgsWall[0] = "You broke your head!";
msgsWall[1] = "The wall is stronger than it seems!";
msgsWall[2] = "There's no way to escape the game...";
msgsWall[3] = "LOOK MA! NO HEAD..!!";
msgsWall[4] = "Can't see the wall? Huh?";


function init () {
  menu.style.zIndex = "-1";

  reset();
}

function gameover () {
  clearInterval(game_loop);


  //Get the gameover text
  var goText = document.getElementById("info2");

  //Show the messages
  if (hitType == "wall") {
    goText.innerHTML = msgsWall[Math.floor(Math.random() * msgsWall.length)];
  }
  else if (hitType == "self") {
    goText.innerHTML = msgsSelf[Math.floor(Math.random() * msgsSelf.length)];
  }

  reMenu.style.zIndex = "1";
}

var startTheGame = function () {

  start = document.getElementById("start");
  loading = document.getElementById("loading");


  //Initializing Canvas
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");


  canvas.height = h;
  canvas.width = w;


  startMenu();
  init();
}

const onMessage = (data) => {
  const event = JSON.parse(data.data);
  console.log(event);
  if (event.event == 'button' && event.pressed) {
    switch (event.index) {
      case 4:
        setTimeout(function () {
          dir = "left";
        }, 30);
        break;

      case 3:
        setTimeout(function () {
          dir = "up";
        }, 30);
        break;

      case 1:
        setTimeout(function () {
          dir = "right";
        }, 30);
        break;

      case 2:
        setTimeout(function () {
          dir = "down";
        }, 30);
        break;
    }
  }
}

var SnakeGame = React.createClass({
  componentDidMount() {
    this.game = startTheGame()
    this.setState({ loaded: true })

    // Establish websocket connection to API for button events
    // this.ws = new WebSocket('ws://localhost:3001');
    // this.ws.onmessage = onMessage;
  },
  componentWillUnmount() {
    clearInterval(game_loop);
  },
  handleInput(data) {
    switch (data) {
      case 'UP':
        dir = "up";
        return;
      case 'DOWN':
        dir = "down";
        return;
      case 'LEFT':
        dir = "left";
        return;
      case 'RIGHT':
        dir = "right";
        return;
      case 'X':
        reset();
        return;
    }
  },
  render() {
    return (
      <div style={{ width: w, height: h }} ref="game" className="snake-game">
        <canvas width={w} height={h} id="canvas">

        </canvas>

        <div style={{ width: w, height: h }} id="reMenu">
          <p id="info2">Game Over</p>
          <a id="restart" onClick={reset}>Restart</a>
        </div>

        <div style={{ width: w, height: h }} id="menu">
          <a id="start" onClick={startTheGame}>Start</a>
          <p id="loading">Loading...</p>
        </div>

        <p id="score">Score: 0</p>
      </div>
    );
  }
});

module.exports = SnakeGame;
