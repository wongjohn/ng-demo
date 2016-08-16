/* 网格／参考线 */
(function () {
    'use strict';

    angular
        .module('app.operations')
        .directive('gridGuideContainer', gridGuideContainer)
        .service('gridGuideService', gridGuideService);

    /* @ngInject */
    function gridGuideContainer(gridGuideService) {
        return function ($scope, $element) {
            gridGuideService.grid.init($element);
            gridGuideService.guide.init($element);
        };
    }

    /* @ngInject */
    function gridGuideService(currentStateService, selectionService) {
        var DESIGN_WIDTH = 320, DESIGN_HEIGHT = 504, CELL_SIZE = 30;

        var grid = {
            init: function ($container) {
                this.color = this.getColor() ? this.getColor() : "rgba(150, 150, 150, 0.2)";
                this.$container = $container;
                this.render();
                setTimeout(function () {
                    if(grid.getVisable()!='disable') {
                        grid.show();
                    }
                }, 1);
            },
            render: function () {
                this.domElement = $('<div class="editor-block-grid">');
                this.canvasElement = $('<canvas class="editor-block-grid-inner">').appendTo(this.domElement);
            },
            show: function () {
                this.domElement.appendTo(this.$container);
                this.paint();
                this.enabled = true;
            },
            hide: function () {
                this.domElement.remove();
                this.enabled = false;
            },
            setVisable : function(visable){
                if(window.localStorage)
                {
                    localStorage.setItem('sceneGridVisable',visable);
                }
            },
            getVisable : function(){
                if(window.localStorage)
                {
                    return localStorage.getItem('sceneGridVisable');
                }
            },
            setColor : function(color){
                if(window.localStorage)
                {
                    localStorage.setItem('sceneGridColor',color);
                }
            },
            getColor : function(){
                if(window.localStorage)
                {
                    return localStorage.getItem('sceneGridColor');
                }
            },
            getGuideState : function(){
                if(window.localStorage)
                {
                    return localStorage.getItem('sceneGridState');
                }
            },
            setGuideState : function(visable){
                if(window.localStorage)
                {
                    localStorage.setItem('sceneGridState',visable);
                }
            },
            getSnapState : function(){
                if(window.localStorage)
                {
                    return localStorage.getItem('sceneSnapState');
                }
            },
            setSnapState : function(visable){
                if(window.localStorage)
                {
                    localStorage.setItem('sceneSnapState',visable);
                }
            },
            paint: function () {
                var slideBoundWidth = DESIGN_WIDTH,
                    slideBoundHeight = DESIGN_HEIGHT,
                    rowNum = Math.round(slideBoundHeight/CELL_SIZE),//this.getRows(),
                    colNum =  Math.round(slideBoundWidth/CELL_SIZE),//this.getCols(),
                    cellWidth = CELL_SIZE,//Math.round(slideBoundWidth / colNum),
                    cellHeight = CELL_SIZE;//Math.round(slideBoundHeight / rowNum),
                this.canvasElement.css({left: 0, top: 0});
                this.canvasElement.attr({
                    width: slideBoundWidth,
                    height: slideBoundHeight
                });
                var gridCanvas = this.canvasElement.get(0).getContext("2d");
                gridCanvas.clearRect(0, 0, slideBoundWidth, slideBoundHeight);
                for (var d = 1; colNum > d; d++) {
                    gridCanvas.fillStyle = this.color;
                    gridCanvas.fillRect(Math.floor(d * cellWidth), 0, 1, slideBoundHeight);
                }
                for (var u = 1; rowNum > u; u++) {
                    gridCanvas.fillStyle = this.color;
                    gridCanvas.fillRect(0, Math.floor(u * cellHeight), slideBoundWidth, 1);
                }
            },
            getRows: function () {
                return 16;
            },
            getCols: function () {
                return 10;
            },
            refreshGrid:function(){
                this.paint();
            }
        };
        var defaultGuideOption = {
            snap: grid.getSnapState() ? grid.getSnapState() : true,
            action: "move",
            threshold: 1,
            enabled: grid.getGuideState() ? grid.getSnapState() : true
        };
        var guide = {
            init: function ($container) {
                this.guides = {h: [], v: []};
                this.slideBounds = {width: DESIGN_WIDTH, height: DESIGN_HEIGHT, x: 0, y: 0};
                this.render();
                $container.append(this.domElement);
                this.options = defaultGuideOption;
            },
            render: function () {
                this.domElement = $('<div class="editor-block-guides">');
            },
            start: function (options) {
                selectionService.updateSelectedComponentsDetectionBoxPoints();
                if(!this.options.enabled) {return;}
                this.allBlocks = [];
                currentStateService.currentPageComponents().forEach(function (entity) {
                    guide.allBlocks.push(entity);
                });
                this.targetBlocks = [];
                angular.forEach(selectionService.allSelections(), function (selectedEntity) {
                    guide.targetBlocks.push(selectedEntity);
                });
                this.gridLines = [];
                var colNum = Math.round(this.slideBounds.width / CELL_SIZE),//grid.getCols(),
                    rowNum =  Math.round(this.slideBounds.height / CELL_SIZE),//grid.getRows(),
                    colWidth = CELL_SIZE,//Math.round(this.slideBounds.width / colNum),
                    rowHeight = CELL_SIZE;//Math.round(this.slideBounds.height / rowNum),
                if(grid.enabled) {
                    for (var horizontalLineNum = 1; colNum > horizontalLineNum; horizontalLineNum++) {
                        this.gridLines.push(this.getCenterEdge({x: horizontalLineNum * colWidth,y: 0,width: 0,height: this.slideBounds.height}, "grid-col-" + horizontalLineNum, "horizontal"));
                    }

                    for (var verticalLineNum = 1; rowNum > verticalLineNum; verticalLineNum++) {
                        this.gridLines.push(this.getCenterEdge({x: 0,y: verticalLineNum * rowHeight,width: this.slideBounds.width,height: 0}, "grid-row-" + verticalLineNum, "vertical"));
                    }
                }
                //this.gridLines.push(this.getCenterEdge({x: 0,y: 0,width: 0,height: this.slideBounds.height}, "grid-col-left", "horizontal"));
                //this.gridLines.push(this.getCenterEdge({x: this.slideBounds.width,y: 0,width: 0,height: this.slideBounds.height}, "grid-col-right", "horizontal"));
                //this.gridLines.push(this.getCenterEdge({x: 0,y: 0,width: this.slideBounds.width,height: 0}, "grid-row-top", "vertical"));
                //this.gridLines.push(this.getCenterEdge({x: 0,y: this.slideBounds.height,width: this.slideBounds.width,height: 0}, "grid-row-bottom", "vertical"));
                this.options = $.extend(defaultGuideOption, options);
            },
            stop: function () {
                this.clearGuideElements();
            },
            sync: function (translate) {
                if(!this.options.enabled) {return;}
                this.findGuides(translate);
                this.renderGuides();
            },
            findGuides: function (translate) {
                translate = angular.extend({x: 0, y: 0, width: 0, height: 0}, translate);
                this.guides.h.length = 0;
                this.guides.v.length = 0;
                var combinedBounds = {
                        x: selectionService.bigDetectionBoxPointA.x + translate.x,
                        y: selectionService.bigDetectionBoxPointA.y + translate.y,
                        width: selectionService.bigDetectionBoxPointB.x - selectionService.bigDetectionBoxPointA.x + translate.width,
                        height: selectionService.bigDetectionBoxPointB.y - selectionService.bigDetectionBoxPointA.y + translate.height
                    },
                    combinedBoundEdges = this.getEdges(combinedBounds, "target-bounds", "resize" === this.options.action);
                this.combinedBounds = combinedBounds;
                this.allBlocks.forEach(function (blockBox) {
                    if(-1 === guide.targetBlocks.indexOf(blockBox)) {
                        guide.compageEdges(combinedBoundEdges, guide.getEdges(blockBox.measure(), blockBox.getID()), guide.options.threshold);
                    }
                });
                this.gridLines.forEach(function (gridLine) {
                    guide.compageEdges(combinedBoundEdges, gridLine, guide.options.threshold);
                });
                this.guides.h.sort(function (e, t) {
                    return e.distance - t.distance;
                });
                this.guides.v.sort(function (e, t) {
                    return e.distance - t.distance;
                });
            },
            enforceGuides: function (translate) {
                if(!this.options.enabled) {return;}
                var threshold = this.options.threshold;
                this.options.threshold = 3;
                this.findGuides(translate);
                this.options.threshold = threshold;

                var deltaX = 0, deltaY = 0, _guide;
                if(this.guides.h.length) {
                    _guide = this.guides.h[0];
                    deltaX = _guide.compareEdge.x - _guide.targetEdge.x;
                }
                if(this.guides.v.length) {
                    _guide = this.guides.v[0];
                    deltaY = _guide.compareEdge.y - _guide.targetEdge.y;
                }
                translate.x += deltaX;
                translate.y += deltaY;
            },
            compageEdges: function (combinedBoundEdge, edge, threshold) {
                var distance;
                combinedBoundEdge.h.forEach(function (targetEdge) {
                    edge.h.forEach(function (compareEdge) {
                        distance = Math.abs(targetEdge.x - compareEdge.x);
                        if(threshold > distance) {
                            guide.guides.h.push({distance: distance, targetEdge: targetEdge, compareEdge: compareEdge});
                        }
                    });
                });
                combinedBoundEdge.v.forEach(function (targetEdge) {
                    edge.v.forEach(function (compareEdge) {
                        distance = Math.abs(targetEdge.y - compareEdge.y);
                        if(threshold > distance){
                            guide.guides.v.push({distance: distance, targetEdge: targetEdge, compareEdge: compareEdge});
                        }
                    });
                });
            },
            renderGuides: function () {
                var guides = [];
                this.guides.h.forEach(function (guideLine) {
                    guides.push(guide.renderGuide(guideLine));
                });
                this.guides.v.forEach(function (guideLine) {
                    guides.push(guide.renderGuide(guideLine));
                });
                this.clearGuideElements(guides);
            },
            renderGuide: function (guide) {
                var targetEdge = guide.targetEdge, compareEdge = guide.compareEdge, $element = $('[data-guide-id="' + compareEdge.id + '"]');
                if(0 === $element.length){
                    $element = $('<div data-guide-id="' + compareEdge.id + '">').appendTo(this.domElement);
                    setTimeout(function () {
                        $element.addClass("show");
                    }, 1);
                }
                var position = {
                    top: Math.min(compareEdge.bounds.y, this.combinedBounds.y),
                    right: Math.max(compareEdge.bounds.x + compareEdge.bounds.width, this.combinedBounds.x + this.combinedBounds.width),
                    bottom: Math.max(compareEdge.bounds.y + compareEdge.bounds.height, this.combinedBounds.y + this.combinedBounds.height),
                    left: Math.min(compareEdge.bounds.x, this.combinedBounds.x)
                };
                if ("number" == typeof compareEdge.y) {
                    var s = "s" === targetEdge.direction ? -1 : 0;
                    $element.addClass("guide-h");
                    $element.css({top: Math.floor(compareEdge.y + s), left: position.left, width: position.right - position.left});
                } else {
                    var a = "e" === targetEdge.direction ? -1 : 0;
                    $element.addClass("guide-v");
                    $element.css({left: Math.floor(compareEdge.x + a), top: position.top, height: position.bottom - position.top});
                }
                return compareEdge.id;
            },
            getEdges: function (bounds, idPrefix, isNoCenter) {
                var edge = {
                    h: [
                        {id: idPrefix + "-h1", bounds: bounds, x: bounds.x, offset: 0, direction: "w"},
                        {id: idPrefix + "-h2", bounds: bounds, x: bounds.x + bounds.width / 2, offset: -bounds.width / 2, direction: "hc"},
                        {id: idPrefix + "-h3", bounds: bounds, x: bounds.x + bounds.width, offset: -bounds.width, direction: "e"}
                    ],
                    v: [
                        {id: idPrefix + "-v1", bounds: bounds, y: bounds.y, offset: 0, direction: "n"},
                        { id: idPrefix + "-v2", bounds: bounds, y: bounds.y + bounds.height / 2, offset: -bounds.height / 2, direction: "vc"},
                        {id: idPrefix + "-v3", bounds: bounds, y: bounds.y + bounds.height, offset: -bounds.height, direction: "s"}
                    ]
                };
                if(isNoCenter) {
                    edge.h.splice(1, 1);
                    edge.v.splice(1, 1);
                }
                return edge;
            },
            getCenterEdge: function (bounds, idPrefix, direction) {
                var centerEdge = {h: [], v: []};
                if("vertical" === direction) {
                    centerEdge.v.push({id: idPrefix + "-v2", bounds: bounds, y: bounds.y + bounds.height / 2, offset: -bounds.height / 2, direction: idPrefix});
                } else {
                    centerEdge.h.push({id: idPrefix + "-h2", bounds: bounds, x: bounds.x + bounds.width / 2, offset: -bounds.width / 2, direction: idPrefix});
                }
                return centerEdge;
            },
            clearGuideElements: function (guides) {
                var currentGuides = this.domElement.find(".guide-v, .guide-h");
                if(guides && guides.length) {
                    currentGuides = currentGuides.filter(function (t, i) {
                        return -1 === guides.indexOf(i.getAttribute("data-guide-id"));
                    });
                }
                currentGuides.remove();
            }
        };
        return {
            grid: grid,
            guide: guide
        };
    }
})();
