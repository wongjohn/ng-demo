(function () {
    'use strict';

    angular
        .module('app.components')
        .service('componentService', componentService);

    /* @ngInject */
    function componentService(currentStateService, selectionService) {
        var service = {
            addComponent: _addComponent,
            removeComponent: _removeComponent,
            deleteSelectedComponents: _deleteSelectedComponents
        };
        return service;

        function _addComponent(component, editing) {
            var entity = {
                data: component,
                isSelected: true,
                editing: !!editing
            };
            currentStateService.addComponent(entity);
            selectionService.selectThisAndCloseOthers(entity);
        }

        function _removeComponent(entity) {
            currentStateService.removeComponent(entity);
        }

        function _deleteSelectedComponents() {
            var allSelectedComponents = selectionService.allSelections();
            allSelectedComponents.forEach(function (selectedEntity) {
                currentStateService.removeComponent(selectedEntity);
            });
            selectionService.clear();
        }
    }
})();
