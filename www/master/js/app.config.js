app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/dashboard", {templateUrl: "/components/dashboard/pages/home.html", controller: "DashboardCtrl"})
    .when("/graph", {templateUrl: "/components/graph/pages/home.html", controller: "GraphCtrl"})
    .when("/404", {templateUrl: "/views/partials/404.html", controller: "PageCtrl"})
    // else 404
    .otherwise({
        redirectTo: "/404"
    });
}]);

app.provider('configurationService', ['ENV', function(ENV) {
  var env = ENV; // allow ability to override the real ENV
  this.getConstant = function(constantName) {
    if (env[constantName]) {
      return env[constantName];
    }
      return false;
    };

  this.getConstantOrElse = function(constantName, alternateValue) {
    if (env[constantName]) {
      return env[constantName];
    }
      return alternateValue;
    };

  this.setEnv = function(value) {
    env = value;
  };

  this.$get = function(env){
    var configMethods = {};
    var toBeReturnedEnv = this.env || env;
    configMethods.getConstant = function (constantName) {
      return toBeReturnedEnv[constantName];
    };

    return configMethods;
  }
}]);

app.config(function(k8sApiProvider,configurationServiceProvider, ENV){
  k8sApiProvider.setUrlBase(configurationServiceProvider.getConstant('k8sApiServer'));
});