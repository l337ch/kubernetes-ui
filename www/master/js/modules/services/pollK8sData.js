(function() {
  "use strict";

  var pollK8sDataServiceProvider = function PollK8sDataServiceProvider(lodash) {
    // A set of configuration controlling the polling behavior.
    // Their values should be configured in the application before
    // creating the service instance.

    var useSampleData = false;
    this.setUseSampleData = function(value) {
      useSampleData = value;
    };

    var sampleDataFiles = [
      "components/graph/assets/sampleData1.json",
      "components/graph/assets/sampleData2.json",
      "components/graph/assets/sampleData3.json"
    ];
    this.setSampleDataFiles = function(value) {
      sampleDataFiles = value;
    };

    var dataServer = "http://localhost:8001/graph";
    this.setDataServer = function(value) {
      dataServer = value;
    };

    var pollMinIntervalSec = 10;
    this.setPollMinIntervalSec = function(value) {
      pollMinIntervalSec = value;
    };

    var pollMaxIntervalSec = 120;
    this.setPollMaxIntervalSec = function(value) {
      pollMaxIntervalSec = value;
    };

    var pollErrorThreshold = 5;
    this.setPollErrorThreshold = function(value) {
      pollErrorThreshold = value;
    };

    this.$get = function($http, $timeout) {
      // Now the sequenceNumber will be used for debugging and verification purposes.
      var k8sdatamodel = { 
        "data" : undefined, 
        "sequenceNumber" : 0,
        "useSampleData" : useSampleData
      };
      var pollingError = 0;
      var promise = undefined;

      var dedupe = function (dataModel) {
        if (dataModel.nodes) {
          dataModel.nodes = lodash.uniq(dataModel.nodes, function(node) { return node.id; });
        }

        if (dataModel.edges) {
          dataModel.edges = lodash.uniq(dataModel.edges, function(edge) { return edge.source + edge.target; });
        }
      };

      var updateModel = function(newModel) {
        if (newModel.graph) {
          newModel = newModel.graph;
        }

        // Remove label and metadata, which contain changing timestamps.
        if (newModel.label) {
          delete newModel.label;
        }

        if (newModel.metadata) {
          delete newModel.metadata;
        }

        dedupe(newModel);

        var newModelString = JSON.stringify(newModel);
        var oldModelString = "";
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

      var nextSampleDataFile = 0;
      var getSampleDataFile = function() {
        var result = "";
        if (sampleDataFiles.length > 0) {
          result = sampleDataFiles[nextSampleDataFile % sampleDataFiles.length];
          ++nextSampleDataFile;
        }

        return result;
      };

      var pollOnce = function(scope, repeat) {
        var dataSource = (k8sdatamodel.useSampleData) ? getSampleDataFile() : dataServer;
        $.getJSON(dataSource)
          .done(function(newModel, jqxhr, textStatus) {
            if (newModel) {
              updateModel(newModel);
              scope.$apply();
              promise = repeat ? $timeout(function() { pollOnce(scope, true); }, pollInterval * 1000) : undefined;
              return;
            }

            bumpCounters();
            promise = repeat ? $timeout(function() { pollOnce(scope, true); }, pollInterval * 1000) : undefined;
          })
        .fail(function(jqxhr, textStatus, error) {
            bumpCounters();
            promise = repeat ? $timeout(function() { pollOnce(scope, true); }, pollInterval * 1000) : undefined;
          });
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
        if (pollingError % pollErrorThreshold === 0) {
          console.log("Error: " + pollingError + " consecutive polling errors for " + dataServer + ".");
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
        return promise ? true : false;
      };

      var refresh = function(scope) {
        stop(scope);
        resetCounters();
        k8sdatamodel.data = undefined;
        pollOnce(scope, false);
      };

      var start = function(scope) {
        // If polling has already started, then calling start() again would
        // just reset the counters and polling interval, but it will not
        // start a new thread polling in parallel to the existing polling
        // thread.
        resetCounters();
        if (!promise) {
          k8sdatamodel.data = undefined;
          pollOnce(scope, true);
        }
      };

      var stop = function(scope) {
        if (promise) {
          $timeout.cancel(promise);
          promise = undefined;
        }
      };

      return {
        "k8sdatamodel" : k8sdatamodel,
        "isPolling" : isPolling,
        "refresh" : refresh,
        "start" : start,
        "stop" : stop
      };
    };
  };

  angular.module("krakenApp.services")
    .provider("pollK8sDataService", ["lodash", pollK8sDataServiceProvider])
    .config(function(pollK8sDataServiceProvider, ENV) {
      if (ENV && ENV['/']) {
        if (ENV['/']['k8sDataServer']) {
          pollK8sDataServiceProvider.setDataServer(ENV['/']['k8sDataServer']);
        }
        if (ENV['/']['k8sDataPollIntervalMinSec']) {
          pollK8sDataServiceProvider.setPollIntervalSec(ENV['/']['k8sDataPollIntervalMinSec']);
        }
        if (ENV['/']['k8sDataPollIntervalMaxSec']) {
          pollK8sDataServiceProvider.setPollIntervalSec(ENV['/']['k8sDataPollIntervalMaxSec']);
        }
        if (ENV['/']['k8sDataPollErrorThreshold']) {
          pollK8sDataServiceProvider.setPollErrorThreshold(ENV['/']['k8sDataPollErrorThreshold']);
        }
      }
    });

})();
