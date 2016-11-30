(function() {
  'use strict';

  angular
    .module('app.frontup.home')
    .service('homeService', homeService);

  function homeService($http) {
    var url = document.location.origin + '/api/v1.0/';
    var service = {
      getBuckets: _getBuckets,
      getProjects: _getProjects,
      getStatus: _getStatus,
      install: _install,
      getJson: _getJson
    };
    return service;

    function _getJson() { return $http.get(url + 'config-json') }
    function _getBuckets() { return $http.get(url + 'buckets') }
    function _getProjects(bucket) { return $http.get(url + 'projects/' + bucket); }
    function _getStatus(id) { return $http.get(url + 'progress/' + id); }
    function _install(bucket, object) {
      return $http.get(url + 'install',
        {
          params:
            {
              bucket: bucket,
              object: object
            }
        }
      );
    }
  };
  homeService.$inject = ['$http'];
})();
