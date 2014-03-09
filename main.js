var express = require('express')
  , path = require('path')
  , router = require('./webui/router');

// create app
var app = express();

// setup app
app.use(express.logger({ format: ':method :url: :status' }));
app.use('/static', express.static(path.join(__dirname, 'webui/static')));
app.use(express.json());
app.use(express.urlencoded());

// pass the application to the router so it can create routes
router(app);

// start application
app.listen(3000);
