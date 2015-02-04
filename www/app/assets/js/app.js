var app = angular.module('krakenApp', ['ngRoute','ngMaterial']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "/views/partials/home.html", controller: "PageCtrl"})
    .when("/pods", {templateUrl: "/pages/pods.html", controller: "PageCtrl"})
    .when("/404", {templateUrl: "/views/partials/404.html", controller: "PageCtrl"})
    // else 404
    .otherwise({
        redirectTo: "/404"
    });
}]);

app.controller('PageCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  console.log("Page Controller reporting for duty.");
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);

// app.run(['$route', function($route)  {
//   $route.reload();
// }]);

app.run(['$route', angular.noop]);

app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});