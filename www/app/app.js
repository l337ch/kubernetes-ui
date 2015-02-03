(function(){
'use strict';

  angular
      .module('krakenApp', ['ngMaterial', 'visualizers'])
      .controller('AppCtrl', ['$scope', 'visualizerService', '$mdSidenav', '$mdBottomSheet', '$log', VisualizerAppController ])
      .config(function($mdThemingProvider) {

        // Place theme overrides here.
        // Example:
        // $mdThemingProvider.theme('default')
        //   .primaryColor('red')
        //   .accentColor('red');

      });

  /**
   * Main Controller for the Kraken App
   * @param $scope
   * @param $mdSidenav
   * @param visualizerService
   * @constructor
   */
  function VisualizerAppController($scope, visualizerService, $mdSidenav, $mdBottomSheet, $log ) {
    var allVisualizers = [ ];

    $scope.selected      = null;
    $scope.visualizers       = allVisualizers;
    $scope.selectVisualizer  = selectVisualizer;
    $scope.toggleSidenav = toggleSideNav;

    loadVisualizers();

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Load visualizers
     * @param menuId
     *
     */
    function loadVisualizers() {
      visualizerService
        .loadAll()
        .then( function( visualizers ) {
          allVisualizers = visualizers;

          $scope.visualizers = [].concat(visualizers);
          $scope.selected = visualizers[0];
        });
    }

    /**
     * Toggle sideNav
     * @param menuId
     */
    function toggleSideNav( name ) {
      $mdSidenav(name).toggle();
    }

    /**
     * Select current visualizer
     * @param menuId
     */
    function selectVisualizer ( visualizer ) {
        $scope.selected = angular.isNumber(visualizer) ? $scope.visualizers[visualizer] : visualizer;
        $scope.toggleSidenav('left');
    }

  }

})();
