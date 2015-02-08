/**=========================================================
 * Module: home-page.js
 * Page Controller
 =========================================================*/

app.controller('PageCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){


  // *********************
  // Internal methods
  // *********************

  var t = false;

  $scope.shouldLockOpen = function() {
    console.log(t);
    return t;
  }

  $scope.openMenu = function() {
    $timeout(function() {
      t = !$mdSidenav('left').isOpen();
      $mdSidenav('left').toggle();
    });
  }
 
}]);