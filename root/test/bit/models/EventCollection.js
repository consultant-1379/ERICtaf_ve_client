/*global define, describe, it, expect */
define([
    'app/models/EventCollection'
], function (EventCollection) {
    'use strict';

    describe("EventCollection", function () {

        it('should be defined', function () {
            expect(EventCollection).not.to.be.undefined;
        });
    });
});