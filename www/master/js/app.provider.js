app.provider('configurationService', [
  'ENV',
function(ENV) {
  var env = ENV; // allow ability to override the real ENV
  this.getConstant = function(constantName) {
    if (env[constantName]) {
      return env[constantName];
    }
      return false;
    };

  this.getConstantOrElse = function(constantName, alternateValue) {
    if (env[constantName]) {
      return env[constantName];
    }
      return alternateValue;
    };

  this.setEnv = function(value) {
    env = value;
  };

  this.$get = function(env){
    var configMethods = {};
    var toBeReturnedEnv = this.env || env;
    configMethods.getConstant = function (constantName) {
      return toBeReturnedEnv[constantName];
    };

    return configMethods;
  }
}]);