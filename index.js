
var Transform = require('readable-stream').Transform;
var util = require('util');
var async = require('async');
var os = require('os');

var MyStream = function() {

  if (!(this instanceof MyStream))
    return new MyStream();

  Transform.call(this);

  this._headerWritten = false;
  this._header = [];
  this._line = [];
  this._data = '';
  this._chunk = '';
};

MyStream.prototype = Object.create(Transform.prototype, {
  constructor: {
    value: MyStream
  }
});

MyStream.prototype._transform = function(chunk, encoding, done) {
  var that = this;

  console.log('--------------');
  that._chunk = chunk.toString();
  console.log('data: ' + that._data);
  console.log('chunk: ' + that._chunk);
  var re = /\{[^}]+\}/;
  var isChunkJSON = re.test(that._chunk);
  console.log('is chunk json -> ' + isChunkJSON);
  if (!isChunkJSON) {
    that._data += that._chunk;
    console.log('new data: ' + that._data);
    var isDataJSON = re.test(that._data);
    console.log('is new data json -> ' + isDataJSON);
    if (isDataJSON) {
      var result = re.exec(that._data);
      console.log('result');
      console.log(result);
      that._data = that._data.split(result[0]).join('');
      if (!this._headerWritten) that.writeHeader(result[0]);
      that.writeLine(result[0], '_data');
    }
  } else {
    var rex = /(\{[^}]+\})/g;
    var m = rex.exec(that._chunk);
    console.log(m);
    if (!this._headerWritten) that.writeHeader(m[0]);
    for (m; m; m = rex.exec(that._chunk)) {
      that.writeLine(m[0], '_chunk');
    }
  }
  done();
  console.log('--------------');
};

/**
 * write the header line
 */
MyStream.prototype.writeHeader = function(header) {
  header = JSON.parse(header);
  var that = this;
  var iterator = function(item, callback) {
    that._header.push(item);
    callback(null);
  };
  async.each(Object.keys(header), iterator, function(err) {
    var headerLine = that._header.join(',');
    console.log(that._header);
    that.emit('header', headerLine);
    that.push(headerLine);
    that._headerWritten = true;
    that._header = null;
  });
};

/**
 * write a body line
 */
MyStream.prototype.writeLine = function(line, bucket) {
  console.log('inside write line');
  console.log(line);
  var that = this;
  var lineJson = JSON.parse(line);
  var iterator = function(key, callback) {
    var val = lineJson[key];
    that._line.push(val);
    callback(null);
  };
  async.each(Object.keys(lineJson), iterator, function(err) {
    var lineStr = that._line.join(',');
    lineStr = os.EOL + lineStr;
    that.emit('line', lineStr);
    that.push(lineStr);
    that._data = that[bucket].split(line).join('');
    that._line = [];
  });
};

module.exports = MyStream;