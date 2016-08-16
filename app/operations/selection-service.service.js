(function () {
    'use strict';

    angular
        .module('app.operations')
        .service('selectionService', selectionService);

    /* @ngInject */
    function selectionService (Point) {
        var _selectionService = {
                addSelection: _addSelection,
                removeSelection: _removeSelection,
                selectThisAndCloseOthers: _selectThisAndCloseOthers,
                allSelections: _allSelections,
                clear: _clear,
                isAnyComponentSelected: _isAnyComponentSelected,
                updateSelectedComponentsDetectionBoxPoints: _updateSelectedComponentsDetectionBoxPoints,
                bigDetectionBoxPointA: null,
                bigDetectionBoxPointB: null,
                bigDetectionBoxPointO: null,
                minimumWidth: null,
                minimumHeight: null
            },
            _selectedEntities = [],
            DESIGN_WIDTH = 320, DESIGN_HEIGHT = 504;

        return _selectionService;

        /**
         * 选中传入的组件
         * @param entity
         * @private
         */
        function _addSelection(entity) {
            entity.isSelected = true;
            entity.element.addClass('selected');
            if(_selectedEntities.indexOf(entity) === -1) {
                _selectedEntities.push(entity);
            }
        }

        /**
         * 取消选中传入的组件
         * @param entity
         * @private
         */
        function _removeSelection(entity) {
            entity.isSelected = false;
            entity.element.removeClass('selected');
            var _index = _selectedEntities.indexOf(entity);
            if(_index !== -1) {
                _selectedEntities.splice(_index, 1);
            }
        }

        /**
         * 选中当前组件，取消选中其他组件
         * @param entity
         * @private
         */
        function _selectThisAndCloseOthers(entity) {
            _clear();

            entity.isSelected = true;
            _selectedEntities.push(entity);
        }

        /**
         * 得到所有选中的组件
         * @returns {Array}
         * @private
         */
        function _allSelections() {
            return _selectedEntities;
        }

        /**
         * 清空选中的组件
         * @private
         */
        function _clear() {
            _selectedEntities.forEach(function (_entity) {
                _entity.isSelected = false;
            });
            _selectedEntities = [];
        }

        /**
         * 判断有没有任何一个元素被选中
         * @returns {boolean}
         * @private
         */
        function _isAnyComponentSelected() {
            return !!_selectedEntities.length;
        }

        /**
         * 更新
         * @private
         */
        function _updateSelectedComponentsDetectionBoxPoints() {
            _selectionService.bigDetectionBoxPointA = new Point(DESIGN_WIDTH, DESIGN_HEIGHT);
            _selectionService.bigDetectionBoxPointB = new Point(0, 0);
            _selectionService.minimumWidth = DESIGN_WIDTH;
            _selectionService.minimumHeight = DESIGN_HEIGHT;
            angular.forEach(_selectedEntities, function (entity) {
                _selectionService.bigDetectionBoxPointA.detectionPointA(entity.startPointA);
                _selectionService.bigDetectionBoxPointB.detectionPointB(entity.startPointB);
                _selectionService.minimumWidth = entity.elementWidth;
                _selectionService.minimumHeight = entity.elementHeight;
            });
            var ox = (_selectionService.bigDetectionBoxPointA.x + _selectionService.bigDetectionBoxPointB.x) / 2,
                oy = (_selectionService.bigDetectionBoxPointA.y + _selectionService.bigDetectionBoxPointB.y) / 2;
            _selectionService.bigDetectionBoxPointO = new Point(ox, oy);
        }
    }
})();
