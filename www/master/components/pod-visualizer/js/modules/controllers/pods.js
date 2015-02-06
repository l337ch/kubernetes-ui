/**=========================================================
 * Module: Pods
 * Visualizer for pods
 =========================================================*/

app.controller('PodCtrl', ['$scope', '$interval', 'podService',
    function($scope, $interval, podService) {
      $scope.mode = 'query';
      $scope.determinateValue = 30;
      $interval(function() {
        $scope.determinateValue += 1;
        if ($scope.determinateValue > 100) {
          $scope.determinateValue = 30;
        }
      }, 100, 0, true);

      var allPods = { };

      loadPods();

      function loadPods() {
        podService
          .loadAll()
          .then( function( pods ) {
            allPods = pods;

            $scope.pods = pods;
            $scope.selected = pods.items[0];
          });
      }
    }
  ]);