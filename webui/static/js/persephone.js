// this script requires a browser which supports EcmaScript 5.
(function () {
  "use scrict";
  
  var tabsTemplate = false;
  var viewModel = {
    activeSearch: false,
    searches: []
  };
  
  // render the tabs and results area
  function renderTabs() {
    if (tabsTemplate === false) return;
    
    var content = swig.render(tabsTemplate, {
      locals: viewModel,
    });
    
    $('#contentArea').html(content);
  }
  
//  function startSearchDaemon() {
//    function callback() {
//      viewModel.searches.forEach(function (search) {
//        if (search.id && !search.done) {
//          
//        }
//      });
//    }
//    setInterval(callback, 200);
//  }
  
  $(function () {
    // load the tabsTemplate
    $.get('/static/templates/tabs.html', function (template) {
      tabsTemplate = template;
      renderTabs(viewModel);
    });
    
    $('#searchForm').on('submit', function () {
      var what = $('#searchText').val();
      
      if (what.length > 0) {
        $.getJSON('/api/startSearch', {what : what}, function (data) {
          viewModel.activeSearch = data.id;
          viewModel.searches.push({
            id: data.id,
            what: data.what,
            done: false,
            results: []
          });
          renderTabs();
        });
      }
      
      return false;
    });
  });
  
  // global events
  
  window.persephoneOnTabClicked = function (id) {
    viewModel.activeSearch = id;
  };
  
  window.persephoneOnCloseTab = function (id) {
    $.getJSON('/api/clearSearch', {id: id});
    viewModel.searches = viewModel.searches.filter(function (search) {
      return search.id !== id;
    });
    renderTabs();
  };

})();
