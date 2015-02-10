(function() {
  'use strict';

  var pollK8sDataService = function PollK8sDataService(
      $http, $timeout) {
    // Now the sequenceNumber will be used for debugging and verification purposes.
    var k8sdatamodel = { 'data': undefined, 'sequenceNumber': 0};
    var pollingError = 0;
    var promise = undefined;

    var startPolling = function() {
      // TODO: maybe display an error in the UI to the end user.
      if (pollingError > 3) {
        console.log('Have ' + pollingError + ' consecutive polling errors.');
      }

      // TODO: Pass in the URL through constants config.
      // TODO: Set CORS header to get away with the XMLHttpRequest origin auth issue.
      $http.get('http://turing-glider-846.appspot.com/graph').
        success(function(data, status, headers, config) {
        if (data) {
          // TODO: only reassign if the newly fetched data differs from the cached one.
          k8sdatamodel.data = data;
          k8sdatamodel.sequenceNumber++;
          pollingError = 0;
        } else {
          pollingError++;
        }

        // TODO: externalized this poll interval as a config value in
        // www/master/js/config
        promise = $timeout(startPolling, 1000);
      }).error(function(data, status, headers, config) {
        pollingError++;

        // TODO: externalized this poll interval as a config value in
        // www/master/js/config
        promise = $timeout(startPolling, 1000);
      });
    };

    startPolling();

    return {
      k8sdatamodel : k8sdatamodel,
      restart: function() {
        startPolling();
      },
      stop: function() {
        $timeout.cancel(promise);
      }
    };
  };

  angular.module('krakenApp.services')
    .service('pollK8sDataService',
             ['$http', '$timeout', pollK8sDataService]);

})();
