(function () {
    'use strict';

    angular.module('app.components')
        .directive('componentAnimation', componentAnimation);

    /* @ngInject */
    function componentAnimation() {
        return function ($scope, $element) {
            playComponentAnimation();

            $scope.$on('playStageAnimation', function () {
                playComponentAnimation();
            });

            $scope.$on('playComponentAnimation', function (event, entity) {
                if($scope.entity === entity) {
                    playComponentAnimation();
                }
            });

            $scope.$on('playSelectedAnimation', function (event, entity, animation) {
                if($scope.entity === entity) {
                    playAllAnimations($element, [animation]);
                }
            });

            function playComponentAnimation() {
                var animations = $scope.component.animation;
                playAllAnimations($element, animations);
            }
        };
        //播放所有动画
        function playAllAnimations($element, animations) {
            if(!animations.length) {
                return;
            }
            playNextAnimation($element, animations, 0);
        }
        //播放下一个动画
        function playNextAnimation($element, animations, currentIndex) {
            if(!currentIndex) {
                $element.addClass('animated');
            }
            if(currentIndex >= animations.length) {
                $element.removeClass('animated')
                    .css('animation', 'resetAnimate 0s 0s forwards');
                return;
            }
            var currentAnimation = animations[currentIndex];
            $element.css('animation',
                currentAnimation.name + ' ' +
                (currentAnimation.duration || 1) + 's ' +
                (currentAnimation.delay || 0) + 's 1 both'
            );
            $element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                playNextAnimation($element, animations, ++currentIndex);
            });
        }
    }
})();
