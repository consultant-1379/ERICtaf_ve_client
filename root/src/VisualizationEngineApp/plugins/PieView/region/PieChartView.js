define([
    "jscore/core",
    "template!app/plugins/PieView/region/PieChart.html",
    "styles!app/plugins/PieView/region/PieChart.less"
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template(this.options.presenter.getData());
        },

        getStyle: function() {
            return style;
        },

        getPieChartElement: function() {
            return this.getElement().find('.eaVEApp-rPieChartArea-pie');
        },

        showLoaderAnimation: function() {
            this.getElement().find('.ebLoader').removeModifier('hidden');
        },

        hideLoaderAnimation: function() {
            this.getElement().find('.ebLoader').setModifier('hidden');
        }
    });
});