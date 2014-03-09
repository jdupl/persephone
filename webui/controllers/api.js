var fs = require('fs')
  , uuid = require('uuid')
  , service = require('../../lib/service.js');

function apiError(res, msg) {
  res.json({
    error: msg
  });
}

// controller routes
var routes = {};

// start search
routes.startSearch = function (req, res) {
  var what = req.query.what;
  
  if (what) {
    var id = service.startSearch(what);
    res.json({
      id: id,
      what: what
    });
  } else {
    apiError(res, 'What parameter is required.');
  }
};

routes.clearSearch = function (req, res) {
  var id = req.query.id;
  
  if (id) {
    // service.clearSearch(id);
  }
}

module.exports = routes;