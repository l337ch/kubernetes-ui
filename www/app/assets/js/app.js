var app = angular.module('krakenApp', ['ngRoute','ngMaterial',
  'pods', 'replicationControllers', 'services']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "/views/partials/home.html", controller: "PageCtrl"})
    .when("/clusters", {templateUrl: "/pages/clusters.html", controller: "PageCtrl"})
    .when("/pods", {templateUrl: "/pages/pods.html", controller: "PageCtrl"})
    .when("/replication", {templateUrl: "/pages/replication.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "/pages/services.html", controller: "PageCtrl"})
    .when("/labels", {templateUrl: "/pages/labels.html", controller: "PageCtrl"})
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

/**=========================================================
 * Module: Clusters
 * Visualizer for clusters
 =========================================================*/

app.controller('ClusterCtrl', ['$scope', '$interval',
    function($scope, $interval) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);

/**=========================================================
 * Module: Pods
 * Visualizer for pods
 =========================================================*/

app.controller('PodCtrl', ['$scope', '$interval', 'podService',
    function($scope, $interval, podService) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);

/**=========================================================
 * Module: Replication
 * Visualizer for replication controllers
 =========================================================*/

app.controller('ReplicationCtrl', ['$scope', '$interval', 'replicationControllerService',
    function($scope, $interval) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);

/**=========================================================
 * Module: Services
 * Visualizer for services
 =========================================================*/

app.controller('ServicesCtrl', ['$scope', '$interval', 'serviceService',
    function($scope, $interval) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);

/**=========================================================
 * Module: Labels
 * Visualizer for labels
 =========================================================*/

app.controller('LabelCtrl', ['$scope', '$interval',
    function($scope, $interval) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);
