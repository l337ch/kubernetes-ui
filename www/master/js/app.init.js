// APP START
// ****************************
// /www/app/assets/app.js is autogenerated. Do not modify.
// Changes should be made in /master/modules/js or /master/components/<component-name>/js
// ****************************
// -----------------------------------

var app = angular.module('krakenApp', ['ngRoute','ngMaterial', 'krakenApp.config']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "/views/partials/home.html", controller: "PageCtrl"})
    .when("/clusters", {templateUrl: "/components/dashboard/pages/clusters.html", controller: "PageCtrl"})
    .when("/pods", {templateUrl: "/components/dashboard/pages/pods.html", controller: "PageCtrl"})
    .when("/replication", {templateUrl: "/components/dashboard/pages/replication.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "/components/dashboard/pages/services.html", controller: "PageCtrl"})
    .when("/labels", {templateUrl: "/components/dashboard/pages/labels.html", controller: "PageCtrl"})
    .when("/404", {templateUrl: "/views/partials/404.html", controller: "PageCtrl"})
    // else 404
    .otherwise({
        redirectTo: "/404"
    });
}]);

app.controller('PageCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  console.log("loading page controller.");
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