(function () {
    'use strict';

    angular
        .module('app.editor')
        .directive('pageList', pageList);

    /* @ngInject */
    function pageList() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/layout/page-list.html',
            scope: true,
            controller: PageListController,
            controllerAs: 'vm'
        };
        return directive;
    }

    /* @ngInject */
    function PageListController(currentStateService, $timeout) {
        var vm = this;

        vm.pages = currentStateService.allPages();
        vm.isCurrentPageSelected = function (page) {
            return page === currentStateService.currentPage();
        };
        vm.switchToPage = function (page) {
            if(page !== currentStateService.currentPage()) {
                currentStateService.switchToPage(page);
            }
        };
        vm.copy = function (page) {
            var index = vm.pages.indexOf(page),
                _copy = angular.copy(page);

            if(index !== -1) {
                vm.pages.splice(index + 1, 0, _copy);
                $timeout(function () {
                    vm.switchToPage(_copy);
                });
            }
        };
        vm.new = function (page) {
            var index = vm.pages.indexOf(page);

            if(index !== -1) {
                var newPage = {
                    cmps: []
                };
                vm.pages.splice(index + 1, 0, newPage);
                $timeout(function () {
                    vm.switchToPage(newPage);
                });
            }
        };
        vm.remove = function (page) {
            var index = vm.pages.indexOf(page);

            if(index !== -1) {
                vm.pages.splice(index, 1);
                var step = index >= vm.pages.length ? 0 : index;
                vm.switchToPage(vm.pages[step]);
            }
        };
    }
})();
