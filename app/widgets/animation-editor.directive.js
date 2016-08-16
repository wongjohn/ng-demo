(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('animationEditor', animationEditor);

    /* @ngInject */
    function animationEditor($rootScope, selectionService) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/animation-editor.html',
            link: function ($scope) {
                $scope.$on('showLastAnimationEditor', function () {
                    $scope.status.isOpen = $scope.$last;
                });
                $scope.applyAnimation = function (animationName) {
                    $scope.animation.name = animationName;
                    $rootScope.$broadcast('playSelectedAnimation', selectionService.allSelections()[0], $scope.animation);
                };
            }
        };
        return directive;
    }
})();
