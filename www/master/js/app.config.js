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

app.config(function(k8sApiProvider, ENV){

  var getConstant = function(constantName) {
    if (ENV[constantName]) {
      return ENV[constantName];
    }
    return false;
  };

  k8sApiProvider.setUrlBase(getConstant('k8sApiServer'));
});