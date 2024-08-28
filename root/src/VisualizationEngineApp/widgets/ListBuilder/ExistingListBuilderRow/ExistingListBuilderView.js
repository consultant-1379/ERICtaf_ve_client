define([
    'jscore/core',
    'template!./ExistingListBuilderRow.html',
    'styles!./ExistingListBuilderRow.less'
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
            return this.getElement().find('.eaVEApp-wListBuilder-existingListBuilders-icon');
        }
    });
});
