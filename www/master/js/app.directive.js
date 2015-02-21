app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
}).directive('compile', function($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
    );
  };
}).directive('menuLink', function() {
  return {
    scope: {
      section: '='
    },
    templateUrl: '/views/partials/menu-link.tmpl.html',
    link: function($scope, $element) {
      var controller = $element.parent().controller();

      $scope.isSelected = function() {
        return controller.isSelected($scope.section);
      };
    }
  };
}).directive("krakenMenu", function() {
  return {
    templateUrl: "/views/partials/kraken-menu.tmpl.html"
  };
}).directive('menuToggle', function() {
  return {
    scope: {
      section: '='
    },
    templateUrl: '/views/partials/menu-toggle.tmpl.html',
    link: function($scope, $element) {
      var controller = $element.parent().controller();

      $scope.isOpen = function() {
        return controller.isOpen($scope.section);
      };
      $scope.toggle = function() {
        controller.toggleOpen($scope.section);
      };

      var parentNode = $element[0].parentNode.parentNode.parentNode;
      if(parentNode.classList.contains('parent-list-item')) {
        var heading = parentNode.querySelector('h2');
        $element[0].firstChild.setAttribute('aria-describedby', heading.id);
      }
    }
  };
}).directive('dashboardHeader', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {user: '='},
        templateUrl: "/components/dashboard/pages/header.html",
        controller: [
          '$scope',
          '$filter',
          '$location',
          'menu',
          '$rootScope',
        function ($scope, $filter, $location, menu, $rootScope) {
          $scope.menu = menu;
          $scope.$watch('page', function(newValue, oldValue) {
            if (typeof newValue !== 'undefined') {
              $location.path(newValue);
            }
          });

          $scope.openMenu = $rootScope.openMenu;

          $scope.subpages = [
            { category: 'dashboard', name: 'Groups', value: '/dashboard/groups//selector/' },
            { category: 'dashboard', name: 'Pods', value: '/dashboard/pods' },
            { category: 'dashboard', name: 'Minions', value: '/dashboard/minions' },
            { category: 'dashboard', name: 'Replication Controllers', value: '/dashboard/replicationcontrollers' },
            { category: 'dashboard', name: 'Services', value: '/dashboard/services' },
            { category: 'dashboard', name: 'Events', value: '/dashboard/events' },
            { category: 'dashboard', name: 'cAdvisor', value: '/dashboard/cadvisor' }
          ];
        }]
    }
}).directive('dashboardFooter', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "/components/dashboard/pages/footer.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
        }]
    }
});

app.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});