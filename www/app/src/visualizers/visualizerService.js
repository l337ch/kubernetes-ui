(function(){
  'use strict';

  angular.module('visualizers', [ ])
         .service('visualizerService', VisualizerDataService);

  /**
   * Visualizer DataService
   * Mock async data service.
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function VisualizerDataService($q){
    var visualizers = [
      {
        name: 'Pods',
        classname: 'svg-pods',
        content: 'Container Pods'
      },
      {
        name: 'Services',
        classname: 'svg-services',
        content: 'Kubernetes Services'
      },
      {
        name: 'Add',
        classname: 'svg-add-visualizers',
        content: 'Add Visualizers'
      },
    ];

    // Uses promises
    return {
      loadAll : function() {
        // Simulate async call
        return $q.when(visualizers);
      }
    };
  }

})();
