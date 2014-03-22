var home = require('./controllers/home.js')
  , api = require('./controllers/api.js');

// function to setup routes
module.exports = function (app) {
  app.get('/', home.index);
  app.get('/settings', home.settings);
  app.get('/api/startSearch', api.startSearch);
  app.get('/api/getSearch', api.getSearch);
  app.get('/api/clearSearch', api.clearSearch);
};
