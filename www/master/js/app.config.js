angular.module("krakenApp.config", []);
angular.module('krakenApp.services',[]);

app.config([
  '$routeProvider',
function ($routeProvider) {
  $routeProvider
    .when("/404", {templateUrl: "/views/partials/404.html"})
    // else 404
    .otherwise({
        redirectTo: "/404"
    });
}]).config([
  '$routeProvider',
  'manifestProvider',
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
      if (r.controller) {
        $routeProvider.when(r.url, {templateUrl: r.templateUrl, controller: r.controller});
      } else {
        $routeProvider.when(r.url, {templateUrl: r.templateUrl});
      }
    });
}]);
