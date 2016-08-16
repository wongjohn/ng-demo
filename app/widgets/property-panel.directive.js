(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('propertyPanel', propertyPanel)
        .controller('PropertyPanelController', PropertyPanelController);

    /* @ngInject */
    function propertyPanel() {
        var directive = {
            restrict: 'E',
            scope: true,
            controller: 'PropertyPanelController',
            controllerAs: 'vm',
            templateUrl: 'app/widgets/property-panel.html'
        };
        return directive;
    }

    /* @ngInject */
    function PropertyPanelController($scope, currentStateService) {
        var vm = this;

        $scope.$watch(function () {
            vm.currentPage = currentStateService.currentPage();
        });
    }
})();
