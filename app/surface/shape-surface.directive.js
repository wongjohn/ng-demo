(function () {
    'use strict';

    angular
        .module('app.surface')
        .directive('shapeSurface', shapeSurface)
        .controller('ShapeSurfaceController', ShapeSurfaceController);

    /* @ngInject */
    function shapeSurface() {
        var directive = {
            restrict: 'EA',
            scope: true,
            template: '<div>TODO</div>',
            controller: 'ShapeSurfaceController',
            controllerAs: 'vm'
        };

        return directive;
    }

    /* @ngInject */
    function ShapeSurfaceController($scope, $element, $compile) {
        var vm = this;


    }
})();
