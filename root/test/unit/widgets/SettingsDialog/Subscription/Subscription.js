/*global define, describe, it, expect */
define([
    'app/widgets/SettingsDialog/Subscription/Subscription',
    'app/widgets/SettingsDialog/Subscription/ExistingSubscriptionRow/ExistingSubscriptionRow'
], function (Subscription, ExistingSubscriptionRow) {
    'use strict';

    describe('Subscription', function () {
        var should = chai.should();
        describe('Methods', function () {
            var subscription = new Subscription();

                var goodMessage1 = "all",
                    goodMessage2 = "hello=world",
                    goodMessage3 = "eventType";

                var badMessage1 = "",
                    badMessage2 = "::::",
                    badMessage3 = "!#¤%&/()=?`^*_;@£$€{[]}\\";

                it('checkValue() good strings', function () {
                    subscription.checkValue(goodMessage1).should.equal(true);
                    subscription.checkValue(goodMessage2).should.equal(true);
                     subscription.checkValue(goodMessage3).should.equal(true);
                });
                it('checkValue() bad strings', function () {
                    subscription.checkValue(badMessage1).should.equal(false);
                    subscription.checkValue(badMessage2).should.equal(false);
                    subscription.checkValue(badMessage3).should.equal(false);               
                });
        });
        describe('Subscription', function () {
            var subscription = new Subscription();
                it('add and remove subscription from widget', function () {
                    var sub = "Test:Test"
                   subscription.addSubscription(sub);
                   subscription.criteriaList.length.should.equal(1);
                   var row = new ExistingSubscriptionRow({name: sub});
                   subscription.removeSubscription(row);
                   subscription.criteriaList[0].softDelete.should.equal(true);

                });

        });
    });
});