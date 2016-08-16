(function () {
    'use strict';

    angular
        .module('app.editor')
        .directive('editControl', editControl)
        .controller('EditControlController', EditControlController);

    /* @ngInject */
    function editControl() {
        var directive = {
            restrict: 'EA',
            scope: true,
            templateUrl: 'app/editor/edit-control.html',
            controller: 'EditControlController',
            controllerAs: 'vm'
        };
        return directive;
    }

    /* @ngInject */
    function EditControlController($scope, $element, selectionService) {
        var vm = this;

        vm.controlState = null;
        $scope.$watch(function () {
            var _allSelections = selectionService.allSelections();
            if(_allSelections.length > 1) {
                vm.controlState = '4';
            } else if(_allSelections.length === 1) {
                var selectedComponent = _allSelections[0];
                switch(selectedComponent.data.cmpType) {
                    case 'text':
                        vm.controlState = '1';
                        break;
                    case 'image':
                        vm.controlState = '2';
                        break;
                    case 'shape':
                        vm.controlState = '3';
                        break;
                }
            } else {
                vm.controlState = null;
            }
        });

        $element.bind('keydown keyup', stopPropagation);
        $element.on('$destroy', function () {
            $element.unbind('keydown keyup', stopPropagation);
        });
        function stopPropagation(event) {
            event.stopPropagation();
        }
    }
})();
