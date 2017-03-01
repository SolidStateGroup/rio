# rio-canvas

A web app hosting a collection of examples that send pixel data to the rio server.


**Handling socket messages**

You can control rio-canvas from a separate application (e.g rio-mobile) by sending websocket messages to this app server
This is handled in ```App.js```.
These events are sent down to the active page so they can respond, e.g. to x button press as long as they override ```handleInput```.

**Router**

This project uses react-router, all routes can be found in ```routes.js```


**config.js**

- Configure ws to be the websocket server address of rio-server.
- Configure the width and height of the led wall.





