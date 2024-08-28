/*global define, describe, it, expect */
define([
    'app/widgets/TableChart/TableChart',
    'app/models/EventCollection'
], function (TableChart,EventCollection) {
    'use strict';

    describe("TableChart", function () {
        var table, collection;
        beforeEach(function() {
            collection = new EventCollection();
            table = new TableChart({
                eventCollection: collection
            });
        });
        it('should be defined', function () {
            expect(TableChart).to.not.be.undefined;
        });
        it('should initialize things', function () {
            expect(table.eventCollection.size()).to.equal(0);
        });
    });
});