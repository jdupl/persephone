/* global angular,window */
(function () {

  var module = angular.module('persephone.SearchController', [
    'SearchService'
  ]);

  module.controller('SearchController', ['$scope', 'searchService', function ($scope, searchService) {
    var providersIcon = {
      'kickasstorrents': '/static/icons/kat.png',
      'thepiratebay': '/static/icons/tbp.png'
    };

    $scope.startSearch = function () {
      var what = $scope.searchText;
      searchService.startSearch(what, function (id) {
        var search = {id: id, what: what, results: [], done: false};
        $scope.searches.push(search);
        $scope.searchText = "";
        $scope.setActiveSearchId(search.id);
        return {
          results: function (results) {
            console.log(search, results);
            Array.prototype.push.apply(search.results, results);
            $scope.$apply();
          },
          end: function () {
            search.done = true;
            $scope.$apply();
          }
        };
      });
    };

    $scope.setActiveSearchId = function (id) {
      $scope.activeSearchId = id;
    };

    $scope.isEmpty = function () {
      return $scope.searches.length === 0;
    };

    $scope.isActive = function (id) {
      return $scope.activeSearchId === id;
    };

    $scope.getProvider = function (source) {
      return providersIcon.hasOwnProperty(source) ? providersIcon[source] : '';
    };

    $scope.removeSearch = function (search) {
      searchService.clearSearch(search.id);
      $scope.searches.splice($scope.searches.indexOf(search), 1);
    };

    $scope.searches = [];
  }]);

}());
