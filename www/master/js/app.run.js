app.run(['$route', angular.noop]).run(function($rootScope, globalsFactory, lodash) {
  $rootScope._globals = globalsFactory;

  // Alias lodash
  window['_'] = lodash; });
