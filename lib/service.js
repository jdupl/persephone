var uuid = require('uuid')
  , fs = require('fs')
  , path = require('path');

var engines = [];
var searches = {};

var basepath, pluginPath, plugin;

// load engines
basepath = path.join(__dirname, '../engines/');

var files = fs.readdirSync(basepath);

files.forEach(function (file) {
  if (/.+\.js$/.test(file)) {
    pluginPath = path.join(basepath, file);
    try {
      plugin = require(pluginPath);
      engines.push(plugin);
      //console.log('Successfully loaded plugin %s.', plugin.name);
    } catch (e) {
      //console.log('Error loading plugin %s: %s', pluginPath, e.toString());
    }
  }
});

// service functions

// start a search
exports.startSearch = function (what) {
  var id = uuid.v4();
  var search = {
    id: id,
    what: what,
    results: [],
    instances: [],
    done: false
  };
  
  function engineResults(results) {
    results.forEach(function (result) {
      search.results.push(result);
    });
    search.results.sort(function (a, b) {
      return b.seeds - a.seeds;
    });
  }
  
  function engineFinished() {
    search.done = search.instances.every(function (inst) {
      return inst.done;
    });
  }
  
  engines.forEach(function (engine) {
    var instance = engine.search(what);
    instance.on('results', engineResults);
    instance.on('end', engineFinished);
    instance.start();
    search.instances.push(instance);
  });
  
  searches[id] = search;
  return id;
};

// get search
exports.getSearch = function (id) {
  if (searches.hasOwnProperty(id)) {
    return searches[id];
  } else {
    return false;
  }
};

// remove a search, stop the instances, etc
exports.clearSearch = function (id) {
  if (searches.hasOwnProperty(id)) {
    searches[id].instances.forEach(function (inst) {
      inst.stop();
    });
    delete searches[id];
  }
};