/**
 * This file contains http related utilities to work with requests and parsers
 * and more.
 */

var zlip = require('zlib')
  , cheerio = require('cheerio')
  , request = require('request');

// list of user agents to be used.
var userAgents = [
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/6.0)',
  'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
  'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/6.0)'
];

/**
 * @returns A random user agent based on the userAgents list.
 */
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Process the given data using the contentType.
 * @param contentType Value of the Content-Type header.
 * @param charset Charset in which the data is encoded in.
 * @param rawData Raw data to decompress.
 * @param fn Callback function.
 * @param context Context of the of the callback function.
 */
function processData(contentType, charset, data, fn, context) {
  charset = charset || 'utf8';
  var error, object;
  switch (contentType) {
    case 'application/json':
    case 'text/x-json':
      try {
        object = JSON.parse(data.toString(charset));
      } catch (err) {
        error = err;
      }
      break;
    case 'text/html':
      try {
        object = cheerio.load(data.toString(charset));
      } catch (err) {
        error = err;
      }
      break;
  }
  fn.call(context, error, object);
}

/**
 * Decompress the given data.
 * @param contentType Value of the Content-Type header.
 * @param charset Charset in which the data is encoded in.
 * @param rawData Raw data to decompress.
 * @param fn Callback function.
 * @param context Context of the of the callback function.
 */
function decompressData(contentType, charset, rawData, fn, context) {
  zlib.unzip(rawData, function (err, data) {
    if (err) fn(err);
    else processData(contentType, data);
  });
}

/**
 * Perform a HTTP GET request.
 * @param url Target url.
 * @param fn Callback function.
 * @param context Context of the callback function.
 */
function get(url, fn, context) {
  context = context || global;

  // create request
  var req = request({
    url: url,
    headers: {
      'Accept-Language': 'en',
      'User-Agent': getRandomUserAgent()
    }
  });

  // response headers
  req.on('response', function (res) {
    var chunks = [];

    // accumulate data
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    // all data is read, do something with it
    res.on('end', function () {
      var rawData = Buffer.concat(chunks);
      var contentEncoding = res.headers['content-encoding'];
      var contentType = res.headers['content-type'];
      var charset = null;

      // if the Content-Type has a charset, parse it
      if (contentType.indexOf(';') >= 0) {
        parts = contentType.split(';');
        contentType = parts[0].trim();
        charset = parts[1].split('=')[1].trim();
      }

      // process the data using the encoding
      switch (contentEncoding) {
        case 'gzip':
        case 'deflate':
          decompressData(contentType, charset, rawData, fn, context);
          break;
        default:
          processData(contentType, charset, rawData, fn, context);
          break;
      }
    });

    // error occured
    res.on('error', function () {
      fn.call(context, 'Error reading from stream.');
    });
  });
}

// export methods
exports.get = get;
