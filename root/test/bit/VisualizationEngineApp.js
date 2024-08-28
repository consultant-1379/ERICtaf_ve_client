/*global define, describe, it, expect */
define([
    'app/VisualizationEngineApp'
], function (VisualizationEngineApp) {
    'use strict';

    describe('VisualizationEngineApp', function () {

        it('VisualizationEngineApp should be defined', function () {
            expect(VisualizationEngineApp).not.to.be.undefined;
        });

        it('should initialize things', function () {
            var app = new VisualizationEngineApp();
            var container = document.createElement('div');
            container.innerHTML = '';
            app.start(container);

            expect(app.activeRegions.length).to.equal(0);
            expect(app.eventCollection.size()).to.equal(0);
            expect(app.lc).not.to.be.undefined;
            expect(app.configurationRegion).not.to.be.undefined;
        });
    });
});