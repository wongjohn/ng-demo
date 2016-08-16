(function () {
    'use strict';

    angular
        .module('app.playground')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'playground',
                config: {
                    url: '/playground',
                    templateUrl: 'app/playground/playground.html',
                    controller: 'PlaygroundController',
                    controllerAs: 'vm'
                }
            }
        ];
    }
})();
