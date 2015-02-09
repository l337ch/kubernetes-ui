/**=========================================================
 * Module: tabs-global.js
 * Page Controller
 =========================================================*/

angular.module('whiteframeBasicUsage', ['ngMaterial']);

app.controller('TabCtrl', ['$scope', '$location', function($scope, $location){
// Define the titles of your tabs
$scope.tabs = ["Dashboard", "Graph Visualizer"];

// Change the tab
$scope.switchTab = function(index) {
    switch(index) {
        case 0: $location.path('/dashboard');break;
        case 1: $location.path('/graph');break;
    }
}
}]);