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
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        indent: 2,
        latedef: "nofunc",
        newcap: true,
        noarg: true,
        noempty: true,
        nonbsp: true,
        nonew: true,
        undef: true,
        unused: true,
        trailing: true,

        laxcomma: true,

        node: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};
