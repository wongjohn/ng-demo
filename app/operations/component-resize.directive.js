/* 组件大小调整 */
(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('componentResize', componentResize)
        .value('Cursor', {
            RESIZE_W : 'w-resize',
            RESIZE_E : 'e-resize',
            RESIZE_N : 'n-resize',
            RESIZE_S : 's-resize',
            RESIZE_SE: 'se-resize',
            RESIZE_SW: 'sw-resize',
            RESIZE_NE: 'ne-resize',
            RESIZE_NW: 'nw-resize'
        })
        .service('multiComponentResize', multiComponentResize);


    /* @ngInject */
    function componentResize(multiComponentResize, gridGuideService, Cursor) {
        var barN = '<div class="bar bar-n"><div class="bar-radius"></div></div>',
            barS = '<div class="bar bar-s"><div class="bar-radius"></div></div>',
            barE = '<div class="bar bar-e"><div class="bar-radius"></div></div>',
            barW = '<div class="bar bar-w"><div class="bar-radius"></div></div>',
            barNE = '<div class="bar bar-ne bar-radius"></div>',
            barNW = '<div class="bar bar-nw bar-radius"></div>',
            barSE = '<div class="bar bar-se bar-radius"></div>',
            barSW = '<div class="bar bar-sw bar-radius"></div>';
        var directive = {
            restrict: 'A',
            link: function($scope, $element) {
                var $barE = $(barE),
                    $barW = $(barW);

                $element
                    .append($barE)
                    .append($barW);

                resize($barE, Cursor.RESIZE_E, $scope);
                resize($barW, Cursor.RESIZE_W, $scope);

                if($scope.component.cmpType === 'text') {
                    $element
                        .append($('<div class="bar bar-n"></div>'))
                        .append($('<div class="bar bar-s"></div>'));
                } else {
                    var $barN = $(barN),
                        $barS = $(barS),
                        $barNE = $(barNE),
                        $barNW = $(barNW),
                        $barSE = $(barSE),
                        $barSW = $(barSW);

                    $element
                        .append($barN)
                        .append($barS)
                        .append($barNE)
                        .append($barNW)
                        .append($barSE)
                        .append($barSW);

                    resize($barN, Cursor.RESIZE_N, $scope);
                    resize($barS, Cursor.RESIZE_S, $scope);
                    resize($barNE, Cursor.RESIZE_NE, $scope);
                    resize($barNW, Cursor.RESIZE_NW, $scope);
                    resize($barSE, Cursor.RESIZE_SE, $scope);
                    resize($barSW, Cursor.RESIZE_SW, $scope);
                }

            }
        };
        return directive;

        function resize(barElement, cursor, $scope) {
            var hm = new Hammer(barElement.get(0));
            hm.get('pan').set({
                threshold: 0, direction: Hammer.DIRECTION_ALL
            });
            hm.on('panstart', function() {
                multiComponentResize.resizeStart();
                gridGuideService.guide.start({
                    action: 'resize'
                });
            });
            hm.on('panmove', function(event) {
                var boundTranslate = multiComponentResize.resizeMove(cursor, event);
                gridGuideService.guide.sync(boundTranslate);
            });
            hm.on('panend', function() {
                gridGuideService.guide.stop();
                $scope.$apply(multiComponentResize.resizeEnd);
            });
        }
    }

    /* @ngInject */
    function multiComponentResize(Cursor, selectionService, currentStateService) {
        var width, height, minWidth = 1, minHeight = 1,minimumWidth, minimumHeight,
            editAreaWidth = 320,
            editAreaHeight = 504;
        var bigPointA = null, bigPointB = null;

        var _multiComponentResize = {};
        _multiComponentResize.selectedComponents = [];//所有选中的可缩放元素

        _multiComponentResize.initCollisionDetectorWithElements = function () {
            currentStateService.updateComponentsEntity();
            selectionService.updateSelectedComponentsDetectionBoxPoints();
            //同步选中的元素到selectedComponents
            _multiComponentResize.selectedComponents = [];
            selectionService.allSelections().forEach(function (entity) {
                _multiComponentResize.selectedComponents.push(entity);
            });
        };
        _multiComponentResize.resizeStart = function () {
            _multiComponentResize.initCollisionDetectorWithElements();
            bigPointA = selectionService.bigDetectionBoxPointA;
            bigPointB = selectionService.bigDetectionBoxPointB;
            minimumWidth = selectionService.minimumWidth;
            minimumHeight = selectionService.minimumHeight;
        };
        _multiComponentResize.checkMinHeight = function (translate, sign, minimumHeight, minHeight) {//最小高度检查
            var reachToMinHeightDelta = Math.floor(minimumHeight - minHeight);
            if(translate.deltaY * sign > reachToMinHeightDelta) {
                translate.deltaY = reachToMinHeightDelta * sign;
            }
            return this;
        };
        _multiComponentResize.checkMinWidth = function (translate, sign, minimumWidth, minWidth) {//最小宽度检查
            var reachToMinWidthDelta = Math.floor(minimumWidth - minWidth);
            if(translate.deltaX * sign > reachToMinWidthDelta) {
                translate.deltaX = reachToMinWidthDelta * sign;
            }
            return this;
        };
        _multiComponentResize.compResizeWithRatio = function (translate, cursor) {
            //如果是按照比例缩放，则重新计算宽高的变化量(边界检测):变化量为不超出边界的、可接受的公共变化量
            switch (cursor) {
                case Cursor.RESIZE_SE:
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {//都可以接受的移动距离deltaY
                        var _deltaX = parseInt(translate.deltaY * entity.ratio, 10), _deltaY = translate.deltaY,
                            _translate = {
                                deltaX: _deltaX, deltaY: _deltaY
                            };
                        _multiComponentResize.checkMinHeight(_translate, -1, entity.elementHeight, minHeight)
                            .checkMinWidth(_translate, -1, entity.elementWidth, minWidth);

                        if(_deltaX !== _translate.deltaX) {
                            _deltaY = _translate.deltaX / entity.ratio;
                            _translate.deltaY = (Math.abs(_deltaY) < Math.abs(_translate.deltaY)) ? _deltaY : _translate.deltaY;//取Y的更小变化值
                        }
                        translate.deltaY = _translate.deltaY;
                        translate.deltaX = _translate.deltaX;
                    });
                    break;
                case Cursor.RESIZE_SW:
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var _deltaX = parseInt(-translate.deltaY * entity.ratio, 10), _deltaY = translate.deltaY,
                            _translate = {
                                deltaX: _deltaX, deltaY: _deltaY
                            };
                        _multiComponentResize.checkMinHeight(_translate, -1, entity.elementHeight, minHeight)
                            .checkMinWidth(_translate, 1, entity.elementWidth, minWidth);

                        if(_deltaX !== _translate.deltaX) {
                            _deltaY = -_translate.deltaX / entity.ratio;
                            _translate.deltaY = (Math.abs(_deltaY) < Math.abs(_translate.deltaY)) ? _deltaY : _translate.deltaY;//取Y的更小变化值
                        }
                        translate.deltaY = _translate.deltaY;
                        translate.deltaX = _translate.deltaX;
                    });
                    break;
                case Cursor.RESIZE_NE:
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var _deltaX = parseInt(-translate.deltaY * entity.ratio, 10), _deltaY = translate.deltaY,
                            _translate = {
                                deltaX: _deltaX, deltaY: _deltaY
                            };

                        _multiComponentResize.checkMinHeight(_translate, 1, entity.elementHeight, minHeight)
                            .checkMinWidth(_translate, -1, entity.elementWidth, minWidth);

                        if(_deltaX !== _translate.deltaX) {
                            _deltaY = -_translate.deltaX / entity.ratio;
                            _translate.deltaY = (Math.abs(_deltaY) < Math.abs(_translate.deltaY)) ? _deltaY : _translate.deltaY;//取Y的更小变化值
                        }
                        translate.deltaY = _translate.deltaY;
                        translate.deltaX = _translate.deltaX;
                    });
                    break;
                case Cursor.RESIZE_NW:
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var _deltaX = parseInt(translate.deltaY * entity.ratio, 10), _deltaY = translate.deltaY,
                            _translate = {
                                deltaX: _deltaX, deltaY: _deltaY
                            };
                        _multiComponentResize.checkMinHeight(_translate, 1, entity.elementHeight, minHeight)
                            .checkMinWidth(_translate, 1, entity.elementWidth, minWidth);

                        if(_deltaX !== _translate.deltaX) {
                            _deltaY = _translate.deltaX / entity.ratio;
                            _translate.deltaY = (Math.abs(_deltaY) < Math.abs(_translate.deltaY)) ? _deltaY : _translate.deltaY;//取Y的更小变化值
                        }
                        translate.deltaY = _translate.deltaY;
                        translate.deltaX = _translate.deltaX;
                    });
                    break;
            }
            return this;
        };
        _multiComponentResize.resizeMove = function (cursor, event) {
            var translate = {
                deltaX: event.deltaX, deltaY: event.deltaY
            };
            var boundTranslate = null;
            switch (cursor) {
                case Cursor.RESIZE_W:
                    _multiComponentResize.checkMinWidth(translate, 1, minimumWidth, minWidth);
                    boundTranslate = {
                        x: translate.deltaX, y: 0, width: -translate.deltaX, height: 0
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        entity.element.css({
                            left: entity.left + translate.deltaX,
                            width: entity.elementWidth - translate.deltaX
                        });
                    });
                    break;
                case Cursor.RESIZE_E:
                    _multiComponentResize.checkMinWidth(translate, -1, minimumWidth, minWidth);
                    boundTranslate = {
                        x: 0, y: 0, width: translate.deltaX, height: 0
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        entity.element.css('width', entity.elementWidth + translate.deltaX);
                    });
                    break;
                case Cursor.RESIZE_N:
                    _multiComponentResize.checkMinHeight(translate, 1, minimumHeight, minHeight);
                    boundTranslate = {
                        x: 0, y: translate.deltaY, width: 0, height: -translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        entity.element.css({
                            top: entity.top + translate.deltaY,
                            height: entity.elementHeight - translate.deltaY
                        });
                    });
                    break;
                case Cursor.RESIZE_S:
                    _multiComponentResize.checkMinHeight(translate, -1, minimumHeight, minHeight);
                    boundTranslate = {
                        x: 0, y: 0, width: 0, height: translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        entity.element.css('height', entity.elementHeight + translate.deltaY);
                    });
                    break;
                case Cursor.RESIZE_SE:
                    _multiComponentResize.compResizeWithRatio(translate, cursor);
                    boundTranslate = {
                        x: 0, y: 0, width: translate.deltaX, height: translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var newHeight = entity.elementHeight + translate.deltaY, newWidth = newHeight * entity.ratio;
                        entity.element.css({
                            height: newHeight,
                            width: newWidth
                        });
                    });
                    break;
                case Cursor.RESIZE_SW:
                    _multiComponentResize.compResizeWithRatio(translate, cursor);
                    boundTranslate = {
                        x: translate.deltaX, y: 0, width: -translate.deltaX, height: translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var newHeight = entity.elementHeight + translate.deltaY, newWidth = newHeight * entity.ratio;
                        entity.element.css({
                            left: entity.left - (newWidth - entity.elementWidth),
                            height: newHeight,
                            width: newWidth
                        });
                    });
                    break;
                case Cursor.RESIZE_NE:
                    _multiComponentResize.compResizeWithRatio(translate, cursor);
                    boundTranslate = {
                        x: 0, y: translate.deltaY, width: translate.deltaX, height: -translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var newHeight = entity.elementHeight - translate.deltaY, newWidth = newHeight * entity.ratio;
                        entity.element.css({
                            top: entity.top + translate.deltaY,
                            height: newHeight,
                            width: newWidth
                        });
                    });
                    break;
                case Cursor.RESIZE_NW:
                    _multiComponentResize.compResizeWithRatio(translate, cursor);
                    boundTranslate = {
                        x: translate.deltaX, y: translate.deltaY, width: -translate.deltaX, height: -translate.deltaY
                    };
                    angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                        var newHeight = entity.elementHeight - translate.deltaY, newWidth = newHeight * entity.ratio;
                        entity.element.css({
                            top: entity.top + translate.deltaY,
                            left: entity.left - (newWidth - entity.elementWidth),
                            height: newHeight,
                            width: newWidth
                        });
                    });
                    break;
            }
            return boundTranslate;
        };
        _multiComponentResize.resizeEnd = function () {
            angular.forEach(_multiComponentResize.selectedComponents, function (entity) {
                var $element = entity.element,
                    position = $element.position();

                angular.extend(entity.data.style, {
                    width: $element.width(),
                    height: $element.height(),
                    left: position.left,
                    top: position.top
                });
            });
        };
        return _multiComponentResize;
    }
})();
