(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('multiComponentDrag', multiComponentDrag)
        .controller('MultiComponentDragController', MultiComponentDragController);

    /* @ngInject */
    function multiComponentDrag() {
        var directive = {
            restrict: 'A',
            controller: 'MultiComponentDragController'
        };
        return directive;
    }

    /* @ngInject */
    function MultiComponentDragController(selectionService, $scope, currentStateService, gridGuideService) {
        var vm = this;
        vm.isKeyboard = false;
        //组件移动开始
        vm.compDragStart = function (noOpacity) {
            //如果没有选中的内容，则不再移动
            if(!selectionService.isAnyComponentSelected()) {
                return;
            }

            currentStateService.updateComponentsEntity();
            gridGuideService.guide.start({
                action: 'move'
            });

            vm.isKeyboard = !!noOpacity;
            if(vm.isKeyboard) {
                return;
            }
            angular.forEach(selectionService.allSelections(), function (selectedEntity) {
                selectedEntity.element.addClass('component-drag');
            });
        };
        //组件移动中
        vm.compDragMove = function (event) {
            //如果没有选中的内容，则不再移动
            if(!selectionService.isAnyComponentSelected()) {
                return;
            }
            var translate = {
                x: event.deltaX, y: event.deltaY
            };
            if(!vm.isKeyboard && gridGuideService.guide.options.snap) {
                gridGuideService.guide.enforceGuides(translate);
            }
            angular.forEach(selectionService.allSelections(), function (selectedEntity) {
                var value = 'translate3d(' + translate.x + 'px, ' + translate.y + 'px, 0) rotateZ(' + selectedEntity.angle + 'deg)';
                selectedEntity.element.css('transform', value);
            });
            gridGuideService.guide.sync(translate);
        };
        //组件移动结束
        vm.compDragEnd = function (delta) {
            //如果没有选中的内容，则不再移动
            if(!selectionService.isAnyComponentSelected()) {
                return;
            }

            angular.forEach(selectionService.allSelections(), function (selectedEntity) {
                selectedEntity.element.removeClass('component-drag');
            });

            var translate = {
                x: delta.deltaX, y: delta.deltaY
            };
            if(!vm.isKeyboard && gridGuideService.guide.options.snap) {
                gridGuideService.guide.enforceGuides(translate);
            }
            $scope.$apply(function () {
                angular.forEach(selectionService.allSelections(), function (selectedEntity) {
                    var value = 'translate3d(0, 0, 0) rotateZ(' + selectedEntity.angle + 'deg)';
                    selectedEntity.element.css('transform', value);
                    selectedEntity.moveBy(translate);
                });
            });
            gridGuideService.guide.stop();
        };
    }
})();
