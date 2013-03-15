
 var fs = require('fs');
 var Transform = require('readable-stream').Transform;
 var util = require('util');
 var Benchmark = require('benchmark');
 var suite = new Benchmark.Suite;


 // my super uppercase stream
 function Uppercase(options) {
 if (!(this instanceof Uppercase))
 return new Uppercase(options);

 Transform.call(this, options);
 }

 Uppercase.prototype = Object.create(
 Transform.prototype, { constructor: { value: Uppercase }});

 Uppercase.prototype._transform = function(chunk, encoding, done) {
 chunk = chunk.toString().toUpperCase();
 this.push(chunk)
 };

 // start benchmarking
 suite.add('stream test', function() {
 var reader = fs.createReadStream('data.json');
 var parser = new Uppercase();
 // var writer = fs.createWriteStream('out.csv');
 reader.pipe(parser);

 reader.on('error', function(err) {
   console.log('err in reader found')
   console.log(err)
 })

 parser.on('error', function(err) {
   console.log('err in parser found')
   console.log(err)
 })

 })
 // add listeners
 .on('cycle', function(event) {
 console.log(String(event.target));
 })
 .on('complete', function() {
 console.log('Fastest is ' + this.filter('fastest').pluck('name'));
 })
 // run async
 .run();