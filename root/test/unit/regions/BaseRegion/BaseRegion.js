/*global define, describe, it, expect */
define([
    'jscore/ext/mvp',
    'jscore/core',
    'app/regions/BaseRegion/BaseRegion'
], function (mvp, core, BaseRegion) {
    'use strict';

    describe('BaseRegion', function () {

        describe('Methods', function () {
            var element = core.Element.parse('<div class="eaVEApp-rTest"><header></header></div>'),
                testRegion,
                eventBus;

            beforeEach(function () {
                eventBus = new core.EventBus();
                testRegion = new BaseRegion({context: {eventBus: eventBus}, configurationData: {title: 'Test'}});
                testRegion.afterOnStart = sinon.spy();
                testRegion.start(element);
            });

            // afterEach(function () {
            //     testRegion.afterOnStart.reset();
            // });

            
            describe('onStart', function () {

                xit('should assign event handler for changeSizeEvent to the RegionHandler', function (done) {
                    eventBus.subscribe('changeSize', function (obj) {
                        expect(obj.region).to.equal(testRegion);
                        expect(obj.value).to.equal('Test');
                        done();
                    });

                    testRegion.regionHandler.trigger('changeSizeEvent', 'Test');
                });

                it('should assign event handler for removeRegionEvent to the RegionHandler', function (done) {
                    eventBus.subscribe('removeRegion', function (region) {
                        expect(region).to.equal(testRegion);
                        done();
                    });

                    testRegion.regionHandler.trigger('removeClicked');
                });

                xit('should assign event handler for removeSubscriptionEvent to the RegionHandler', function (done) {
                    eventBus.subscribe('unsubscribeMessageBus', function (value) {
                        expect(value).to.equal(testRegion.uid);
                        done();
                    });

                    testRegion.regionHandler.trigger('removeSubscriptionEvent', testRegion.uid);
                });

                xit('should call onNewModel when a new model has this region as destination', function (done) {
                    var model = new mvp.Model({destination: [testRegion.uid]}),
                        onNewModelSpy = sinon.spy(function (model) {
                            expect(onNewModelSpy.called).to.be.true;
                            done();
                        });

                    testRegion.onNewModel = onNewModelSpy;
                    eventBus.publish('modelAdded', model);
                });

                xit('should call onERFetch when events from ER have been fetched', function (done) {
                    var onERFetchSpy = sinon.spy(function (model) {
                        expect(onERFetchSpy.called).to.be.true;
                        done();
                    });

                    testRegion.onERFetch = onERFetchSpy;
                    eventBus.publish('er:fetchDone', testRegion.uid);
                });

                xit('should call onERFailed when fetch from ER fails', function (done) {
                    var onERFailedSpy = sinon.spy(function (model) {
                        expect(onERFailedSpy.called).to.be.true;
                        done();
                    });

                    testRegion.onERFailed = onERFailedSpy;
                    eventBus.publish('er:fetchFailed', testRegion.uid);
                });

                it('should call afterOnStart', function () {
                    expect(testRegion.afterOnStart.calledOnce).to.be.true;
                });
            });

            describe('getRegionHandler', function () {

                it('should return the RegionHandler object', function () {
                    testRegion.regionHandler = {
                        obj: 'RegionHandler'
                    };

                    expect(testRegion.getRegionHandler()).to.eql({obj: 'RegionHandler'});
                });
            });
        });
    });
});