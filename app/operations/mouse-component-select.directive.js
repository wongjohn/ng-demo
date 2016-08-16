(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('mouseComponentSelect', mouseComponentSelect)
        .controller('MouseComponentSelectController', MouseComponentSelectController);

    /* @ngInject */
    function mouseComponentSelect() {
        return {
            restrict: 'A',
            controller: 'MouseComponentSelectController'
        };
    }

    /* @ngInject */
    function MouseComponentSelectController($element, Point, selectionService, currentStateService) {

        function SelectArea(positionX, positionY, width, height, startFlag) {//选中区域
            this.startPositionX = positionX;
            this.startPositionY = positionY;
            this.width = width;
            this.height = height;
            this.selectAreaPointA = new Point(positionX, positionY);
            this.selectAreaPointB = new Point(positionX + width, positionY + height);
            this.startFlag = startFlag;
            this.selectAreaTemplate = $element.find('.edit-area-select-container');
            if(!this.selectAreaTemplate.length) {
                this.selectAreaTemplate = $('<div class="edit-area-select-container"></div>');
                $element.append(this.selectAreaTemplate);
            }
            var offset = $element.offset(), containerOffset = $('#editStage').offset();
            this.offset = offset;
            this.containerOffset = containerOffset;
            $(window).resize(function () {
                angular.extend(offset, $element.offset());
                angular.extend(containerOffset, $('#editStage').offset());
            });
        }
        SelectArea.prototype.selectStart = function (clientX, clientY) {//开始区域选择
            currentStateService.updateComponentsEntity();
            angular.extend(this.offset, $element.offset());
            angular.extend(this.containerOffset, $('#editStage').offset());
            this.startPositionX = clientX;
            this.startPositionY = clientY;
            this.startFlag = true;
            this.updateSelectedElements();//点击编辑区域外部，也能取消当前选中元素
        };
        SelectArea.prototype.isSelectStarted = function () {//是否已经开始选择
            return this.startFlag;
        };
        SelectArea.prototype.selectMove = function (event) {//区域选择进行中
            this.width = event.clientX - this.startPositionX;
            this.height = event.clientY - this.startPositionY;
            this.updateCurrentPosition();
            if(this.width > 4 && this.height > 4) {//如果没有划最小的区域，则不认为是框选
                this.updateSelectArea();
                this.updateSelectedElements();
            }
        };
        SelectArea.prototype.selectEnd = function () {//区域选择进行中
            this.startPositionX = this.startPositionY = this.width = this.height = 0;
            this.startFlag = false;
            this.updateCurrentPosition();
            this.updateSelectArea();
        };
        SelectArea.prototype.getLocalPoint = function (worldPoint) {//世界坐标转本地坐标
            return new Point(worldPoint.x - this.offset.left, worldPoint.y - this.offset.top);
        };
        SelectArea.prototype.updateSelectArea = function () {//根据选中区域设置，更新区域框的位置
            var localPointA = this.getLocalPoint(this.selectAreaPointA);
            this.selectAreaTemplate.css('left', localPointA.x);
            this.selectAreaTemplate.css('top', localPointA.y);
            this.selectAreaTemplate.height(this.height);
            this.selectAreaTemplate.width(this.width);
        };
        SelectArea.prototype.updateCurrentPosition = function () {
            this.selectAreaPointA.x = (this.width > 0 ? this.startPositionX : (this.width + this.startPositionX));
            this.selectAreaPointA.y = (this.height > 0 ? this.startPositionY : (this.height + this.startPositionY));
            this.width = Math.abs(this.width);
            this.height = Math.abs(this.height);
            this.selectAreaPointB.x = this.selectAreaPointA.x + this.width;
            this.selectAreaPointB.y = this.selectAreaPointA.y + this.height;
        };
        SelectArea.prototype.updateSelectedElements = function () {
            var that = this;
            currentStateService.currentPageComponents().forEach(function (entity) {
                if(that.contains(entity)) {
                    selectionService.addSelection(entity);
                    return;
                }
                selectionService.removeSelection(entity);
            });
        };
        SelectArea.prototype.contains = function (entity) {
            var bigO = new Point(this.containerOffset.left + entity.startPointO.x, this.containerOffset.top + entity.startPointO.y);
            return (bigO.x >= this.selectAreaPointA.x && bigO.x <= this.selectAreaPointB.x && bigO.y >= this.selectAreaPointA.y && bigO.y <= this.selectAreaPointB.y);
        };

        var selectArea = new SelectArea(0, 0, 0, 0, false);
        $element.bind('mousedown', function (event) {
            var targetElement = $(event.target);
            //鼠标框选mousedown事件，忽略来自各个组件的事件冒泡。
            if(targetElement.hasClass('trailer') || targetElement.parents('.trailer').length) {
                return;
            }

            selectArea.selectStart(event.clientX, event.clientY);
        });
        $element.bind('mousemove', function (event) {
            if(selectArea.isSelectStarted()) {
                selectArea.selectMove(event);
            }
        });
        $element.bind('mouseup', function () {
            if(selectArea.isSelectStarted()) {
                selectArea.selectEnd();
            }
        });
    }
})();
