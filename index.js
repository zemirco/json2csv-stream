
/**
 * Module dependencies
 */
var Transform = require('readable-stream').Transform;
var util = require('util');
var async = require('async');
var os = require('os');

/**
 * MyStream constructor function.
 *
 * @param {Object} options Optional options including 'del', 'keys', 'eol'
 */
var MyStream = function(options) {

  if (!(this instanceof MyStream))
    return new MyStream(options);

  Transform.call(this, options);

  if (!options) options = {};

  this.del = options.del || ',';
  this.keys = options.keys;
  this.eol = options.eol || os.EOL;
  this.showHeader = options.showHeader !== false;

  this._headerWritten = false;
  this._header = [];
  this._line = [];
  this._data = '';
  this._chunk = '';
  this._firstLineWritten = false;

};

/**
 * Set prototype
 */
MyStream.prototype = Object.create(Transform.prototype, {
  constructor: {
    value: MyStream
  }
});

/**
 * Main function that transforms incoming json data to csv output.
 *
 * @param {Buffer} chunk Incoming data
 * @param {String} encoding Encoding of the incoming data. Defaults to 'utf8'
 * @param {Function} done Called when the proceesing of the supplied chunk is done
 */
MyStream.prototype._transform = function(chunk, encoding, done) {
  var that = this;

  that._chunk = chunk.toString();
  // regular expression looking for json in chunk
  var re = /(\{[^}]+\})/g;
  // see if incoming chunk has a json object
  var m = re.exec(that._chunk);
  if (!m) {
    // no json in chunk found -> append chunk to data collection
    that._data += that._chunk;
    // check if new data collection contains json object
    var result = re.exec(that._data);
    if (result) {
      // that._data plus new chunk now has json object
      if (!that._headerWritten && that.showHeader) that.writeHeader(result[0]);
      that.writeLine(result[0]);
      // remove processed json string from _data store
      that._data = that._data.split(result[0]).join('');
    }
  } else {
    // json in chunk found
    if (!that._headerWritten && that.showHeader) that.writeHeader(m[0]);
    for (m; m; m = re.exec(that._chunk)) {
      that.writeLine(m[0]);
    }
  }
  done();
};

/**
 * Write the header line to csv output.
 * Takes all keys or the keys specified in options.keys and pushes
 * the KEYS out to a readable stream. Also emits a 'header' event where data is
 * the header as a String. When processing the header is done sets
 * _headerWritten to true.
 *
 * @param {String} header String containing a json object
 */
MyStream.prototype.writeHeader = function(header) {
  var that = this;
  // convert string to json object
  header = JSON.parse(header);
  // use all keys or the ones specified in options.keys
  var keys = that.keys || Object.keys(header);
  // iterate over all keys
  var iterator = function(item, callback) {
    that._header.push(item);
    callback(null);
  };
  async.each(keys, iterator, function(err) {
    // when iteration is done process the header
    var headerLine = that._header.join(that.del);
    // emit 'header' event
    that.emit('header', headerLine);
    // push data to readable stream
    that.push(headerLine);
    // remember that header has been processed
    that._headerWritten = true;
  });
};

/**
 * Write the body lines to csv output.
 * Takes all keys or the keys specified in options.keys and pushes
 * the VALUES out to a readable stream. Also emits a 'line' event where data is
 * the line as a String. When processing the line is done clear
 * the internal _line store.
 *
 * @param {String} line String containing a json object
 */
MyStream.prototype.writeLine = function(line) {
  var that = this;
  // convert string to json object
  var lineObject = JSON.parse(line);
  // use all keys or the ones specified in options.keys
  var keys = that.keys || Object.keys(lineObject);
  // iterate over all keys
  var iterator = function(item, callback) {
    var val = lineObject[item];
    that._line.push(val);
    callback(null);
  };
  async.each(keys, iterator, function(err) {
    // when iteration is done process the header
    var lineStr = that._line.join(that.del);
    // add end-of-line marker to previous line followed by line string
    if (!that._firstLineWritten && !that.showHeader) {
      that._firstLineWritten = true;
    } else {
      lineStr = that.eol + lineStr;
    }
    // emit 'line' event
    that.emit('line', lineStr);
    // push data to readable stream
    that.push(lineStr);
    // clear old data
    that._line = [];
  });
};

/**
 * Export MyStream
 */
module.exports = MyStream;