(function () {
    'use strict';

    angular
        .module('app.components')
        .directive('components', components)
        .controller('ComponentsController', ComponentsController);

    /* @ngInject */
    function components() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/components.html',
            controller: 'ComponentsController',
            compile: function (tElement, tAttrs) {
                if(!angular.isDefined(tAttrs.inEditor)) {
                    tElement.html('<component ng-repeat="component in components"></component>');
                }
            },
            scope: {
                components: '=data'
            }
        };
        return directive;
    }

    /* @ngInject */
    function ComponentsController($scope, $attrs, currentStateService) {
        if(angular.isDefined($attrs.inEditor)) {
            initComponentEntity();
            $scope.$on('switchToPage', function () {
                initComponentEntity();
            });
        }
        function initComponentEntity() {
            $scope.entities = currentStateService.allComponents();
            if(currentStateService.currentPage() && currentStateService.currentPage().cmps) {
                currentStateService.currentPage().cmps.forEach(function (component) {
                    $scope.entities.push({
                        data: component,
                        isSelected: false
                    });
                });
            }
        }
    }
})();
