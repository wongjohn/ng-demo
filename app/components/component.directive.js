(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('component', component)
        .filter('trailer', trailer);

    /* @ngInject */
    function component() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/component.html',
            compile: function (tElement, tAttrs) {
                if(!angular.isDefined(tAttrs.inEditor)) {
                    tElement.html('<div class="trailer" ng-style="component.style | trailer">\n    <div class="surface" component-surface></div>\n</div>');
                }
            }
        };
        return directive;
    }

    /* @ngInject */
    function trailer() {
        return function (style) {
            return {
                position: 'absolute',
                left: style.left || 0,
                top: style.top || 0,
                width: style.width || 'auto',
                height: style.height || 'auto',
                transform: style.transform || 'initial',
                overflow: 'hidden'
            };
        };
    }

})();
