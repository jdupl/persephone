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
      searchService.startSearch($scope.searchText, function (search) {
        $scope.searches.push(search);
        $scope.searchText = "";
        $scope.setActiveSearchId(search.id);
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
    
    $scope.removeSearch = function (id) {
      $scope.searches = $scope.searches.filter(function (search) {
        return search.id != id;
      });
    };
    
    $scope.searches = [];
    
  }]);

}());
