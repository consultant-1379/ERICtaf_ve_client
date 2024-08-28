define([
    'jscore/core',
    'text!./SettingsTab.html',
    'styles!./SettingsTab.less'
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        appendToDOM: function(element) {
            this.getElement().append(element);
        }

    });
});