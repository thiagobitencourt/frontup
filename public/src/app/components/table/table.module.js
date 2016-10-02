(function() {
  'use strict';

  angular.module('app.projectTable', [])
    .component('projectTable', {
      bindings: {
        records: '=',
        onInstall: '&'
      },
      templateUrl: '/app/components/table/table.html'
    });
})();
