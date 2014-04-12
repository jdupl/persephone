module.exports = function (grunt) {

  var jsFiles = [
    'Gruntfile.js',
    'lib/*.js',
    'engines/*.js',
    'webui/*.js',
    'webui/controllers/*.js',
    'webui/static/js/*.js'
  ];

  grunt.initConfig({
    jshint: {
      files: jsFiles,
      options: {
        laxcomma: true
      }
    },
    watch: {
      files: jsFiles,
      tasks: ['jshint'],
      options: {
        spawn: true
      }
    },
    exec: {
      server: {
        cmd: 'nodemon app.js'
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  
  grunt.registerTask('default', ['exec:server']);

};
