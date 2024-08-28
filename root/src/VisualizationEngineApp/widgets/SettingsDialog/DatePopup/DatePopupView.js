define([
    'jscore/core',
    'template!./DatePopup.html',
    'styles!./DatePopup.less'
], function (core, template, style) {

    return core.View.extend({
        getTemplate: function () {
            return template(this.options.presenter.getViewSettings());
        },

        getStyle: function () {
            return style;
        },

        getCheckBoxElement: function() {
            return this.getElement().find(".eaVEApp-wDatePopup-picker-checkbox");
        },

        getStartDateElement: function() {
            return this.getElement().find(".eaVEApp-wDatePopup-picker-start-date");
        },

        getStartTimeInput: function() {
            return this.getElement().find(".start");
        },

        getEndDateElement: function() {
            return this.getElement().find(".eaVEApp-wDatePopup-picker-end-date");
        },

        getEndTimeInput: function() {
            return this.getElement().find(".end");
        },

        getNotificationElement: function() {
            return this.getElement().find(".eaVEApp-wDatePopup-picker-notification");
        },

        getTopInfoElement: function() {
            return this.getElement().find(".eaVEApp-wDatePopup-top-info");  
        },

        hideEndDate: function() {
            this.getElement().find(".eaVEApp-wDatePopup-picker-end").setStyle("display", "none");
        },

        showEndDate: function() {
            this.getElement().find(".eaVEApp-wDatePopup-picker-end").setStyle("display", "block");
        }
    });
});
