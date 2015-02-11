(function() {
  'use strict';

  var pollK8sDataServiceProvider = function PollK8sDataServiceProvider() {
    // A set of configuration controlling the polling behavior.
    // Their values should be configured in the application before
    // creating the service instance.
    var endpointUrl = '';
    var pollIntervalSec = 1;
    var pollErrorThreshold = 3;

    this.setEndpointUrl = function(value) {
      endpointUrl = value;
    }
    this.setPollIntervalSec = function(value) {
      pollIntervalSec = value;
    }
    this.setPollErrorThreshold = function(value) {
      pollErrorThreshold = value;
    }

    this.$get = function($http, $timeout) {
      // Now the sequenceNumber will be used for debugging and verification purposes.
      var k8sdatamodel = { 'data': undefined, 'sequenceNumber': 0};
      var pollingError = 0;
      var promise = undefined;

      var startPolling = function() {
	// TODO: maybe display an error in the UI to the end user.
	if (pollingError > pollErrorThreshold) {
          console.log('Have ' + pollingError + ' consecutive polling errors.');
	}

	// TODO: Set CORS header to get away with the XMLHttpRequest origin auth issue.
	$http.get(endpointUrl).
            success(function(data, status, headers, config) {
              if (data) {
		// TODO: only reassign if the newly fetched data differs from the cached one.
		k8sdatamodel.data = data;
		k8sdatamodel.sequenceNumber++;
		pollingError = 0;
              } else {
		pollingError++;
              }

              promise = $timeout(startPolling, pollIntervalSec * 1000);
	    }).error(function(data, status, headers, config) {
              pollingError++;

              promise = $timeout(startPolling, pollIntervalSec * 1000);
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
    }
  };

  angular.module('krakenApp.services')
    .provider('pollK8sDataService', pollK8sDataServiceProvider);

})();
