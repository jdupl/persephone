var home = require('./controllers/home');

// function to setup routes
module.exports = function (app) {
  app.get('/', home.index);
  app.get('/settings', home.settings);
};