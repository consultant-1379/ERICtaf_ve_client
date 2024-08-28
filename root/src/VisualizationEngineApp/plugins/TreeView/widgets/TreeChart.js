define([
    'jscore/core',
    'app/plugins/TreeView/widgets/TreeChartView',
    'chartlib/base/d3',
    'app/lib/utils/EventController',
    'jscore/ext/utils/base/underscore'
], function(core, View, d3, EventController, _) {
    'use strict';

    return core.Widget.extend({
        View: View,

        init: function() {
            this.idCounter = 0;

            this.barHeight = 20;
            this.barWidth = 250;
            this.paddingX = 20;
            this.paddingY = 30;

            this.selectors = {
                type: 'eventType',
                testId: 'eventData.testId',
                name: 'eventData.name',
                jcatLog: 'eventData.logReferences.jcat_logs.uri',
                result: 'eventData.resultCode'
            };
            this.eventTypes = {
                started: [
                    'EiffelTestSuiteStartedEvent',
                    'EiffelTestCaseStartedEvent'
                ],
                finished: [
                    'EiffelTestSuiteFinishedEvent',
                    'EiffelTestCaseFinishedEvent'
                ],
                stepFinished: 'EiffelJobStepFinishedEvent'
            };

            this.clear();
        },

        onViewReady: function() {
        },

        onDOMAttach: function() {
            var svgArea = this.getElement().find('.eaVEApp-wTreeChart-svgArea');
            this.svg = d3.select(svgArea.element).append('svg:svg');
            this.vis = this.svg.append('svg:g')
                .attr('transform', 'translate(' + this.paddingX + ',' + this.paddingY + ')');

            this.tree = d3.layout.tree()
                .size([this.height, 100]);

            this.diagonal = d3.svg.diagonal()
                .projection(function(d) {
                    return [d.y, d.x];
                });
        },

        clear: function() {
            this.root = {
                name: 'Tests',
                children: [],
                x0: 0,
                y0: 0
            };
            this.eventCache = {};
        },

        redraw: function() {
            this.update(this.root);
        },

        update: function(data) {
            // Compute the flattened node list.
            // TODO use d3.layout.hierarchy
            if (this.tree == null) {
                return;
            }
            var nodes = this.tree.nodes(this.root);

            // Compute the layout.
            nodes.forEach(function(n, i) {
                n.x = i * (this.barHeight + 1);
            }.bind(this));

            // Update the node
            var width = 0;
            var height = 0;
            var node = this.vis.selectAll('g.node')
                .data(nodes, function(d) {
                    width = Math.max(width, d.y + this.barWidth);
                    height = Math.max(height, d.x + this.barHeight);
                    return d.id || (d.id = ++this.idCounter);
                }.bind(this));
            this.svg
                .attr('width', width + this.paddingX * 2)
                .attr('height', height + this.paddingY * 2);

            var nodeEnter = node.enter().append('svg:g')
                .attr('class', 'node')
                .attr('data-result', function(d) {
                    return d.result;
                })
                .attr('transform', function() {
                    return 'translate(' + data.y0 + ',' + data.x0 + ')';
                })
                .style('opacity', 1e-6);

            node.attr('data-result', function(d) {
                return d.result;
            });

            // Enter any new nodes at the parent's previous position.
            nodeEnter.append('svg:rect')
                .attr('y', -this.barHeight / 2)
                .attr('height', this.barHeight)
                .attr('width', this.barWidth)
                .attr('ry', 3)
                .attr('rx', 3)
                .attr('data-type', function(d) {
                    return d.type;
                })
                .attr('data-parent', function(d) {
                    if (d.children != null && d.children.length > 0) {
                        return true;
                    }
                })
                .attr('data-action', function(d) {
                    if (d.link != null) {
                        return true;
                    }
                })
                .on('click', function(d) {
                    if (d.link != null) {
                        window.open(d.link);
                    }
                }.bind(this));

            nodeEnter.append("svg:title")
                .text(function(d) {
                    return d.link;
                });

            nodeEnter.append('svg:text')
                .attr('dy', 3.5)
                .attr('dx', 5.5)
                .text(function(d) {
                    return d.name;
                });

            // Transition nodes to their new position.
            nodeEnter.transition()
                .attr('transform', function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                })
                .style('opacity', 1);

            node.transition()
                .attr('transform', function(d) {
                    return 'translate(' + d.y + ',' + d.x + ')';
                })
                .style('opacity', 1);

            // Transition exiting nodes to the parent's new position.
            node.exit().transition()
                .attr('transform', function() {
                    return 'translate(' + data.y + ',' + data.x + ')';
                })
                .style('opacity', 1e-6)
                .remove();

            // Update the links
            var link = this.vis.selectAll('path.link')
                .data(this.tree.links(nodes), function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert('svg:path', 'g')
                .attr('class', 'link')
                .attr('d', function() {
                    var o = {x: data.x0, y: data.y0};
                    return this.diagonal({source: o, target: o});
                }.bind(this))
                .transition()
                .attr('d', this.diagonal);

            // Transition links to their new position.
            link.transition()
                .attr('d', this.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .attr('d', function() {
                    var o = {x: data.x, y: data.y};
                    return this.diagonal({source: o, target: o});
                }.bind(this))
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },

        getData: function() {
            return { id: _.uniqueId('tree-chart-') };
        },

        addEventToScreen: function(model) {
            var dag = model.items[0];
            if (dag != null) {
                var dagIndex = _.reduce(dag, function(index, event) {
                    index[event.id] = event;
                    return index;
                }, {});
                this.traceDag(dagIndex, dag[0], this.root);
            }
            this.redraw();
        },

        traceDag: function(dagIndex, parentEvent, parentNode) {
            _.each(parentEvent.connection, function(conn) {
                var event = dagIndex[conn.id];
                if (event == null || event.id === parentEvent.id) {
                    return;
                }
                var id = event.uniqueId;
                var information = event.information;
                var nodeUpdate = this.createNode(information);
                if (_.contains(this.eventTypes.started, nodeUpdate.type)) {
                    var node = this.eventCache[id];
                    if (node != null) {
                        this.updateNode(node, nodeUpdate);
                    } else {
                        parentNode.children.push(nodeUpdate);
                        this.eventCache[id] = nodeUpdate;
                        node = nodeUpdate;
                    }
                    var testId = information[this.selectors.testId];
                    var match = testId.match(/^[a-z]+\-\d+/i);
                    if (match != null) {
                        node.link = 'http://jira-oss.lmera.ericsson.se/browse/' + match[0];
                    }
                    this.traceDag(dagIndex, event, node);
                } else if (_.contains(this.eventTypes.finished, nodeUpdate.type)) {
                    // Update node result
                    parentNode.result = information[this.selectors.result];
                } else if (nodeUpdate.type === this.eventTypes.stepFinished) {
                    // Update siblings with job step JCAT report link
                    var jcatLog = information[this.selectors.jcatLog];
                    if (jcatLog != null && jcatLog !== 'UNKNOWN') {
                        _.each(parentNode.children, function(childNode) {
                            childNode.link = jcatLog;
                        });
                    }
                } else {
                    // Skip this event and trace child with current parent node
                    this.traceDag(dagIndex, event, parentNode);
                }
            }, this);
        },

        createNode: function(information) {
            return {
                type: information[this.selectors.type],
                name: information[this.selectors.name],
                children: []
            };
        },

        updateNode: function(node, nodeUpdate) {
            node.type = nodeUpdate.type;
            node.name = nodeUpdate.name;
        }
    });
});
