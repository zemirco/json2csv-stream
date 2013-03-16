
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
      },
      function(callback) {
        // only output specific keys
        var key_data =
          'car,color' + os.EOL +
            'Audi,blue' + os.EOL +
            'BMW,black' + os.EOL +
            'Mercedes,red' + os.EOL +
            'Porsche,green';
        fs.writeFile('test/fixtures/out_keys.csv', key_data, function(err) {
          callback(err);
        });
      },
      function(callback) {
        // comma seperated values
        var unix_data =
          'car,price,color\n' +
          'Audi,40000,blue\n' +
          'BMW,35000,black\n' +
          'Mercedes,80000,red\n' +
          'Porsche,60000,green';
        fs.writeFile('test/fixtures/out_unix.csv', unix_data, function(err) {
          callback(err);
        });
      },
      function(callback) {
        // comma seperated values
        var dos_data =
          'car,price,color\r\n' +
          'Audi,40000,blue\r\n' +
          'BMW,35000,black\r\n' +
          'Mercedes,80000,red\r\n' +
          'Porsche,60000,green';
        fs.writeFile('test/fixtures/out_dos.csv', dos_data, function(err) {
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

  it('should provide optional support for specific keys', function(done) {

    var parser = new MyStream({
      keys: ['car','color']
    });
    var reader = fs.createReadStream('test/fixtures/in.json');
    var writer = fs.createWriteStream('test/fixtures/_out_keys.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out_keys.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out_keys.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

  it('should support optional end of line markers (unix)', function(done) {

    var parser = new MyStream({
      eol: '\n'
    });
    var reader = fs.createReadStream('test/fixtures/in.json');
    var writer = fs.createWriteStream('test/fixtures/_out_unix.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out_unix.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out_unix.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

  it('should support optional end of line markers (dos)', function(done) {

    var parser = new MyStream({
      eol: '\r\n'
    });
    var reader = fs.createReadStream('test/fixtures/in.json');
    var writer = fs.createWriteStream('test/fixtures/_out_dos.csv');

    reader.pipe(parser).pipe(writer);

    writer.on('close', function() {
      fs.readFile('test/fixtures/_out_dos.csv', function(err, _data) {
        if (err) console.log(err);
        _data = _data.toString();
        fs.readFile('test/fixtures/out_dos.csv', function(err, data) {
          if (err) console.log(err);
          data = data.toString();
          _data.should.eql(data);
          done();
        });
      });
    });

  });

});