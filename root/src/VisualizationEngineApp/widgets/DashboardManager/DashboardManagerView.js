define([
    'jscore/core',
    'text!./DashboardManager.html',
    'styles!./DashboardManager.less'
], function (core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getDropdownElement: function() {
            return this.getElement().find(".eaVEApp-wDashboardManager-dropdown");
        },

        getCurrentDashboardElement: function() {
            return this.getElement().find(".eaVEApp-wDashboardManager-currentDashboard");
        }

    });
});