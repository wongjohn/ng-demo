(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('componentDrag', componentDrag);

    function componentDrag() {
        var directive = {
            restrict: 'A',
            require: '^multiComponentDrag',
            link: _componentDrag
        };

        return directive;

        function _componentDrag($scope, $element, $attrs, multiCompDragCtrl) {
            var hm = new Hammer($element.get(0));
            hm.get('pan').set({
                threshold: 0
            });
            hm.on('panstart', function(event) {
                event.preventDefault();
                event.srcEvent.preventDefault();
                multiCompDragCtrl.compDragStart();
            });
            hm.on('panmove', function(event) {
                event.preventDefault();
                multiCompDragCtrl.compDragMove(event);
            });
            hm.on('panend', function(event) {
                multiCompDragCtrl.compDragEnd(event);
                $(event.srcEvent.target).one('click', function(e) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
            });
        }
    }
})();
