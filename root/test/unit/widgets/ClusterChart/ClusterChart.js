/*global define, describe, it, expect */
define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/widgets/ClusterChart/ClusterChart'
], function (core, _, ClusterChart) {
    'use strict';

    describe('ClusterChart Widget', function () {

        describe('Methods', function () {
            var clusterChart,
            should = chai.should();

            var realEvent1 = {
                "domainId": "kista",
                "eventId": "d565c60f-0707-4d4c-8e67-18c71d2f440c",
                "eventTime": "2013-08-22T14:36:16.000Z",
                "eventType": "EiffelJobStartedEvent",
                "inputEventIds": [ "" ],
                "eventData": {
                    "jobInstance": "1_LMDeliveryPoller_rnc_main_89.1",
                    "jobExecutionId": "544",
                    "resultCode": "SUCCESS"
                }
            },
            realEvent2 = {
                "domainId": "kista",
                "eventId": "8da13726-b909-4449-9e56-e766a7ac75d6",
                "eventTime": "2013-08-22T14:36:19.000Z",
                "eventType": "EiffelJobFinishedEvent",
                "inputEventIds": [ "" ],
                "eventData": {
                    "jobInstance": "2_LMBaselineBuilder_rnc_main_89.1",
                    "jobExecutionId": "393",
                    "resultCode": "FAILURE"
                }
            };

            beforeEach(function() {
                clusterChart = new ClusterChart({parentUID: this.uid});
            });

            afterEach(function() {
                clusterChart.destroy();
                clusterChart = undefined;
            });

            describe('init', function () {
                it('should start with initiating a clusterChart', function() {
                    should.exist(clusterChart);
                });
                it('should have set up initial values properly', function () {
                    clusterChart.settings.firstRun.should.equal(true);
                    clusterChart.settings.aspectRatio.should.equal(1);
                    clusterChart.settings.clusterBase.should.equal("eventType");

                    clusterChart.nodeSettings.edge_show_arrow.should.equal(true);
                    clusterChart.nodeSettings.cols.should.equal(2);
                    clusterChart.nodeSettings.oneNode.should.equal(false);
                    clusterChart.nodeSettings.node_draggable.should.equal(true);
                });

            });

            describe('setColumns(n: number)', function () {
                it('should allow changing the column count', function() {
                    clusterChart.setColumns(1);
                    clusterChart.nodeSettings.cols.should.equal(1);
                });
            });

            describe('setFadeout(timeInSeconds: number)', function () {
                it('should allow setting a fadeout time', function() {
                    clusterChart.fadeout = function() {return;}
                    should.not.exist(clusterChart.fadeInterval);
                    clusterChart.setFadeout(60);
                    clusterChart.fadeInterval.should.be.a("number");
                });
                it('should allow clearing an interval completely', function () {
                    should.not.exist(clusterChart.fadeInterval);
                    clusterChart.setFadeout(0);
                    should.not.exist(clusterChart.fadeInterval);
                });
                it('should handle incorrect values', function () {
                    clusterChart.setFadeout(-60);
                    should.not.exist(clusterChart.fadeInterval);
                    clusterChart.setFadeout("hello world");
                    should.not.exist(clusterChart.fadeInterval);
                });
            });

            describe('setAspectRatio(aRatio: number)', function () {
                it('should set a different aspectRatio', function() {
                    clusterChart.settings.aspectRatio.should.equal(1);
                    clusterChart.setAspectRatio(1);
                    clusterChart.settings.aspectRatio.should.equal(1/10);
                    clusterChart.setAspectRatio(10);
                });
                it('should handle bad aspectRatio values', function() {
                    clusterChart.settings.aspectRatio.should.equal(1);
                    clusterChart.setAspectRatio(-60);
                    clusterChart.settings.aspectRatio.should.equal(1);
                    clusterChart.setAspectRatio("hello world");
                    clusterChart.settings.aspectRatio.should.equal(1);
                });
            });

            describe('setOneNode(oNode: boolean)', function () {
                it('should set the oneNode mode variable', function() {
                    clusterChart.setOneNode(true);
                    clusterChart.nodeSettings.oneNode.should.equal(true);
                    clusterChart.setOneNode(false);
                    clusterChart.nodeSettings.oneNode.should.equal(false);
                });
            });

            describe('setClusterBase(cBase: string)', function () {
                it('should set the clustering base', function() {
                    clusterChart.setClusterBase("eventTime");
                    clusterChart.settings.clusterBase.should.equal("eventTime");
                    clusterChart.setClusterBase("eventData.jobInstance");
                    clusterChart.settings.clusterBase.should.equal("eventData.jobInstance");
                });
            });

            describe('createItem(event: Object)', function () {
                it('should create an item from an event object', function() {
                    var event1 = {eventTime: "xxx", eventId: 1, eventData: { jobInstance: "event1"}};

                    var item1 = clusterChart.createItem(event1);
                    item1.eventId.should.equal(1);
                    item1.textmatrix[0][1].should.equal("xxx");
                    item1.rate.should.equal("SUCCESS");
                });
                it('should not crash from faulty events (required?)', function() {
                    var event2 = {};
                    var item2 = clusterChart.createItem(event2);
                    should.not.exist(item2.eventId);
                    item2.textmatrix[0][1].should.equal("");
                    item2.rate.should.equal("SUCCESS");
                });
            });

            describe('handleNewEvent(event: Object)', function () {
                it('should handle new events and sort them into activeData when applicable', function() {
                    sinon.stub(clusterChart, "createItem").returns({
                        id: 0,
                        eventId: "d565c60f-0707-4d4c-8e67-18c71d2f440c",
                        textmatrix: [[""]],
                        rate: "SUCCESS",
                        added: "2013-08-22T14:36:16.000Z"
                    });

                    _.size(clusterChart.activeData).should.equal(0);
                    clusterChart.handleNewEvent(realEvent1);
                    _.size(clusterChart.activeData).should.equal(1);
                    clusterChart.handleNewEvent(realEvent1);
                    _.size(clusterChart.activeData).should.equal(1);
                });
                it('should handle new events but not sort them into activeData when not applicable', function() {
                    clusterChart.activeData = [];
                    clusterChart.settings.clusterBase = "Flurrup"
                    clusterChart.handleNewEvent(realEvent1);
                    _.size(clusterChart.activeData).should.equal(0);
                });
            });

            describe('arrangeNodes()', function () {
                it('should turn an item in activeData to a node', function() {
                    clusterChart.handleNewEvent(realEvent1);

                    clusterChart.arrangeNodes();
                    clusterChart.nodes[0].x.should.equal(0);
                    clusterChart.nodes[0].y.should.equal(0);
                });
                it('should turn multiple items in activeData to multiple nodes when normal mode is active', function() {
                    clusterChart.handleNewEvent(realEvent1);
                    clusterChart.handleNewEvent(realEvent2);

                    should.not.exist(clusterChart.nodes);
                    clusterChart.arrangeNodes();
                    clusterChart.nodes.length.should.equal(2);
                });
                it('should turn multiple items in activeData to a single nodes when single node mode is active', function() {
                    clusterChart.handleNewEvent(realEvent1);
                    clusterChart.handleNewEvent(realEvent2);
                    clusterChart.setOneNode(true);

                    should.not.exist(clusterChart.nodes);
                    clusterChart.arrangeNodes();
                    clusterChart.nodes.length.should.equal(1);
                });
            });

            describe('clear()', function () {
                it('should adjust svg to fit nodes', function() {
                    clusterChart.clear();
                    clusterChart.svg.node().viewBox.baseVal.height.should.equal(0);

                    // add a fake object to nodes
                    clusterChart.nodes = [{ x: 0, y: 0 }];

                    clusterChart.clear();

                    clusterChart.svg.node().viewBox.baseVal.height.should.not.equal(0);
                    clusterChart.svg.node().viewBox.baseVal.height.should.equal(clusterChart.nodeSettings.boxHeight);
                });
            });

            describe('historicalToolTip()', function () {
                beforeEach(function() {
                    // add a fake object to nodes
                    clusterChart.nodes = [{ x: 0, y: 0 }];
                    clusterChart.initializeSVG();

                    var onCallback;
                    clusterChart.svg_g = {
                        selectAll: function() {
                            return {
                                on: function(eventStr, callback) {
                                    onCallback = callback;
                                }
                            };
                        }
                    }
                    clusterChart.getNodeHistory = function () { return "body"; }

                    clusterChart.historicalToolTip();
                    clusterChart.d3 = { event: { pageX:0, pageY:0 } };

                    it('should create a popup on click', function () {
                        should.not.exist(clusterChart.popup);
                        onCallback({title: "hello"});           // one click to create
                        should.exist(clusterChart.popup);
                    });
                    it('should destroy a popup on second click', function () {
                        onCallback({title: "hello"});
                        should.exist(clusterChart.popup);
                        onCallback({title: "hello"});
                        should.not.exist(clusterChart.popup);
                    });
                    it('should create a popup on click', function () {
                        onCallback({title: "hello"});
                        should.exist(clusterChart.popup);
                        clusterChart.popup.trigger('close');
                        should.not.exist(clusterChart.popup);
                    });
                });
            });
            describe('getNodeHistory(identifier: string)', function () {
                var returnValue;

                describe('normal mode', function () {
                    beforeEach(function() {
                        var EventController = {
                            getEventValueFromKey: function(attributes, clusterBase) {
                                return attributes.eventData.jobInstance;
                            }
                        };
                    });

                    it('should get no history when there is no history in normal mode', function() {
                        returnValue = clusterChart.getNodeHistory("NOMATCH");
                        (returnValue.getText()).should.equal("");
                    });
                });
                describe('One Node mode', function () {

                    beforeEach(function () {
                        clusterChart.activeData = [{
                            eventData: {
                                jobInstance: "JIName1"
                            }
                        },
                        {
                            eventData: {
                                jobInstance: "JIName1.1"
                            }
                        },
                        {
                            eventData: {
                                jobInstance: "JIName2"
                            }
                        }];
                        clusterChart.getEventFromId = function (eventId) {
                            return "Line";
                        }
                    });

                    it('should get node history given any base', function() {
                        clusterChart.nodeSettings.oneNode = true;

                        returnValue = clusterChart.getNodeHistory("");
                        (returnValue.getText().trim().replace(/^\s*[\r\n]/gm, "").split("\n").length).should.equal(3);

                        returnValue = clusterChart.getNodeHistory("NOMATCH");
                        (returnValue.getText().trim().replace(/^\s*[\r\n]/gm, "").split("\n").length).should.equal(3);
                    });
                });
            });

            describe('fadeout()', function () {
                var d3rect;
                var onCallback;

                beforeEach(function() {

                    // add a fake object to nodes
                    clusterChart.activeData["JIName1"] = {
                        eventData: {
                            jobInstance: "JIName1",
                            resultCode: "SUCCESS"
                        }
                    };

                    clusterChart.nodes = [{ x: 0, y: 0, rate: "SUCCESS" }];
                    clusterChart.initializeSVG();

                    clusterChart.svg_g = {
                        selectAll: function(a) {
                            return {
                                each: function(callback) {
                                    onCallback = callback;
                                }
                            }
                        }
                    };

                    clusterChart.svg.append("title").property("id", "JIName1");
                    d3rect = clusterChart.svg.append("rect").style("opacity", 1);

                    clusterChart.d3.select = function (a) {
                        return {
                            select: function(a) {
                                return d3rect;
                            }
                        };
                    };
                    clusterChart.fadeout();
                });

                it('should fade out a node by 20% if run once', function() {
                    (d3rect.node().style.opacity).should.equal("1");
                    onCallback();
                    (d3rect.node().style.opacity).should.equal("0.8");
                });
                it('should fade out a node by 100% if run five times', function() {
                    (d3rect.node().style.opacity).should.equal("1");
                    onCallback(); //0.8
                    onCallback(); //0.6
                    onCallback(); //0.4
                    onCallback(); //0.2
                    onCallback();
                    (d3rect.node().style.opacity).should.equal("0");

                });
                it('should remove a nodes info from activeData if run six times', function() {
                    (d3rect.node().style.opacity).should.equal("1");
                    onCallback(); //0.8
                    onCallback(); //0.6
                    onCallback(); //0.4
                    onCallback(); //0.2
                    onCallback(); //0

                    should.exist(clusterChart.activeData["JIName1"]);
                    onCallback(); // removed
                    should.not.exist(clusterChart.activeData["JIName1"]);
                });
            });

            describe('redraw()', function () {
                var returnValue;

                beforeEach(function() {
                    returnValue = "";
                    clusterChart.clear = function() {returnValue+="do";};
                    clusterChart.drawNodes = function() {returnValue+="re";};
                    clusterChart.historicalToolTip = function() {returnValue+="mi";};
                });

                it('should not run if this.nodes is empty', function() {
                    should.not.exist(clusterChart.nodes);
                    clusterChart.redraw();
                    returnValue.should.equal("");
                });
                it('should run sub-functions if this.nodes is not empty', function() {
                    clusterChart.nodes = [{ x: 0, y: 0, rate: "SUCCESS" }];
                    should.exist(clusterChart.nodes);
                    clusterChart.redraw();
                    returnValue.should.equal("doremi");
                });
            });

            describe('getData()', function () {
                it('should return a unique id everytime it is run', function() {
                    (clusterChart.getData().id).should.not.equal(clusterChart.getData().id)
                });
            });

            describe('update(event: object)', function () {
                var returnValue;
                beforeEach(function () {
                    returnValue = ""
                    clusterChart.handleNewEvent = function (event) {return event.boolean;};
                    clusterChart.arrangeNodes = function() {returnValue+="do";};
                    clusterChart.redraw = function() {returnValue+="re";};
                });

                it('should update the nodes when a new event is handled', function() {
                    returnValue.should.equal("");
                    clusterChart.update({boolean: true});
                    returnValue.should.equal("dore");
                });
                it('should not update the nodes when a new event is not handled', function() {
                    returnValue.should.equal("");
                    clusterChart.update({boolean: false});
                    returnValue.should.equal("");
                });
            });

            describe('sortObject(o: object)', function () {
                var returnValue, originalObject;
                beforeEach(function () {
                    originalObject = {"1a": "do", "3a": "mi", "2a": "re"};
                });

                it('should return a sorted object', function() {
                    (_.keys(originalObject)).should.eql(["1a","3a","2a"]);
                    returnValue = clusterChart.sortObject(originalObject);
                    (_.keys(returnValue)).should.eql(["1a","2a","3a"]);
                });
            });

        });
    });
});