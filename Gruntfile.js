
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        es5: true,
        expr: true
      },
      files: ['Gruntfile.js', 'index.js', 'example/example.js', 'benchmark/run.js', 'test/test.js']
    },
    mochaTest: {
      files: ['test/test.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'spec'
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // register tasks
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('test', ['mochaTest']);

};