(function () {
    'use strict';

    angular
        .module('app.editor')
        .directive('tickmark', tickmark);

    /* @ngInject */
    function tickmark() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/editor/tickmark.html'
        };

        return directive;
    }
})();
