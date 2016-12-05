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

      vm.itemClicked = itemClicked;
      vm.subItemClicked = subItemClicked;
      vm.save = save;
      vm.addItem = addItem;
      vm.removeItem = removeItem;

      vm.fullFileClicked = fullFileClicked;

      vm.copy = function() {
        var obj = angular.copy(vm.currentItem);
        _clearItem([obj]);

        vm.currentItemString = JSON.stringify(obj, null, 2);
        vm.currentItem.options.editing = true;
      }

      function init() {
        vm.options = [
          { name: 'Projeto', value: 'name'},
          { name: 'Versão recente', value: 'lastVersion'}
        ];

        vm.helpers = {
          onInstall: install
        };

        vm.onClick = function(it) {
          vm.projSelected = it === 'projetos';
        }
        vm.projSelected = true;
        vm.configJson = {};
        vm.projects = [];

        homeService
          .getBuckets()
          .then(function(buckets) {
              vm.buckets = buckets.data;
              if(!vm.buckets.length) return _handleError('No buckets found!');
              vm.currentBucket = vm.buckets[0];
              loadProjects();
          }, _handleError);

        homeService
          .getJson()
          .then(function(result) {
            vm.originalJson = result.data;
            vm.configJson = vm.originalJson.menu.children;
          });
      }

      function removeItem() {
        function _rmItem(obj) {
          obj.forEach(function(item, index) {
              if(item.label === vm.currentItem.label) {
                obj.splice(index, 1);
              } else if(item.children) {
                _rmItem(item.children);
              }
          });
        };
        _rmItem(vm.configJson);
        _unActive(vm.configJson);
        vm.currentItem = null;
        _saveConfig(vm.configJson);
      }

      function addItem() {
        function _findPar(obj) {
          obj.forEach(function(item, index) {
              if(item.label === vm.currentItem.label) {
                obj.splice(index + 1, 0, {label: vm.newItemLabel});
              } else if(item.children) {
                _findPar(item.children);
              }
          });
        };
        _findPar(vm.configJson);
        _saveConfig(vm.configJson);

        vm.addingItem = false;
        vm.newItemLabel = '';
      }

      function _unActive(arr) {
        arr.forEach(function(it) {
          it.options = it.options || {};
          it.options.active = false;
          it.options.editing = false;
          if(it.children) {
            _unActive(it.children);
          }
        });
      }

      function _toShow(item) {
        var obj = angular.copy(item);
        _clearItem([obj]);
        return obj;
      }

      function _setCurrent(item, three) {
        vm.addingItem = false;
        _unActive(three);
        item.options.active = true;
        vm.currentItem = item;

        vm.currentItem.options.show = _toShow(vm.currentItem);

        var obj = angular.copy(vm.currentItem);
        _clearItem([obj]);

        vm.currentItemString = JSON.stringify(obj, null, 2);
      }

      function fullFileClicked() {
        vm.originalJson.options = {};
        vm.fullFileEdditing = true;
        _setCurrent(vm.originalJson, vm.configJson);
      }

      function itemClicked(item) {
        vm.fullFileEdditing = false;
        _setCurrent(item, vm.configJson);
      }

      function subItemClicked(sub, item) {
        vm.fullFileEdditing = false;
        _setCurrent(sub, item.children);
      }

      function save() {
        vm.currentItem.options.editing = false;
        var cpObj = angular.copy(vm.currentItem);

        vm.errorMessage = null;
        try {
          var objParsed;
          objParsed = JSON.parse(vm.currentItemString);

          angular.extend(vm.currentItem, objParsed);
          vm.currentItem.options.show = _toShow(vm.currentItem);

          // _saveConfig(vm.configJson, vm.fullFileEdditing);
          _saveConfig(vm.configJson, vm.fullFileEdditing);
        } catch (e) {
          vm.errorMessage = 'Arquvio JSON inválido: ' + e;
        }
      }

      function loadProjects() {
        if(!vm.currentBucket) return;
        vm.projects = [];
        homeService
          .getProjects(vm.currentBucket.Name)
          .then(function(projects) {
              vm.projects = projects.data;
              if(vm.projects && vm.projects.length) {
                vm.projects.forEach(function(project) {
                  if(project.records && project.records.length) {
                    var lastM = 0; var lastV;
                    project.records.forEach(function(record) {
                      var t  = new Date(record.lastModified);
                      var cur = t.getTime();
                      if(cur > lastM) {
                        lastM = cur;
                        lastV = record.version;
                      }
                    });
                    project.lastVersion = lastV;
                  }
                });
              }
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

            if(project.status.description === 'Error' || project.status.description === 'Not found')
              return _handleError(message);
            vm.installedMessage = message;
            if(project.status.description !== 'Done' &&
               project.status.description !== 'Error' &&
               project.status.description !== 'Not found'
            ) {
              $timeout(function() {
                _getStatus(project);
              }, 1000);
            }
          });
      }

      function _clearItem(arr) {
        arr.forEach(function(it) {
          delete it.options;
          if(it.children) {
            _clearItem(it.children);
          } else if(it.menu && it.menu.children) { // In case it is the full file
            _clearItem(it.menu.children);
          }
        });
      }

      function _saveConfig(config, fullFile) {
        var toSave = angular.copy(config);

        _clearItem(toSave);
        if(!fullFile) { // If edditing full file wee do not need this step
          vm.originalJson.menu.children = toSave;
        } else {
          _clearItem([vm.originalJson]);
          vm.configJson = vm.originalJson.menu.children; // Reset config json to update data
        }

        homeService.saveJson(vm.originalJson)
        .then(function(result) {
          vm.successMessage = 'Configuração atualizada com sucesso!';
        }, function(error) {
          vm.errorMessage = 'Falha ao salvar objecto: ' + error.data.message;
        });
      };

      function _handleError(err) {
        vm.installedMessage = null;
        vm.apiError = err;
      }
    };
})();
