(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('animatePanel', animatePanel)
        .controller('AnimatePanelController', AnimatePanelController);

    /* @ngInject */
    function animatePanel() {
        var directive = {
            restrict: 'EA',
            scope: true,
            controller: 'AnimatePanelController',
            controllerAs: 'vm',
            templateUrl: 'app/widgets/animate-panel.html'
        };
        return directive;
    }

    /* @ngInject */
    function AnimatePanelController($scope, $timeout, $rootScope, selectionService, animationService) {
        var vm = this;

        $scope.$watch(function () {
            var _allSelections = selectionService.allSelections();
            if(_allSelections.length === 1) {
                vm.animations = _allSelections[0].data.animation;
            }
        });

        vm.addAnimation = function () {
            vm.animations.push({});
            $timeout(function () {
                $scope.$broadcast('showLastAnimationEditor');
            }, 0);
        };

        vm.playAnimation = function () {
            $rootScope.$broadcast('playComponentAnimation', selectionService.allSelections()[0]);
        };

        vm.deleteAnimation = function (animation, $event) {
            $event.preventDefault();
            var index = vm.animations.indexOf(animation);
            if(index !== -1) {
                vm.animations.splice(index, 1);
            }
        };

        vm.enterAnimation = animationService.enterAnimation;
        vm.emhpasisAnimation = animationService.emphasisAnimation;
        vm.exitAnimation = animationService.exitAnimation;
    }
})();
