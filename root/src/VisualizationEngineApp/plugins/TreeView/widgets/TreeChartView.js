define([
    'jscore/core',
    'template!./TreeChart.html',
    'styles!./TreeChart.less'
], function (core, template, style) {

    return core.View.extend({
        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        getStyle: function () {
            return style;
        },

        getSvgArea: function () {
            return this.getElement().find(".eaVEApp-wTreeChart-svgArea");
        },
        getEventDiv: function () {
            return this.getElement().find(".eaVEApp-wTreeChart-event");
        }
    
    });
});
