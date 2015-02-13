app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
}).directive('sidebar', function ($rootScope) {
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        template: '<div ng-repeat="item in sidebarItemService.sidebarItems">{{item.Title}}</div>',
        controller: function ($scope, SidebarService) {

            $scope.sidebarItemService = SidebarService;

            $rootScope.$on('$stateChangeStart', function(event, toState, fromState, fromParams) {
                $scope.sidebarItemService.clearSidebarItems();
            });

            $scope.isDisabled = function(bool) {
                return bool;
            }
        },
        link: function (scope, element, attrs) {

        }
    };
});