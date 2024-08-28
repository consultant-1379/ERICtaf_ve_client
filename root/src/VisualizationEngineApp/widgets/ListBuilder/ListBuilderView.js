define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'text!./ListBuilder.html',
    'styles!./ListBuilder.less'
], function(core,  _, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getListBuilderContentElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-newListBuilder');
        },

        getListBuilderButtonElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-newListBuilder-button');
        },

        getListBuilderInputElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-newListBuilder-input');
        },

        getListBuilderInputValidationElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-newListBuilder-input');
        },
        
        getListBuilderInputValue: function () {
            return this.getListBuilderInputElement().getValue();
        },

        setListBuilderInputValue: function (value) {
            return this.getListBuilderInputElement().setValue(value);
        },

        getExistingListBuilderElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-existingListBuilders');
        },

        getExistingListBuilderHeaderElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-existingListBuilders-header');
        },

        getExistingListBuilderListElement: function () {
            return this.getElement().find('.eaVEApp-wListBuilder-existingListBuilders-list');
        },

        hideExistingListBuilderHeader: function () {
            this.getExistingListBuilderHeaderElement().setStyle('display', 'none');
        },

        showExistingListBuilderHeader: function () {
            this.getExistingListBuilderHeaderElement().setStyle('display', '');
        },

        hideLoaderAnimation: function() {
            this.getElement().find('.ebLoader').setModifier('hidden');
        },
        
        deleteListBuilderListElement: function(subscriptionListElementToRemoveIndex) {
            this.getExistingListBuilderListElement().children()[subscriptionListElementToRemoveIndex].detach();
        },

        enableListBuilderListElement: function() {
            _.each(this.getExistingListBuilderListElement().children(), function(row) {
                 row.find('.eaVEApp-wListBuilder-existingListBuilders-icon').setStyle('display', '');
             });
        },       
 
        disableListBuilderListElement: function() {
            _.each(this.getExistingListBuilderListElement().children(), function(row) {
                row.find('.eaVEApp-wListBuilder-existingListBuilders-icon').setStyle('display', 'none');
            });
        },

        enableInputElement: function() {
            this.getListBuilderInputValidationElement().removeAttribute('disabled');
        },       
 
        disableInputElement: function() {
            this.getListBuilderInputValidationElement().setAttribute('disabled', 'true');
        },         

    });
});