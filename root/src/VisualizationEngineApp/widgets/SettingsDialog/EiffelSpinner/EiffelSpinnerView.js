define([
    'jscore/core',
    'text!./EiffelSpinner.html',
    'styles!./EiffelSpinner.less',
    'jscore/base/jquery'
], function (core, template, style, $) {

    return core.View.extend({
        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getSpinnerElement: function() {
            return this.getElement().find('.eaVEApp-wVEEiffelSpinner-spinner');
        },

        getCheckboxElement: function() {
            return this.getElement().find('.eaVEApp-wVEEiffelSpinner-checkbox');
        },

        getInfoElement: function() {
            return this.getElement().find('.eaVEApp-wVEEiffelSpinner-info');
        },

        hideSpinner: function() {
            this.getSpinnerElement().setStyle('display', 'none');
        },

        showSpinner: function() {
            this.getSpinnerElement().setStyle('display', 'inline-block');
        }

    });
});