define([
    "jscore/core",
    "template!./FlowChart.html",
    "styles!./FlowChart.less"
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template(this.options.presenter.getData());
        },

        getStyle: function() {
            return style;
        },

        setStyle: function(style) {
            this.getElement().setStyle(style);
        },

        showLoaderAnimation: function() {
            this.getElement().find('.ebLoader').removeModifier('hidden');
        },

        hideLoaderAnimation: function() {
            this.getElement().find('.ebLoader').setModifier('hidden');
        }
    });
});