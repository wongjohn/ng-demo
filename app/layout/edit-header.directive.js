(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('editHeader', editHeader)
        .controller('EditHeaderController', EditHeaderController);

    /* @ngInject */
    function editHeader() {
        var directive = {
            restrict: 'EA',
            scope: true,
            controller: 'EditHeaderController',
            controllerAs: 'vm',
            templateUrl: 'app/layout/edit-header.html'
        };
        return directive;
    }

    /* @ngInject */
    function EditHeaderController($state, logger, componentService) {
        var vm = this;

        vm.exitEditor = function () {
            $state.go('dashboard');
        };

        /*组件添加*/
        vm.addTextComponent = function (fontSize) {//文本
            var _component = null;
            switch(fontSize) {
                case 12:
                    _component = {
                        cmpType: 'text',
                        name: '文字',
                        text: '<div style="font-size: 12px;">双击编辑文字</div>',
                        style: {
                            position: 'absolute',
                            left: 60,
                            top: 100,
                            width: 120,
                            'font-size': 12
                        },
                        animation: []
                    };
                    break;
                case 20:
                    _component = {
                        cmpType: 'text',
                        name: '文字',
                        text: '<div style="font-size: 20px;">双击编辑文字</div>',
                        style: {
                            position: 'absolute',
                            left: 60,
                            top: 100,
                            width: 120,
                            'font-size': 20
                        },
                        animation: []
                    };
                    break;
                case 32:
                    _component = {
                        cmpType: 'text',
                        name: '文字',
                        text: '<div style="font-size: 32px;">双击编辑文字</div>',
                        style: {
                            position: 'absolute',
                            left: 60,
                            top: 100,
                            width: 200,
                            'font-size': 32
                        },
                        animation: []
                    };
                    break;
            }

            componentService.addComponent(_component, true);

        };


        /*工作结果操作*/
        vm.save = function () {
            logger.info('TODO');
        };
        vm.preview = function () {
            logger.info('TODO');
        };
        vm.submit = function () {
            logger.info('TODO');
        }
    }
})();
