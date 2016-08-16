(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('componentRotate', componentRotate);

    /* @ngInject */
    function componentRotate() {
        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        function link($scope, $element, $attrs) {
            var center = {};
            var angle;
            var hm = new Hammer($element.get(0));
            hm.get('pan').set({
                threshold: 0
            });
            hm.on('panstart', function() {
                center = {
                    x: $scope.entity.element.offset().left + $scope.entity.element.width() / 2,
                    y: $scope.entity.element.offset().top + $scope.entity.element.height() / 2
                };
            });
            hm.on('panmove', function(event) {
                var endPoint = event.center;
                var ox = endPoint.x - center.x;
                var oy = endPoint.y - center.y;
                var to = Math.abs(ox / oy);
                angle = Math.atan(to) / (2 * Math.PI) * 360;
                if(ox > 0 && oy < 0) { // 右上角，1象限
                    angle = 360 + angle;
                }
                else if(ox > 0 && oy > 0) { // 右下角，4象限
                    angle = 180 - angle;
                }
                else if(ox < 0 && oy > 0) { // 左下角，3象限
                    angle = 180 + angle;
                }
                else if(ox < 0 && oy < 0) { // 左上角，2象限
                    angle = 360 - angle;
                }
                if(angle > 360) {
                    angle = angle - 360;
                }
                $scope.entity.element
                    .css({
                        transform: 'rotateZ(' + angle + 'deg)'
                    });
            });
            hm.on('panend', function() {
                $scope.$apply(function () {
                    $scope.entity.data.style.transform = 'rotateZ(' + angle + 'deg)';
                });
            });
        }
    }
})();
