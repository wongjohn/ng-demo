(function () {
    'use strict';

    angular
        .module('app.playground')
        .controller('PlaygroundController', PlaygroundController);

    /* @ngInject */
    function PlaygroundController(logger, currentStateService, playgroundService) {
        playgroundService.getStartGuide().then(function (data) {
            currentStateService.allPages(data);
        });

        activate();

        function activate() {
            logger.info('欢迎使用新手引导');
        }
    }
})();
