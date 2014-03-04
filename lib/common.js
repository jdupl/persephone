/**
 * This file contains all kinds of utilities for the application.
 */

var util = require('util');

// byte sizes
var kibi = 1024
  , mibi = kibi * 1024
  , gibi = mibi * 1024
  , tibi = gibi * 1024;

/**
 * Format a quantity of bytes into a readable format.
 * @param bytes An amount of bytes to be formatted.
 * @returns A properly formatted size string.
 */
function formatBytes(bytes) {
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
  return util.format('%d %s', (Math.round(quotient * 100) / 100), symbol);
}

/**
 * Pad a number with leading zeros for the given length.
 * @param number Number to pad.
 * @param length Length of the string after being padded.
 * @returns A string padded with leading zeros.
 */
function zeroPadding(number, length) {
  length = length || 2;

  if (length < 2) {
    throw RangeError("Length must be greater than or equal to 2.");
  }
  var strNumb = number.toString();

  while (strNumb.length < length) {
    strNumb = '0' + strNumb;
  }

  return strNumb;
}

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

// exports
exports.formatBytes = formatBytes;
exports.zeroPadding = zeroPadding;
exports.formatDateParts = formatDateParts;
exports.formatDate = formatDate;

