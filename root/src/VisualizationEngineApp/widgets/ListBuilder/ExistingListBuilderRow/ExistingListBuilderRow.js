/**
Adds a string row to the ListBuilder widget
@class ExistingSubscriptionRow
*/
define([
    'jscore/core',
    './ExistingListBuilderView',
    "app/widgets/Icon/Icon"
], function (core, View, Icon) {
    'use strict';

    return core.Widget.extend({
        View: View,

        onAttach: function () {
            this.icon = new Icon({icon: "ebIcon_close_red", text: "Remove string", onclickevent: function () {
               this.options.onClickCallback.call(this.context, this);
            }.bind(this)});
            this.icon.attachTo(this.view.getRemoveIconElement());
        },
        /**
        Returns Object that was passed to it
        @name ExistingListBuilderRow#getData
        @returns this.options {Object} 
        */
        getData: function () {
            // Return all the models attributes so it can be passed to the template
            return this.options;
        }

    });
});
