/**
 * ThePirateBay engine.
 */

var http = require('../lib/http.js')
  , common = require('../lib/common.js')
  , util = require('util')
  , uuid = require('uuid')
  , events = require('events');

// Parse a date.
var reDate = /^Uploaded\s(\d\d)\-(\d\d)\s(\d{4})$/i
// When the torrent was uploaded in the current year, it uses a different
// date format.
  , reSpecialDate = /^Uploaded\s(\d\d)\-(\d\d)\s\d\d:\d\d$/
// Parse the size of the torrent.
  , reSize = /^\sSize\s([a-z0-9\.\s]+)$/i
// Parse the expected amount of results.
  , reExpectedAmount = /\(approx\s(\d+)\sfound\)$/i;

/**
 * Extract a date from a string formatted like 12-29 2013 or 01-13 07:31.
 * @param str Date to extract.
 * @returns A properly formatted ISO date.
 */
function extractDate(str) {
  var year, month, day;
  var matches = str.match(reDate);
  if (matches !== null) {
    year = parseInt(matches[3]);
    month = parseInt(matches[1]);
    day = parseInt(matches[2]);
  } else {
    var now = new Date();
    matches = str.match(reSpecialDate);
    year = now.getFullYear();
    if (matches !== null) {
      month = parseInt(matches[1]);
      day = parseInt(matches[2]);
    } else {
      month = now.getMonth() + 1;
      day = now.getDate();
      if (str.indexOf('Y-day') >= 0) {
        day--;
      }
    }
  }
  return common.formatDateParts(year, month, day);
}

/**
 * Extract the size of the torrent from a string formatted like 223 MiB.
 * @param str Size to extract.
 * @returns Torrent size.
 */
function extractSize(str) {
  return str.match(reSize)[1];
}

/**
 * Extract the expected amount of results from a string formatted like approx 655 found.
 * @param str Amount to extract.
 * @returns Expected amount of results.
 */
function extractExpectedAmount(str) {
  var matches = str.match(reExpectedAmount);
  if (matches !== null) {
    return parseInt(matches[1]);
  } else {
    return 0;
  }
}

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
  this.done = false;
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
  this.done = true;
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
  var url = util.format('%s/search/%s/%d/7/0', exports.url,
    encodeURIComponent(this._what), this._page++);

  // fetch the page
  http.get(url, function (err, $) {

    // extract expected amount if needed
    if (this._expectedAmount === null) {
      $('h2').find('span').remove();
      this._expectedAmount = extractExpectedAmount($('h2').text());
    }

    // remove table head
    $('#searchResult tr').eq(0).remove();

    // variables needed for data extraction
    var results = []
      , result, parts
      , cells, detLink, font;

    // loop through rows and extract data
    $('#searchResult tr').toArray().forEach(function (row) {
      cells = $(row).find('td');
      detLink = $(row).find('.detLink').eq(0);
      font = $(cells[1]).find('font');

      $(font).remove('a');
      parts = $(font).text().split(',');

      result = {
        id: uuid.v4(),
        title: $(detLink).attr('title'),
        url: exports.url + $(detLink).attr('href'),
        magnet: $(cells[1]).find('a').eq(1).attr('href'),
        date: extractDate(parts[0]),
        size: extractSize(parts[1]),
        seeds: parseInt($(cells[2]).text()),
        leechs: parseInt($(cells[3]).text()),
        source: exports.id
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
      this.done = true;
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
exports.url = 'http://thepiratebay.se';
