(function () {
    'use strict';

    angular
        .module('app.editor')
        .directive('editStage', editStage)
        .controller('EditStageController', EditStageController);

    /* @ngInject */
    function editStage() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/editor/edit-stage.html',
            scope: true,
            controller: 'EditStageController',
            controllerAs: 'vm'
        };
        return directive;
    }

    /* @ngInject */
    function EditStageController($scope, currentStateService) {
        var vm = this;
        vm.page = currentStateService.currentPage();
        $scope.$on('switchToPage', function (event, page) {
            vm.page = page;
        });
    }
})();
