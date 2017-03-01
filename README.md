<img height="200" src='./logo.png'/>
#What is rio?
The main focus of rio was to allow us to build an interactive LED wall that was internet connected.

We were originally inspired originally by <a href="https://googlecreativelab.github.io/anypixel/">Google Creative Labs's anypixel</a> however felt that we could create a library ourselves that's a lot easier to build on top of and understand for curious devs who wanted to build something cool.

##1. <a href='./rio-server'>rio-server</a>
The main component in this library, it takes different types of data, converts it to rgb arrays and sends it to the LED wall (or any output e.g. terminal). At a high level this is broken down into 3 simple concepts:

1. **inputs** -
These files interpret data coming in before frame data is sent to the LED wall.

  *e.g. video, gifs, arrays of rgb values, text.*


2. **outputs** -
These files interpret frame data and output them:

- ```console-output``` - Write coloured pixels to terminal.
- ```pi-output``` - Sends data to our lightweight python LED wall firmware.
- ```websocket-output``` - Pixel data is echoed with websockets, meaning you can show a realtime representation of an LED wall on web, mobile, desktop, etc.

3. **clients** -
Integrate with clients that send any form of data, converting them to inputs:

- ```slack-client``` - Handles messages and passes through as video or gif inputs.
- ```web-client``` - Restful API, request are forwarded onto appropriate input.
- ```websocket-client``` - Accepts raw canvas pixel data and sends directly to outputs.


##2. <a href='./rio-canvas'>rio-canvas</a>
A web app hosting a collection of examples that send pixel data to the rio server.

  *e.g. pong, paint, breakout and more*

You can controll rio-canvas from a separate application (e.g rio-mobile) by connecting to it via websockets and sending string messages such as :

 - ```route_pong``` - routing
 - ```'UP', 'DOWN', 'LEFT', 'RIGHT', 'S', 'T', 'C', 'X'``` Player 1 controller
 - ```'UP2', 'DOWN2', 'LEFT2', 'RIGHT2', 'S2', 'T2', 'C2', 'X2'``` Player 2 controller


##3. <a href='./rio-mobile'>rio-mobile</a>
An iOS/Android app built in <a href='https://facebook.github.io/react-native/'>React Native</a> that demonstrates both reading and writing to rio-server.


#Installation
Installation instructions can be found within each of the application directories above. A few high level notes here to keep in mind:

- <a href='./rio-server'>rio-server</a> can run independently, simply go through the installation instructions there and simulate the LED wall in your terminal within minutes.

- <a href='./rio-canvase'>rio-canvas</a> Requires you to be running **rio-server** and have a valid websocket address defined in its ```config.js```

-  <a href='./rio-mobile'>rio-mobile</a> Requires you to be running both **rio-server** and **rio-canvas** have a valid api/websocket address defined in its ```config.js```



