// this script requires a browser which supports EcmaScript 5.1.
+function () {
  "use scrict";
  
  var providersIcon = {
    'kickasstorrents': '/static/icons/kat.png',
    'thepiratebay': '/static/icons/tbp.png'
  };
  
  function ResultViewModel(data) {
    var self = this;
    
    self.id = ko.observable(data.id);
    self.url = ko.observable(data.url);
    self.title = ko.observable(data.title);
    self.date = ko.observable(data.date);
    self.size = ko.observable(data.size);
    self.seeds = ko.observable(data.seeds);
    self.leechs = ko.observable(data.leechs);
    self.magnet = ko.observable(data.magnet);
    self.torrent = ko.observable(data.torrent);
    self.provider = ko.computed(function () {
      if (providersIcon.hasOwnProperty(data.source)) {
        return providersIcon[data.source];
      } else {
        return '';
      }
    });
  }
  
  function SearchViewModel(data) {
    var self = this;
    
    self.id = ko.observable(data.id);
    self.what = ko.observable(data.what);
    self.done = false;
    self.results = ko.observableArray();
  }
  
  function AppViewModel() {
    var self = this;
    
    self.activeSearchId = ko.observable();
    self.searchText = ko.observable();
    self.searches = ko.observableArray();
    
    self.startSearch = function () {
      var what = self.searchText();
      
      $.getJSON('/api/startSearch', {what: what}, function (data) {
        self.activeSearchId(data.id);
        
        self.searches.push(new SearchViewModel({
          id: data.id,
          what: what
        }));
      });
      
      self.searchText('');
      return false;
    };
    
    self.closeTab = function (search) {
      self.searches.remove(search);
    };
  }
  
  var viewModel = new AppViewModel();
  
  setInterval(function () {
    viewModel.searches().forEach(function (search) {
      if (search.id() !== undefined && !search.done) {
        $.getJSON('/api/getSearch', {id: search.id}, function (data) {
          search.done = data.done;
          search.results([]);
          data.results.forEach(function (result) {
            search.results.push(new ResultViewModel(result));
          });
        });
      }
    });
  }, 1000);
  
  ko.applyBindings(viewModel);
}();
