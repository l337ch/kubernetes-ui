/**=========================================================
 * Module: tabs-global.js
 * Page Controller
 =========================================================*/

angular.module('whiteframeBasicUsage', ['ngMaterial']);

app.controller('AppCtrl', function( $scope ) {
    $scope.data = {
      selectedIndex : 0,
      secondLocked : true,
      firstLabel : "Dashboard",
      secondLabel : "Graph",
      thirdLabel : "Other"
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });