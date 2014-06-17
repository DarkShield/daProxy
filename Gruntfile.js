module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/public/js/{,*/}*.js',
        'app/public/js/controllers/{,*/}*.js',
        'app/public/js/directives/{,*/}*.js',
        'app/public/js/services/{,*/}*.js'
      ]
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'app/public/css/application.css',
          'app/public/css/bootstrap-combined.min.css',
          'app/public/css/customizations.css'
          //place your Stylesheet files here
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'app/public/js/controllers/sidebarCtrl.js',
          'app/public/js/controllers/trafficCtrl.js',
          'app/public/js/services/domainService.js',
          'app/public/js/services/drilldownService.js',
          'app/public/js/dashboard.js'
          //place your JavaScript files here
        ]
      }
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/public/css/**/*.css','app/public/js/**/*.js'],
        tasks: ['concat']
      },
      protractor: {
        files: ['app/public/js/**/*.js','spec/angular/e2e/**/*.js'],
        tasks: ['protractor:auto']
      }
    },

    jasmine_node: {
      coverage: {

      },
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        captureExceptions: true,
        junitreport: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['jasmine_node']);
  //grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  //grunt.registerTask('autotest', ['karma:unit_auto']);
  //grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  //grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

  //coverage testing
  //grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  //grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  //grunt.registerTask('install', ['update','shell:protractor_install']);
  //grunt.registerTask('update', ['shell:npm_install', 'concat']);

  //defaults
  //grunt.registerTask('default', ['dev']);

  //development
  //grunt.registerTask('dev', ['update', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //server daemon
  //grunt.registerTask('serve', ['connect:webserver']);
};