/**
 * This file contains all kinds of utilities for the application.
 */

var util = require('util');

// byte sizes
var kibi = 1024
  , mibi = kibi * 1024
  , gibi = mibi * 1024
  , tebi = gibi * 1024;

/**
 * Format a quantity of bytes into a readable format.
 * @param bytes An amount of bytes to be formatted.
 * @returns A properly formatted size string.
 */
function formatBytes(bytes) {
  var divider, symbol;
  switch (true) {
    case bytes > tebi:
      divider = tebi;
      symbol = 'TiB';
      break;
    case bytes > gibi:
      divider = gibi;
      symbol = 'GiB';
      break;
    case bytes > mibi:
      divider = mibi;
      symbol = 'MiB';
      break;
    case bytes > kibi:
      divider = kibi;
      symbol = 'KiB';
      break;
    default:
      divider = 1;
      symbol = 'bytes';
      break;
  }
  var quotient = bytes / divider;
  return util.format('%d %s', (Math.round(quotient * 100) / 100), symbol);
}
exports.formatBytes = formatBytes;

/**
 * Pad a number with leading zeros for the given length.
 * @param number Number to pad.
 * @param length Length of the string after being padded.
 * @returns A string padded with leading zeros.
 */
function zeroPadding(number, length) {
  length = length || 2;

  if (length < 2) {
    throw new RangeError("Length must be greater than or equal to 2.");
  }
  var strNumb = number.toString();

  while (strNumb.length < length) {
    strNumb = '0' + strNumb;
  }

  return strNumb;
}
exports.zeroPadding = zeroPadding;

/**
 * Format date parts in ISO format.
 * @param year Year of the date.
 * @param month Month of the date.
 * @param day Day of the date.
 */
function formatDateParts(year, month, day) {
  return util.format('%d/%s/%s', year,
    zeroPadding(month),
    zeroPadding(day));
}
exports.formatDateParts = formatDateParts;

/**
 * Format a date from a string
 * @param dateString A date string which can be parsed by the Date.parse function.
 * @returns Properly formatted date string.
 */
function formatDateString(dateString) {
  return formatDate(new Date(Date.parse(dateString)));
}
exports.formatDateString = formatDateString;

/**
 * Format a date in ISO format.
 * @param date Date to format.
 * @returns A properly formatted date string.
 */
function formatDate(date) {
  return formatDateParts(date.getFullYear(),
    zeroPadding(date.getMonth() + 1),
    zeroPadding(date.getDate()));
}
exports.formatDate = formatDate;

/**
 * Try to call a function. If no exception occurs, return the result. If an
 * exception occurs, return undefined.
 * @param fn Function to call.
 * @param context Context to call the function with. Optional, defaults to global.
 */
function tryCall(fn, context) {
  context = context !== void 0 ? context : global;
  try {
    var ret = fn.call(context);
    return ret;
  } catch (e) {
    return void 0;
  }
}
exports.tryCall = tryCall;

