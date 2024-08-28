/**
*    Custom cell class with a custom View.
*
*    @class StatusNameCell
*/
define([
    "widgets/table/Cell",
    "./ListSelectorCellView",
    "app/widgets/Icon/Icon"
], function(Cell, View, Icon) {
    'use strict';
    return Cell.extend({

        View: View,

        /**
        Using the status attribute of the model to change the icon, and then rendering the value as usual.
        @name StatusNameCell#setValue
        @param {String} value
        */
        setValue: function(value) {
            // find out what type of information we have
            var status = this.getRow().getData().getAttribute("status");
            // By Default, we don't need to have an icon
            if (status !== undefined) {
                var icon;
                if (status === "up") {
                    icon = new Icon({icon: "ebIcon_leftArrow", text: "Up"});
                    icon.attachTo(this.view.getLeftSideIcon());
                } else if (status === "right") {
                    icon = new Icon({icon: "ebIcon_rightArrow", text: "Expand"});
                    icon.attachTo(this.view.getRightSideIcon());
                }
            }
            this.view.setItemText(value);
        }
    });
});