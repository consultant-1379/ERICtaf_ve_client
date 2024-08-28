/*global define, describe, it, expect */
define([
    'jscore/ext/mvp',
    'jscore/core',
    'app/plugins/FlowView/region/FlowView',
    'app/lib/debugEvents',
    '../../../../test/utils/TestUtils'
], function (mvp, core, FlowChart, Events, TestUtils) {
    'use strict';

    describe('FlowChart Region', function () {

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
                    "connection": [{"to":2,"type":"inputEventId"},{"to":3,"type":"inputEventId"}]
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
        var event1 = Events.Event1();
        var event2 = Events.Event2();
        var event3 = Events.Event3();
        var event4 = Events.Event4();
        var event5 = Events.Event5();
        var event6 = Events.Event6();

        describe('Methods', function () {
             var element = core.Element.parse('<div class="eaVEApp-wFlowChart-flowChartArea"></div>'),
             flowRegion,
             eventBus;

            beforeEach(function() {
                eventBus = new core.EventBus();
                flowRegion = new FlowChart({context: {eventBus: eventBus}, collection: {addEventHandler: function() {}}, configurationData:{},parentUID:"this_uid"});
                flowRegion.start(element);
            });

            describe('init', function () {
                it('should start with initial values', function() {
                    flowRegion.afterOnStart();
                    flowRegion.flowChart.should.not.equal(null);

                });
            });

            describe('onNewModel', function () {
                it('sending multiple event models to flow region ', function() {
                    flowRegion.refresh = function () {};

                    flowRegion.onNewModel(model);

                    should.exist(flowRegion.flowChart.getSettings().data[0]);
                });
            });

            describe('afterOnStart', function () {
                xit('should assign event handler for addSubscriptionEvent to the RegionHandler', function (done) {
                    flowRegion.getElement = function () {
                        return {
                            find: function (element) {
                                return {
                                    remove: function () {}
                                };
                            }
                        };
                    }

                    eventBus.subscribe('subscribeMessageBus', function (value) {
                        expect(value.eventBody.query).to.equal('Test');
                        done();
                    });

                    flowRegion.regionHandler.trigger('addSubscriptionEvent', 'Test');
                });

                xit('should set atStart to false on addSubscriptionEvent', function (done) {
                    flowRegion.getElement = function () {
                        return {
                            find: function (element) {
                                return {
                                    remove: function () {}
                                };
                            }
                        };
                    }

                    eventBus.subscribe('subscribeMessageBus', function () {
                        expect(flowRegion.atStart).to.be.false;
                        done();
                    });

                    flowRegion.regionHandler.trigger('addSubscriptionEvent');
                });

                xit('should remove h1 tag on first addSubscriptionEvent', function (done) {
                    var removeSpy = sinon.spy();
                    flowRegion.getElement = function () {
                        return {
                            find: function (element) {
                                return {
                                    remove: removeSpy
                                };
                            }
                        };
                    }

                    eventBus.subscribe('subscribeMessageBus', function () {
                        expect(removeSpy.called).to.be.true;
                        done();
                    });

                    flowRegion.regionHandler.trigger('addSubscriptionEvent');
                });

                xit('should not call remove on h1 tag after first addSubscriptionEvent', function (done) {
                    var removeSpy = sinon.spy(),
                        subscribeMessageBusCallCount = 0;
                    flowRegion.getElement = function () {
                        return {
                            find: function (element) {
                                return {
                                    remove: removeSpy
                                };
                            }
                        };
                    }

                    eventBus.subscribe('subscribeMessageBus', function () {
                        if (++subscribeMessageBusCallCount > 2) {
                            expect(removeSpy.calledOnce).to.be.true;
                            done();
                        }
                    });

                    flowRegion.regionHandler.trigger('addSubscriptionEvent');
                    flowRegion.regionHandler.trigger('addSubscriptionEvent');
                    flowRegion.regionHandler.trigger('addSubscriptionEvent');
                });
            });

            describe('AspectRatio & default Values', function () {
                xit('Aspect Ratio should change by triggering of changeAspectRatioEvent', function () {
                    flowRegion.resizeChart = function() {};

                    flowRegion.regionHandler.trigger('changeAspectRatioEvent', 5);
                    flowRegion.aspectRatio.should.eql(0.5);

                    //this should never happen as spinner GUI is never zero
                    flowRegion.regionHandler.trigger('changeAspectRatioEvent', 0);
                    flowRegion.aspectRatio.should.eql(0.0);
                });

                xit('setDefaultRatio() by triggering defaultAspectRatioEvent', function () {
                    var defaultValue = 0.8;
                    flowRegion.aspectRatio = 0.6;
                    flowRegion.resizeChart = function() {};

                    flowRegion.regionHandler.trigger('defaultAspectRatioEvent', true);
                    flowRegion.aspectRatio.should.eql(defaultValue);

                    flowRegion.aspectRatio = 0.0;
                    flowRegion.regionHandler.trigger('defaultAspectRatioEvent', true);
                    flowRegion.aspectRatio.should.eql(defaultValue);
                });
            });

        });
    });
});