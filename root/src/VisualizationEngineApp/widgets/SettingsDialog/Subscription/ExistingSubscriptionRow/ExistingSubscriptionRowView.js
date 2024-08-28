define([
    'jscore/core',
    'template!./ExistingSubscriptionRow.html',
    'styles!./ExistingSubscriptionRow.less'
], function (core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template(this.options.presenter.getData());
        },

        getStyle: function () {
            return style;
        },

        getRemoveIconElement: function () {
            return this.getElement().find('.eaVEApp-wSubscription-existingSubscriptions-icon');
        }
    });
});
