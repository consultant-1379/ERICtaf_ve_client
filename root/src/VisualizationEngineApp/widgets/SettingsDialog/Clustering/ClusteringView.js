define([
    'jscore/core',
    'text!./Clustering.html',
    'styles!./Clustering.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getOneNodeElement: function() {
            return this.getElement().find(".eaVEApp-wVEClustering-oneNode");
        },

        getRefreshButtonElement: function() {
            return this.getElement().find(".eaVEApp-wVEClustering-button");
        }
    });
});