/**=========================================================
 * Module: home-page.js
 * Page Controller
 =========================================================*/

app.controller('PageCtrl', [
  '$scope',
  '$timeout',
  '$mdSidenav',
  'menu',
function($scope, $timeout, $mdSidenav, menu) {
  console.log("loading page controller.");
  $scope.menu = menu;

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

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

}]).filter('humanizeDoc', function() {
  return function(doc) {
    if (!doc) return;
    if (doc.type === 'directive') {
      return doc.name.replace(/([A-Z])/g, function($1) {
        return '-'+$1.toLowerCase();
      });
    }
    return doc.label || doc.name;
  };
});