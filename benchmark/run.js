var fs = require('fs');
var async = require('async');
var MyStream = require('../index.js');
var Transform = require('readable-stream').Transform;
var util = require('util');

var runs = 10;
//var durations = [];

count = 0;

var parser, reader, writer;

//async.whilst(
//  function() {
//    return count < runs;
//  },
//  function(callback) {
//    console.log('first cycle')
//    console.log(count)
//    parser = new MyStream();
//    reader = fs.createReadStream('data.json');
//    writer = fs.createWriteStream('out.csv');
//
//    var start = Date.now();
//
//    reader.pipe(parser).pipe(writer);
//
//    parser.on('end', function() {
//      parser = null;
//      reader = null;
//      writer = null;
//      var duration = Date.now() - start;
//      console.log('%d ms needed to parse the data', duration);
//      durations.push(duration);
//      count++
//      callback(null);
//    });
//  }, function(err) {
//    console.log('done');
//    console.log(durations);
//  }
//);

function SimpleProtocol(options) {
  if (!(this instanceof SimpleProtocol))
    return new SimpleProtocol(options);

  Transform.call(this, options);
}

SimpleProtocol.prototype = Object.create(
  Transform.prototype, { constructor: { value: SimpleProtocol }});

SimpleProtocol.prototype._transform = function(chunk, encoding, done) {
  chunk = chunk.toString().toUpperCase();
  this.push(chunk)
};

var count = 0;
var durations = [];

//var reader = fs.createReadStream('data.json');
//var parser = new SimpleProtocol();
//var writer = fs.createWriteStream('out.csv');
//var start = Date.now();
//reader.pipe(parser).pipe(writer);
//reader.on('end', function() {
//  var duration = Date.now() - start;
//  console.log(duration)
//})

async.whilst(
  function() {
    return count < 10;
  },
  function(callback) {
    var start = Date.now();
    var reader = fs.createReadStream('data.json');
    var parser = new SimpleProtocol();
    var writer = fs.createWriteStream('out.csv');
    reader.pipe(parser).pipe(writer);
    reader.on('end', function() {
      var duration = Date.now() - start;
      durations.push(duration);
      count++;
      callback(null);
    })
  },
  function(err) {
    console.log('done');
    console.log(durations);
  }
);