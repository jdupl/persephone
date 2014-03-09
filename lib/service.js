var uuid = require('uuid')
  , path = require('path');

var engines = [];
var bridges = [];
var searches = {};

exports.startSearch = function (what) {
  var id = uuid.v4();
  searches[id] = {
    id: id,
    what: what,
    results: []
  };
  return id;
};