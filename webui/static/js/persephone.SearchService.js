/* global angular,io */
(function () {

  var module = angular.module('SearchService', []);

  module.service('searchService', [function () {

    var socket = io();
    var listeners = {};

    socket.on('connect', function () {
      socket.on('results', function (data) {
        if (typeof listeners[data.id].results === 'function') {
          listeners[data.id].results(data.results);
        }
      });

      socket.on('end', function (id) {
        if (typeof listeners[id].end === 'function') {
          listeners[id].end();
        }
      });
    });

    this.startSearch = function (what, callback) {
      socket.emit('start', what, function (id) {
        listeners[id] = callback(id);
      });
    };

    this.clearSearch = function (id) {
      socket.emit('stop', id);
    };

  }]);

}());
