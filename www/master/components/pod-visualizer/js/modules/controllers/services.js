/**=========================================================
 * Module: Services
 * Visualizer for services
 =========================================================*/

app.controller('ServicesCtrl', ['$scope', '$interval', 'serviceService',
    function($scope, $interval) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);
    }
  ]);
