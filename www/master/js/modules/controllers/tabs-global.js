/**=========================================================
 * Module: tabs-global.js
 * Page Controller
 =========================================================*/

angular.module('whiteframeBasicUsage', ['ngMaterial']);

app.controller('TabCtrl', ['$scope', '$location', 'tabs', function($scope, $location, tabs){
	// Define the titles of your tabs
	$scope.tabs = tabs;

	console.log($scope._globals.getConstant('k8sApiServerd'));

	// Change the tab
	$scope.switchTab = function(index) {
	    var tab = tabs[index];
	    if (tab) {
	      var path = '/%s'.format(tab.toLowerCase());
	      $location.path(path);
	    }
	}
}]);
