define([
    "jscore/core",
    "template!./ClusterChart.html",
    "styles!./ClusterChart.less"
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template(this.options.presenter.getData());
        },

        getStyle: function() {
            return style;
        },

        showLoaderAnimation: function() {
            this.getElement().find('.ebLoader').removeModifier('hidden');
        },

        hideLoaderAnimation: function() {
            this.getElement().find('.ebLoader').setModifier('hidden');
        }
    });
});