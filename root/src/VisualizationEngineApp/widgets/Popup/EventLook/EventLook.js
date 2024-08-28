/**
Method to format json as text
@class EventLook
*/
define([
    'jscore/core',
    './EventLookView',
    'app/lib/utils/EventController'
], function(core, View, EventController) {
    'use strict';
    return core.Widget.extend({

        View: View,

        init: function () {},

        onViewReady: function () {
            this.view.setContent(EventController.showTooltip(this.options.event));
        }
    });
});