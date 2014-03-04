// ThePirateBay engine
//--------------------

// Parse a date.
var reDate = /^Uploaded\s(\d\d)\-(\d\d)\s(\d{4})$/i
// When the torrent was uploaded in the current year, it uses a different
// date format.
  , reSpecialDate = /^Uploaded\s(\d\d)\-(\d\d)\s\d\d:\d\d$/
// Parse the size of the torrent.
  , reSize = /^\sSize\s([a-z0-9\.\s]+)$/i
// Parse the expected amount of results.
  , reExpectedAmount = /\(approx\s(\d+)\sfound\)$/i;

// Extract the date out of a string.
function extractDate(str) {
  matches = str.match(reDate);
  if (matches !== null) {
    return util.format('%s-%s-%s', matches[3], matches[1], matches[2]);
  } else {
    matches = str.match(reSpecialDate);
    return util.format('%d-%s-%s', new Date().getFullYear(), matches[1],
      matches[2]);
  }
}

// Extract the size out of a string.
function extractSize(str) {
  return str.match(reSize)[1];
}

// Extract the expected amount of results out of a string.
function extractExpectedAmount(str) {
  return parseInt(str.match(reExpectedAmount));
}

// Constructor of the Search object.
// `what` is a string, what the engine is looking for.
function Search(what) {
  this._what = what;
  this._stop = false;
  this._page = 0;
  this._resultCount = 0;
  this._expectedAmount = null;
}

// This tells the search to start loading pages, one at a time, until there are
// no more results to fetch or if the stop method was called.
Search.prototype.start = function () {
  this._fetchNextPage();
};

// This tells the search to stop. It does not garantee that the search will stop
// now, only that it will not load another page. The `end` event will be fired
// when the search is truly done.
Search.prototype.stop = function () {
  this._stop = true;
};

Search.prototype._fetchNextPage = function () {
  // if the search should stop, exit the function
  if (this._stop) return;

  // we want to sort the results by seeds, to get the most interesting results
  // first
  var url = util.format('%s/search/%s/%d/7/0', exports.url,
    encodeURIComponent(this._what), this._page++);
};

// Wrapper around the search object to ease its construction.
exports.search = function (what) {
  return new Search(what);
};

// Export module data.
exports.id = 'thepiratebay';
exports.name = 'The Pirate Bay';
exports.url = 'http://thepiratebay.se';
