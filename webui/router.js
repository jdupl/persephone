var home = require('./controllers/home.js')
  , api = require('./controllers/api.js');

// function to setup routes
module.exports = function (app) {
  app.get('/', home.index);
  app.get('/settings', home.settings);
  app.post('/api/startSearch', api.startSearch);
  app.post('/api/getSearch', api.getSearch);
  app.post('/api/clearSearch', api.clearSearch);
};
