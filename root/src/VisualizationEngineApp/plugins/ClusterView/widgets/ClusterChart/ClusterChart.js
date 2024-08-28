define([
    'jscore/core',
    'app/plugins/ClusterView/widgets/ClusterChart/ClusterChartView',
    'chartlib/base/d3',
    'app/ext/d3node',
    'jscore/ext/utils/base/underscore',
    'app/widgets/Popup/EventLook/EventLook',
    'app/widgets/Popup/Popup',
    'widgets/Accordion',
    'app/lib/utils/EventController',
    'app/config/config'
], function (core, View, d3, node, _, EventViewer, Popup, Accordion, EventController, config) {
    'use strict';
    return core.Widget.extend({
        View: View,

        init: function () {
            _.extend(this, node);

            this.activeData = [];
            this.parentUID = this.options.parentUID;
            this.d3 = d3;

            this.settings = {
                firstRun: true,
                aspectRatio: 1,
                clusterBase: config.defaultClusteringOption
            };

            this.nodeSettings = {
                edge_show_arrow: true,
                cols: 2,
                oneNode: false,
                node_draggable: true,
                boxHeight : 60,
                boxWidth : 180
            };
        },

        /*
        Changes the amount of nodes per row before breaking
        */
        setColumns: function (n) {
            this.nodeSettings.cols = n;
            if (this.nodes) {
                this.arrangeNodes();
                this.redraw();
            }
        },

        /*
        Changes the time before a node is completely faded out
        */
        setFadeout: function (timeInSeconds) {
            clearInterval(this.fadeInterval);
            if(timeInSeconds > 0) {
                this.fadeInterval = setInterval(function() {
                    this.fadeout();
                }.bind(this), timeInSeconds/6 * 1000);
            }
        },

        /*
        Changes the aspect ratio to the event value
        */
        setAspectRatio: function(aRatio) {
            if (aRatio > 0) {
                this.settings.aspectRatio = aRatio/10;
                if(!this.settings.firstRun) {
                    this.redraw();
                }
            }
        },

        /*
        Changes the "one node" functionality and redraws when needed
        */
        setOneNode: function(oNode) {
            this.nodeSettings.oneNode = oNode;
            if(!this.settings.firstRun) {
                this.arrangeNodes();
                this.redraw();
            }
        },

        /*
        Changes the base for the clustering functionality and redraws when needed
        */
        setClusterBase: function(cBase) {
            this.settings.clusterBase = cBase;
            if(!this.settings.firstRun) {
                this.activeData = [];
                this.selectFromEventCollection();
                this.arrangeNodes();
                this.redraw();
            }
        },

        /*
        Creates an item (for d3Node input) from an event
        */
        createItem: function(event) {
            var resultCode = EventController.getEventValueFromKey(event, "eventData.resultCode");

            var date = new Date(event.eventTime).getTime();

            return {
                id: _.size(this.activeData),
                eventId: event.eventId,
                textmatrix: [["", event.eventTime?event.eventTime:""]],
                rate: resultCode?resultCode:"SUCCESS",
                added: date
            };
        },

        /*
        Handles new incoming events and sorts them into active data when applicable
        */
        handleNewEvent: function(event) {
            // otherwise create the item
            var item = this.createItem(event);

            // get the value of the active clustering key from the event
            var e = EventController.getEventValueFromKey(event, this.settings.clusterBase);

            //override old active event if applicable
            if (typeof e === "string") {
                if (!this.activeData[e]) {  // if the post is new
                    this.activeData[e] = []; //insert token
                    this.activeData = this.sortObject(this.activeData); //resort the array
                }
                item.title = e;             // set the item title
                this.activeData[e] = item;  // and replace the existing post (or token)
            }
            else {
                return false;
            }
            return true;
        },

        /*
        Bind items to nodes
        */
        arrangeNodes: function () {
            this.nodes = [];

            var position = 0;

            if (this.nodeSettings.oneNode) {
                if (!_.isEmpty(this.activeData)) {
                    // determine the result
                    var result = "SUCCESS";
                    _.each(this.activeData, function(d) {
                        if (d.rate !== undefined && d.rate !== "SUCCESS") {
                            result = d.rate;
                            return;
                        }
                    });

                    //determine the update time
                    var time = new Date(_.max(this.activeData, function(d) { return d.added; }).added).toISOString();
                    this.nodes.push({
                        y: 0,
                        x: 0,
                        id: 0,
                        title: "Summary of " + this.settings.clusterBase.split(".").pop(),
                        rate: result,
                        textmatrix: [
                            ["Items:", Object.keys(this.activeData).length],
                            ["Updated:", time]
                        ]
                    });
                }
            } else {
                _.each(this.activeData, function (d) {
                    d.y = (10 + this.nodeSettings.boxWidth) * (position % this.nodeSettings.cols);
                    d.x = (10 + this.nodeSettings.boxHeight) * Math.floor(position / this.nodeSettings.cols);
                    this.nodes.push(d);
                    position++;
                }.bind(this));
            }
        },

        /*
        Create and set an svg to prepare for drawing of nodes
        */
        initializeSVG: function () {
            this.svgArea = d3.select(this.getElement().element).select(".eaVEApp-wClusterChart-svgArea");
            this.svgArea.append("svg").append("g").append("svg:defs");
            this.svg = this.svgArea.select("svg");
            this.svg_g = this.svg.select("g");
        },

        /*
        Clear the svg to prepare for drawing of nodes
        */
        clear: function () {
            if (this.settings.firstRun === true) {
                this.initializeSVG();
                this.settings.firstRun = false;
                this.setFadeout(0);//48*60*60); // standard interval 48 hours
            }

            var maxWidth = _.max(this.nodes, function (d) { return d.y; }).y + this.nodeSettings.boxWidth;
            var maxHeight = _.max(this.nodes, function (d) { return d.x; }).x + this.nodeSettings.boxHeight;
            maxWidth = isNaN(maxWidth) ? 0 : maxWidth;
            maxHeight = isNaN(maxHeight) ? 0 : maxHeight;

            var height = this.element.element.clientWidth / maxWidth * maxHeight;
            height = isNaN(height) ? 0 : height;

            this.svg
                .attr("class", "eaVEApp-wClusterChart-svg")
                .attr("width", 100*this.settings.aspectRatio+"%")
                .attr("height", height)
                .attr("viewBox", (-this.nodeSettings.boxWidth/2 - 10) + " " + -this.nodeSettings.boxHeight/2 + " " + (maxWidth + 20) + " " + maxHeight );
        },

        /**
        Method to display the node history if available
        */
        historicalToolTip: function () {
            var el = this.getElement().find('.eaVEApp-wClusterChart-svgArea');

            var node = this.svg_g.selectAll('.node');

            node.on("click", function(d) {
                if (this.popup !== undefined) {
                    this.popup.destroy();
                    this.popup = undefined;
                    return;
                }
                var event = this.d3.event;

                // calculate the offset from click position to top of svg to click event location.
                var offsetRect = this.svg.node().getBoundingClientRect();
                var offsetToPosition = { x: event.pageX - offsetRect.left - window.scrollX, y: event.pageY - offsetRect.top - window.scrollY};

                this.popup = new Popup({title: "Node History", content: this.getNodeHistory(d.title), position: offsetToPosition});
                this.popup.attachTo(el);
                this.popup.addEventHandler('close', function() {
                    this.popup.destroy();
                    this.popup = undefined;
                }, this);
            }.bind(this));
        },

        /**
        Method to return all history as a list object in html by searching for the eventSource or JobInstance
        @param indentifier
        @return converted list
        */
        getNodeHistory : function(identifier) {

            var nodeHistory = [];
            var shownTitle = "";
            if (this.nodeSettings.oneNode) {
                _.each(this.activeData, function (item) {
                    nodeHistory.push(this.getEventFromId(item.eventId));    // get all active events
                }. bind(this));
            } else {
                //this part of code need to be re-do after we have decide how the event details are handled
//                _.each(this.eventCollection.getByDestination(this.parentUID), function (item) {
//                    if(EventController.getEventValueFromKey(item.attributes, this.settings.clusterBase) === identifier) {   // if the clusterBase is the same as the identifier
//                        nodeHistory.push(item.attributes);                  // then it must've been hidden so we show it in the history
//                    }
//                }. bind(this));
                shownTitle = " [CURRENTLY SHOWN]";
            }

            var nodeAccordion = core.Element.parse("<div class='eaVEApp-wClusterChart-accordionHolder'></div>");

            var c = 1;
            _.each(nodeHistory.reverse(), function(item) {
                var accHistory = new Accordion({
                    title: "\nEvent " + c + shownTitle,
                    content: "a"
                });
                accHistory.addEventHandler("expand", function() {
                    var ev = new EventViewer({event: item});
                    accHistory.setContent(ev);
                });
                c++;
                accHistory.attachTo(nodeAccordion);                 // attach the accordion to the popup
                shownTitle = "";                                    // show only title for the first item
            }, this);
            return nodeAccordion;
        },

        /*
        Fades out a d3 node by 20%. Deletes the node upon fadeout
        */
        fadeout: function () {
            var self = this;
            var d3Nodes = this.svg_g.selectAll('.node');
            d3Nodes.each(function () {
                var r = self.d3.select(this).select("rect");
                if (r.node().style.opacity < 0.2) {
                    //this.remove();  // remove the node
                    delete self.activeData[r.node().previousSibling.id];
                    self.arrangeNodes();
                    self.redraw();
                } else if (r.node().style.opacity > 1 || r.node().style.opacity < 0) {
                    r.style("opacity", 1);
                } else  {
                    r.style("opacity", Math.round(10*r.node().style.opacity-2)/10);
                }
            });
        },

        redraw: function () {
            if(this.nodes){
                this.clear();
                this.drawNodes(this.svg_g, this.nodes, this.nodeSettings);
                this.historicalToolTip();
            }
        },

        getData: function () {
            return { id: _.uniqueId('job-chart-') };
        },

        update: function (event) {
            var redraw = this.handleNewEvent(event);
            if (redraw === true) {
                this.arrangeNodes();
                this.redraw();
            }
        },

        sortObject: function (o) {
            var sorted = {};

            var sortedkeys = _.keys(o).sort();

            _.each(sortedkeys, function (key) {
                sorted[key] = o[key];
            });
            return sorted;
        },

        // return an event from the eventCollection, where applicable. Return empty if not found
        getEventFromId: function (id) {
            // This function need to be re-do after we have decide how the details of events are going to be hanlded.
//            var event = this.eventCollection._collection.get(id);
//            if(event === undefined) {
//                return;
//            }
//
//            return event.attributes;
            return;
        }
    });
});