var uuid = require('uuid')
  , fs = require('fs')
  , path = require('path')
  , EventEmitter = require('events').EventEmitter
  , util = require('util');

var engines = [];

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

function Search(what) {
  EventEmitter.call(this);
  var self = this;
  var instances = [];

  this.id = uuid.v4();

  function onResults(results) {
    self.emit('results', results);
  }

  function onEnd() {
    if (instances.every(function (inst) { return inst.done; })) {
      self.emit('end');
    }
  }

  engines.forEach(function (engine) {
    var inst = engine.search(what);
    inst.on('results', onResults);
    inst.on('end', onEnd);
    instances.push(inst);
  });

  this.start = function () {
    instances.forEach(function (inst) {
      inst.start();
    });
  };

  this.stop = function () {
    instances.forEach(function (inst) {
      inst.stop();
    });
  };
}
util.inherits(Search, EventEmitter);

exports.search = function (what) {
  return new Search(what);
};
