(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('pageThumbnail', pageThumbnail);

    function pageThumbnail() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/page-thumbnail.html',
            scope: {
                page: '=data'
            }
        };

        return directive;
    }
})();
