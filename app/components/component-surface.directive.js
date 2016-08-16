(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('componentSurface', componentSurface);

    /* @ngInject */
    function componentSurface($timeout, $compile) {
        return {
            restrict: 'EA',
            link: link
        };

        function link($scope, $element) {
            switch($scope.component.cmpType) {
                case 'text':
                    $element.append($compile('<text-surface></text-surface>')($scope));
                    break;
                case 'image':
                    $element.append($compile('<image-surface></image-surface>')($scope));
                    break;
                case 'shape':
                    $element.append($compile('<shape-surface></shape-surface>')($scope));
                    break;
                default:
                    $element.append($('<div>TODO</div>'));
            }

            $element.bind('click mousedown keydown contextmenu', function (event){
                event.stopPropagation();
            });

            if($scope.entity && $scope.entity.editing) {
                $timeout($scope.editThisComponent);
            }
        }
    }
})();
