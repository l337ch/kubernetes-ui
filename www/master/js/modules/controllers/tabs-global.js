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
	    var cases = '';
	    var i = 0;
	    var nl = '\n';
	    tabs.forEach(function(tab) {
	      cases += 'case %d: $location.path("/%s");break;'.format(i,tab.toLowerCase()) + nl;
	      i++;
	    });
	    var switchStmt = 'switch(index) {' + nl +  cases + nl + '}';
	    eval(switchStmt);
	}
}]);