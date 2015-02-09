/**=========================================================
 * Module: tabs-global.js
 * Page Controller
 =========================================================*/

angular.module('whiteframeBasicUsage', ['ngMaterial']);

app.controller('TabCtrl', ['$scope', '$location', 'tabs', function($scope, $location, tabs){
// Define the titles of your tabs
$scope.tabs = tabs;

// Change the tab
$scope.switchTab = function(index) {
    switch(index) {
        case 0: $location.path('/dashboard');break;
        case 1: $location.path('/graph');break;
    }
}
}]);