/*global define, describe, it, expect */
define([
    'app/lib/utils/EventController'
], function (EventController) {
    'use strict';

    describe('EvenController', function () {
       var should = chai.should();
        describe('Methods', function () {
            var event1 = {
                    "id":"d45cca9f-94ca-4fab-a83c-386b3c1660ff",
                    "domainId": "kista",
                    "eventId": "d45cca9f-94ca-4fab-a83c-386b3c1660ff",
                    "eventType": "EiffelArtifactModifiedEvent2",
                    "eventTime": "2013-06-28T08:56:24.992Z",
                    "eventData":{
                        "jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",
                        "jobExecutionId":"544",
                        "resultCode": "SUCCESS"
                    },
                    "parent":{
                        "children":"1_LMDeliveryPoller_rnc_main_89.1",
                        "jobExecutionId":"544",
                        "resultCode": "SUCCESS"
                    },
                    "children":{
                        "children":"1_LMDeliveryPoller_rnc_main_89.1",
                        "jobExecutionId":"544",
                        "resultCode": "SUCCESS"
                    },
                    "eventSource": "FlowEventsDemo"
            };
            describe('showTooltip(event:Hash)', function () {
                it('showTooltip build up an HTML string with the event data ', function () {
                    var msg = EventController.showTooltip(event1);
                    msg.should.include(event1.eventId);
                });
            });
            describe('getEventValueFromKey(event:Hash, key:String)', function () {
                it('should extract value from the \"key\" in the event for top layer', function () {
                    var value  = EventController.getEventValueFromKey(event1, "eventType");
                    value.should.equal(event1.eventType);
                });
                it('should extract value from the \"key.childKey\" in the event for laower layer', function () {
                    var value  = EventController.getEventValueFromKey(event1, "eventData.jobInstance");
                    value.should.equal(event1.eventData.jobInstance);
                });
                it('should return undefined if the key does not exist in the event', function () {
                    var value  = EventController.getEventValueFromKey(event1, "noExistKey");
                    expect(value).to.equal(undefined);
                });
            });

        });
    });
});