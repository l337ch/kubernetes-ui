app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/404", {templateUrl: "/views/partials/404.html", controller: "PageCtrl"})
    // else 404
    .otherwise({
        redirectTo: "/404"
    });
}]);

app.config(['$routeProvider', 'manifestProvider',
  function($routeProvider, manifestProvider) {

    var _manifestRoutes = JSON.parse(manifestProvider.getRoutes());

    var _routes = [];

    var _extractPageValues = function(page) {
        _routes.push({
            url: page.url,
            templateUrl: page.templateUrl,
            controller: page.controller
        });
    };

    _manifestRoutes.forEach(function(section) {
      if(section.children) {
        section.children.forEach(function(childSection) {
          if(childSection.pages){
            childSection.pages.forEach(function(page) {
              _extractPageValues(page);
            });
          }
        });
      }
      else if(section.pages) {
        section.pages.forEach(function(page) {
            _extractPageValues(page);
        });
      }
      else if (section.type === 'link') {
        _extractPageValues(section);
      }
    });

    angular.forEach(_routes, function(r) {
        $routeProvider.when(r.url, {templateUrl: r.templateUrl, controller: r.controller});
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