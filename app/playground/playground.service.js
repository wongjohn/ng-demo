(function () {
    'use strict';

    angular
        .module('app.playground')
        .service('playgroundService', playgroundService);

    /* @ngInject */
    function playgroundService($http, exception) {
        return {
            getStartGuide: function getStartGuide() {
                //return $http.get('/api/start-guide')
                //    .then(success)
                //    .catch(fail);
                return $http.get('/start-guide.json')
                    .then(success)
                    .catch(fail);


                function success(response) {
                    return response.data;
                }

                function fail(e) {
                    return exception.catcher('获取新手引导出错')(e);
                }
            }
        };
    }
})();
