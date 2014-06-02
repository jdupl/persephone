var express = require('express')
  , path = require('path')
  , http = require('http')
  , socketio = require('socket.io')
  , router = require('./webui/router');

// create app
var app = express();
var server = http.Server(app);
var io = socketio(server);

// setup app
app.use('/static', express.static(path.join(__dirname, 'webui/static')));
app.use(express.json());
app.use(express.urlencoded());

// pass the application to the router so it can create routes
router(app, io);

// start application
server.listen(3000);
