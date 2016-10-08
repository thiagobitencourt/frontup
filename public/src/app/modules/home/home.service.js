(function() {
  'use strict';

  angular
    .module('app.frontup.home')
    .service('homeService', homeService);

  function homeService($http) {
    var url = document.location.origin + '/api/v1.0/';
    var bucket = 'projetos-frontend'
    var service = {
      getVersion: _getVersion,
      install: _install,
      getStatus: _getStatus
    };
    return service;

    function _getVersion(project) {
      project = project || bucket;
      return $http.get(url + 'version/' + project)
        .then(function(result) {
          return result.data;
        })
        .catch(function(result) {
          console.log(result);
        });
    }

    function _install(object, project) {
      return $http.get(url + 'install/' + (project || bucket),
        {
          params: { object: object }
        }
      );
    }

    function _getStatus(id) {
      return $http.get(url + 'progress/' + id);
    }

  };

  homeService.$inject = ['$http'];
})();
