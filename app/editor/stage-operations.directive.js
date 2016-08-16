(function () {
    'use strict';

    angular
        .module('app.editor')
        .directive('stageOperations', stageOperations)
        .controller('StageOperationsController', StageOperationsController);

    /* @ngInject */
    function stageOperations() {
        var directive = {
            restrict: 'EA',
            scope: true,
            templateUrl: 'app/editor/stage-operations.html',
            controller: 'StageOperationsController',
            controllerAs: 'vm'
        };
        return directive;
    }

    /* @ngInject */
    function StageOperationsController($rootScope, logger) {
        var vm = this;

        vm.redo = function () {
            logger.info('TODO');
        };
        vm.undo = function () {
            logger.info('TODO');
        };
        vm.stageBackground = function () {
            logger.info('TODO');
        };
        vm.stageGrid = function () {
            logger.info('TODO');
        };
        vm.playStageAnimation = function() {
            $rootScope.$broadcast('playStageAnimation');
        };
    }
})();
