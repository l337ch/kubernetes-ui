app.directive('includeReplace', function () {
  'use strict';
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
}).directive('compile', function($compile) {
  'use strict';
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
  'use strict';
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
  'use strict';
  return {
    templateUrl: "/views/partials/kraken-menu.tmpl.html"
  };
}).directive('menuToggle', function() {
  'use strict';
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
  'use strict';
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
    };
}).directive('dashboardFooter', function () {
  'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "/components/dashboard/pages/footer.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
        }]
    };
}).directive('mdTable', function () {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      headers: '=',
      content: '=',
      sortable: '=',
      filters: '=',
      customClass: '=customClass',
      thumbs:'=',
      count: '='
    },
    controller: function ($scope, $filter, $window) {
      var orderBy = $filter('orderBy');
      $scope.currentPage = 0;
      $scope.nbOfPages = function () {
        return Math.ceil($scope.content.length / $scope.count);
      };
      $scope.handleSort = function (field) {
        if ($scope.sortable.indexOf(field) > -1) {
          return true;
        } else {
          return false;
        }
      };
      $scope.order = function(predicate, reverse) {
          $scope.content = orderBy($scope.content, predicate, reverse);
          $scope.predicate = predicate;
      };
      $scope.order($scope.sortable[0], false);
      $scope.getNumber = function (num) {
        return new Array(num);
      };
      $scope.goToPage = function (page) {
        $scope.currentPage = page;
      };
    },
    templateUrl: '/views/partials/md-table.tmpl.html'
  };
});

app.filter('startFrom', function () {
  'use strict';
  return function (input, start) {
    return input.slice(start);
  };
}).filter('nospace', function () {
  'use strict';
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
