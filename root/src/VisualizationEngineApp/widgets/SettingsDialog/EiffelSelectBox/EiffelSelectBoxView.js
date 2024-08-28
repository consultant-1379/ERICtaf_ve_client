define([
    'jscore/core',
    'text!./EiffelSelectBox.html',
    'styles!./EiffelSelectBox.less'
], function (core, template, style) {

    return core.View.extend({
        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        }
    });
});