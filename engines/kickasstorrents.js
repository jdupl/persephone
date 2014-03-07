/**
 * KickAssTorrents engine.
 */

var http = require('../lib/http.js')
  , common = require('../lib/common.js')
  , util = require('util')
  , uuid = require('uuid')
  , events = require('events');

/**
 * Constructor of the search object.
 * @param what String to search.
 */
function Search(what) {
  this._what = what;
  this._stop = false;
  this._page = 0;
  this._resultCount = 0;
  this._expectedAmount = null;
  this.results = [];
}

// extend EventEmitter
util.inherits(Search, events.EventEmitter);

/**
 * Start searching for torrents. The search will stop when it has retrieved
 * all of the available results, or if the stop method.
 */
Search.prototype.start = function () {
  this._nextPage();
};

/**
 * Stop searching for torrents.
 */
Search.prototype.stop = function () {
  this._stop = true;
};

/**
 * Get the next page of results.
 */
Search.prototype._nextPage = function () {
  // if the search should stop, exit the function
  if (this._stop) return;

  // we want to sort the results by seeds, to get the most interesting results
  // first
  var url = util.format('%s/json.php?q=%s&page=%d&field=seeders&sorder=desc', exports.url,
    encodeURIComponent(this._what), ++this._page);

  // fetch the page
  http.get(url, function (err, torrents) {

    // extract expected amount if needed
    if (this._expectedAmount === null) {
      this._expectedAmount = torrents.total_results;
    }

    var results = [], result;

    torrents.list.forEach(function (torrent) {
      result = {
        uuid: uuid.v4(),
        title: torrent.title,
        url: torrent.link,
        torrent: torrent.torrentLink,
        date: common.formatDateString(torrent.pubDate),
        size: common.formatBytes(torrent.size),
        seeds: torrent.seeds,
        leechs: torrent.leechs
      };
      results.push(result);
    }, this);

    // append new results to all results
    results.forEach(function (result) {
      this.results.push(result);
    }, this);

    // emit event
    this.emit('results', results);

    // check if we're done
    var done = this._stop || this.results.length >= this._expectedAmount;

    // do not stop
    if (done) {
      this.emit('end');
    } else {
      this._nextPage();
    }
  }, this);
};

// Wrapper around the search object to ease its construction.
exports.search = function (what) {
  return new Search(what);
};

// Export module data.
exports.id = 'thepiratebay';
exports.name = 'The Pirate Bay';
exports.url = 'https://kickass.to';
