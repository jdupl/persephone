var service = require('../../lib/service.js');

exports.onConnect = function (socket) {

  var searches = [];

  socket.on('start', function (what, callback) {
    var search = service.search(what);
    callback(search.id);

    search.on('results', function (results) {
      socket.emit('results', {id: search.id ,results: results});
    });

    search.on('end', function () {
      socket.emit('end', search.id);
    });

    search.start();
    searches.push(search);
  });

  socket.on('stop', function (id) {
    var index = -1
      , len = searches.length;
    while (++index < len) {
      if (searches[index].id === id) {
        searches[index].stop();
      }
    }
    // delete search, gc should collect
    searches.splice(index, 1);
  });

  socket.on('disconnect', function () {
    searches.forEach(function (search) {
      search.stop();
    });
    searches = [];
  });

};
