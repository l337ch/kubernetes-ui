// angular.module('services.k8api', []);
// angular.module('services.k8api')
// angular.module('services.k8sApi')
app.provider('k8sApiService', ['k8sApiServer', function(k8sApiServer, $http) {

  var urlBase = k8sApiServer;
  var _get = function ($http, baseUrl, id) {
    var fullUrl = baseUrl;
    if(id !== undefined)
      fullUrl += '/' + id;

    return $http.get(fullUrl);
  };

  this.$get = function($http, $q){
    var api = {};

    api.getPods = function (id) {
      console.log("pod url is ", urlBase + '/pods')
      return _get($http, urlBase + '/pods', id);
    };

    api.getServices = function (id) {
      return _get($http, urlBase + '/services', id);
    };

    api.getReplicationControllers = function (id) {
      return _get($http, urlBase + '/replicationcontrollers', id)
    };

    return api;
  }
}]);

// app.config(function(k8sApiService){
//   //Providers are the only service you can pass into app.config
//   k8sApiService.urlBase = k8sApiServer;
// });