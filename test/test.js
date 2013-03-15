
var should = require('should');
var fs = require('fs');
var MyStream = require('../index.js');

describe('json2csv-stream', function() {

  it('should parse json to csv when json is in chunk', function(done) {

    var parser = new MyStream();
    var reader = fs.createReadStream('test/fixtures/in.json');
    var writer = fs.createWriteStream('test/fixtures/_out.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

  it('should parse json to csv when chunk doesn\'t contain json ', function(done) {

    var parser = new MyStream();
    var reader = fs.createReadStream('test/fixtures/in.json', {
      bufferSize: 32
    });
    var writer = fs.createWriteStream('test/fixtures/_out.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

});