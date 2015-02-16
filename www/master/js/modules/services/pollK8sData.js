(function() {
  'use strict';

  var pollK8sDataServiceProvider = function PollK8sDataServiceProvider() {
    // A set of configuration controlling the polling behavior.
    // Their values should be configured in the application before
    // creating the service instance.

    var dataServer = '';
    this.setDataServer = function(value) {
      dataServer = value;
    }

    var pollMinIntervalSec = 3;
    this.setPollMinIntervalSec = function(value) {
      pollMinIntervalSec = value;
    }

    var pollMaxIntervalSec = 30;
    this.setPollMaxIntervalSec = function(value) {
      pollMaxIntervalSec = value;
    }

    var pollErrorThreshold = 5;
    this.setPollErrorThreshold = function(value) {
      pollErrorThreshold = value;
    }

    this.$get = function($http, $timeout) {
      // Now the sequenceNumber will be used for debugging and verification purposes.
      var k8sdatamodel = { 'data' : undefined, 'sequenceNumber' : 0 };
      var pollingError = 0;
      var promise = null;

      var updateModel = function(newModel) {
        // Remove label and metadata, which contain changing timestamps.
        if (newModel["label"]) {
          delete newModel["label"];
        }

        if (newModel["metadata"]) {
          delete newModel["metadata"];
        }

        var newModelString = JSON.stringify(newModel);
        var oldModelString = '';
        if (k8sdatamodel.data) {
          oldModelString = JSON.stringify(k8sdatamodel.data);
        }

        if (newModelString != oldModelString) {
          k8sdatamodel.data = newModel;
          k8sdatamodel.sequenceNumber++;
        }

        pollingError = 0;
        resetCounters();
      };

      var startPolling = function() {
        $.getJSON(dataServer)
          .done(function(newModel, jqxhr, textStatus) {
            if (newModel) {
              if (newModel["graph"]) {
                // Extract the data model from the response.
                newModel = newModel["graph"];
              }

              if (newModel) {
                updateModel(newModel);
                return;
              }
            }

            bumpCounters();
          })
        .fail(function(jqxhr, textStatus, error) {
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
        if (pollingError % pollErrorThreshold == 0) {
          console.log('Error: ' + pollingError + ' consecutive polling errors for ' + dataServer + '.');
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

      var isPolling = function() {
        return !!promise;
      };

      return {
        'k8sdatamodel' : k8sdatamodel,
        'start' : function() {
          // If polling has already started, then calling start() again would
          // just reset the counters and polling interval, but it will not
          // start a new thread polling in parallel to the existing polling
          // thread.
          resetCounters();
          if (!isPolling()) {
            startPolling();
          }
        },
        'stop' : function() {
          if (isPolling()) {
            $timeout.cancel(promise);
            k8sdatamodel.data = undefined;
            promise = null;
          }
        }
      };
    };
  };

  angular.module('krakenApp.services')
    .provider('pollK8sDataService', pollK8sDataServiceProvider);

})();
