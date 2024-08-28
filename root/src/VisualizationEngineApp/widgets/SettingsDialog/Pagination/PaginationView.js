define([
    'jscore/core',
    'text!./Pagination.html',
    'styles!./Pagination.less'
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