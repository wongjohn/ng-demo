(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('pageEditor', pageEditor);

    /* @ngInject */
    function pageEditor() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/layout/page-editor.html'
        };
        return directive;


    }
})();
