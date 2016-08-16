(function () {
    'use strict';

    angular
        .module('app.widgets')
        .value('enterAnimation', [//进入
            {animate: 'fadeInDown', name: '从上淡入', klass: 'animate-fade-in-down'},
            {animate: 'fadeInRight', name: '从左淡入', klass: 'animate-fade-in-right'},
            {animate: 'fadeInLeft', name: '从右淡入', klass: 'animate-fade-in-up'},
            {animate: 'fadeInUp', name: '从下淡入', klass: 'animate-fade-in-left'},
            {animate: 'bounceInUp', name: '从上飞入', klass: 'animate-bounce-in-up'},
            {animate: 'bounceInLeft', name: '从左飞入', klass: 'animate-bounce-in-left'},
            {animate: 'bounceInRight', name: '从右飞入', klass: 'animate-bounce-in-down'},
            {animate: 'bounceInDown', name: '从下飞入', klass: 'animate-bounce-in-right'},
            {animate: 'slideDown', name: '从上弹入', klass: 'animate-slide-down'},
            {animate: 'slideRight', name: '从左弹入', klass: 'animate-slide-right'},
            {animate: 'slideLeft', name: '从右弹入', klass: 'animate-slide-up'},
            {animate: 'slideUp', name: '从下弹入', klass: 'animate-slide-left'},
            {animate: 'rotateInDownRight', name: '右上旋入', klass: 'animate-rotate-in-down-left'},
            {animate: 'rotateInUpLeft', name: '右下旋入', klass: 'animate-rotate-in-up-left'},
            {animate: 'rotateInUpRight', name: '左下旋入', klass: 'animate-rotate-in-up-right'},
            {animate: 'rotateInDownLeft', name: '左上旋入', klass: 'animate-rotate-in-down-right'},
            {animate: 'fadeIn', name: '淡入', klass: 'animate-fade-in'},
            {animate: 'bounceIn', name: '飞入', klass: 'animate-bounce-in'},
            {animate: 'translate', name: '正向旋转', klass: 'animate-translate'},
            {animate: 'translateReverse', name: '逆向旋转', klass: 'animate-translate-reverse'},
            {animate: 'zoomIn', name: '从小到大', klass: 'animate-zoom-in'},
            {animate: 'zoomOut', name: '从大到小', klass: 'animate-zoom-out'},
            {animate: 'bounceOut', name: '弹性放大', klass: 'animate-bounce-out'}
        ])
        .value('emphasisAnimation', [//强调
            {animate: 'rotate2d', name: '旋转2D', klass: 'animate-rotate-2d'},
            {animate: 'shake', name: '抖动', klass: 'animate-shake'},
            {animate: 'float2', name: '左右浮动', klass: 'animate-float2'},
            {animate: 'float', name: '上下浮动', klass: 'animate-float'},
            {animate: 'flash', name: '闪烁', klass: 'animate-flash'},
            {animate: 'wobble', name: '左右摇摆', klass: 'animate-wobble'},
            {animate: 'tada', name: 'Q弹晃动', klass: 'animate-tada'}
        ])
        .value('exitAnimation', [//退出
            {animate: 'fadeOutDown', name: '从上淡出', klass: 'animate-fadeOutDown'},
            {animate: 'fadeOutRight', name: '从左淡出', klass: 'animate-fadeOutLeft'},
            {animate: 'fadeOutLeft', name: '从右淡出', klass: 'animate-fadeOutRight'},
            {animate: 'fadeOutUp', name: '向下淡出', klass: 'animate-fadeOutUp'},
            {animate: 'fadeOut', name: '淡出', klass: 'animate-fade-out'}
        ])
        .service('animationService', animationService)
        .filter('animationName', animationName);

    /* @ngInject */
    function animationService(enterAnimation, emphasisAnimation, exitAnimation) {
        var service = {
            enterAnimation: enterAnimation,
            emphasisAnimation: emphasisAnimation,
            exitAnimation: exitAnimation
        };
        return service;
    }

    /* @ngInject */
    function animationName(enterAnimation, emphasisAnimation, exitAnimation) {
        return function (animate) {
            var name = '无动画';
            [enterAnimation, emphasisAnimation, exitAnimation].forEach(function (animationGroup) {
                animationGroup.forEach(function (animation) {
                    if(animate === animation.animate) {
                        name = animation.name;
                    }
                });
            });
            return name;
        };
    }
})();
