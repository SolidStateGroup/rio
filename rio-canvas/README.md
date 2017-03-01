# rio-canvas

A web app hosting a collection of examples that send pixel data to the rio server.

  *e.g. pong, paint, breakout and more*

You can control rio-canvas from a separate application (e.g rio-mobile) by connecting to it via websockets and sending string messages such as.
This is handled in ```App.js```
 - ```route_pong``` - routing
 - ```'UP', 'DOWN', 'LEFT', 'RIGHT', 'S', 'T', 'C', 'X'``` Player 1 controller
 - ```'UP2', 'DOWN2', 'LEFT2', 'RIGHT2', 'S2', 'T2', 'C2', 'X2'``` Player 2 controller



