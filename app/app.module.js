(function () {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.layout',
        'app.common',
        'app.editor',
        'app.dashboard',
        'app.playground',
        'app.components'
    ]).config(config);

    /* @ngInject */
    function config($uibTooltipProvider) {
        $uibTooltipProvider.options({
            appendToBody: true
        });
    }
})();
