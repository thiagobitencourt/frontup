(function() {
  'use strict';
  angular.module('app.menuBar', [])
  .component('menuBar', {
    bindings: {
      // no bindings yet
    },
    templateUrl: 'app/components/menuBar/menuBar.html',
    controller: menuBarController
  });

  function menuBarController() {
    var vm = this;

    vm.inProgress = 0;
  };
})();
