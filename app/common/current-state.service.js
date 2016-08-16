(function () {
    'use strict';

    angular
        .module('app.common')
        .service('currentStateService', currentStateService);

    /* @ngInject */
    function currentStateService($rootScope) {
        var current = {
                allPages: allPages,
                currentPage: currentPage,
                switchToPage: _switchToPage,
                currentPageComponents: _currentPageComponents,
                addComponent: _addComponent,
                removeComponent: _removeComponent,
                updateComponentsEntity: _updateComponentsEntity,
                allComponents: _getAllComponents
            },
            _allPages = [],
            _currentPage = {},
            _allComponents = [];

        return current;

        /**
         * 设置／获取所有页面数据
         * @param allPagesParam
         * @returns {*}
         */
        function allPages(allPagesParam) {
            if (allPagesParam) {
                angular.copy(allPagesParam, _allPages);
                currentPage(_allPages[0]);//默认选中第一页
                $rootScope.$broadcast('switchToPage', _allPages[0]);
                return current;
            } else {
                return _allPages;
            }
        }

        /**
         * 设置／获取当前编辑页数据
         * @param currentPageParam
         * @returns {*}
         */
        function currentPage(currentPageParam) {
            if (currentPageParam) {
                _currentPage = currentPageParam;
                return current;
            } else {
                return _currentPage;
            }
        }

        /**
         * 切换到传入的页面
         * @param page
         * @private
         */
        function _switchToPage(page) {
            currentPage(page);
            _allComponents = [];
            $rootScope.$broadcast('switchToPage', page);
        }

        /**
         * 获取当前编辑页的所有组件
         * @param component
         * @returns {Array}
         */
        function _currentPageComponents() {
            return _allComponents;
        }

        /**
         * 添加一个组件
         * @param component
         * @private
         */
        function _addComponent(component) {
            var _index = _allComponents.indexOf(component);
            if(_index === -1) {
                _allComponents.push(component);
            }
            _index = _currentPage.cmps.indexOf(component.data);
            if(_index === -1) {
                _currentPage.cmps.push(component.data);
            }
        }

        /**
         * 删除一个组件
         * @param component
         * @private
         */
        function _removeComponent(component) {
            var _index = _allComponents.indexOf(component);
            if(_index !== -1) {
                _allComponents.splice(_index, 1);
            }
            _index = _currentPage.cmps.indexOf(component.data);
            if(_index !== -1) {
                _currentPage.cmps.splice(_index, 1);
            }

        }

        /**
         * 更新各个组件位置、变换等参数状态
         * @private
         */
        function _updateComponentsEntity() {
            _allComponents.forEach(function (entity) {
                entity.initEntity();
            });
        }

        /**
         * 得到所有组件
         * @returns {Array}
         * @private
         */
        function _getAllComponents() {
            return _allComponents;
        }
    }
})();
