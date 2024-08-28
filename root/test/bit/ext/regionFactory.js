/*global define, describe, it, expect */
define([
    'app/ext/regionFactory',
    'app/regions/PieChart/PieChart',
    'app/regions/FlowChart/FlowChart'
], function (regionFactory, PieRegion, FlowRegion) {
    'use strict';

    describe('regionFactory', function () {

        it('should be defined', function () {
            expect(regionFactory).not.to.be.undefined;
        });


        it('should create a PieChartArea region', function () {
            var region = regionFactory.create('pieRegion', {context: null, collections: {eventCollection: {addEventHandler: function() {}}}});

            expect(region).to.be.an.instanceof(PieRegion);
        });

        it('should create a FlowChartArea region', function () {
            var region = regionFactory.create('flowRegion', {context: null, collections: {eventCollection: {addEventHandler: function() {}}}});

            expect(region).to.be.an.instanceof(FlowRegion);
        });
    });
});