(function() {
  'use strict';

  angular
    .module('app.frontup.home', [])
    .controller('homeController', homeController)

    homeController.$inject = [];
    function homeController() {
      var vm = this;

      vm.projects = [
        {
          name: "Projeto 1",
          records: [
            {
              installed: true,
              version: "2.1.0",
              release: new Date()
            },
            {
              installed: false,
              version: "1.1.0",
              release: new Date()
            },
            {
              installed: false,
              version: "0.1.0",
              release: new Date()
            }
          ]
        },
        {
          name: "Projeto 2",
          records: [
            {
              installed: false,
              version: "1.9.5",
              release: new Date()
            },
            {
              installed: true,
              version: "1.7.2",
              release: new Date()
            },
            {
              installed: false,
              version: "0.1.8",
              release: new Date()
            }
          ]
        }
      ]
    };
})();
