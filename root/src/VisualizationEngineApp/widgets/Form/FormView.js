define([
    'jscore/core',
    'text!./Form.html',
    'styles!./Form.less'
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
        },

        getInputElement: function(name) {
            return this.getElement().find(".ebInput_" + name);
        },

        getValue: function(name) {
            return this.getElement().find(".ebInput_" + name).getValue();
        }

    });
});