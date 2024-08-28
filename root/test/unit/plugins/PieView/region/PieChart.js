/*global define, describe, it, expect */
define([
    'jscore/ext/mvp',
    'jscore/core',
    'app/plugins/PieView/region/PieView',
    '../../../../test/utils/TestUtils'
], function (mvp, core, PieChart, TestUtils) {
    'use strict';

    describe('PieChart', function () {

        var should = chai.should();

        describe('Methods', function () {
            var element = core.Element.parse('<div class="eaVEApp-rPieChartArea-pie"></div>'),
                pieRegion,
                eventBus;

            beforeEach(function() {
                eventBus = new core.EventBus();
                pieRegion = new PieChart({context: {eventBus: eventBus}, configurationData:{}});
                pieRegion.start(element);
            });

            describe('init', function () {
                it('should start with initial values', function() {
                    pieRegion.model.should.not.be.undefined;
                });
            });

            xdescribe('afterOnStart', function () {
                it('should assign event handler for addSubscriptionEvent to the RegionHandler', function (done) {
                    pieRegion.getElement = function () {
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

                    pieRegion.regionHandler.trigger('addSubscriptionEvent', 'Test');
                });

                it('should set atStart to false on addSubscriptionEvent', function (done) {
                    pieRegion.getElement = function () {
                        return {
                            find: function (element) {
                                return {
                                    remove: function () {}
                                };
                            }
                        };
                    }

                    eventBus.subscribe('subscribeMessageBus', function () {
                        expect(pieRegion.atStart).to.be.false;
                        done();
                    });

                    pieRegion.regionHandler.trigger('addSubscriptionEvent');
                });

                it('should remove h1 tag on first addSubscriptionEvent', function (done) {
                    var removeSpy = sinon.spy();
                    pieRegion.getElement = function () {
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

                    pieRegion.regionHandler.trigger('addSubscriptionEvent');
                });

                it('should not call remove on h1 tag after first addSubscriptionEvent', function (done) {
                    var removeSpy = sinon.spy(),
                        subscribeMessageBusCallCount = 0;
                    pieRegion.getElement = function () {
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

                    pieRegion.regionHandler.trigger('addSubscriptionEvent');
                    pieRegion.regionHandler.trigger('addSubscriptionEvent');
                    pieRegion.regionHandler.trigger('addSubscriptionEvent');
                });
            });

            describe('onNewModel', function () {

                it('should save an event in the pie chart model', function () {
                    pieRegion.onNewModel({
                        items: [
                            {label: 'Test1', value: 1},
                            {label: 'Test2', value: 2},
                            {label: 'Test3', value: 3}
                        ]
                    });

                    pieRegion.pieChart.pieData.should.eql({
                        items: [
                            {label: 'Test1', value: 1},
                            {label: 'Test2', value: 2},
                            {label: 'Test3', value: 3}
                        ]
                    });
                });
            });

            describe('pieClickHandler', function () {

                it('should destroy popup', function() {
                    var mouse = {clientX: 0, clientY: 0};

                    pieRegion.onNewModel({
                        items: [
                            {label: 'Test1', value: 1},
                            {label: 'Test2', value: 2},
                            {label: 'Test3', value: 3}
                        ]
                    });

                    pieRegion.pieChart.pieClickHandler([], mouse);
                    pieRegion.pieChart.pieClickHandler([], mouse);

                    should.not.exist(pieRegion.pieChart.popup)

                });

                it('should trigger popup to close', function() {
                    var mouse = {clientX: 0, clientY: 0};

                    pieRegion.onNewModel({
                        items: [
                            {label: 'Test1', value: 1},
                            {label: 'Test2', value: 2},
                            {label: 'Test3', value: 3}
                        ]
                    });

                    pieRegion.pieChart.pieClickHandler([], mouse);
                    pieRegion.pieChart.popup.trigger('close', "");

                    //popup is not set to undefined
                    should.exist(pieRegion.pieChart.popup);
                    should.not.exist(pieRegion.getElement().find('.eaVEApp-wPopup'));
                });
            });

            xdescribe('AspectRatio & default Values ', function () {
                it('should setAspectRatio() by triggering changeAspectRatioEvent', function () {

                    pieRegion.regionHandler.trigger('changeAspectRatioEvent', 5);
                    pieRegion.pieChart.pieRegionSettings.pieAspect.should.eql(0.5);

                    //this should never happen as spinner GUI is never zero
                    pieRegion.regionHandler.trigger('changeAspectRatioEvent', 0);
                    pieRegion.pieChart.pieRegionSettings.pieAspect.should.eql(0.0);

                });

                it('should setDefaultRatio() by triggering defaultAspectRatioEvent', function () {
                    var defaultValue = 0.7;
                    pieRegion.pieChart.aspectRatio = 0.6;
                    pieRegion.regionHandler.trigger('defaultAspectRatioEvent', "");
                    pieRegion.pieChart.pieRegionSettings.pieAspect.should.equal(defaultValue);

                    pieRegion.pieChart.aspectRatio = 0.0;
                    pieRegion.regionHandler.trigger('defaultAspectRatioEvent', "");
                    pieRegion.pieChart.pieRegionSettings.pieAspect.should.equal(defaultValue);

                });
            });
        });
    });
});