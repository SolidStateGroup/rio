PixelWall messaging API
==================================

This project provides a super generic and flexible api for drawing to a pixel wall. The project is split up into 3 main areas:

## 1 /inputs
These files interpret data, convert to raw pixel data and then call ```send-data``` which is responsible for sending data to the appropriate output:

- ```gif-url(url) ``` - take a gif url, convert to resized pixel data
- ```video-url(url)``` - take a video url, convert to resized pixel data


## 2 /outputs
These files intepret take frame data and output them to devices:

- ```console-output(frame) ``` - write coloured pixels to terminal
- ```pi-output(frame)``` - write pixels to our LED wall


## 3 /clients
Allow custom clients to intepret their own custom data, converting them to inputs:

- ```slack-client``` - handles messages and passes through as video or gif inputs
- ```websocket-client``` - accepts canvas pixel data and sends directly to ```send-data```
- ```web-client``` - restful api (docs coming soon), request are forwarded onto appropriate input or client

_______________

Getting Started
---------------

# Install dependencies
```brew install pkg-config cairo pango libpng jpeg giflib```
```npm i```

# Run
```npm start```
- API ``http://localhost:3000``


<img height="150" src="./example.gif"/>