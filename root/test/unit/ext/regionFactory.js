/*global define, describe, it, expect */
define([
    'app/ext/regionFactory',
], function (regionFactory) {
    'use strict';

    describe('regionFactory', function () {

        describe('Methods', function () {

            it('create(type: String, options: Object)', function () {
                var region;

                expect(regionFactory.create.bind('PieView', {context: null, plugin: {}, configurationData:{type: 'PieView'}})).to.throw(Error);
                //expect(region.options.title).to.equal('PieView');

                //region = regionFactory.create('FlowView', {context: null, plugin: {}, configurationData:{type: 'FlowView'}});
                //expect(region.options.title).to.equal('FlowView');
            });
        });
    });
});