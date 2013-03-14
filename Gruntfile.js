
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        es5: true,
        expr: true
      },
      files: ['Gruntfile.js', 'index.js', 'example/example.js', 'benchmark/run.js']
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // register tasks
  grunt.registerTask('hint', ['jshint']);

};