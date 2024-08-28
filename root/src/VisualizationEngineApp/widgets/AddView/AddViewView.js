define([
    'jscore/core',
    'text!./AddView.html',
    'styles!./AddView.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        }

    });
});