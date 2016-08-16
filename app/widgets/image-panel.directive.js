(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('imagePanel', imagePanel)
        .controller('ImagePanelController', ImagePanelController);

    /* @ngInject */
    function imagePanel() {
        return {
            restrict: 'EA',
            scope: true,
            controller: 'ImagePanelController',
            controllerAs: 'vm',
            templateUrl: 'app/widgets/image-panel.html'
        };
    }

    /* @ngInject */
    function ImagePanelController($scope, selectionService) {
        var vm = this;

        $scope.$watch(function () {
            var _allSelections = selectionService.allSelections();
            if(_allSelections.length === 1) {
                var selectedComponent = selectionService.allSelections()[0].data;
                if(selectedComponent.cmpType === 'image') {
                    vm.selectedImageComponent = selectedComponent;
                }
            }
        });
    }
})();
