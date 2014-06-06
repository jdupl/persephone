/* global angular,io */
(function () {

  var app = angular.module('persephone', [
    'ngRoute'
  ]);

  app.factory('socket', function () {
    /**
     * Initiate socket.io connection with server.
     * No params for now, let it auto-discover.
     */
    return io();
  });

  /**
   * StatsController
   */
  app.controller('StatsController', ['$scope', 'socket', function ($scope, socket) {
    socket.on('stats', function (stats) {
      $scope.memoryText = Math.round(stats.rss / (1024 * 1024) * 100) / 100;
      $scope.$apply();
    });
  }]);

  /**
   * SearchController
   */
  app.controller('SearchController', ['$scope', 'socket', function ($scope, socket) {
    window.scope = $scope;

    $scope.searches = {};

    var providersIcon = {
      'kickasstorrents': '/static/icons/kat.png',
      'thepiratebay': '/static/icons/tbp.png'
    };

    socket.on('results', function (data) {
      if ($scope.searches.hasOwnProperty(data.id)) {
        Array.prototype.push.apply($scope.searches[data.id].results, data.results);
      }
    });

    socket.on('end', function (id) {
      if ($scope.searches.hasOwnProperty(id)) {
        $scope.searches[id].done = true;
      }
    });

    $scope.startSearch = function () {
      var what = $scope.searchText;
      socket.emit('start', what, function (id) {
        $scope.searches[id] = {
          id: id,
          what: what,
          results: [],
          done: false
        };
        $scope.activeSearchId = id;
      });
    };

    $scope.isEmpty = function () {
      return Object.keys($scope.searches).length === 0;
    };

    $scope.isActive = function (id) {
      return $scope.activeSearchId === id;
    };

    $scope.getProvider = function (source) {
      return providersIcon.hasOwnProperty(source) ? providersIcon[source] : '';
    };

    $scope.removeSearch = function (search) {
      socket.emit('stop', search.id);
      delete $scope.searches[search.id];
    };

  }]);

  /**
   * SettingsController
   */
  // TODO

  /**
   * Application configuration
   */
  app.config(['$compileProvider', '$routeProvider', function ($compileProvider, $routeProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet):/);
    $routeProvider
      .when('/', {
        controller: 'SearchController',
        templateUrl: '/static/templates/search.html'
      })
      .when('/settings', {
        controller: 'SettingsController',
        templateUrl: '/static/templates/settings.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

}());
