(function() {
  'use strict';

  angular.module('app.accordion')
    .component('accordionPanel', {
        transclude: true,
        require: {
          'parent': '^accordion'
        },
        bindings: {
          heading: '@'
        },
        templateUrl: 'app/components/accordion/accordionPanel.html',
        controller: AccordionPanelController
    });

  function AccordionPanelController() {
    var self = this;
    self.selected = true;

    self.$onInit = function() {
      self.parent.addPanel(self);
    };

    self.turnOn = function() {
      self.selected = true;
    };

    self.turnOff = function() {
      self.selected = false;
    };

    self.select = function() {
      self.parent.selectPanel(self);
    };
  }
})();
