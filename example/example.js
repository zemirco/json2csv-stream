var fs = require('fs');
var MyStream = require('../index.js');

var parser = new MyStream();

parser.on('header', function(data) {
  console.log(' ++ yeah header found ++');
  console.log(data);
});

parser.on('line', function(data) {
  console.log(' ++ yeah line found ++');
  console.log(data);
});

// read the json file
var reader = fs.createReadStream('example/data.json', {
  encoding: 'utf8',
  bufferSize: 32
});

var writer = fs.createWriteStream('out.csv');

reader.pipe(parser).pipe(writer);