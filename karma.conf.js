module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma'),
        require('karma-junit-reporter')
      ],
      client: {
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/mo-pdf-viewer'),
        subdir: '.',
        reporters: [{type:'html'}, {type:'lcovonly'}, {type:'text-summary'}, {type:'cobertura'}],
        fixWebpackSourcePaths: true
      },
      junitReporter: {
        outputDir: require('path').join(__dirname, './coverage/mo-pdf-viewer'),
        useBrowserName: false
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadless'],
      singleRun: false,
      restartOnFileChange: true
    });
  };
