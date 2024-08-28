/*global define, describe, it, expect */
define([
    'app/plugins/FlowView/widgets/FlowChart/FlowChart',
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/lib/debugEvents',
    'chartlib/base/d3'
], function (FlowChart, core, _, Events, d3) {
    'use strict';

    describe('FlowChart', function () {

        var should = chai.should();
        var model = {
                "modelMetaData" : {"Type" : "directedAcyclicGraphModel", "Version" : "1.2.3"},
                "items" : [
                  [{"id": 0,
                    "type"      : "events",
                    "uniqueId"  : "0c7d5153-7980-44e9-8542-b6292f22a1c8",
                    "title"     : "EiffelBaselineDefinedEvent",
                    "information": {"domainId":"kista", "Status":"Unknown"},
                    "status"    : "UNKNOWN",
                    "connection": [{"id":2,"type":"inputEventId"},{"id":3,"type":"inputEventId"}]
                   },            
                   {"id": 2,
                    "type"      : "events",
                    "uniqueId"  : "0c7d5153-7980-44e9-8542-b6292f22a1c0",
                    "title"     : "EiffelBaselineDefinedEvent",
                    "information": {"domainId":"kista", "Status":"Success"},
                    "status"    : "SUCCESS",
                    "connection": []
                   },
                   {"id": 3,
                    "type"      : "events",
                    "uniqueId"  : "0c7d5153-7980-44e9-8542-b6292f22a1d1",
                    "title"     : "EiffelBaselineDefinedEvent",
                    "information": {"domainId":"kista", "Status":"Success"},
                    "status"    : "SUCCESS",
                    "connection": []
                   }             
                 ],
                 [{"id": 1,
                    "type"      : "events",
                    "uniqueId"  : "0c7d5153-7980-44e9-8542-b6292f22a1c9",
                    "title"       : "EiffelBaselineDefinedEvent",
                    "information": {"domainId":"kista", "Status":"Success"},
                    "status"    : "SUCCESS",
                    "connection": []
                   }
                 ]
                ]
              };
        var element = core.Element.parse('<div class="eaVEApp-wFlowChart-flowChartArea"></div>'),
        flowChart;

        beforeEach(function() {
            flowChart = new FlowChart({aspectRatio: 0.2, context: {eventBus: {subscribe: function(){}}}, collection: {addEventHandler: function() {}}});
        });

        afterEach(function() {
            flowChart = null;
        });

        describe('Methods', function () {
            describe('getSettings()', function () {
                it('should return correct settings when a default Flowchart is created', function () {
                    var retrievedSettings,
                        expectedSettings = {
                            edge_show_arrow: true,
                            data: []
                        };

                    retrievedSettings = flowChart.getSettings();

                    expectedSettings.should.eql(retrievedSettings);
                });
            });

            describe('getData()', function () {
                it('should give a unique id everytime it is called', function () {
                    var result = flowChart.getData().id
                    flowChart.getData().id.should.not.equal(result);
                });
            });

            describe('modelToGraphData', function () {
                beforeEach(function () {
                    // override the refresh function
                    flowChart.refresh = function () {};
                });

                it('should convert model to the data set used to build graph', function () {
                    flowChart.data[0].length.should.equal(0);
                    flowChart.data = flowChart.modelToGraphData(model.items);
                    should.exist(flowChart.data[0]);
                    flowChart.data[0][0].eventId.should.equal(model.items[0][0].uniqueId);
                });

                it('should send an event and a job finished event to be handled and update resultCode of event in handleEvent', function () {
                    flowChart.data[0].length.should.equal(0);
                    flowChart.data = flowChart.modelToGraphData(model.items);
                    flowChart.data[0].length.should.equal(3);
                    flowChart.data[0][0].rate.should.equal("UNKNOWN");
                    flowChart.data[1][0].rate.should.not.equal("UNKNOWN");
                });

                it('should send a flow of events and see if the parent node is created', function () {
                    flowChart.data[0].length.should.equal(0);
                    flowChart.data = flowChart.modelToGraphData(model.items);
                    should.exist(flowChart.data[0][1]);

                });

                
            });
        });

        describe('Graphics', function () {

            it('Start clear function for first time and then interate through it again making sure elements still have there references ', function () {
                flowChart._parent = true;
                flowChart._parent.element = element;
                flowChart.updateGraph(model.items);

                flowChart.clear();

                should.exist(flowChart.svgArea);
                should.exist(flowChart.svg);
                should.exist(flowChart.svg_g);

                flowChart.firstRun = false;
                flowChart.clear();
                should.exist(flowChart.svgArea);
                should.exist(flowChart.svg);
                should.exist(flowChart.svg_g);
            });

            it('Test to check that the nodes are drawn', function () {
                flowChart._parent = true;
                flowChart._parent.element = element;
                flowChart.onAttach();
                flowChart.updateGraph(model.items);

                flowChart.redraw();

                should.exist(flowChart.svg_g);
                should.exist(flowChart.drawNodes(flowChart.svg_g, flowChart.nodes, flowChart.nodeSettings))
                should.exist(flowChart.svg_g.selectAll('rect'));
            });

        });
        describe('Refresh and Bind data', function () {

             it('Check the refresh of data and that the events are binding to the to the this.nodes array', function () {
                flowChart.redraw = function() {};

                should.not.exist(flowChart.getSettings().data[0]);
                flowChart.updateGraph(model.items);
                should.exist(flowChart.getSettings().data[0]);
                should.exist(flowChart.nodes);
                flowChart.nodes.length.should.eql(3)
            });
        });
        describe('Tabs', function () {
            it('Trigger mouse click of Tabs', function () {
                flowChart.refresh = function() {};
                flowChart._parent = true
                flowChart._parent.element = element;
                flowChart.onAttach();
                flowChart.updateGraph(model.items);
                
                var olddata = flowChart.getSettings().data;
                flowChart.tabs.trigger('tabselect', "title", 1);
                olddata.should.not.eql(flowChart.getSettings().data);

            });
        });
    });
});