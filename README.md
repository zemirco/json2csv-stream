# json2csv-stream

very early release, work in progress

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

### Use optional custom delimiter

The default delimiter is `,` (comma). If you want to have tab-seperated values (\t) or
semilocon-seperated values (;) you can specify an optional delimiter inside the `options`.

```javascript
var MyStream = require('../index.js');

var parser = new MyStream({
  del: ';'
});
```

### Use optional specific keys

You can specify which key-value pairs you'd like to include in your `.csv` file. Use the `keys` property.

```javascript
var MyStream = require('../index.js');

var parser = new MyStream({
  keys: ['car', 'color']
});
```

## Benchmark

*coming soon*

## Test

You need to have [grunt-cli](http://gruntjs.com/) installed.

```bash
$ grunt test
```

or

```bash
$ npm test
```

## License

Copyright (C) 2012 [Mirco Zeiss](mailto: mirco.zeiss@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.