module.exports = function(grunt) {

  grunt.initConfig({
    jasmine_node: {
      coverage: {
        options : {
          failTask: true,
          branches : 67 ,
          functions: 83,
          statements:90,
          lines:95
        }
      },
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec.unit',
        junitreport: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      }
    },
    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['lib/*.js','lib/inspectors/*.js','spec/**/*.js'],
        tasks: ['test:unit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage-validation');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('test:unit', ['jasmine_node']);
  grunt.registerTask('autotest',['watch:assets']);
};
