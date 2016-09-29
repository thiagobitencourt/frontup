(function() {
  'use strict';

  angular
    .module('app.frontup.main', [])
    .controller('homeController', homeController)

    homeController.$inject = [];
    function homeController() {
      var vm = this;

      vm.hello = 'Hello from Front-up app!';
    };
})();
