/**=========================================================
 * Module: home-page.js
 * Page Controller
 =========================================================*/

app.controller('PageCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  console.log("loading page controller.");
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);