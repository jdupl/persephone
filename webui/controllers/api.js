var service = require('../../lib/service.js');

function onConnect(socket) {

  var searches = {};

  socket.on('start', function (what, callback) {
    var search = service.search(what);
    callback(search.id);

    search.on('results', function (results) {
      socket.emit('results', {id: search.id ,results: results});
    });

    search.on('end', function () {
      socket.emit('end', search.id);
      process.nextTick(function () {
        delete searches[search.id];
      });
    });

    search.start();
    searches[search.id] = search;
  });

  socket.on('stop', function (id) {
    if (searches.hasOwnProperty(id)) {
      searches[id].stop();
      delete searches[id];
    }
  });

  socket.on('disconnect', function () {
    Object.keys(searches).forEach(function (id) {
      searches[id].stop();
    });
    searches = {};
  });

};

module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    onConnect(socket);
  });

  setInterval(function () {
    io.sockets.emit('stats', process.memoryUsage());
  }, 1000);
};
