var path = require('path');

// GET /
exports.index = function (req, res) {
  res.sendfile(path.join(__dirname, '../views/index.html'));
};

// GET /settings
exports.settings = function (req, res) {

};
