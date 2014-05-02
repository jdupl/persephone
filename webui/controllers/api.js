var fs = require('fs')
  , uuid = require('uuid')
  , service = require('../../lib/service.js');

function apiError(res, msg) {
  res.json({
    error: msg
  });
}

// GET /api/startSearch
exports.startSearch = function (req, res) {
  var what = req.body.what;
  
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

// GET /api/getSearch
exports.getSearch = function (req, res) {
  var id = req.body.id;
  if (id) {
    var search = service.getSearch(id);
    if (search) {
      res.json({
        done: search.done,
        results: search.results
      });
    } else {
      apiError(res, "Search not found.");
    }
  } else {
    apiError(res, "Id undefined.");
  }
};

// GET /api/clearSearch
exports.clearSearch = function (req, res) {
  var id = req.body.id;
  
  if (id) {
    service.clearSearch(id);
  }
};
