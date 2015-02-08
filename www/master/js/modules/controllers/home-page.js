/**=========================================================
 * Module: home-page.js
 * Page Controller
 =========================================================*/

app.controller('PageCtrl', ['$scope', '$mdSidenav', '$timeout', function($scope, $mdSidenav, $timeout){


  // *********************
  // Internal methods
  // *********************

  var t = false;

  $scope.shouldLockOpen = function() {
    return t;
  }

  $scope.openMenu = function() {
    $timeout(function() {
      t = !$mdSidenav('left').isOpen();
      $mdSidenav('left').toggle();
    });
  }
 
}]);