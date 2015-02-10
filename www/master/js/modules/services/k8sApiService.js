app.provider('k8sApi', function(){

  var urlBase = '';

  this.setUrlBase = function(value) {
    urlBase = value;
  }

  var _get = function ($http, baseUrl, id) {
    var _fullUrl = baseUrl;
    if(id !== undefined) {
      _fullUrl += '/' + id;
    }

    return $http.get(_fullUrl);
  };

  this.$get = function($http, $q) {
    var api = {};

    api.getUrlBase = function() {
      return urlBase;
    }

    api.getPods = function (id) {
      return _get($http, urlBase + '/pods', id);
    };

    api.getMinions = function (id) {
      return _get($http, urlBase + '/minions', id);
    };

    api.getServices = function (id) {
      return _get($http, urlBase + '/services', id);
    };

    api.getReplicationControllers = function (id) {
      return _get($http, urlBase + '/replicationControllers', id)
    };

    return api;
  }
});