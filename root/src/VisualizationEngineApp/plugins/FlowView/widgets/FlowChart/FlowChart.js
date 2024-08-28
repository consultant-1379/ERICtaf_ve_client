/**
Flow Chart widget to draw an array of elements in a flow structure and linking them together based on their relationship
@class FlowChart
*/
define([
    'jscore/core',
    'app/plugins/FlowView/widgets/FlowChart/FlowChartView',
    'chartlib/base/d3',
    'app/ext/d3path',
    'app/ext/d3node',
    'jscore/ext/utils/base/underscore',
    'jscore/base/jquery',
    'widgets/Tabs',
    'app/widgets/Popup/EventLook/EventLook',
    'app/widgets/Popup/Popup',
    'widgets/Accordion',
    'app/lib/utils/EventController'
], function (core, View, d3, path, node, _, $, Tabs, EventViewer, Popup, Accordion, EventController) {
    'use strict';

    return core.Widget.extend({
        View: View,

        /**
        Initialisation of the flowChart
        */
        init: function () {
            this.d3 = d3;
            this.activeField = 0;
            this.data = [[]];
            this.dataByEventId = [];
            this.parentUID = this.options.parentUID;
            this.settings = this.getSettings();
            this.handledEvents = [];
            this.erCollectionSize = 50;
            this.firstLoad = true;
            this.tabs = new Tabs({
                enabled: true
            });
            _.extend(this, path);
            _.extend(this, node);

            this.cluster = d3.layout.cluster();
            this.firstRun = true;

            this.nodeSettings = {
                boxHeight : 60,
                boxWidth : 225,
                node_draggable : false             
            };
            this.pathSettings = {
                stoke_width : 3,
                instant : true
            };
        },

        /**
        Method to bind the data in a tree flow and attach children to each node if they are connected.
        @param data - array of node data to be represented as a flow structure
        @name FlowChart#bind
        */
        bind: function (data) {
            var conv2tree = function (data) {
                var root = this.getRoot(data);
                var hasParentFlag = [];
                hasParentFlag[root.id] = true;
                this.traverseEdge(data, function (source, target) {
                    if (!hasParentFlag[target.id] && source.id !== target.id) {
                        if (!source.children) {
                            source.children = [];
                        }
                        source.children.push(target);
                        hasParentFlag[target.id] = true;
                    }
                });
                return root;
            }.bind(this);

            var buildNodes = function (tree) {
                return this.cluster.nodes(tree);
            }.bind(this);

            var buildLinks = function (data) {
                var result = [];
                this.traverseEdge(data, function (source, target) {
                    result.push({
                        'source': source,
                        'target': target
                    });
                });
                return result;
            }.bind(this);
            
           
            
            var merge = function (nodes, links) {
                this.nodes = nodes;
                this.links = links;
            }.bind(this);

            //1)temporarily convert a connectivity to a tree.
            var tree = conv2tree(data);
            //2)calculate for nodes' coords with <code>this.cluster.nodes(tree);</code>
            var nodes = buildNodes(tree);
            //3)fill in all the edges(links) of the connectivity
            var links = buildLinks(data);
            //4)do merge to keep info like node's position
            merge(nodes, links);
            //5)redraw
            var firstPosX = null;
            var previousD = null;
            var lastDofLastRow = null; // the last node of previous row
            nodes.forEach(function (d) {
                
                firstPosX = firstPosX ? firstPosX : d.x;
                d.x = (d.x - firstPosX) * 400;
                d.y = d.depth * 150 + d.position * 100;
                if (previousD){
                    // when we start a new sub flow, remember the last node of the last row
                    if (d.depth < previousD.depth){
                        lastDofLastRow =  previousD; 
                    }
                    // if the note will be draw over the previous one, move it down
                    if ((d.y < previousD.y + this.nodeSettings.boxWidth) && (d.x < previousD.x + this.nodeSettings.boxHeight) ){
                        d.x = previousD.x + this.nodeSettings.boxHeight + 2 ;
                    }
                    //if there is only one child, keep it with in line with the parent
                    if (previousD.children && (previousD.children.length === 1)){d.x = previousD.x; }
                    else {
                        // if a child is draw above the parent, make sure it is not draw over the last row
                        if (lastDofLastRow && (previousD !== lastDofLastRow) && d.x < previousD.x){
                            d.x = lastDofLastRow.x + this.nodeSettings.boxHeight + 2 ;
                        }
                    }
                }
               
                previousD = d;
            }.bind(this));

            this.redraw();
        },

        /**
        Create and set an svg to prepare for drawing of nodes
        @name FlowChart#initializeSVG
        */
        initializeSVG: function () {
            this.svgArea = d3.select(this.view.getSvgArea().element);
            this.svgArea.append("svg").append("g").append("svg:defs");
            this.svg = this.svgArea.select("svg");
            this.svg_g = this.svg.select("g");
        },

        /**
        Method to clear the svg elements and reset the width and height of the svg
        @name FlowChart#clear
        */
        clear: function () {
            if (this.firstRun === true) {
                this.initializeSVG();
                this.trigger('onLoad');
                this.firstRun = false;
                
                this.svg_g.append("defs").append("marker")
                .attr("id", "arrowhead")
                .attr("refX", 6 + 3) 
                .attr("refY", 2)
                .attr("markerWidth", 6)
                .attr("markerHeight", 4)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M 0,0 V 4 L6,2 Z");
            }

            var minWidth = _.max(this.nodes, function (d) { return d.y; }).y + this.nodeSettings.boxHeight+250; 
            var minHeight = _.max(this.nodes, function (d) { return d.x; }).x + this.nodeSettings.boxWidth+50;
            minWidth = _.max([this.nodeSettings.boxWidth*3, minWidth]);
            this.minHeight = _.max([this.nodeSettings.boxHeight*3, minHeight]);

            this.svg
                .attr("class", "eaVEApp-wFlowchart-svg")
                .attr("width", "99%")
                .attr("height","99%")
                .attr("viewBox", "0 0 " + minWidth + " " + this.minHeight);

            this.svg
                .select("g")
                .attr("transform", "translate(150, " + this.minHeight / 2 + ")");

                      
            var zoom = d3.behavior.zoom();

            this.svg.call(zoom.scaleExtent([0, 8]).on("zoom", function(){
                this.svg.select("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                this.translate = d3.event.translate;
                this.scale = d3.event.scale;
            }.bind(this)));
           
            if(typeof this.translate !== 'undefined' && typeof this.scale !== 'undefined'){
                this.svg.select("g").attr("transform", "translate(" + this.translate + ")scale(" + this.scale + ")");
            }


        },

        /**
        Method to redraw() d3 nodes and if necessary (re-config, re-custom the actions, etc.)
        depending on it being recalled
        @name FlowChart#redraw
        */
        redraw: function () {
            var el = this.view.getSvgArea();
            this.clear();
            this.drawPaths(this.svg_g, this.links, this.pathSettings);
            this.drawNodes(this.svg_g, this.nodes, this.nodeSettings);

            /* DURACI-1666: Disable event information  until GA, after GA restore it  
            var node = this.svg_g.selectAll('.node');
            node.on("click", function(d) {
                if (!this.popup) {
                    this.popup = [];
                }
                if (this.popup[d.id]) {
                    this.popup[d.id].destroy();
                    this.popup.pop(d.id);
                    return;
                }
                var event = this.d3.event;

                // calculate the offset from click position to top of svg to click event location.
                var offsetRect = this.svg.node().getBoundingClientRect();
                var offsetToPosition = { x: event.pageX - offsetRect.left - window.scrollX, y: event.pageY - offsetRect.top - window.scrollY};

                var nodeAccordion = core.Element.parse("<div class='eaVEApp-wClusterChart-accordionHolder'></div>");

                var ev = new EventViewer({event: this.getEventFromId(d.eventId)});
                var accHistory = new Accordion({
                    title: "\nEvent",
                    content: ev
                });
                accHistory.attachTo(nodeAccordion);                 // attach the accordion to the popup

                this.popup[d.id] = new Popup({title: "Node History", content: nodeAccordion, position: offsetToPosition});
                this.popup[d.id].attachTo(el);
                this.popup[d.id].addEventHandler('close', function() {
                    this.popup[d.id].destroy();
                    this.popup[d.id] = undefined;
                }, this);
            }.bind(this));
            
            DURACI-1666   */
	
            this.firstLoad = false;
        },
        /**
        Return Root node of flow of data stored
        @param data - the array of data
        @name FlowChart#getRoot
        */
        getRoot: function (data) {
            return data[0];
        },
        /**
        Method to traverse the the data structure
        @name FlowChart#traverse
        @param data
        @param callback
        */
        traverse: function (data, callback) {
            if (!data) console.error('data is null');

            function _init() {
                var i;
                for(i in data) {
                    data[i].visited = false;
                }
            }

            function _traverse(pt, callback) {
                if (!pt) {return;}
                pt.visited = true;
                callback(pt);
                if (pt.ref) {
                    pt.ref.forEach(function (ref) {
                        var childNode = _.find(data, function (d) { return d.id === ref.to; });

                        if (childNode && !childNode.visited) {
                            _traverse(childNode, callback);
                        }
                    });
                }
            }

            _init();
            _traverse(this.getRoot(data), callback);
        },
        /**
        Find parent node and attach child to that node
        @name FlowChart#traverseEdge
        @param data
        @param callback
        */
        traverseEdge: function (data, callback) {
            if (!data) console.error('data is null');

            this.traverse(data, function (node) {
                if (node.ref) {
                    node.ref.forEach(function (ref) {
                        var childNode = _.find(data, function (d) { return d.id === ref.to; });
                        if (childNode) {
                            callback(node, childNode, ref);
                        }
                    });
                }
            });
        },
        /**
        Method to refresh the data and add it into a new array in order to bind it
        @name FlowChart#refresh
        */
        refresh: function () {
            //request data here
            var myData = this.settings.data;
            var data = [];
            var i = 0;
            _.each(myData, function() {
                data[i] = {
                    id: myData[i].id,
                    eventId: myData[i].eventId,
                    title: myData[i].title,
                    textmatrix: myData[i].textmatrix,
                    rate: myData[i].rate,
                    ref: myData[i].ref,
                    position: myData[i].position
                };
                i++;
            });
            if (data.length > 0) {
                this.bind(data);
            }

        },
        /**
        Method to set the eventFinder
        @name FlowChart#setEventFinder
        */
        setEventFinder: function(eventFinder) {
            this.eventFinder = eventFinder;
        },
        /**
        Method to return a unique id of the flowchart to a region
        @name FlowChart#getData
        @returns Object - object with an id i.e Object.id
        */
        getData: function () {
            return { id: _.uniqueId('flow-chart-') };
        },
        /**
        Method to return the settings of the flow chart
        @name FlowChart#getSettings
        @returns settings {Object} - object contains edge_show_arrow , data  
        */
        getSettings: function () {
            return {
                edge_show_arrow: true,
                data: this.data[this.activeField]
            };
        },

        changeColumnSize: function () {
            this.tabs.addTab("");                               // do whatever floats your boat
            this.tabs.removeLastTab();                          // do whatever floats your boat
        },

        /**
        Method to add the TABs to the tab area
        @name FlowChart#addTab
        @param number - index of data array
        */
        addTab: function (number) {
            this.tabs.addTab(this.data[number][0].title, " ");
            
            this.tabs.addEventHandler("tabselect", function(t, i){
                this.activeField = i;                                                          // change the marker for active data set
                this.settings.data = this.data[this.activeField];
                this.translate = [150, this.minHeight / 2];
                this.scale = 1;                             // change the active data set
                this.refresh();                                                                 // Finally update the chart
            }, this);
        },

        /**
        Update the graphic when the model received.
        @name FlowChart#updateGraph
        @param data {object} model sent from the server
        */
        updateGraph: function (data) {
            this.data = this.modelToGraphData(data);
            if(this.data[0].length !== 0){
                if(this.firstRun === true) {
                    this.tabs.attachTo(this.view.getTabField());
                } else {
                    this.tabs.clearTabs();
                }            
                for (var i = 0; i< this.data.length; i++){
                    this.addTab(i);
                }

                this.tabs.setSelectedTab(this.activeField);
                this.settings.data = this.data[this.activeField];
                this.view.showSvgArea();
                this.view.getInfo().setText("");
                this.refresh();
            }
            else{
                this.view.hideSvgArea();
                this.tabs.clearTabs();
                this.view.getInfo().setText("No Data");
            }
        },
        
        /**
        Method to transfer model data to the data used to build graph
        @name FlowChart#modelToGraphData
        @param data {object} model to be parsed for rendering        
        */
        modelToGraphData: function(data){
            var j = 0;
            var myData = [[]];
            _.each(data, function(d){
                myData[j]= [];
                _.each(d, function (itemIn, index){
                    var item = {};
                    var k;
                    item.id = itemIn.id;
                    item.eventId = itemIn.uniqueId;
                    item.title = itemIn.title;
                    item.position =index;
                    item.rate = itemIn.status;
                    item.ref = [];
                    _.each(itemIn.connection, function(c){
                       var ref = {from:itemIn.id,to:c.id};
                       item.ref.push(ref);
                    });
                    item.textmatrix = [];
                    _.each(itemIn.information, function(key, value){
                        item.textmatrix.push([value, key]);
                    });
                    myData[j].push(item);
                });
                j++;
                
            }.bind(this));
            return myData;
        }
        
        
         
    });
});