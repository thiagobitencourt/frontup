(function() {
  'use strict';
  angular
    .module('app.frontup', [
      // libs
      'senior-simple-grid',
      // own
      'app.frontup.home',
      'app.menuBar',
      'app.accordion',
      'app.projectTable'
    ]);
})();
