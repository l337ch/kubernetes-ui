/**=========================================================
 * Module: home-page.js
 * Page Controller
 =========================================================*/

app.controller('PageCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);