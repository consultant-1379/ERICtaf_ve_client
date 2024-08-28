define([
    'jscore/core',
    'text!./DefaultSettings.html'
], function (core, template) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getTitleElement: function() {
            return this.element.find('.eaVEApp-wDefaultSettings-title');
        },

        getCheckboxElement: function() {
            return this.element.find('.eaVEApp-wDefaultSettings-checkBox');
        },

        addCheckboxEventHandler: function(callback) {
            return this.getCheckboxElement().addEventHandler('click', callback);
        },

        setCheckboxStatus: function(status) {
            this.getCheckboxElement().element.checked = status;
        },

        setTitle: function(title) {
            if (typeof(title) !== 'string') {
                title = "Use Default Settings";
            }
            this.getTitleElement().setText(title);
        },

        disable: function() {
            this.getCheckboxElement().setAttribute('disabled', true);
        },

        enable: function() {
            this.getCheckboxElement().removeAttribute('disabled');
        }
    });
});