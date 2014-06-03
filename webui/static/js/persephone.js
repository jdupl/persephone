/* global angular */
(function () {

  var app = angular.module('persephone', [
    'ngRoute',
    'persephone.SearchController'
  ]);

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
