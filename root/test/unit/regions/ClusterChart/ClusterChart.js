/*global define, describe, it, expect */
define([
    'jscore/ext/mvp',
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/regions/ClusterChart/ClusterChart',
    '../../../test/utils/TestUtils'
], function (mvp, core, _, ClusterChartRegion, TestUtils) {
    'use strict';

    describe('ClusterChart Region', function () {

        xdescribe('Methods', function () {
            var element = core.Element.parse('<div class="eaVEApp-rClusterChartArea"></div>'),
                clusterRegion,
                eventBus;

            beforeEach(function() {
                eventBus = new core.EventBus();
                clusterRegion = new ClusterChartRegion({context: {eventBus: eventBus}, collection: {addEventHandler: function() {}, each: function () {}}, configurationData:{}});
                clusterRegion.start(element);
            });

            afterEach(function() {
                clusterRegion.stop();
            });

            describe('init', function () {
                it('should start with initiating a clusterWidget', function() {
                    expect(clusterRegion.clusterWidget).to.not.equal(undefined);
                });
            });

            describe('getData()', function () {
                it('should return data for the template', function() {
                    var d = clusterRegion.getData();
                    expect(d.uid).to.not.equal(undefined);
                    expect(d.span).to.equal("spanundefined"); // due to us not using the regionFactory to create the instance
                });
            });

            describe('onNewModel(model: Model)', function () {
                it('should make it possible to add multiple models', function() {
                    clusterRegion.onNewModel(new mvp.Model({eventType: 'MyEventType1', eventData: {jobInstance:"1"}}));
                    expect(_.size(clusterRegion.clusterWidget.activeData)).to.equal(1);

                    clusterRegion.onNewModel(new mvp.Model({eventType: 'MyEventType2', eventData: {jobInstance:"2"}}));
                    expect(_.size(clusterRegion.clusterWidget.activeData)).to.equal(2);
                });
            });

        });
    });
});