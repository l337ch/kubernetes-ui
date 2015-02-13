app.run(['$route', angular.noop]
).run(function($rootScope, globalsFactory) {
  $rootScope._globals = globalsFactory;
});