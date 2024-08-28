/*global define, describe, it, expect */
define([
    'app/VisualizationEngineApp',
    'app/ext/LocationController'
], function (VisualizationEngineApp, LocationExt) {
    'use strict';

    xdescribe('LocationController', function () {
        var app;

        beforeEach(function () {
            app = new VisualizationEngineApp();
            var container = document.createElement('div');
            container.innerHTML = '';
            app.start(container);
        });

        afterEach(function () {
            window.location.hash = '';
        });

        it('should be defined', function () {
            expect(LocationExt).not.to.be.undefined;
        });

        it('should update the url when new regions are created', function () {
            var data = {title: 'TestRegion', factory: 'listRegion', span: 4};
            app.createRegion(data);
            expect(window.location.hash).to.equal('#main/listRegion/4');

            data = {title: 'TestRegion', factory: 'flowRegion', span: 7};
            app.createRegion(data);
            expect(window.location.hash).to.equal('#main/listRegion/4/flowRegion/7');
        });

        after(function () {
            app.stop();
        });

        it('should update the url when regions are removed', function () {
            var data = {title: 'TestRegion', factory: 'listRegion', span: 3};
            app.createRegion(data);
            data = {title: 'TestRegion', factory: 'flowRegion', span: 8};
            app.createRegion(data);
            data = {title: 'TestRegion', factory: 'pieRegion', span: 10};
            app.createRegion(data);

            app.removeRegion(app.activeRegions[0]);
            expect(window.location.hash).to.equal('#main/flowRegion/8/pieRegion/10');
            app.removeRegion(app.activeRegions[1]);
            expect(window.location.hash).to.equal('#main/flowRegion/8');
            app.removeRegion(app.activeRegions[0]);
            expect(window.location.hash).to.equal('#main/');
        });

        after(function () {
            app.stop();
        });

        it('should create regions when the url changes', function (done) {
            window.location.hash = '#main/pieRegion/12/flowRegion/7';

            // Give the app some time to process the hash change
            window.setTimeout(function () {
                expect(app.activeRegions.length).to.equal(2);
                done();
            }, 10);
        });

        after(function () {
            app.stop();
        });

    });
});