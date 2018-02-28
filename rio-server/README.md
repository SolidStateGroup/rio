rio-server
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

- ```twitter-client``` - subscribes to twitter stream and displays text on the wall matching #rio
- ```slack-client``` - handles messages and passes through as video or gif inputs
- ```websocket-client``` - accepts canvas pixel data and sends directly to ```send-data```
- ```web-client``` - restful api (docs coming soon), request are forwarded onto appropriate input or client

# Installation on a Raspberry Pi

## Install Node.js

`curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -`

This will take care of updating your RPi distribution and adding the necessary repositories for Node.js.

`sudo apt-get install nodejs`

Installs node.js

## Install dependencies for Node.js based canvas

`sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++`

## Install git (should already be installed)

`sudo apt-get install git`

## Install rio-server

Clone rio

`git clone https://github.com/SolidStateGroup/rio`

Install

`cd rio && npm run install-server`

## Run rio-server

`npm run server`

## Configuration

rio-server is configured to output to console only initially. If you have already hooked up a physical wall of LED's to your Raspberry Pi you will need to reconfigure rio-server to output to it.

The first step is making sure that communication to your LED wall does in fact work. We have provided two standalone scripts for this purpose found in `rio-server/firmware/rpi` called `singlestrandtest.py` and `strandtest.py`. The configuration for each script is at the top and will need to be changed to suit your LED wall. In particular the LED count(s) and GPIO pin(s). Each can be run with python i.e. `python singlestrandtest.py`.

Once that works you can then reconfigure rio-server. Edit `rio-server/config/index.js`. Change the `matrix` `width` and `height` to match your LED wall. Enable `sendToPi`.

You will also need to edit the configuration in `rio-server/firmware/rpi/lowlevel-server.py` (in the same way as `strandtest.py`).

At this point you should be able to run rio-server and the rio logo will be displayed on your LED wall!

# Video input support

If you wish to utilise streaming video to your device you will need to install FFMPEG, this URL covers the instructions we used when building our wall https://owenashurst.com/?p=242.. 
