module.exports = function(config) {
  config.set({

    basePath : '../',

    files : [
      'master/bower_components/angular/angular.js',
      'master/bower_components/angular-aria/angular-aria.js',
      'master/bower_components/angular-material/angular-material.js',
      'master/bower_components/angular-mocks/angular-mocks.js',
      'master/bower_components/angular-route/angular-route.js',
      'master/bower_components/hammerjs/hammer.js',
      'app/assets/js/app.js',
      'app/assets/js/base.js',
      'app/assets/vendor/**/*.js',
      'app/shared/**/*.js',
      'master/shared/**/*.js',
      'master/test/**/*.js',
      'master/components/**/test/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
