/**=========================================================
 * Module: Replication
 * Visualizer for replication controllers
 =========================================================*/

app.controller('ReplicationCtrl', ['$scope', '$interval', 'replicationControllerService',
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
