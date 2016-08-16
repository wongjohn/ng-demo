(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('componentEntity', componentEntity)
        .service('Point', pointService);

    /* @ngInject */
    function componentEntity(selectionService) {
        return function ($scope, $element) {
            angular.extend($scope.entity, {
                //data: $scope.component,
                element: $element,
                //isSelected: false,
                moveBy: _moveBy,
                initEntity: _initEntity,
                getID: _getID,
                measure: _measure
            });

            $scope.selectThisComponent = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if($event.ctrlKey || $event.shiftKey) {
                    selectionService.addSelection($scope.entity);
                } else {
                    selectionService.selectThisAndCloseOthers($scope.entity);
                }
            };

            function _initEntity() {
                //初始位置
                $scope.entity.startPosition = {
                    top: parseInt($scope.component.style.top, 10) || 0, left: parseInt($scope.component.style.left, 10) || 0
                };
                var rawElement = $element.get(0);
                var transformAngle = /[0-9]*[.]*[0-9]*deg/.exec(rawElement.style.transform || rawElement.style.webkitTransform || rawElement.style.mozTransform || rawElement.style.msTransform || rawElement.style.oTransform || '');//角度
                var angle = ((transformAngle && transformAngle.length) ? transformAngle[0] : '0');
                $scope.entity.angle = parseInt(angle, 10);
                $scope.entity.radian = $scope.entity.angle * 2 * Math.PI / 360;//弧度
                var elementWidth = $element.width(), elementHeight = $element.height();
                $scope.entity.elementWidth = elementWidth;
                $scope.entity.elementHeight = elementHeight;
                $scope.entity.left = $scope.entity.startPosition.left;
                $scope.entity.top = $scope.entity.startPosition.top;
                $scope.entity.ratio = elementWidth / elementHeight;
                $scope.entity.width = Math.abs(elementWidth * Math.cos($scope.entity.radian)) + Math.abs(elementHeight * Math.sin($scope.entity.radian));
                $scope.entity.height = Math.abs(elementWidth * Math.sin($scope.entity.radian)) + Math.abs(elementHeight * Math.cos($scope.entity.radian));

                var startPosition = $element.position();
                $scope.entity.startPointA = new Point(Math.ceil(startPosition.left), Math.ceil(startPosition.top));//A点
                $scope.entity.originPointA = new Point(startPosition.left, startPosition.top);
                $scope.entity.startPointB = $scope.entity.startPointA.add($scope.entity.width, $scope.entity.height);
                $scope.entity.originPointB = $scope.entity.originPointA.add($scope.entity.width, $scope.entity.height);
                $scope.entity.startPointO = $scope.entity.startPointA.middle($scope.entity.startPointB);
            }

            function _moveBy(translate) {
                $scope.component.style.left = $scope.entity.startPosition.left + translate.x;
                $scope.component.style.top = $scope.entity.startPosition.top + translate.y;
                _initEntity();
            }

            function _getID() {
                return $scope.component.id;
            }

            function _measure() {
                return {
                    x: $scope.entity.startPointA.x,
                    y: $scope.entity.startPointA.y,
                    width: $scope.entity.width,
                    height: $scope.entity.height
                };
            }
        };
    }

    function pointService() {
        return Point;
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (x, y) {//在坐标点基础上添加距离x、y
        return new Point(this.x + x, this.y + y);
    };
    Point.prototype.middle = function (point) {//两个坐标点之间的中点
        return new Point((this.x + point.x) / 2, (this.y + point.y) / 2);
    };
    Point.prototype.detectionPointA = function (pointA) {//左上角
        this.x = (pointA.x < this.x ? pointA.x : this.x);//最小的x坐标
        this.y = (pointA.y < this.y ? pointA.y : this.y);//最小的y坐标
    };
    Point.prototype.detectionPointB = function (pointB) {//右下角
        this.x = (pointB.x > this.x ? pointB.x : this.x);//最大的x坐标
        this.y = (pointB.y > this.y ? pointB.y : this.y);//最大的y坐标
    };
})();
