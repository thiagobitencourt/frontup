(function() {
  'use strict';

  angular
    .module('app.frontup.home', [])
    .controller('homeController', homeController)

    homeController.$inject = ['homeService'];
    function homeController(homeService) {
      var vm = this;
      vm.install = install;
      vm.installedMessage = null;
      vm.$onInit = init;

      function init() {
        homeService
          .getVersion()
          .then(function(projects) {
              vm.projects = projects;
          });
      }

      function install(object) {
        console.log(object);
        homeService
          .install(object)
          .then(function(result) {
            homeService.getStatus(result.data.process)
              .then(function(res) {
                vm.installedMessage = res.data;
              });
          });
      }

      // vm.projects = [
      //   {
      //     name: "Projeto 1",
      //     records: [
      //       {
      //         installed: true,
      //         version: "2.1.0",
      //         release: new Date()
      //       },
      //       {
      //         installed: false,
      //         version: "1.1.0",
      //         release: new Date()
      //       },
      //       {
      //         installed: false,
      //         version: "0.1.0",
      //         release: new Date()
      //       }
      //     ]
      //   },
      //   {
      //     name: "Projeto 2",
      //     records: [
      //       {
      //         installed: false,
      //         version: "1.9.5",
      //         release: new Date()
      //       },
      //       {
      //         installed: true,
      //         version: "1.7.2",
      //         release: new Date()
      //       },
      //       {
      //         installed: false,
      //         version: "0.1.8",
      //         release: new Date()
      //       }
      //     ]
      //   }
      // ]
    };
})();
