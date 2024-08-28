define([
    'jscore/core',
    'template!./TemplateChart.html',
    'styles!./TemplateChart.less'
], function (core, template, style) {

    return core.View.extend({
        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        getStyle: function () {
            return style;
        },

        getSvgArea: function () {
            return this.getElement().find(".eaVEApp-wTemplateChart-svgArea");
        },
        getEventDiv: function () {
            return this.getElement().find(".eaVEApp-wTemplateChart-event");
        }
    
    });
});
