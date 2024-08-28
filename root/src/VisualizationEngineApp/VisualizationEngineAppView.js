define([
    'jscore/core',
    'text!./VisualizationEngineApp.html',
    'styles!./VisualizationEngineApp.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getConfigurationContainerElement: function () {
            return this.getElement().find('.eaVEApp-containerConfiguration');
        },

        getViewContainerElement: function () {
            return this.getElement().find('.eaVEApp-viewContainer');
        },

        getSystemBarElement: function () {
            return this.getElement().find('.ebSystemBar');
        }
    });

});
