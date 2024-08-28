define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'text!./Subscription.html',
    'styles!./Subscription.less'
], function(core,  _, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getSubscriptionContentElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-newSubscription');
        },

        getSubscriptionButtonElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-newSubscription-button');
        },

        getSubscriptionInputElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-newSubscription-input');
        },

        getSubscriptionInputValue: function () {
            return this.getSubscriptionInputElement().getValue();
        },

        setSubscriptionInputValue: function (value) {
            return this.getSubscriptionInputElement().setValue(value);
        },

        getSubscriptionInfoElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-title-info');
        },

        getExistingSubscriptionsElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-existingSubscriptions');
        },

        getExistingSubscriptionsHeaderElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-existingSubscriptions-header');
        },

        getExistingSubscriptionsListElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-existingSubscriptions-list');
        },

        hideExistingSubscriptionsHeader: function () {
            this.getExistingSubscriptionsHeaderElement().setStyle('display', 'none');
        },

        showExistingSubscriptionsHeader: function () {
            this.getExistingSubscriptionsHeaderElement().setStyle('display', '');
        },

        hideLoaderAnimation: function() {
            this.getElement().find('.ebLoader').setModifier('hidden');
        },
        
        deleteSubscriptionListElement: function(subscriptionListElementToRemoveIndex) {
            this.getExistingSubscriptionsListElement().children()[subscriptionListElementToRemoveIndex].detach();
        },
        
        clearSubscriptionListElement: function() {
             _.each(this.getExistingSubscriptionsListElement().children(), function(row) {
                 row.detach();
             });
        },       
        
    });
});