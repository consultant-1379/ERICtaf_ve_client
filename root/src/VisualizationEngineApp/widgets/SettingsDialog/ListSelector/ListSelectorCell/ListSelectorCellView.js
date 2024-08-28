define([
    "jscore/core",
    "text!./ListSelectorCell.html",
    "styles!./ListSelectorCell.less"
], function(core, template, style) {
    'use strict';
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getLeftSideIcon: function() {
            return this.getElement().find(".eaVEApp-wListSelector-navigationLeftIcon");
        },

        getRightSideIcon: function() {
            return this.getElement().find(".eaVEApp-wListSelector-navigationRightIcon");
        },

        getItem: function() {
            return this.getElement().find(".eaVEApp-wListSelector-item");
        },

        setItemText: function(value) {
            this.getItem().setText(value);
        },

        getStyle: function() {
            return style;
        }
    });
});