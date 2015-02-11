(function() {
  'use strict';

  var pollK8sDataServiceProvider = function PollK8sDataServiceProvider() {
    // A set of configuration controlling the polling behavior.
    // Their values should be configured in the application before
    // creating the service instance.

    var endpointUrl = '';
    // Set URL for data service during development.
    endpointUrl = 'http://turing-glider-846.appspot.com/graph/';

    var pollMinIntervalSec = 1;
    var pollMaxIntervalSec = 60;
    var pollErrorThreshold = 5;

    this.setEndpointUrl = function(value) {
      endpointUrl = value;
    }
    this.setPollMinIntervalSec = function(value) {
      pollMinIntervalSec = value;
    }
    this.setPollMaxIntervalSec = function(value) {
      pollMaxIntervalSec = value;
    }
    this.setPollErrorThreshold = function(value) {
      pollErrorThreshold = value;
    }

    this.$get = function($http, $timeout) {
      // Now the sequenceNumber will be used for debugging and verification purposes.
      var k8sdatamodel = { 'data' : undefined, 'sequenceNumber' : 0 };
      var pollingError = 0;
      var promise = undefined;

      var startPolling = function() {

        // TODO: Set CORS header to get away with the XMLHttpRequest origin auth issue.
        $http.get(endpointUrl)
        .success(function(data, status, headers, config) {
          if (data) {
            // TODO: only reassign if the newly fetched data differs from the cached one.
            k8sdatamodel.data = data;
            k8sdatamodel.sequenceNumber++;
            pollingError = 0;
            resetCounters();
          } else {
            bumpCounters();
          }
        })
        .error(function(data, status, headers, config) {
          bumpCounters();
        });

        promise = $timeout(startPolling, pollInterval * 1000);
      };

      // Implement fibonacci back off when the service is down.
      var pollInterval = pollMinIntervalSec;
      var pollIncrement = pollInterval;

      // Reset polling interval.
      var resetCounters = function() {
        pollInterval = pollMinIntervalSec;
        pollIncrement = pollInterval;
      };

      // Bump error count and polling interval.
      var bumpCounters = function() {
        // Bump the error count.
        pollingError++;

        // TODO: maybe display an error in the UI to the end user.
        if (pollingError > pollErrorThreshold) {
          console.log('Have ' + pollingError + ' consecutive polling errors.');
        }

        // Bump the polling interval.
        var oldIncrement = pollIncrement;
        pollIncrement = pollInterval;
        pollInterval += oldIncrement;

        // Reset when limit reached.
        if (pollInterval > pollMaxIntervalSec) {
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
  };

  angular.module('krakenApp.services')
  .provider('pollK8sDataService', pollK8sDataServiceProvider);

})();
