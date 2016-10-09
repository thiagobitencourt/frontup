(function() {
  'use strict';

  angular
    .module('app.frontup.home', [])
    .controller('homeController', homeController)

    homeController.$inject = ['$timeout', 'homeService'];
    function homeController($timeout, homeService) {
      var vm = this;
      vm.install = install;
      vm.$onInit = init;
      vm.loadProjects = loadProjects;
      vm.currentBucket = null;
      vm.installedMessage = null;

      function init() {
        homeService
          .getBuckets()
          .then(function(buckets) {
              vm.buckets = buckets.data;
              if(!vm.buckets.length) return _handleError('No buckets found!');
              vm.currentBucket = vm.buckets[0];
              loadProjects();
          }, _handleError);
      }

      function loadProjects() {
        homeService
          .getProjects(vm.currentBucket.Name)
          .then(function(projects) {
              vm.projects = projects.data;
          }, _handleError);
      };

      function install(project) {
        homeService
          .install(vm.currentBucket.Name, project.object)
          .then(function(result) {
            project.process = result.data.process;
              _getStatus(project);
          }, _handleError);
      }

      function _getStatus(project) {
        homeService.getStatus(project.process)
          .then(function(res) {
            project.status = res.data.status;
            var message = [
              'Process ', project.process,
              ': ', project.status.code,
              ' - ', project.status.description,
              '. ', project.status.message].join('');

            if(project.status.description === 'Error')
              return _handleError(message);
            vm.installedMessage = message;
            if(project.status.description !== 'Done' &&
               project.status.description !== 'Error'
            ) {
              $timeout(function() {
                _getStatus(project);
              }, 1000);
            }
          });
      }

      function _handleError(err) {
        vm.installedMessage = null;
        vm.apiError = err;
      }
    };
})();
