var home = require('./controllers/home'),
    api = require('./controllers/api');

// function to setup routes
module.exports = function (app) {
  app.get('/', home.index);
  app.get('/settings', home.settings);
  app.get('/api/startSearch', api.startSearch);
  app.get('/api/getSearch', api.getSearch);
  app.get('/api/clearSearch', api.clearSearch);
};