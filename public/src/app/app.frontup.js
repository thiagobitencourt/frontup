(function() {
  'use strict';
  angular
    .module('app.frontup', [
      // libs
      'ui.router',
      // own
      'app.frontup.main'
    ])
    .config(mainConfig);

    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function mainConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'app/modules/home/home.html',
          controller: 'homeController',
          controllerAs: 'home'
        });

      $urlRouterProvider.otherwise('/home');
    };
})();
