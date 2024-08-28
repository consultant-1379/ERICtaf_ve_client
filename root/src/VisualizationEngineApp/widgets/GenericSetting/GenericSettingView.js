define([
    'jscore/core',
    'template!./GenericSetting.html',
    'styles!./GenericSetting.less'
], function (core, template, style) {

    return core.View.extend({

        /**
        Method that returns the html document template
        @name GenericSettingsView#getTemplate
        @return {string} template
        */
        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        /**
        Method that returns the CSS style for generic settings widget
        @name GenericSettingsView#getStyle
        @return {string} css
        */
        getStyle: function() {
            return style;
        },
 
        /**
        Method that returns the info popup element from the dom
        @name GenericSettingsView#getInfoElement
        @return {object} info popup element
        */
        getInfoElement: function () {
            return this.getElement().find('.eaVEApp-wGenericSetting-title-info');
        },

        /**
        Method that returns the generic settings widget's title element from the dom
        @name GenericSettingsView#getTitleElement
        @return {object} title element
        */
        getTitleElement: function () {
            return this.getElement().find('.eaVEApp-wGenericSetting-title-main');
        },        

        /**
        Method that returns the generic settings widget's widget content element from the dom
        @name GenericSettingsView#getContentElement
        @return {object} content  element
        */
        getContentElement: function () {
            return this.getElement().find('.eaVEApp-wGenericSetting-content');
       },        


    });
});