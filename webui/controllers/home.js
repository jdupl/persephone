var path = require('path');

// controller routes
var routes = {};

// GET /
routes.index = function (req, res) {
  res.sendfile(path.join(__dirname, '../views/index.html'));
};

// GET /settings
routes.settings = function (req, res) {

};

// export routes
module.exports = routes;
