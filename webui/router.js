var home = require('./controllers/home.js')
  , api = require('./controllers/api.js');

// function to setup routes
module.exports = function (app, io) {
  app.get('/', home.index);
  //app.get('/settings', home.settings);

  io.sockets.on('connection', function (socket) {
    api.onConnect(socket);
  });
};
