var fs = require('fs');
  , _ = require('lodash');
  , uuid = require('uuid');


// controller routes
var routes = {};

routes.search = function (req, res) {
  if (!_.isEmpty(req.body.what)) {
    var what = req.body.what;
  }
};
