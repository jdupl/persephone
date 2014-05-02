(function () {

  var module = angular.module('SearchService', []);
  
  module.service('searchService', ['$http', '$interval', function ($http, $interval) {
    
    var searches = [];
    
    function startUpdating() {
      searches.forEach(function (search) {
        if (search.id && !search.done) {
          $http.post('/api/getSearch', { id: search.id }).success(function (data) {
            search.done = data.done;
            search.results = data.results;
          });
        }
      });
    }
    
    $interval(startUpdating, 1000);
    
    this.startSearch = function (what, callbackFn) {
      $http.post('/api/startSearch', { what: what }).success(function (data) {
        var search = {
          id: data.id,
          what: what,
          done: false,
          results: []
        };
        
        searches.push(search);
        
        if (typeof callbackFn === 'function') callbackFn(search);
      });
    };
    
  }]);

}());
