(function () {

  var app = angular.module('persephone', [
    'ngRoute',
    'persephone.SearchController'
  ]);
  
  app.config(['$routeProvider', function ($routeProvider) {
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
