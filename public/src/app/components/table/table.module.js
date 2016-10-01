(function() {
  'use strict';

  angular.module('app.projectTable', [])
    .component('projectTable', {
      bindings: {
        records: '='
      },
      templateUrl: '/app/components/table/table.html'
    });
})();
