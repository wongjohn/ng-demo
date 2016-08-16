(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('textPanel', textPanel)
        .controller('TextPanelController', TextPanelController);

    /* @ngInject */
    function textPanel() {
        var directive = {
            restrict: 'EA',
            scope: true,
            controller: 'TextPanelController',
            controllerAs: 'vm',
            templateUrl: 'app/widgets/text-panel.html'
        };

        return directive;
    }

    /* @ngInject */
    function TextPanelController($scope, selectionService) {
        var vm = this;

        $scope.$watch(function () {
            var _allSelections = selectionService.allSelections();
            if(_allSelections.length === 1) {
                var selectedComponent = selectionService.allSelections()[0].data;
                if(selectedComponent.cmpType === 'text') {
                    vm.selectedTextComponent = selectedComponent;
                }
            }
        });

    }
})();
