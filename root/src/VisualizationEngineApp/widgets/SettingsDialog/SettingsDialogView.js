define([
    'jscore/core',
    'text!./SettingsDialog.html',
    'styles!./SettingsDialog.less',
    'widgets/utils/domUtils'
], function(core, template, style, domUtils) {

    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getAllTabTitleElements: function() {
            return domUtils.findAll('.ebTabs-tabItem', this.getElement());
        }
    });
});