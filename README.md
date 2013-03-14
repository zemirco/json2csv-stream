# very early release, work in progress

json2csv implemented as a transform stream.

Parse json streams to csv output. Emits `header` and `line` events for custom use.

## Pipe data to readable stream

```javascript
var fs = require('fs');
var MyStream = require('../index.js');

// create the parsing stream
var parser = new MyStream();

// create the read and write streams
var reader = fs.createReadStream('data.json');
var writer = fs.createWriteStream('out.csv');

reader.pipe(parser).pipe(writer);
```

## Use `header` and `line` events

If you want to further manipulate your data listen on the custom events.

```javascript
parser.on('header', function(data) {
  console.log(' ++ yeah header found ++');
  console.log(data);
});

parser.on('line', function(data) {
  console.log(' ++ yeah line found ++');
  console.log(data);
});
```

## Benchmark
