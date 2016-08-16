(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('shapePanel', shapePanel)
        .controller('ShapePanelController', ShapePanelController);

    /* @ngInject */
    function shapePanel() {
        return {
            restrict: 'EA',
            scope: true,
            controller: 'ShapePanelController',
            controllerAs: 'vm',
            templateUrl: 'app/widgets/shape-panel.html'
        };
    }

    /* @ngInject */
    function ShapePanelController($scope, selectionService) {
        var vm = this;

        $scope.$watch(function () {
            var _allSelections = selectionService.allSelections();
            if(_allSelections.length === 1) {
                var selectedComponent = selectionService.allSelections()[0].data;
                if(selectedComponent.cmpType === 'shape') {
                    vm.selectedShapeComponent = selectedComponent;
                }
            }
        });
    }
})();
