(function () {
    'use strict';

    angular
        .module('app.surface')
        .directive('textSurface', textSurface)
        .controller('TextSurfaceController', TextSurfaceController);

    /* @ngInject */
    function textSurface() {
        var directive = {
            restrict: 'EA',
            scope: true,
            template: '<div></div>',
            controller: 'TextSurfaceController',
            controllerAs: 'vm'
        };

        return directive;
    }

    /* @ngInject */
    function TextSurfaceController($scope, $element, $document, $compile) {
        var vm = this;

        var $component = $($scope.component.text);
        $component.css({
            'fontSize': $scope.component.style['fontSize'],
            'textAlign': $scope.component.style['textAlign']
        });
        $component.addClass('text-surface');
        $element.append($component);

        $scope.$parent.editThisComponent = function ($event) {
            if($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }

            $component.attr('contenteditable', true);

            $scope.entity.disableMask = true;
            $document.bind('mousedown', _mousedown);
            function _mousedown() {
                $document.unbind('mousedown', _mousedown);
                $component.removeAttr('contenteditable');
                $scope.$apply(function () {
                    $scope.entity.disableMask = false;
                    $scope.entity.data.text = $element.html();
                });
            }
            $component.focus();
            setTimeout(function () {
                if(window.getSelection) {
                    //如果支持文本内容选中，那么就选中文本内容
                    var sel = window.getSelection();
                    sel.modify('move', 'left', 'documentboundary');
                    sel.modify('extend', 'right', 'documentboundary');
                }
            }, 0);
        };
    }
})();
