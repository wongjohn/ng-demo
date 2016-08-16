(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('multiSelectPanel', multiSelectPanel)
        .directive('msAlignLeft', msAlignLeft)
        .directive('msAlignHorizontalCenter', msAlignHorizontalCenter)
        .directive('msAlignRight', msAlignRight)
        .directive('msAlignTop', msAlignTop)
        .directive('msAlignVerticalCenter', msAlignVerticalCenter)
        .directive('msAlignBottom', msAlignBottom)
        .directive('msVerticalAverage', msVerticalAverage)
        .directive('msHorizontalAverage', msHorizontalAverage);

    /* @ngInject */
    function multiSelectPanel() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/multi-select.html'
        };
        return directive;
    }

    /* @ngInject */
    function msAlignLeft(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var minLeft = selectionService.bigDetectionBoxPointA.x;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = minLeft - entity.startPointA.x;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top, left: entity.startPosition.left + step
                        };
                        entity.element.css('left', newPosition.left);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msAlignHorizontalCenter(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var centerX = selectionService.bigDetectionBoxPointO.x;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = centerX - entity.startPointO.x;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top, left: entity.startPosition.left + step
                        };
                        entity.element.css('left', newPosition.left);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msAlignRight(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var minRight = selectionService.bigDetectionBoxPointB.x;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = minRight - entity.startPointB.x;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top, left: entity.startPosition.left + step
                        };
                        entity.element.css('left', newPosition.left);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msAlignTop(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var minTop = selectionService.bigDetectionBoxPointA.y;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = minTop - entity.startPointA.y;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top + step, left: entity.startPosition.left
                        };
                        entity.element.css('top', newPosition.top);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msAlignVerticalCenter(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var centerY = selectionService.bigDetectionBoxPointO.y;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = centerY - entity.startPointO.y;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top + step, left: entity.startPosition.left
                        };
                        entity.element.css('top', newPosition.top);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msAlignBottom(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function () {
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var minTop = selectionService.bigDetectionBoxPointB.y;
                    angular.forEach(selectionService.allSelections(), function (entity) {
                        var step = minTop - entity.startPointB.y;
                        step = (step === Math.abs(step)) ? Math.floor(step) : Math.ceil(step);
                        var newPosition = {
                            top: entity.startPosition.top + step, left: entity.startPosition.left
                        };
                        entity.element.css('top', newPosition.top);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msVerticalAverage(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function() {
                var selectElements = selectionService.allSelections();
                var selectedNum = selectElements.length;
                if(selectedNum < 2) {
                    return;
                }
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var detectionBoxes = selectionService.allSelections();
                    detectionBoxes.sort(function (a, b) {
                        return a.startPointO.y > b.startPointO.y;
                    });
                    var start = detectionBoxes[0].startPointO.y;
                    var end = detectionBoxes[selectedNum - 1].startPointO.y;
                    var step = (end - start) / (selectedNum - 1);
                    angular.forEach(detectionBoxes, function (entity, index) {
                        if(index === 0 || index === selectedNum) {
                            return;
                        }
                        var topStep = (start + index * step) - entity.startPointO.y;
                        topStep = (topStep === Math.abs(topStep)) ? Math.floor(topStep) : Math.ceil(topStep);
                        var newPosition = {
                            top: entity.startPosition.top + topStep, left: entity.startPosition.left
                        };
                        entity.element.css('top', newPosition.top);
                    });
                });
            });
        };
    }
    /* @ngInject */
    function msHorizontalAverage(currentStateService, selectionService) {
        return function ($scope, $element) {
            $element.click(function() {
                var selectElements = selectionService.allSelections();
                var selectedNum = selectElements.length;
                if(selectedNum < 2) {
                    return;
                }
                $scope.$apply(function () {
                    currentStateService.updateComponentsEntity();
                    selectionService.updateSelectedComponentsDetectionBoxPoints();
                    var detectionBoxes = selectionService.allSelections();
                    detectionBoxes.sort(function (a, b) {
                        return a.startPointO.x > b.startPointO.x;
                    });
                    var start = detectionBoxes[0].startPointO.x;
                    var end = detectionBoxes[selectedNum - 1].startPointO.x;
                    var step = (end - start) / (selectedNum - 1);
                    angular.forEach(detectionBoxes, function (entity, index) {
                        if(index === 0 || index === selectedNum) {
                            return;
                        }
                        var leftStep = (start + index * step) - entity.startPointO.x;
                        leftStep = (leftStep === Math.abs(leftStep)) ? Math.floor(leftStep) : Math.ceil(leftStep);
                        var newPosition = {
                            top: entity.startPosition.top, left: entity.startPosition.left + leftStep
                        };
                        entity.element.css('left', newPosition.left);
                    });
                });
            });
        };
    }

})();
