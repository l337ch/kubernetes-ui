(function() {
  'use strict';

  var pollK8sDataService = function PollK8sDataService(
      $http, $timeout) {
    // sequenceNumber can be used to watch for changes in data.
    var k8sdatamodel = { 'data' : undefined, 'sequenceNumber': 0 };
    var pollingError = 0;
    var promise = undefined;

    var startPolling = function() {
      // TODO: Pass in the URL through constants config.
      // TODO: Set CORS header to get away with the XMLHttpRequest origin auth issue.
      $http.get('http://turing-glider-846.appspot.com/graph').
        success(function(data, status, headers, config) {
        if (data) {
          // TODO: only reassign if the newly fetched data differs from the cached one.
          k8sdatamodel.data = data;
          k8sdatamodel.sequenceNumber++;
          pollingError = 0;
          resetCounters();
        } else {
          bumpCounters();
        }

        promise = $timeout(startPolling, pollingInterval);
      }).error(function(data, status, headers, config) {
        bumpCounters();

        promise = $timeout(startPolling, pollingInterval);
      });
    };

    // TODO: externalize these values.
    var maximumInterval = 60000;
    var initialInterval = 1000;

    // Implement fibonacci back off when the service is down.
    var pollingInterval = initialInterval;
    var pollingIncrement = pollingInterval;

    // Reset polling interval.
    var resetCounters = function() {
      pollingInterval = initialInterval;
      pollingIncrement = pollingInterval;
    };

    // Bump error count and polling interval.
    var bumpCounters = function() {
      // Bump the error count.
      pollingError++;

      // TODO: maybe display an error in the UI to the end user.
      console.log('Have ' + pollingError + ' consecutive polling errors.');

      // Bump the polling interval.
      var currentIncrement = pollingIncrement;
      pollingIncrement = pollingInterval;
      pollingInterval += currentIncrement;

      // Reset when limit reached.
      if (pollingInterval > maximumInterval) {
        resetCounters();
      }
    };

    return {
      'k8sdatamodel' : k8sdatamodel,
      'start' : function() {
        resetCounters();
        startPolling();
      },
      'stop' : function() {
        $timeout.cancel(promise);
      }
    };
  };

  angular.module('krakenApp.services')
    .service('pollK8sDataService',
             ['$http', '$timeout', pollK8sDataService]);

})();
