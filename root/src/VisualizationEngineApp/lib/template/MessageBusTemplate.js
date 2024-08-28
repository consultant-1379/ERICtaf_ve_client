/**
This class holds the template menu items for tree menus
@class MessageBusTemplate
*/
define(function() {
    'use strict';

    return {
        /**
        Default template for menu systems
        @name MessageBusTemplate#getDefaultOptions
        @returns {Object} Json
        */
        getDefaultOptions: function() {
            return {
                "domainId": "vm18domain",
                "eventId": "",
                "eventTime": "",
                "eventType": "",
                "eventData": {
                    "jobInstance": "",
                    "resultCode": "",
                    "changeSet": {
                        "contributor": ""
                    }
                }
            };
        }
    };
});