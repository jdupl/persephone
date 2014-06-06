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
        console.log('cleaning up by end ' + search.id);
        delete searches[search.id];
      });
    });

    search.start();
    searches[search.id] = search;
  });

  socket.on('stop', function (id) {
    if (searches.hasOwnProperty(id)) {
      searches[id].stop();
      console.log('cleaning up by stop ' + id);
      delete searches[id];
    }
  });

  socket.on('disconnect', function () {
    console.log('cleanup');
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
