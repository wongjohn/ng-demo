(function () {
    'use strict';

    angular
        .module('app.surface')
        .directive('imageSurface', imageSurface)
        .controller('ImageSurfaceController', ImageSurfaceController);

    /* @ngInject */
    function imageSurface() {
        var directive = {
            restrict: 'EA',
            scope: true,
            template: '<div></div>',
            controller: 'ImageSurfaceController',
            controllerAs: 'vm'
        };

        return directive;
    }

    /* @ngInject */
    function ImageSurfaceController($scope, $element, $compile) {
        var vm = this;

        var $component = $('<img class="image-surface" src="' + $scope.component.file.key + '"></img>');
        $element.append($component.addClass('image-surface'));
    }
})();
