(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('editMain', editMain);

    /* @ngInject */
    function editMain() {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div ht-sidebar">
        //  <div ht-sidebar whenDoneAnimating="vm.sidebarReady()">
        // Creates:
        //  <div ht-sidebar class="sidebar">
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/layout/edit-main.html'
        };
        return directive;


    }
})();
