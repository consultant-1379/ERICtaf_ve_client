/*global define, describe, it, expect */
define([
    'jscore/core',
    'app/VisualizationEngineApp',
    'app/models/EventCollection',
    'app/regions/BaseRegion/BaseRegion'
], function (core, VisualizationEngineApp, EventCollection, BaseRegion) {
    'use strict';

    describe('BaseRegion', function () {
        var element = element = core.Element.parse('<div></div>'),
            baseRegion,
            collection;

        beforeEach(function() {
            var app = new VisualizationEngineApp();
            var container = document.createElement('div');
            container.innerHTML = '';
            app.start(container);

            collection = new EventCollection();
            baseRegion = new BaseRegion({context: {eventBus: {subscribe: function(){}}}, collection: collection});
        });

        afterEach(function() {
            if (baseRegion !== undefined) {
                baseRegion.stop();
            }
        });

        it('should be defined', function () {
            expect(BaseRegion).not.to.be.undefined;
        });

        it('should call afterOnStart on start', function () {
            sinon.stub(baseRegion, 'afterOnStart');

            baseRegion.start(element);

            sinon.assert.calledOnce(baseRegion.afterOnStart);
        });

        it('should call onNewModel when new models are added', function () {
            sinon.stub(baseRegion, 'onNewModel');

            baseRegion.start(element);
            collection.addModel({data: 'TestData', destination: [baseRegion.uid]});

            sinon.assert.calledOnce(baseRegion.onNewModel);
        });
    });
});