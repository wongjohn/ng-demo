(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('hotKey', hotKey);

    /* @ngInject */
    function hotKey(selectionService, componentService, $document) {
        return {
            restrict: 'A',
            link: link,
            require: '^multiComponentDrag'
        };

        function link($scope, $element, $attrs, multiCompDragCtrl) {
            $scope.$on('$destroy', function() {
                $document.unbind('keydown', _keydown);
                $document.unbind('keydown', _keyup);
            });
            var flag;
            var delta = {
                deltaX: 0, deltaY: 0
            };
            $document
                .keydown(_keydown)
                .keyup(_keyup);

            function _keydown (e) {
                //快捷键删除
                if('' + e.keyCode === '8' || '' + e.keyCode === '46') {
                    if(selectionService.allSelections().length) {
                        e.preventDefault();
                        $scope.$apply(function () {
                            componentService.deleteSelectedComponents();
                        });
                    }
                }

                //方向键移动
                if(['37', '38', '39', '40'].indexOf(('' + e.keyCode)) !== -1) {
                    if(selectionService.allSelections().length) {
                        e.preventDefault();
                    }
                    //获得组件元素
                    if(!flag) {
                        flag = true;
                        multiCompDragCtrl.compDragStart(delta);
                    }
                    var step = 1;
                    //更新元素位置
                    //press left
                    if('' + e.keyCode === '37') {
                        delta.deltaX -= step;
                        multiCompDragCtrl.compDragMove(delta);
                    } else if('' + e.keyCode === '38') {
                        //press up
                        delta.deltaY -= step;
                        multiCompDragCtrl.compDragMove(delta);
                        // upMoveComp(ids, limit);
                    } else if('' + e.keyCode === '39') {
                        //press right
                        delta.deltaX += step;
                        multiCompDragCtrl.compDragMove(delta);
                        // rightMoveComp(ids, limit);
                    } else if('' + e.keyCode === '40') {
                        //press down
                        delta.deltaY += step;
                        multiCompDragCtrl.compDragMove(delta);
                        // downMoveComp(ids, limit);
                    }
                }

                $scope.$apply();
            }

            function _keyup() {
                flag = false;
                //坐标有变化
                if(delta.deltaX || delta.deltaY) {
                    multiCompDragCtrl.compDragEnd(delta);
                }
                delta.deltaX = 0;
                delta.deltaY = 0;
                $scope.$apply();
            }
        }
    }
})();
