app.run(['$route', angular.noop]);

app.run(function($rootScope, globalsFactory) {
  $rootScope._globals = globalsFactory;
});