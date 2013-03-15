
var should = require('should');
var fs = require('fs');
var os = require('os');
var async = require('async');
var MyStream = require('../index.js');

describe('json2csv-stream', function() {

  // write some platform independent files to fixtures dir
  before(function(done) {
    async.parallel([
      function(callback) {
        // comma seperated values
        var csv_data =
          'car,price,color' + os.EOL +
            'Audi,40000,blue' + os.EOL +
            'BMW,35000,black' + os.EOL +
            'Mercedes,80000,red' + os.EOL +
            'Porsche,60000,green';

        fs.writeFile('test/fixtures/out.csv', csv_data, function(err) {
          callback(err);
        });
      },
      function(callback) {
        // semicolon seperated values
        var ssv_data =
          'car;price;color' + os.EOL +
            'Audi;40000;blue' + os.EOL +
            'BMW;35000;black' + os.EOL +
            'Mercedes;80000;red' + os.EOL +
            'Porsche;60000;green';

        fs.writeFile('test/fixtures/out_ssv.csv', ssv_data, function(err) {
          callback(err);
        });
      }
    ], function(err, results) {
      if (err) console.log(err);
      done();
    });

  });

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

  it('should parse json to csv when chunk doesn\'t contain json', function(done) {

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

  it('should support optional custom delimiters', function(done) {

    var parser = new MyStream({
      del: ';'
    });
    var reader = fs.createReadStream('test/fixtures/in.json');
    var writer = fs.createWriteStream('test/fixtures/_out_ssv.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out_ssv.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out_ssv.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

});