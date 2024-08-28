define([
    'jscore/core',
    'template!./FlowChart.html',
    'styles!./FlowChart.less'
], function (core, template, style) {

    return core.View.extend({
        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        getStyle: function () {
            return style;
        },

        getSvgArea: function () {
            return this.getElement().find(".eaVEApp-wFlowChart-svgArea");
        },
        
        getInfo: function () {
            return this.getElement().find(".eaVEApp-wFlowChart-info");
        },

        getTabField: function () {
            return this.getElement().find(".eaVEApp-wFlowChart-tabField");
        },
        
        showSvgArea: function () {
             this.getElement().find(".eaVEApp-wFlowChart-svgArea").setStyle('display', 'inherit');
        },

        hideSvgArea: function () {
             this.getElement().find(".eaVEApp-wFlowChart-svgArea").setStyle('display', 'none');
        }
        

    });
});
