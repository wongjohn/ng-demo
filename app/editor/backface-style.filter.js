(function () {
    'use strict';

    angular
        .module('app.editor')
        .filter('backfaceStyle', backfaceStyle);

    /* @ngInject */
    function backfaceStyle() {
        return function (page) {
            var _backgroundStyle = {};
            if(page) {
                _backgroundStyle.background = 'url(' + page.bgimage  +')';
            }
            return _backgroundStyle;
        };
    }
})();
