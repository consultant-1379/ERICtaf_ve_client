define([
    'jscore/core',
    'template!./RegionHandler.html',
    'styles!./RegionHandler.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({

        init: function() {
            this.width = 0;
        },

        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        getStyle: function() {
            return style;
        },

        getSettingsElement: function() {
            return this.getElement().find(".regionBar-rightButton");
        },

        getIconElement: function() {
            return this.getElement().find(".regionBar-logo");
        },

        getTitleElement: function() {
            return this.getElement().find(".regionBar-topMenuName");
        },

        getTitleTextElement: function() {
            return this.getElement().find(".regionBar-topMenuName-text");
        },

        getTitleInputElement: function() {
            return this.getElement().find(".regionBar-topMenuName-input");
        },

        getEditIconElement: function() {
            return this.getElement().find(".regionBar-topMenuName-icon");
        },

        setTitle: function(text) {
            this.getTitleTextElement().setText(text);
        },

        /**
        Method to remove icon and title from the menu bar if it get too small
        @Method setMinimise
        */
        setMinimize: function() {
            var regionBar = this.getElement();
            var regionBar_topMenuName = this.getElement().find('.regionBar-topMenuName');
            var regionBar_logo = this.getElement().find('.regionBar-logo');
            var regionBar_rightButton = this.getElement().find('.regionBar-rightButton');
            // need to set this to absolute to get its width
            regionBar_rightButton.element.style.position = "inherit";
            if (this.width <=  regionBar_topMenuName.element.clientWidth){
                this.width = regionBar_topMenuName.element.clientWidth;
            }
           
            if((regionBar.element.clientWidth - regionBar_rightButton.element.clientWidth) <= (this.width + regionBar_logo.element.clientWidth)){
                regionBar_topMenuName.element.style.display = "none";
                regionBar_logo.element.style.display = "none";
                regionBar_rightButton.element.style.position = "relative";
                regionBar_rightButton.element.style.textAlign = "center";
            }
            else {
                regionBar_topMenuName.element.style.display = "inherit";
                regionBar_logo.element.style.display = "inherit";
                regionBar_rightButton.element.style.position = "inherit";
                regionBar_rightButton.element.style.textAlign = "none";
            }
        }

    });
});