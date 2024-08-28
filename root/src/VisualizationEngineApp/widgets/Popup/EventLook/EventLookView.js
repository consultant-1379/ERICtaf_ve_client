define([
    'jscore/core',
    'text!./EventLook.html',
    'styles!./EventLook.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setContent: function (text) {
            this.getElement().element.innerHTML = text;
        }
    });
});